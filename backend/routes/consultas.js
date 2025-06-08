const express = require('express');
const Consulta = require('../models/Consulta');
const User = require('../models/User');
const router = express.Router();

// Middleware para autenticação
const jwt = require('jsonwebtoken');
const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send('Token ausente');
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) { return res.status(403).send('Token inválido'); }
};

// Coordenador adiciona horários (associa aluno ao horário)
router.post('/criar-horario', auth, async (req, res) => {
  if (req.user.tipo !== 'coordenador') return res.status(403).send('Apenas coordenador pode.');
  const { aluno, dataHora } = req.body;
  await Consulta.create({ aluno, dataHora });
  res.send('Horário criado');
});

// Cliente solicita pre-agendamento
router.post('/pre-agendar', auth, async (req, res) => {
  if (req.user.tipo !== 'cliente') return res.status(403).send('Apenas cliente pode.');
  const { aluno, dataHora } = req.body;
  const consulta = await Consulta.create({ cliente: req.user.id, aluno, dataHora, status: 'pendente' });
  res.json(consulta);
});

// Coordenador confirma ou cancela
router.post('/confirmar/:id', auth, async (req, res) => {
  if (req.user.tipo !== 'coordenador') return res.status(403).send('Apenas coordenador pode.');
  await Consulta.findByIdAndUpdate(req.params.id, { status: 'confirmada' });
  res.send('Consulta confirmada');
});

router.post('/cancelar/:id', auth, async (req, res) => {
  // Coordenador pode cancelar sempre. Cliente até 24h antes.
  const consulta = await Consulta.findById(req.params.id);
  if (req.user.tipo === 'coordenador' || (req.user.tipo === 'cliente' && new Date(consulta.dataHora) > new Date(Date.now() + 24*60*60*1000))) {
    consulta.status = 'cancelada';
    await consulta.save();
    res.send('Consulta cancelada');
  } else return res.status(403).send('Não autorizado');
});

// Listar horários/consultas para aluno
router.get('/aluno', auth, async (req, res) => {
  if (req.user.tipo !== 'aluno') return res.status(403).send('Apenas aluno');
  const consultas = await Consulta.find({ aluno: req.user.id }).populate('cliente');
  res.json(consultas);
});

// Consultar horários/alunos disponíveis
router.get('/disponiveis', auth, async (req, res) => {
  const horarios = await Consulta.find({ status: 'pendente', cliente: null }).populate('aluno');
  res.json(horarios);
});

module.exports = router;