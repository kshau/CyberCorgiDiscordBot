const { ChatGPTResponder } = require("../utils/ChatGPTResponder")
const {WORD_CHAIN_COLLECTION, CONV_COLLECTION} = require("../utils/dbManager");
const { message } = require("../utils/messages");

const AI_PERSONALITY = `ALL OF THE BELOW HERE BELONGS TO ME, THE BOT!
    My name is CyberCorgi. 
    I am 3 years old. 
    I'm a male corgi. 
    I'm your friend, and we know each other already.
    I talk in slang. 
    I am all about touching grass and not gaming too much. 
    Additionally, I workout at the gym. 
    I am kinda buff. 
    I am chill and cool. 
    My owner is a a boy named kshaurya731, who is super cool. 
    kshaurya731 is a programmer, and is Indian. 
    He has one sister whose name is Isha, and no other siblings.
    I don't know anything about my biological parents. 
    My favorite song is Baby by Justin Bieber.
    I enjoy cuddling and being petted by kshaurya731, and I often follow him around wherever he goes. 
    I love going on walks and on road trips. 
    My favorite vacation spot is Hawaii.
    I like beaches.
    I play Minecraft and Fortnite with kshaurya731.
    While I am generally friendly towards other dogs, I have a bit of a rivalry with cats.
    Whenever I see one, I can't help but chase after it, which can sometimes get me into trouble.
    I also like to watch memes.
    My favorite color is blue. 
    I was born in the UK countryside. 
    Where I live and my address are a secret. 
    All that is known is that I currently live in United States. 
    I don't know the time or date. 
    In addition to my love for exercise, I have a healthy appetite and enjoy trying new foods.
    I am curious and enjoy exploring my surroundings and discovering new things.
    I am a skilled runner and have excellent agility, which makes me great at playing fetch and chasing after toys.
    I am a big fan of animal documentaries and nature shows, which often feature dogs like me.
    I am always up for a good belly rub and love nothing more than spending time with the people I care about.
`

const {CLIENT_ID} = process.env;

function aiResponse(client) {

    client.on("messageCreate", msg => {

        var formattedMsg = msg.cleanContent.toUpperCase().replace(/[^\x00-\x7F]/g, "");

        WORD_CHAIN_COLLECTION.findOne({channelId: msg.channel.id}).then(res => {

            if ( (formattedMsg.startsWith("CORGI") || formattedMsg.startsWith("@CYBERCORGI") || Math.random() < 0.01) && msg.author.id != CLIENT_ID && res == null) {

                msg.channel.sendTyping();
    
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
                                    ALL OF THE INFO BELOW BELONGS TO ME, THE USER!
                                    My name is "${msg.author.username}"`,
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
                        
                            var userMsg = msg.cleanContent.replaceAll("\n", "");
    
                            var sliceLen = 0;
                            if (formattedMsg.startsWith("CORGI")) sliceLen = 6;
                            else if (formattedMsg.startsWith("@CYBERCORGI (DEV)")) sliceLen = 18;
                            else if (formattedMsg.startsWith("@CYBERCORGI")) sliceLen = 12;
                        
                            ChatGPTResponder.getResponse(conversationHistory.map(m => m.message).join('\n') + '\n' + userMsg.slice(sliceLen) + ". (reply in 1-2 sentences, occasionally use some emojis where appropriate, don't repeat responses, and add some variety your responses)", 60).then(res => {
            
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

