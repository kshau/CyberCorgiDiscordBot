const SlashCommand = require('../utils/structures/SlashCommand');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { message } = require('../utils/messages');

module.exports = class HelpCommand extends SlashCommand {
  constructor() {
    super(new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows the use of every command! :scroll:"));
  }

  async run(client, interaction) {

    var commands = Array.from(client.slashCommands, ([name, value]) => ({ name, value }));
    var content = ""

    for (var i in commands) {

      var cmd = commands[i];
      var cmdData = cmd.value.data;

      content += `\`/${cmd.name}\` - ${cmdData.description}\n`

    }

    var sendMsg = message(content);
    sendMsg["content"] = ":dog: **CyberCorgi**";

    if (interaction.channel == undefined) {
      await interaction.reply(sendMsg);
    }

    else {
      await interaction.user.send(sendMsg);
      await interaction.reply(message("**Check DMs!** :dog:", true));
    }

  }
}