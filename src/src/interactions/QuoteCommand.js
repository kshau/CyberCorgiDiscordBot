const SlashCommand = require('../utils/structures/SlashCommand');
const { SlashCommandBuilder } = require("@discordjs/builders")
const { ChatGPTResponder } = require('../utils/ChatGPTResponder');

const {fetch} = require("undici");
const { message } = require('../utils/messages');

module.exports = class QuoteCommand extends SlashCommand {
  constructor() {

    super(new SlashCommandBuilder()

      .setName("quote")
      .setDescription("Shows an inspirational quote by a famous person! :speech_left:")

      .addStringOption(option => {
        return option
          .setName("keyword")
          .setDescription("Generate a quote based on a keyword. Can be a person you want the quote from.")
          .setRequired(false);
      })
    
    );
  }

  async run(client, interaction) {
    
    var keywordOption = interaction.options.getString("keyword");

    if (keywordOption == undefined) {

      fetch("https://zenquotes.io/api/random").then(res => {

        res.json().then(json => {

          var {q, a} = json[0];
          interaction.reply(message(`**${q}**\n\n~ ${a}`));

        })

      })

    }

    else {

      interaction.reply(message("**Loading...**"));
      ChatGPTResponder.getResponse(`Tell me a random quote relating to ${keywordOption}. Seperate the quote and the author with a ::.`).then(res => {
  
        res.json().then(json => {
          
          var quote = json.choices[0].text;
          var split = quote.split("::");
          var quoteText = split[0].replaceAll("\n", "");
          var quoteAuthor = split[1];
  
          interaction.editReply(message(`**${quoteText}**\n\n~ ${quoteAuthor}`));
  
        })
  
      })

    }

  }
}
    