require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");
const util = require("minecraft-server-util");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

let statusInterval;

client.once("ready", () => {
  console.log(`✅ Bot is online as ${client.user.tag}`);
});

client.on("messageCreate", async message => {
  if (!message.content.startsWith("!mcstatus") || message.author.bot) return;

  const args = message.content.split(" ");
  const host = args[1];
  const port = args[2] ? parseInt(args[2]) : 25565;

  if (!host) return message.reply("❌ Please provide a server IP: `!mcstatus play.example.com`");

  const guild = message.guild;
  const categoryName = "Minecraft Server Status";

  let category = guild.channels.cache.find(c => c.type === 4 && c.name === categoryName);
  if (!category) {
    category = await guild.channels.create({ name: categoryName, type: 4 });
  }

  let statusChannel = guild.channels.cache.find(c => c.name.startsWith("Server:") && c.parentId === category.id);
  let playersChannel = guild.channels.cache.find(c => c.name.startsWith("Players:") && c.parentId === category.id);

  if (!statusChannel) {
    statusChannel = await guild.channels.create({
      name: "Server: Loading...",
      type: 2,
      parent: category,
      permissionOverwrites: [{ id: guild.roles.everyone, deny: [PermissionsBitField.Flags.Connect] }]
    });
  }

  if (!playersChannel) {
    playersChannel = await guild.channels.create({
      name: "Players: 0/0",
      type: 2,
      parent: category,
      permissionOverwrites: [{ id: guild.roles.everyone, deny: [PermissionsBitField.Flags.Connect] }]
    });
  }

  message.reply("✅ Monitoring started! Voice channels will auto-update every 1 minute.");

  if (statusInterval) clearInterval(statusInterval);

  statusInterval = setInterval(async () => {
    try {
      const result = await util.status(host, port);
      await statusChannel.setName(`🟢 Server: Online`);
      await playersChannel.setName(`👥 Players: ${result.players.online}/${result.players.max}`);
    } catch (err) {
      await statusChannel.setName(`🔴 Server: Offline`);
      await playersChannel.setName(`👥 Players: 0/0`);
    }
  }, 60000);
});

client.login(process.env.TOKEN);