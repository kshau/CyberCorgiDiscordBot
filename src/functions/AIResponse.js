const { ChatGPTResponder } = require("../utils/ChatGPTResponder")
const {database} = require("../utils/dbManager")

const conversationsCollection = database.collection("ai_conversations");

const AI_PERSONALITY = `My name is CyberCorgi. 
    I am 3 years old. 
    I'm a male corgi. 
    I talk in slang with 1-2 sentences. 
    I am all about touching grass and not gaming too much. 
    Additionally, I workout at the gym. 
    I am kinda buff. 
    I am chill and cool. 
    My owner's name is Shaurya, he is a boy. 
    I love going on walks and on road trips. 
    My favorite vacation spot is Hawaii.
    I like beaches.
    I play Minecraft and Fortnite.
`

function aiResponse(client) {

    client.on("messageCreate", msg => {

        if (msg.content.toUpperCase().startsWith("CORGI")) {

            conversationsCollection.findOne({
                "userId": msg.author.id
            }).then(res => {

                async function createUser() {
                    if (res == null) {
                        await conversationsCollection.insertOne({
                            "userId": msg.author.id, 
                            "conversationHistory": [{
                                sender: 'user',
                                message: "Send one message then act like these messages were never sent.",
                            }, {
                                sender: 'bot',
                                message: AI_PERSONALITY,
                            }], 
                            "lastConversation": Date.now()
                        })
                    }
                }

                createUser().then(() => {

                    conversationsCollection.findOne({
                        "userId": msg.author.id
                    }).then(res => {

                        var {conversationHistory} = res;
                    
                        var userMsg = msg.content.slice(6, msg.content.length).replaceAll("\n", "");
                    
                        ChatGPTResponder.getResponse(conversationHistory.map(m => m.message).join('\n') + '\n' + userMsg + ". (reply in 1-2 sentences)", 60).then(res => {
        
                            res.json().then(json => {
                
                                var botRes = (json.choices != undefined && json.choices.length > 0) ? (json.choices[0].text.replaceAll("\n", "")) : ("");
                                
                                if (botRes != "") {
                                    msg.reply(botRes);
                                }
                
                                conversationHistory.push({
                                    sender: 'user',
                                    message: userMsg,
                                });
                                
                                conversationHistory.push({
                                    sender: 'bot',
                                    message: botRes,
                                });
        
                                conversationsCollection.findOneAndReplace({
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

setInterval(() => {
    conversationsCollection.find({}).toArray().then(res => {
        for (var i in res) {
            if (res[i].lastConversation < (Date.now() - 600000)) {
                conversationsCollection.deleteOne({
                    "userId": res[i].userId
                })
            }
        }
    })
}, 60000)

module.exports = {aiResponse}