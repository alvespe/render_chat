const express = require('express');
const axios = require('axios');
const Buffer = require('buffer').Buffer; // Para criar base64

const app = express();
app.use(express.json()); // Para lidar com requisições JSON

// Configurações do Sunshine Conversations
const apiKeyId = 'app_6793a7e5b0900d3e32cb870f'; // Substitua pelo seu ID
const apiKeySecret = 'ujqbEmWhbDzLbIHAHpg9-1pMdTtbMOQwa9OCILojiWmrsShKotnHcnYu_Yy1YnGGoE7P5Et6HBCrWHT931BMNA'; // Substitua pelo seu Secret

// Rota para iniciar uma conversa
app.post('/start-chat', async (req, res) => {
    const { userId, headerText, inputPlaceholder } = req.body;

    try {
        // Codifica a chave no formato base64
        const basicAuth = Buffer.from(`${apiKeyId}:${apiKeySecret}`).toString('base64');

        // Realiza a requisição para iniciar a conversa
        const response = await axios.post(
            'https://api.smooch.io/v1/init',
            {
                userId: userId || 'guest_' + Math.random().toString(36).substring(2, 15),
                customText: {
                    headerText: headerText || 'Olá! Como posso ajudar?',
                    inputPlaceholder: inputPlaceholder || 'Digite sua mensagem...'
                }
            },
            {
                headers: {
                    Authorization: `Basic ${basicAuth}`, // Envia o cabeçalho com autenticação Basic
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao iniciar conversa',
            details: error.response ? error.response.data : error.message
        });
    }
});

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
