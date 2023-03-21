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
    ChatGPTResponder.getResponse(`Generate a comma seperated list of 7 ${criteriaOption}. Don't number them. `).then(res => {

      res.json().then(json => {

        var msg = json.choices[0].text;
        var split = msg.split(", ");
        var newMsg = "";

        for (var i in split) {
          newMsg += `\`${split[i].replaceAll("\n", "")}\`` + ((i == split.length - 1) ? ("") : (", "))
        }

        interaction.editReply(message(`**${newMsg}**`));

      })

    })

  }
}
    