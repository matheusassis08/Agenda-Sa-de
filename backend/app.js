const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Configurações do Express
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado com sucesso!'))
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));

// Rotas da aplicação
app.use('/auth', require('./routes/auth'));
app.use('/consultas', require('./routes/consultas'));
app.use('/api/users', require('./routes/users'));
app.use('/alunos', require('./routes/alunos'));  // rota para buscar alunos

// Inicializa o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}!`));
