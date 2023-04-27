require("dotenv").config()
const { Client, Intents } = require('discord.js');
const { registerCommands, registerEvents, registerSlashCommands } = require('./utils/registry');
const { aiResponse } = require("./functions/AIResponse");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS
  ]
});

(async () => {
  client.commands = new Map();
  client.slashCommands = new Map();
  client.events = new Map();
  client.prefix = process.env.PREFIX;
  await registerCommands(client, '../commands');
  await registerEvents(client, '../events');
  await registerSlashCommands(client, '../interactions')
  await client.login(process.env.TOKEN);

  client.on("error", (err) => {
    console.log(err);
  })

  aiResponse(client);
})()