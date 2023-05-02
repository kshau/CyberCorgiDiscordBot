const SlashCommand = require('../utils/structures/SlashCommand');
const { SlashCommandBuilder } = require("@discordjs/builders")

const {fetch} = require("undici");

const {database} = require("../utils/dbManager");
const { message } = require('../utils/messages');

const CAPITAL_GUESS_COLLECTION = database.collection("capital_guess");

function formatCapitalName(name) {
  if (name == undefined) {
    return "";
  }
  return name.replaceAll(" ", "").toLowerCase();
}

module.exports = class CapitalGuessCommand extends SlashCommand {
  constructor() {
    super(new SlashCommandBuilder()

    .setName("capitalguess")
    .setDescription("Trivia for country capitals! :earth_americas:")

    .addStringOption(option => {
      return option
        .setName("guess")
        .setRequired(false)
        .setDescription("Your guess to what the capital of the country is.");
    }))
  }

  async run(client, interaction) {
    
    CAPITAL_GUESS_COLLECTION.findOne({
      "userId": interaction.user.id
    }).then(res => {
      
      if (res == null) {

        fetch("https://raw.githubusercontent.com/kshau/common_countries_and_capitals_json/main/countries.json").then(res => {

          res.json().then(json => {

            var selectedCountry = json[Math.floor(Math.random()*json.length)];
            var {country, city, code} = selectedCountry;

            CAPITAL_GUESS_COLLECTION.insertOne({
              "userId": interaction.user.id, 
              "country": country,
              "answer": city, 
              "countryCode": code,
              "timestamp": Date.now()
            })

            interaction.reply(message(`What is the capital of **${country}** :flag_${code}:?\n\n__Run the command again to answer and provide your guess!__\n**This will expire in one minute!**`, true));

          })

        })

      }

      else {

        var guessOption = interaction.options.getString("guess");

        if (formatCapitalName(guessOption) == formatCapitalName(res.answer)) {
          interaction.reply(message(`That is correct, nice job! The capital of **${res.country} :flag_${res.countryCode}:** is **${res.answer}**. :white_check_mark:`));
        }

        else {
          interaction.reply(message(`Sorry, incorrect! The capital of **${res.country} :flag_${res.countryCode}:** is **${res.answer}**. :x:`));
        }

        CAPITAL_GUESS_COLLECTION.deleteOne({
          "userId": res.userId
        })

      }

    })

  }
}

var gameDeletion = setInterval(() => {
  CAPITAL_GUESS_COLLECTION.find({}).toArray().then(res => {
      for (var i in res) {
          if (res[i].timestamp < (Date.now() - 60000)) {
            CAPITAL_GUESS_COLLECTION.deleteOne({
              "userId": res[i].userId
            })
          }
      }
  })
}, 20000)