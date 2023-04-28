const {fetch} = require("undici")

const {GPT_API_KEY} = process.env;

class ChatGPTResponder {

    static async getResponse(q, maxTokens, sentence) {
        
        return fetch(`https://api.openai.com/v1/completions`, {

            body: JSON.stringify({model: "text-davinci-003", prompt: q, temperature: 0, max_tokens: maxTokens, stop: undefined}),
            headers: {
                "authorization": `Bearer ${GPT_API_KEY}`,
                "content-type": "application/json"
            },
            method: "POST"
            }).then(res => {
                return res;
            })
    
    }

}

module.exports = {ChatGPTResponder}
