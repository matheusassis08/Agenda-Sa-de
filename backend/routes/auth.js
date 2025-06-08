const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    // Agora pegamos também os campos telefone e matricula do corpo da requisição
    const { nome, email, senha, tipo, telefone, matricula } = req.body;

    const hashed = await bcrypt.hash(senha, 10);

    // Criamos o usuário com todos os dados recebidos
    // Se um campo for undefined (ex: matricula para um cliente), ele será ignorado pelo Mongoose
    await User.create({ 
        nome, 
        email, 
        senha: hashed, 
        tipo,
        telefone,
        matricula
    });

    res.status(201).send('Usuário cadastrado com sucesso!');
  } catch (err) {
    // Tratamento de erro melhorado para dar mais detalhes
    if (err.code === 11000) { // Código de erro para chave duplicada (e-mail)
        return res.status(400).json({ error: 'Este e-mail já está em uso.' });
    }
    res.status(400).json({ error: err.message });
  }
});


router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('Usuario não achado');
  const valid = await bcrypt.compare(senha, user.senha);
  if (!valid) return res.status(400).send('Senha inválida');
  const token = jwt.sign({ id: user._id, tipo: user.tipo }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, tipo: user.tipo, nome: user.nome, id: user._id });
});

module.exports = router;