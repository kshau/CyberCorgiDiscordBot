const SlashCommand = require('../utils/structures/SlashCommand');
const { SlashCommandBuilder } = require("@discordjs/builders")

const {fetch} = require("undici");

module.exports = class MemeCommand extends SlashCommand {
  constructor() {
    super(new SlashCommandBuilder()
    .setName("meme")
    .setDescription("Shows a random meme! Might be relatable! :clown:"));
  }

  async run(client, interaction) {

    fetch(`https://meme-api.com/gimme/wholesomememes`).then(res => {

      res.json().then(json => {

        var {url} = json;
        interaction.reply(url);

      })

    })

  }
}
    