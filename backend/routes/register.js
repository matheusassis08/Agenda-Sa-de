const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Middleware para autenticação
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send('Acesso negado.');
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).send('Token mal formatado.');
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (e) {
    return res.status(403).send('Token inválido.');
  }
};

// Rota pública para registro de clientes e coordenadores
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, tipo, telefone, matricula, foto } = req.body;

    const hashed = await bcrypt.hash(senha, 10);

    const novoUsuario = new User({
      nome,
      email,
      senha: hashed,
      tipo,
      telefone,
      matricula,
      foto
    });

    await novoUsuario.save();

    res.status(201).send('Usuário registrado com sucesso!');
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Erro ao registrar usuário.' });
  }
});

// Rota protegida: Coordenador cria aluno (com campo criadoPor)
router.post('/register/aluno', auth, async (req, res) => {
  try {
    if (req.user.tipo !== 'coordenador') {
      return res.status(403).json({ message: 'Apenas coordenadores podem criar alunos.' });
    }

    const { nome, email, senha, telefone, matricula, foto } = req.body;
    const hashed = await bcrypt.hash(senha, 10);

    const novoAluno = new User({
      nome,
      email,
      senha: hashed,
      tipo: 'aluno',
      telefone,
      matricula,
      foto,
      criadoPor: req.user.id
    });

    await novoAluno.save();
    res.status(201).json({ message: 'Aluno criado com sucesso!', aluno: novoAluno });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao registrar aluno.' });
  }
});

module.exports = router;

