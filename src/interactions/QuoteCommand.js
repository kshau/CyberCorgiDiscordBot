const SlashCommand = require('../utils/structures/SlashCommand');
const { SlashCommandBuilder } = require("@discordjs/builders")

const {fetch} = require("undici");
const { message } = require('../utils/messages');

module.exports = class QuoteCommand extends SlashCommand {
  constructor() {
    super(new SlashCommandBuilder()
    .setName("quote")
    .setDescription("Shows an inspirational quote by a famous person! :speech_left:"));
  }

  async run(client, interaction) {
    
    fetch("https://zenquotes.io/api/random").then(res => {

      res.json().then(json => {

        var {q, a} = json[0];
        interaction.reply(message(`**${q}**\n\n~ ${a}`));

      })

    })

  }
}
    