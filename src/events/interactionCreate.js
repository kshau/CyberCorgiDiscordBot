const { message } = require("../utils/messages");
const BaseEvent = require("../utils/structures/BaseEvent");
const {database} = require("../utils/dbManager");

const WORD_CHAIN_COLLECTION = database.collection("word_chain");

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

      WORD_CHAIN_COLLECTION.findOne({channelId: interaction.channel.id}).then(res => {

        if (res == null || interaction.commandName == "wordchain") {
          command.run(client, interaction);
        }

        else {
          interaction.reply(message("**You can't run commands in a channel with an active word chain game! :dog2:**", true));
        }

      })

    } catch (error) {
      console.error(error);
      await interaction.reply(message("**An unknown error occured! :dog2:**", true));
    }
  }
};
