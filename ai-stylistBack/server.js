const express = require('express');
const { OpenAI } = require('openai');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const parseJSONResponse = (response) => {
  const match = response.match(/```json([\s\S]*?)```/);
  if (match) {
    return JSON.parse(match[1].trim());
  }
  return JSON.parse(response);
};

const systemMessage = {
  role: "system",
  content: `You are a fashion assistant that generates outfit suggestions with real, valid links to purchase each article of clothing. The JSON response should be an array of objects, each containing "image" (URL of the image), "name" (name of the item), and "link" (URL to purchase the item). Ensure the links and images are valid and currently active online retail links. If a valid link cannot be found, omit that item.`
};

const createOutfit = async (prompt) => {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [systemMessage, { role: "user", content: prompt }],
  });

  const outfit = parseJSONResponse(completion.choices[0].message.content.trim());
  return Array.isArray(outfit) ? outfit : [];
};

app.post('/api/query', async (req, res) => {
  const { query } = req.body;

  try {
    const outfit = await createOutfit(`Create an outfit based on the keyword: ${query}.`);
    res.json({ outfit });
  } catch (error) {
    console.error('Error fetching outfit:', error);
    res.status(500).send('Error fetching outfit');
  }
});

app.post('/api/closet', async (req, res) => {
  const { files } = req.body;

  try {
    const outfit = await createOutfit(`Create an outfit based on the following articles of clothing: ${files.join(', ')}.`);
    res.json({ outfit });
  } catch (error) {
    console.error('Error building outfit from closet:', error);
    res.status(500).send('Error building outfit from closet');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
