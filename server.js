const express = require('express');
const cors = require('cors');

// Cria a aplicação Express
const app = express();
const port = 3000;

// Middlewares
app.use(cors()); // Permite requisições de diferentes origens (CORS)
app.use(express.json()); // Permite o uso de JSON no corpo das requisições
app.use(express.static('public')); // Serve arquivos estáticos da pasta "public"

// Rota para sortear números
app.post('/sortear', (req, res) => {
    const { min, max, quantidade, jogos } = req.body;

    // Converte os valores para números
    const minNum = 1; // Fixo como 1
    const maxNum = parseInt(max, 10);
    const quantidadeNum = parseInt(quantidade, 10);
    const jogosNum = parseInt(jogos, 10);

    // Verifica se os valores são válidos
    if (isNaN(maxNum) || isNaN(quantidadeNum) || isNaN(jogosNum)) {
        return res.status(400).json({ error: 'Valores inválidos. Certifique-se de que todos os campos são números.' });
    }

    if (minNum >= maxNum) {
        return res.status(400).json({ error: 'O valor máximo deve ser maior que 1.' });
    }

    if (quantidadeNum > (maxNum - minNum + 1)) {
        return res.status(400).json({ error: 'A quantidade de números a sortear não pode ser maior que o intervalo.' });
    }

    // Sorteia os números para cada jogo
    const todosJogos = [];
    for (let i = 0; i < jogosNum; i++) {
        const numeros = [];
        while (numeros.length < quantidadeNum) {
            const numero = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
            if (!numeros.includes(numero)) {
                numeros.push(numero);
            }
        }
        numeros.sort((a, b) => a - b); // Ordena os números
        todosJogos.push(numeros);
    }

    // Retorna os jogos sorteados
    res.json({ jogos: todosJogos });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});