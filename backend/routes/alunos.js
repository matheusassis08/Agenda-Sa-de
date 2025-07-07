const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Rota para buscar todos os utilizadores com o tipo 'aluno'
router.get('/', async (req, res) => {
  try {
    // <<< MUDANÇA PRINCIPAL AQUI >>>
    // Agora estamos a pedir ao banco de dados para retornar todos estes campos.
    // O Mongoose inclui o _id por padrão.
    const projection = 'nome email telefone matricula';
    
    const alunos = await User.find({ tipo: 'aluno' }, projection);
    
    res.json(alunos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar alunos.' });
  }
});

module.exports = router;