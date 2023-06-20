const SlashCommand = require('../utils/structures/SlashCommand');
const { SlashCommandBuilder } = require("@discordjs/builders")

const {WORD_CHAIN_COLLECTION} = require("../utils/dbManager");
const { message } = require('../utils/messages');

const {EMBED_COLOR} = process.env;

var instructionEmbed = {
  title: "Word Chain Game", 
  description: `**This is the word chain game! You must say a word, and the next person must say another word starting with the last letter of the previous word. Only one person can go at a time, and no word repetitions or single letters allowed (except \`a\` or \`I\`). Put a \`-\` before your word to have it register.**
  
  **:white_check_mark: = Word is valid; your word should start with the last letter of only these words**
  **:x: = Word is invalid, doesn't follow last letter rule, or you have gone twice in one turn**

  **Enjoy! :chains:**
  `, 

  color: EMBED_COLOR
};

module.exports = class WordChainCommand extends SlashCommand {
  constructor() {
    super(new SlashCommandBuilder()
    .setName("wordchain")
    .setDescription("Play the word chain game! :chains:")
    
    .addSubcommand(subcommand => {
      return subcommand
        .setName("start")
        .setDescription("Start the word chain game in this channel.")
    })

    .addSubcommand(subcommand => {
      return subcommand
        .setName("end")
        .setDescription("Stop the word chain game in this channel.")
    })

    .addSubcommand(subcommand => {
      return subcommand
        .setName("wordcount")
        .setDescription("Shows the number of valid words in this round.")
    })

    .addSubcommand(subcommand => {
      return subcommand
        .setName("howtoplay")
        .setDescription("Shows you how to play the word chain game.")
    })
    
    );
  }

  async run(client, interaction) {
    
    var subcommand = interaction.options.getSubcommand();
    var member = interaction.member;

    if (subcommand == "start") {
      
      if (member.permissions.has("ADMINISTRATOR")) {

        WORD_CHAIN_COLLECTION.findOne({guildId: interaction.guild.id}).then(res => {

          if (res == null) {
            WORD_CHAIN_COLLECTION.insertOne({
              guildId: interaction.guild.id, 
              channelId: interaction.channel.id, 
              wordEntries: []
            })

            interaction.reply({embeds: [instructionEmbed]});
          }

          else {
            if (interaction.channel.id == res.channelId) {
              interaction.reply(message(`**There is already an active word chain game in this channel! :dog2:**`, true));
            }
            else {
              interaction.reply(message(`**There is already an active word chain game in <#${res.channelId}> on this server! End that game first to start one in this channel! :dog2:**`, true));
            }
          }

        })

      }

      else {

        interaction.reply(message("**You must be a server administrator to start a word chain game! :dog2:**", true));

      }

    }

    else if (subcommand == "end") {
      
      if (member.permissions.has("ADMINISTRATOR")) {

        WORD_CHAIN_COLLECTION.findOne({guildId: interaction.guild.id}).then(res => {

          if (res == null) {
            interaction.reply(message("**There isn't an active word chain game on this server! :dog2:**", true));
          }

          else {
            interaction.reply(message(`**Stopped the word chain game on this server! :chains:**\n\n**Words: \`${res.wordEntries.length}\`**`));
            WORD_CHAIN_COLLECTION.deleteOne({guildId: interaction.guild.id});
          }

        })

      }

      else {

        interaction.reply(message("**You must be a server administrator to stop a word chain game! :dog2:**", true));

      }

    }

    else if (subcommand == "wordcount") {

      WORD_CHAIN_COLLECTION.findOne({guildId: interaction.guild.id}).then(res => {

        if (res == null) {
          interaction.reply(message("**There isn't an active word chain game on this server! :dog2:**", true));
        }

        else {
          interaction.reply(message(`**We're at \`${res.wordEntries.length}\` words so far! Keep going! :chains:**`, true));
        }

      })

    }

    else if (subcommand == "howtoplay") {
      interaction.reply({embeds: [instructionEmbed], ephemeral: true});
    }

  }
}
    