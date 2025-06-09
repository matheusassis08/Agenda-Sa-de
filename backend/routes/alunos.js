const express = require('express');
const router = express.Router();
const Aluno = require('../models/Aluno'); // Certifique-se que o caminho está correto

// GET /alunos - retorna a lista de alunos
router.get('/', async (req, res) => {
  try {
    const alunos = await Aluno.find();
    res.json(alunos);
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    res.status(500).json({ message: 'Erro ao buscar alunos.' });
  }
});

module.exports = router;

