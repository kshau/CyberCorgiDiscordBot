const SlashCommand = require('../utils/structures/SlashCommand');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ChatGPTResponder } = require('../utils/ChatGPTResponder');
const { message } = require('../utils/messages');

module.exports = class TalkLikeCommand extends SlashCommand {
  constructor() {

    super(new SlashCommandBuilder()

      .setName("talklike")
      .setDescription("Repeats the text you give but with a different personality! :disguised_face:")
      
      .addStringOption(option => {
        return option
          .setName("personality")
          .setDescription("The personality you want the text to be said with.")
          .setRequired(true)
      })

      .addStringOption(option => {
        return option
          .setName("text")
          .setDescription("The text you want to convert.")
          .setRequired(true)
      })
    
    );
  }

  async run(client, interaction) {

    var personalityOption = interaction.options.getString("personality");
    var textOption = interaction.options.getString("text");

    if (textOption.length > 60) {
      interaction.reply(message("**Try something shorter!**", true));
    }

    else {

      interaction.reply(message("**Loading...**"));
      ChatGPTResponder.getResponse(`Translate into ${personalityOption} using English characters in under 60 characters: ${textOption}.`).then(res => {
  
        res.json().then(json => {
  
          var converted = json.choices[0].text.replaceAll("\n", "");
          interaction.editReply(message(`\`${textOption}\`\n\n**"${converted}"** (__${personalityOption.replaceAll(" ", "")}__ified)`))
  
        })
  
      })

    }

  }
}
    