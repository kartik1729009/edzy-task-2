import express from 'express';
import mongoose from 'mongoose';
import startBot from './bot.js';
import 'dotenv/config';

const app = express();
app.use(express.json());

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('Error: MONGODB_URI not set!');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ Connected to MongoDB!');
    startBot(); // start the bot only after DB connection
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err);
  });

// Add a simple route
app.get('/', (req, res) => {
  res.send('Express server is running!');
});

// Start Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Express server running on port ${PORT}`);
});
