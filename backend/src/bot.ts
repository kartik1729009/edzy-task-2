import TelegramBot from 'node-telegram-bot-api';
import { getRandomJoke } from './service/jokeService.js';
import { User, type IUser } from './models/User.js';
import 'dotenv/config';
const token = process.env.TELEGRAM_BOT_TOKEN!;
if (!token) {
  console.error('Error: TELEGRAM_BOT_TOKEN not set!');
  process.exit(1);
}
const bot = new TelegramBot(token, { polling: true });

export default function startBot() {
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id.toString();

    // Create user if not exists (upsert)
    const user = await User.findOneAndUpdate(
      { chatId },
      { $setOnInsert: { chatId, isEnabled: true, frequency: 1 } },
      { upsert: true, new: true }
    );

    bot.sendMessage(
      chatId,
      'Welcome! You will receive jokes every 1 minute by default. Use ENABLE/DISABLE to control delivery.'
    );

    scheduleJokes(user);
  });
}


bot.on('message', async (msg) => {
    const chatId = msg.chat.id.toString();
    const text = msg.text?.toUpperCase();

    if (!text || text === '/START') return; 

    const user = await User.findOne({ chatId });
    if (!user) return;

    if (text === 'ENABLE') {
    user.isEnabled = true;
    await user.save();
    bot.sendMessage(chatId, 'Jokes delivery enabled!');

    if (userTimeouts[chatId]) {
        clearTimeout(userTimeouts[chatId]);
    }

    userTimeouts[chatId] = setTimeout(async () => {
        const freshUser = await User.findById(user._id);
        if (freshUser?.isEnabled) {
            scheduleJokes(freshUser); 
        }
    }, user.frequency * 60 * 1000);
} else if (text === 'DISABLE') {
    user.isEnabled = false;
    await user.save();
    bot.sendMessage(chatId, 'Jokes delivery disabled!');

    if (userTimeouts[chatId]) {
        clearTimeout(userTimeouts[chatId]);
        delete userTimeouts[chatId]; 
    }
} else if (text.startsWith('FREQ')) {
    const parts = text.split(' ');

    if (parts[1]) { 
        const freq = parseInt(parts[1]);

        if (!isNaN(freq) && freq > 0) {
            user.frequency = freq;
            await user.save();
            bot.sendMessage(chatId, `Jokes frequency updated to ${freq} minute(s).`);
        } else {
            bot.sendMessage(chatId, 'Invalid frequency. Use: FREQ <minutes>');
        }
    } else {
        bot.sendMessage(chatId, 'Please provide a number. Example: FREQ 5');
    }
}
});

const userTimeouts: Record<string, NodeJS.Timeout> = {};

async function scheduleJokes(user: IUser) {
  if (!user.isEnabled) return;

  const joke = await getRandomJoke();
  bot.sendMessage(user.chatId, joke);

  // Clear previous timeout if exists
  if (userTimeouts[user.chatId]) clearTimeout(userTimeouts[user.chatId]);

  userTimeouts[user.chatId] = setTimeout(async () => {
    const freshUser = await User.findById(user._id);
    if (freshUser?.isEnabled) {
      scheduleJokes(freshUser); 
    }
  }, user.frequency * 60 * 1000);
}


startBot();
