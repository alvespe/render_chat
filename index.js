const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json()); // Necessário para fazer o parsing do corpo das requisições

const port = process.env.PORT || 3000;

app.post('/start-chat', async (req, res) => {
  try {
    const response = await axios.post('https://api.smooch.io/v1/init', {
      headers: {
        'Authorization': 'Bearer app_609c2a4922d15000d353f8f2',
        'Content-Type': 'application/json'
      },
      data: {
        userId: 'guest_' + Math.random().toString(36).substring(2, 15),
        customText: {
          headerText: 'Olá! Como posso ajudar?',
          inputPlaceholder: 'Digite sua mensagem...'
        }
      }
    });
    res.send(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
