# 🤖 Telegram Joke Bot – Edzy.ai  

A **Telegram bot** that engages users by delivering random jokes at configurable intervals.  
Users can enable/disable joke delivery and choose how often they want to receive jokes.  

---

## 📌 Features  

- ✅ Start a chat and automatically receive a random joke every **N minutes** (default: `1`)  
- ✅ Configure joke frequency using simple commands  
- ✅ Commands:  
  - `ENABLE` → Resume joke delivery  
  - `DISABLE` → Pause joke delivery  
- ✅ Store user preferences in **MongoDB**  
- ✅ Tracks frequency, enable/disable state, and last sent timestamp  
- ✅ Built with scalability & clean architecture in mind  

---

## ⚙️ Tech Stack  

- **Node.js + Express** → Backend API  
- **node-telegram-bot-api** → Telegram Bot integration  
- **Official Joke API** → Joke source ([GitHub](https://github.com/15Dkatz/official_joke_api))  
- **MongoDB + Mongoose** → Store user chat preferences  

---

## 🛠️ MongoDB Model  

User model (example):  

```js
{
  chatId: String,       
  isEnabled: Boolean,   
  frequency: Number,   
  lastSentAt: Date      
}

Installation
Clone the repo and install dependencies:
git clone <your-repo-url>
cd backend
npm install
Start the bot:
npm start
