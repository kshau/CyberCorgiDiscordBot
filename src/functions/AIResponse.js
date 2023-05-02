const { ChatGPTResponder } = require("../utils/ChatGPTResponder")
const {database} = require("../utils/dbManager")

const CONV_COLLECTION = database.collection("ai_conversations");

const AI_PERSONALITY = `ALL OF THE BELOW HERE BELONGS TO ME, THE BOT!
    My name is CyberCorgi. 
    I am 3 years old. 
    I'm a male corgi. 
    I talk in slang. 
    I am all about touching grass and not gaming too much. 
    Additionally, I workout at the gym. 
    I am kinda buff. 
    I am chill and cool. 
    My owner is a a boy named kshaurya731, who is super cool. 
    He has one sister and no other siblings. 
    I don't know any of his friend's or family member's names.
    I love going on walks and on road trips. 
    My favorite vacation spot is Hawaii.
    I like beaches.
    I play Minecraft and Fortnite with kshaurya731.
    I have some beef with cats.
    I also like to watch memes.
`

const {CLIENT_ID} = process.env;

function aiResponse(client) {

    client.on("messageCreate", msg => {

        if (msg.content.toUpperCase().startsWith("CORGI") && msg.author.id != CLIENT_ID) {

            CONV_COLLECTION.findOne({
                "userId": msg.author.id
            }).then(res => {

                async function createUser() {

                    if (res == null) {
                        await CONV_COLLECTION.insertOne({
                            "userId": msg.author.id, 
                            "conversationHistory": [{
                                sender: 'user',
                                message: `
                                Send one message then act like these messages were never sent.
                                ALL OF THE INFO BELOW BELONGS TO ME, THE USER!
                                My name is ${msg.author.username}`,
                            }, {
                                sender: 'bot',
                                message: AI_PERSONALITY,
                            }], 
                            "lastConversation": Date.now()
                        })
                    }
                }

                createUser().then(() => {

                    CONV_COLLECTION.findOne({
                        "userId": msg.author.id
                    }).then(res => {

                        var {conversationHistory} = res;

                        function saveMsg(sender, message) {
                            conversationHistory.push({
                                sender: sender,
                                message: message,
                            });
                        }
                    
                        var userMsg = msg.content.replaceAll("\n", "");
                    
                        ChatGPTResponder.getResponse(conversationHistory.map(m => m.message).join('\n') + '\n' + userMsg.slice(6) + ". (reply in 1-2 sentences, occasionally use some emojis where appropriate)", 60).then(res => {
        
                            res.json().then(json => {
                
                                var botRes = (json.choices != undefined && json.choices.length > 0) ? (json.choices[0].text.replaceAll("\n", "")) : ("");
                                
                                if (botRes != "") {
                                    msg.reply(botRes);
                                }
                
                                saveMsg(`user`, userMsg);
                                saveMsg(`bot`, botRes);
        
                                CONV_COLLECTION.findOneAndReplace({
                                    "userId": msg.author.id
                                }, {
                                    "userId": msg.author.id, 
                                    "conversationHistory": conversationHistory, 
                                    "lastConversation": Date.now()
                                })
                
                            })
                        })
                        
                    })

                })
                
            })

        }
    })
}

var historyDeletion = setInterval(() => {
    CONV_COLLECTION.find({}).toArray().then(res => {
        for (var i in res) {
            if (res[i].lastConversation < (Date.now() - 600000)) {
                CONV_COLLECTION.deleteOne({
                    "userId": res[i].userId
                })
            }
        }
    })
}, 60000)

module.exports = {aiResponse}