require('dotenv').config();
require('./keep_alive.js');
const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");
const util = require("minecraft-server-util");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

let monitors = {};

client.once("ready", () => {
  console.log(`✅ Bot is online as ${client.user.tag}`);
});

client.on("messageCreate", async message => {
  if (message.author.bot) return;

  const [cmd, arg1, arg2] = message.content.trim().split(" ");

  if (cmd === "!mcstatus") {
    const host = arg1;
    const port = arg2 ? parseInt(arg2) : 25565;
    if (!host) return message.reply("❌ Provide a server IP: `!mcstatus play.example.net`");

    const guild = message.guild;
    const categoryName = `MC Status: ${host}`;

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

    if (monitors[host]) clearInterval(monitors[host]);

    monitors[host] = setInterval(async () => {
      try {
        const result = await util.status(host, port);
        await statusChannel.setName(`🟢 Server: Online`);
        await playersChannel.setName(`👥 Players: ${result.players.online}/${result.players.max}`);
      } catch (err) {
        await statusChannel.setName(`🔴 Server: Offline`);
        await playersChannel.setName(`👥 Players: 0/0`);
      }
    }, 60000);

    message.reply(`✅ Now monitoring \`${host}\``);
  }

  if (cmd === "!unmonitor") {
    const host = arg1;
    if (!host) return message.reply("❌ Provide the IP to unmonitor: `!unmonitor play.example.net`");

    const category = message.guild.channels.cache.find(c => c.type === 4 && c.name === `MC Status: ${host}`);
    if (category) {
      const channels = message.guild.channels.cache.filter(c => c.parentId === category.id);
      for (const [_, channel] of channels) {
        await channel.delete();
      }
      await category.delete();
    }

    if (monitors[host]) {
      clearInterval(monitors[host]);
      delete monitors[host];
    }

    message.reply(`✅ Stopped monitoring \`${host}\``);
  }
});

client.login(process.env.TOKEN);
