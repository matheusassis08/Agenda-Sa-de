const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Carrega as variáveis de ambiente do ficheiro .env
dotenv.config();

const app = express();

// Configurações do Express
app.use(cors());
app.use(express.json()); // Middleware para interpretar o corpo das requisições como JSON

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado com sucesso!'))
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));

// Rotas da aplicação
// Garante que todas as rotas estão a ser carregadas corretamente
app.use('/auth', require('./routes/auth'));
app.use('/consultas', require('./routes/consultas'));
app.use('/api/users', require('./routes/users')); // Rota para editar perfil
app.use('/alunos', require('./routes/alunos'));   // Rota para buscar alunos

// Inicializa o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend a rodar na porta ${PORT}!`));
