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

app.post('/api/query', async (req, res) => {
  const { query } = req.body;

  try {

    console.log("Button pressed")

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: `Create an outfit based on the keyword: ${query}. Provide links to purchase each article of clothing.` }],
      model: 'gpt-4',
    });

    const outfitText = completion.choices[0].message.content.trim();
    res.json({ outfit: outfitText });
  } catch (error) {
    console.error('Error fetching outfit:', error);
    res.status(500).send('Error fetching outfit');
  }
});

app.post('/api/closet', async (req, res) => {
  const { files } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: `Create an outfit based on the following articles of clothing: ${files.join(', ')}.` }],
      model: 'gpt-4',
    });

    const outfitText = completion.choices[0].message.content.trim();
    res.json({ outfit: outfitText });
  } catch (error) {
    console.error('Error building outfit from closet:', error);
    res.status(500).send('Error building outfit from closet');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
