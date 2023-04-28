const SlashCommand = require('../utils/structures/SlashCommand');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { message } = require('../utils/messages');

module.exports = class FlipCommand extends SlashCommand {
  constructor() {
    super(new SlashCommandBuilder()
    .setName("flip")
    .setDescription("Flips a coin! :coin:"));
  }

  async run(client, interaction) {

    var randomVal = Math.random();

    if (randomVal > 0.5) {
      await interaction.reply(message("**Heads!** :coin:"));
    }
    else {
      await interaction.reply(message("**Tails!** :coin:"));
    }

  }
}
    