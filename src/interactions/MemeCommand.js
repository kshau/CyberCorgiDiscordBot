const SlashCommand = require('../utils/structures/SlashCommand');
const { SlashCommandBuilder } = require("@discordjs/builders")

const {fetch} = require("undici");
const {image} = require('../utils/messages');

const SUBREDDIT_OPTIONS = ["wholesomememes", "memes", "cleanmemes", "funnymemes"];

module.exports = class MemeCommand extends SlashCommand {
  constructor() {
    super(new SlashCommandBuilder()
    .setName("meme")
    .setDescription("Shows a random meme! Might be relatable! :clown:"));
  }

  async run(client, interaction) {

    var subreddit = SUBREDDIT_OPTIONS[Math.floor(Math.random()*SUBREDDIT_OPTIONS.length)];

    fetch(`https://meme-api.com/gimme/${subreddit}`).then(res => {

      res.json().then(json => {

        var {url} = json;
        interaction.reply(image(url, `From __r/${subreddit}__`));

      })

    })

  }
}
    