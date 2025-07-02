const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Rota para buscar todos os utilizadores com o tipo 'aluno'
router.get('/', async (req, res) => {
  try {
    // Busca na coleção 'User' filtrando por tipo e selecionando apenas os campos 'id' e 'nome'
    const alunos = await User.find({ tipo: 'aluno' }, 'id nome'); 
    res.json(alunos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar alunos.' });
  }
});

module.exports = router;