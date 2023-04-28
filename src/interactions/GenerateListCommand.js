const SlashCommand = require('../utils/structures/SlashCommand');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { message } = require('../utils/messages');
const {ChatGPTResponder} = require("../utils/ChatGPTResponder");

module.exports = class GenerateListCommand extends SlashCommand {
  constructor() {

    super(new SlashCommandBuilder()

      .setName("generatelist")
      .setDescription("Generates a list based on criteria you give!")

      .addStringOption(option => {
        return option
          .setName("criteria")
          .setDescription("The criteria for which you wanna generate a list.")
          .setRequired(true)
      })
    
    );
  }

  async run(client, interaction) {

    var criteriaOption = interaction.options.getString("criteria");

    interaction.reply(message("**Loading...**"));
    ChatGPTResponder.getResponse(`Generate a comma seperated list of 7 ${criteriaOption}. Don't number them. Only use numbers and letters no other symbols.`, 2048).then(res => {

      res.json().then(json => {

        if (json.choices != undefined && json.choices.length > 0) {

          var msg = json.choices[0].text.replaceAll("\n", "");
          var split = msg.split(", ");
          var newMsg = "";
  
          for (var i = 0; i <= 6; i++) {
            newMsg += `\`${split[i]}\`` + ((i == 6) ? ("") : (", "))
          }
  
          interaction.editReply(message(`**${newMsg}**`));

        }

        else {
          interaction.editReply(message(`**Sorry, a ChatGPT error occurred while running this command! :tired_face:**`, true));
        }

      })

    })

  }
}
    