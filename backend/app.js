const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // 👈 Adicionado

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado com sucesso!'))
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));

// Rotas
app.use('/auth', require('./routes/auth'));
app.use('/consultas', require('./routes/consultas'));
app.use('/api/users', require('./routes/users'));
app.use('/alunos', require('./routes/alunos'));

// 💡 Servir imagens da pasta 'uploads' via URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Inicializa o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend a rodar na porta ${PORT}!`));
