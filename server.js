const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { Buffer } = require('buffer');
require('dotenv').config();

const app = express();
const port = 5500;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.post('/api/analyze-image', async (req, res) => {
  const { imageData } = req.body;

  const subscriptionKey = process.env.SUBSCRIPTION_KEY;
  const endpoint = process.env.ENDPOINT;

  const imageBuffer = Buffer.from(imageData, 'base64');

  const params = {
    'visualFeatures': 'Categories,Description,Color',
    'details': '',
    'language': 'en'
  };

  const headers = {
    'Content-Type': 'application/octet-stream',
    'Ocp-Apim-Subscription-Key': subscriptionKey
  };
  console.log(headers);

  try {
    const response = await axios.post(endpoint, imageBuffer, {
      params,
      headers,
    });

    const analysisResults = response.data;
    console.log('Analysis Results:', analysisResults);
    res.json(analysisResults);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Image analysis failed' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
