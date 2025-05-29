# Minecraft Server Status Discord Bot

This Discord bot monitors Minecraft server statuses and updates Discord voice channels with live information like server online/offline state and player count. It also includes commands to monitor or unmonitor any server.

# Features

- 🟢 Automatically creates a category and two voice channels per monitored server
- 🔁 Updates server status and player count every minute
- ❌ Command to stop monitoring a specific server
- 💬 Easy setup via `!mcstatus` and `!unmonitor` commands
- ☁️ 24/7 Free Hosting using Replit + UptimeRobot

# Commands

### `!mcstatus <ip> [port]`
Starts monitoring the specified Minecraft server. Example:
```
!mcstatus play.example.net
```

### `!unmonitor <ip>`
Stops monitoring the specified Minecraft server and deletes its category + channels. Example:
```
!unmonitor play.example.net
```

# Hosting Guide (Replit + UptimeRobot)

## 1. Import to Replit
- Create a new **Node.js** Replit project
- Upload these files:
  - `index.js`
  - `keep_alive.js`
  - `package.json`
  - `.env` (add `TOKEN=your_bot_token` via Secrets tab)

## 2. Install Dependencies
In the Replit shell, run:
```
npm install
```

## 3. Run the Bot
Click the **Run** button in Replit. You should see a "Bot is online" log.

## 4. Keep Bot 24/7 with UptimeRobot
1. Go to [https://uptimerobot.com](https://uptimerobot.com)
2. Create a **free** account
3. Click “Add New Monitor”
   - **Type**: HTTP(s)
   - **URL**: Your Replit web URL (found in the browser address bar when running)
   - **Interval**: 5 minutes
   - **Friendly Name**: Anything you like (e.g., “MC Bot Ping”)
4. Save and your bot will stay online 24/7!

---

💡 Make sure not to share your bot token publicly (even by accident). If it gets leaked, regenerate it from [Discord Developer Portal](https://discord.com/developers/applications).
