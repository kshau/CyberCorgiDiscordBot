const {WORD_CHAIN_COLLECTION} = require("../utils/dbManager");
const {fetch} = require("undici");
const { message } = require("../utils/messages");
const Filter = require('bad-words');

const CHECK_MARK_EMOJI = "\u2705";
const X_EMOJI = "\u274C";

var profFilter = new Filter();

function wordChain(client) {

    client.on("messageCreate", msg => {

        if (!msg.author.bot && msg.content.length >= 2 && msg.content.startsWith("-")) {

            WORD_CHAIN_COLLECTION.findOne({channelId: msg.channel.id}).then(res => {

                if (res != null) {

                    var wordEntries = res.wordEntries;
                    var formattedWord = msg.content.split(" ")[0].toLowerCase().substring(1);

                    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${formattedWord}`).then(res2 => {
    
                        res2.json().then(json => {

                            var prevEntry = (wordEntries.length == 0) ? ({}) : (wordEntries[wordEntries.length - 1]);
                            var prevWord = prevEntry["word"];
        
                            var {title} = json;

                            var incorrectMsg;

                            if (res.wordEntries.some((item) => item.word == formattedWord)) {
                                msg.reply(message(`**Word has already been said! Start from \`${prevWord}\`! :dog2:**`));
                            }
        
                            else if (title == "No Definitions Found" || profFilter.isProfane(formattedWord) || (formattedWord.length < 2 && !(formattedWord == "a" || formattedWord == "i"))) {
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