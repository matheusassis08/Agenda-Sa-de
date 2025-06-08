const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Rota para buscar todos os usuários com o tipo 'aluno'
router.get('/alunos', async (req, res) => {
  try {
    const alunos = await User.find({ tipo: 'aluno' }, 'id nome'); // Busca apenas o ID e o nome
    res.json(alunos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar alunos.' });
  }
});

module.exports = router;