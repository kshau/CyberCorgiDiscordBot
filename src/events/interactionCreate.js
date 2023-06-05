const { message } = require("../utils/messages");
const BaseEvent = require("../utils/structures/BaseEvent");
const {WORD_CHAIN_COLLECTION} = require("../utils/dbManager");

module.exports = class InteractionCreateEvent extends BaseEvent {
  constructor() {
    super("interactionCreate");
  }

  async run(client, interaction) {
    // Makecord PSA: Don't touch this 😅
    if (!interaction.isCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);

    if (!command) return console.log(`[MAKECORD] ${interaction.id} could not be responded to as no command was found`);
    
    try {

      if (interaction.channel == undefined && interaction.commandName == "wordchain") {
        interaction.reply(message("**You must be on a server to start a word chain game! :dog2:**", true));
      }

      else {

        WORD_CHAIN_COLLECTION.findOne({channelId: interaction.channel.id}).then(res => {

          if (res == null || interaction.commandName == "wordchain") {
            command.run(client, interaction);
          }
  
          else {
            interaction.reply(message("**You can't run commands in a channel with an active word chain game! :dog2:**", true));
          }
  
        })

      }

    } catch (err) {
      console.error(err);
      await interaction.reply(message("**An unknown error occured! :dog2:**", true));
    }
  }
};
