const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
app.use(express.json()); // Para lidar com requisições JSON

// Configurações do Sunshine Conversations
const apiKeyId = 'app_67939ca2b2f78c6f92e8ee32'; // Substitua pelo seu ID
const apiKeySecret = 'vsrWTxieNWJMAaNsW_eStQdeWcGQ9BbzZClZUR9ZaCIi1D2Qo5YPkFwe1TSpdpvRP_CBt6S0P5tf_TqdKz6qlg'; // Substitua pelo seu Secret

// Rota para gerar JWT
app.get('/generate-jwt', (req, res) => {
    try {
        const token = jwt.sign(
            { scope: 'app' },
            apiKeySecret,
            {
                header: { alg: 'HS256', typ: 'JWT', kid: apiKeyId },
                expiresIn: '1h' // Expiração de 1 hora
            }
        );
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao gerar o token' });
    }
});

// Rota para iniciar uma conversa
app.post('/start-chat', async (req, res) => {
    const { userId, headerText, inputPlaceholder } = req.body;

    try {
        const token = jwt.sign(
            { scope: 'app' },
            apiKeySecret,
            {
                header: { alg: 'HS256', typ: 'JWT', kid: apiKeyId },
                expiresIn: '1h'
            }
        );

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
                    Authorization: `Bearer ${token}`,
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
