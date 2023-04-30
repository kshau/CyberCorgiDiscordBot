const SlashCommand = require('../utils/structures/SlashCommand');
const { SlashCommandBuilder } = require("@discordjs/builders")

const {fetch} = require("undici");
const { message } = require('../utils/messages');

module.exports = class JokeCommand extends SlashCommand {
  constructor() {
    super(new SlashCommandBuilder()
    .setName("joke")
    .setDescription("Tells a random joke to make you laugh! :rofl:"));
  }

  async run(client, interaction) {
    
    fetch("https://official-joke-api.appspot.com/random_joke").then(res => {

      res.json().then(json => {

        var {setup, punchline} = json;

        if (Math.random() < 0.01) {
          interaction.reply(message(`**You! Nah I'm just messin' :rofl:**`));
        }
        else {
          interaction.reply(message(`**${setup}**\n\n||${punchline} :rofl:||`));
        }

      })

    })

  }
}
    