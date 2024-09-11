const axios = require('axios');
require('dotenv').config();

const { TYPHOON_KEY } = process.env;

const typhoonAI = async (text) => {
    try{
        const resp = await axios.post('https://api.opentyphoon.ai/v1/chat/completions', {
            "model": "typhoon-v1.5-instruct",
            "max_tokens": 512,
            "messages": [
                {
                    "role": "system",
                    "content": "You are a helpful assistant. You must answer only in Thai."
                },
                {
                    "role": "system",
                    "content": "ช่วยตอบให้สั้นกระชับและเข้าใจง่าย"
                },
                {
                    "role": "user",
                    "content": text
                }
            ],
            "temperature": 0.4,
            "top_p": 0.9,
            "top_k": 0,
            "repetition_penalty": 1.05,
            "min_p": 0.05
        }, {
            headers: {
            Authorization: 'Bearer '+TYPHOON_KEY
            }    
        });
    }
    catch (error){
        console.log("Error with Typhoon AI",error)
        return "AI ตอนนี้มีปัญหา"
    }
    
    return resp.data.choices[0].message.content;
};

module.exports = {
    typhoonAI
};
