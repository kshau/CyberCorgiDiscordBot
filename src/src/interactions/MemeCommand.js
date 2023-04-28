const SlashCommand = require('../utils/structures/SlashCommand');
const { SlashCommandBuilder } = require("@discordjs/builders")

const {fetch} = require("undici");
const { message } = require('../utils/messages');

module.exports = class MemeCommand extends SlashCommand {
  constructor() {
    super(new SlashCommandBuilder()
    .setName("meme")
    .setDescription("Shows a random meme! Might be relatable! :clown:"));
  }

  async run(client, interaction) {

    var memeSubreddits = ["wholesomememes", "memes", "cleanmemes", "funnymemes"];
    var subreddit = memeSubreddits[Math.floor(Math.random()*memeSubreddits.length)];

    fetch(`https://meme-api.com/gimme/${subreddit}`).then(res => {

      res.json().then(json => {

        var {url} = json;
        interaction.reply({embeds: [{image: {url}, title: `From __r/${subreddit}__`, color: "#3374ff"}]});

      })

    })

  }
}
    