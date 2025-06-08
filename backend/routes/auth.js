const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;
    const hashed = await bcrypt.hash(senha, 10);
    await User.create({ nome, email, senha: hashed, tipo });
    res.status(201).send('Usuário cadastrado!');
  } catch (err) {
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