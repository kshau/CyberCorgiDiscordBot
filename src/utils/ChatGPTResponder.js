const {fetch} = require("undici")

const {GPT_API_KEY} = process.env;

class ChatGPTResponder {

    static async getResponse(q, maxTokens) {
        
        return fetch(`https://api.pawan.krd/v1/completions`, {

            body: JSON.stringify({model: "text-davinci-003", prompt: q, temperature: 1, max_tokens: maxTokens}),
            headers: {
                "authorization": `Bearer ${GPT_API_KEY} `,
                "content-type": "application/json"
            },
            method: "POST"
            }).then(res => {
                return res;
            })
    
    }

}

module.exports = {ChatGPTResponder}