const {database} = require("../utils/dbManager");
const WORD_CHAIN_COLLECTION = database.collection("word_chain");
const {fetch} = require("undici");
const { message } = require("../utils/messages");

const CHECK_MARK_EMOJI = "\u2705";
const X_EMOJI = "\u274C";
const R_EMOJI = "\uD83C\uDDF7";

function wordChain(client) {

    client.on("messageCreate", msg => {

        if (!msg.author.bot) {

            WORD_CHAIN_COLLECTION.findOne({channelId: msg.channel.id}).then(res => {

                if (res != null) {

                    var wordEntries = res.wordEntries;
                    var formattedWord = msg.content.split(" ")[0].toLowerCase();

                    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${formattedWord}`).then(res2 => {
    
                        res2.json().then(json => {

                            var prevEntry = (wordEntries.length == 0) ? ({}) : (wordEntries[wordEntries.length - 1]);
                            var prevWord = prevEntry["word"];
        
                            var {title} = json;

                            var incorrectMsg;

                            if (res.wordEntries.some((item) => item.word == formattedWord)) {
                                msg.react(R_EMOJI);
                            }
        
                            else if (title == "No Definitions Found") {
                                incorrectMsg = `<@${msg.author.id}> ruined it by saying an invalid word!`;
                            }

                            else if (prevWord != undefined && msg.author.id == prevEntry.userId) {
                                incorrectMsg = `<@${msg.author.id}> ruined it by taking two turns!`;
                            }

                            else if (prevWord != undefined && prevWord[prevWord.length - 1] != formattedWord[0]) {
                                incorrectMsg = `<@${msg.author.id}> ruined it by saying a word that doesn't follow the rule!`;
                            }
        
                            else {

                                msg.react(CHECK_MARK_EMOJI);

                                wordEntries.push({
                                    userId: msg.author.id, 
                                    word: formattedWord
                                })

                                WORD_CHAIN_COLLECTION.replaceOne({guildId: res.guildId}, {
                                    guildId: res.guildId, 
                                    channelId: res.channelId, 
                                    wordEntries: wordEntries
                                })

                            }

                            if (incorrectMsg != undefined) {

                                msg.react(X_EMOJI);
                                msg.channel.send(message(`**${incorrectMsg} Start over! :x:\n\nWords: \`${wordEntries.length}\`**`));

                                WORD_CHAIN_COLLECTION.replaceOne({guildId: res.guildId}, {
                                    guildId: res.guildId, 
                                    channelId: res.channelId, 
                                    wordEntries: []
                                })
                                
                            }

                        })
    
                    })

                    
                }
            })

        }

    })

}

module.exports = {wordChain};