const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configura armazenamento de imagens com multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir); // Cria a pasta se não existir
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // .jpg, .png, etc
    const uniqueName = `foto-${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// =====================
//  CADASTRO (com imagem)
// =====================
router.post('/register', upload.single('foto'), async (req, res) => {
  try {
    const { nome, email, senha, tipo, telefone, matricula } = req.body;

    const hashed = await bcrypt.hash(senha, 10);

    // Gera URL da foto (se enviada)
    let fotoUrl = '';
    if (req.file) {
      fotoUrl = `http://192.168.100.8:3001/uploads/${req.file.filename}`;
    }

    await User.create({
      nome,
      email,
      senha: hashed,
      tipo,
      telefone,
      matricula,
      foto: fotoUrl
    });

    res.status(201).send('Usuário cadastrado com sucesso!');
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Este e-mail já está em uso.' });
    }
    res.status(400).json({ error: err.message });
  }
});

// ============
//   LOGIN
// ============
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('Usuário não encontrado');

  const valid = await bcrypt.compare(senha, user.senha);
  if (!valid) return res.status(400).send('Senha inválida');

  const token = jwt.sign({ id: user._id, tipo: user.tipo }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.json({
    token,
    tipo: user.tipo,
    nome: user.nome,
    id: user._id,
    foto: user.foto || null
  });
});

module.exports = router;
