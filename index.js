const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

// Configure o JWT gerado manualmente
const JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImFwcF82NzkzOWNhMmIyZjc4YzZmOTJlOGVlMzIifQ.eyJzY29wZSI6ImFwcCIsImV4cCI6MTczNzgyNjgwMH0.odkiuY0AY29xTJogcrzeL7lW9Zuezucr1ir60KUhD0A"; // Substitua aqui pelo token gerado

// Configuração da rota para iniciar a conversa
app.post('/start-conversation', async (req, res) => {
    try {
        const response = await fetch('https://api.smooch.io/v1/init', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${JWT_TOKEN}`, // JWT aqui
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // Exemplo de payload para iniciar a conversa
                userId: req.body.userId || 'default-user-id',
                device: req.body.device || 'web'
            })
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            res.status(response.status).json({
                error: 'Erro ao iniciar conversa',
                details: errorDetails
            });
            return;
        }

        const data = await response.json();
        res.status(200).json({
            message: 'Conversa iniciada com sucesso',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            error: 'Erro interno do servidor',
            details: error.message
        });
    }
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000; // Porta configurada automaticamente no Render
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
