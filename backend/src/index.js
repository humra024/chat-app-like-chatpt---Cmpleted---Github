const express = require('express');
const OpenAI = require("openai");
const cors = require('cors');

const openai = new OpenAI({
    apiKey: "Key"
});

// Setup server
const app = express();
app.use(express.json());
app.use(cors());


const chatHistory = []; // Array to store chat history messages

// Routes
app.post("/chat", async (req, res) => {
    // const messages = req.body.messages;
    const question=req.body.question
    
    // Add user question to chat history
    chatHistory.push({ role: "user", content: question });

    const completion = await openai.chat.completions.create({
        // messages: messages,
        messages: [ ...chatHistory, {"role": "system", "content": "You are a helpful assistant"},
            {"role": "user", "content": question}],
        model: 'gpt-4o-mini',
        temperature: 0,
        max_tokens: 200,
        top_p:0.7,
    });

    res.send({
        prompt: question,
        answer: completion.choices[0].message.content
    });
});

// Server running on port
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
