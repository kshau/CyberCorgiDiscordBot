const SlashCommand = require('../utils/structures/SlashCommand');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { message } = require('../utils/messages');

const {fetch} = require("undici");

const {NINJAS_API_KEY} = process.env;

module.exports = class FactCommand extends SlashCommand {
  constructor() {
    super(new SlashCommandBuilder()
    .setName("fact")
    .setDescription("Tells a random, interesting fact! :astonished:"));
  }

  async run(client, interaction) {

    fetch("https://api.api-ninjas.com/v1/facts?limit=3", {
      "headers": {
          "X-Api-Key": NINJAS_API_KEY
      }
    }).then(res => {

      res.json().then(json => {

        var {fact} = json[0];
        interaction.reply(message(`**${fact}!** :astonished:`));

      })

    })

  }

}
    