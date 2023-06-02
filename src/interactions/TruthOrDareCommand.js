const { message } = require('../utils/messages');
const SlashCommand = require('../utils/structures/SlashCommand');
const { SlashCommandBuilder } = require("@discordjs/builders")

const {fetch} = require("undici");

module.exports = class TruthOrDareCommand extends SlashCommand {
  constructor() {
    super(new SlashCommandBuilder()
    .setName("truthordare")
    .setDescription("Asks a random truth or dare question! :thinking:")
    .addStringOption(option => {
      return option
        .setName("type")
        .setDescription("Select truth or dare.")
        .setRequired(true)

        .addChoices(
          { name: "Truth", value: "truth"},
          { name: "Dare", value: "dare"},
          { name: "Random", value: "random"}
        )
    })
    
    );
  }

  async run(client, interaction) {
    
    fetch("https://raw.githubusercontent.com/kshau/truth-or-dare-json/main/truth_or_dare.json").then(res => {

      res.json().then(json => {

        var typeOption = interaction.options.getString("type");
        
        var chosenType = (typeOption == "random") ? ((Math.random() > 0.5) ? ("truth") : ("dare")) : (typeOption);
        var fullArray = json[chosenType + "s"];
        interaction.reply(message(`**${chosenType.charAt(0).toUpperCase() + chosenType.slice(1)}:** ${fullArray[Math.floor(Math.random()*fullArray.length)]}`));

      })

    })

  }
}
    