const SlashCommand = require('../utils/structures/SlashCommand');
const { SlashCommandBuilder } = require("@discordjs/builders")
const { message } = require('../utils/messages');

const {fetch} = require("undici");

module.exports = class DogCommand extends SlashCommand {
  constructor() {

    super(new SlashCommandBuilder()

      .setName("dog")
      .setDescription("Shows a random picture of a dog! :dog:")

      .addStringOption(option => {
        return option
          .setName("breed")
          .setRequired(false)
          .setDescription("The breed of the dog.");
      })
    
    )

  }

  async run(client, interaction) {

    var breedOption = interaction.options.getString("breed");
    
    var fetchURL = "https://dog.ceo/api/breeds/image/random";
    if (breedOption != undefined) {
      fetchURL = `https://dog.ceo/api/breed/${breedOption.toLowerCase().replace(" ", "")}/images/random`
    }

    fetch(fetchURL).then(res => {

      res.json().then(json => {

        var {code} = json;
        var msg = json.message;

        if (code == 404) {
          interaction.reply(message("**I don't recognize that breed!** :dog:", true));
        }

        else {
          interaction.reply(msg);
        }

      })

    })

  }
}
    