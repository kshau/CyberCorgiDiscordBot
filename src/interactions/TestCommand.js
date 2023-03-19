const SlashCommand = require('../utils/structures/SlashCommand');
const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = class TestCommand extends SlashCommand {
  constructor() {
    super(new SlashCommandBuilder()
    .setName("test")
    .setDescription("no"));
  }

  async run(client, interaction) {
    await interaction.reply("no");
  }
}
    