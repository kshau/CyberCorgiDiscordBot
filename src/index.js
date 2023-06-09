require("dotenv").config()
const { Client, Intents, Constants } = require('discord.js');
const { registerCommands, registerEvents, registerSlashCommands } = require('./utils/registry');
const { aiResponse } = require("./functions/AIResponse");
const { wordChain } = require("./functions/WordChain");

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

  process.on("uncaughtException", (err) => {
    console.error("Error: " + err.message);
  })

  process.on("unhandledRejection", (err) => {
    if (err.code != Constants.APIErrors.MISSING_ACCESS && err.code != Constants.APIErrors.MISSING_PERMISSIONS) {
      console.error("Error: " + err.message);
    }
  })
  
  await client.login(process.env.TOKEN);

  aiResponse(client);
  wordChain(client);
})()