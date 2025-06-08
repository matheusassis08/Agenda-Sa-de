const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());

// Linhas importantes que carregam suas regras de negócio
app.use('/auth', require('./routes/auth'));
app.use('/consultas',require('./routes/consultas'));

// Linha que inicia o servidor e mostra a mensagem
app.listen(3001, () => console.log('Backend rodando na porta 3001!'));