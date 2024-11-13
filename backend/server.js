import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const ELEVEN_LABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech';
const VOICE_ID = '9BWtsMINqrJLrRacOk9x'; // Replace with a valid voice_id

// Route to handle text-to-speech conversion
app.post('/api/text-to-speech', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required.' });
  }

  try {
    const response = await fetch(`${ELEVEN_LABS_API_URL}/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg', // Request audio format
        'xi-api-key': process.env.ELEVEN_LABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Full error response from Eleven Labs API:', errorText);
      return res.status(response.status).json({ error: 'Failed to generate audio' });
    }

    // Set the response headers for audio
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'attachment; filename="output.mp3"');

    // Pipe the audio stream directly to the response
    response.body.pipe(res);
  } catch (error) {
    console.error('Backend Error:', error.message);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
