const express = require('express');
const Consulta = require('../models/Consulta');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware de autenticação para rotas protegidas
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

// --- ROTAS PÚBLICAS (sem token) ---

// Rota para TODOS verem os horários disponíveis
router.get('/disponiveis', async (req, res) => {
  try {
    const horarios = await Consulta.find({ status: 'disponivel' }).populate('aluno', 'nome');
    res.json(horarios);
  } catch (error) { res.status(500).json({ error: 'Erro no servidor.' }); }
});

// Rota para o CLIENTE fazer um pré-agendamento (sem token)
router.put('/agendar/:id', async (req, res) => {
    try {
        const { clienteId } = req.body;
        if (!clienteId) return res.status(400).json({ message: 'ID do cliente é obrigatório.' });
        const consulta = await Consulta.findByIdAndUpdate(
            req.params.id, 
            { cliente: clienteId, status: 'pendente' },
            { new: true }
        );
        if (!consulta) return res.status(404).json({ message: 'Horário não encontrado.' });
        res.status(200).json({ message: 'Solicitação de agendamento enviada!', consulta });
    } catch (error) { res.status(500).json({ message: 'Erro no servidor ao agendar.' }); }
});

// Rota para COORDENADOR excluir um horário (sem token, conforme solicitado)
router.delete('/:id', async (req, res) => {
    try {
        const consulta = await Consulta.findById(req.params.id);
        if (!consulta) return res.status(404).json({ message: 'Horário não encontrado.' });
        if (consulta.status === 'confirmada') {
            return res.status(400).json({ message: 'Não é possível remover um horário que já foi confirmado.' });
        }
        await Consulta.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Horário removido com sucesso!' });
    } catch (error) { res.status(500).json({ message: 'Erro no servidor.' }); }
});


// --- ROTAS PROTEGIDAS (precisam de token) ---

// Rota para o COORDENADOR criar um novo horário disponível
router.post('/criar-horario', auth, async (req, res) => {
    if (req.user.tipo !== 'coordenador') {
        return res.status(403).json({ message: 'Acesso negado. Apenas coordenadores podem criar horários.' });
    }
    try {
        const { alunoId, dataHora } = req.body;
        if (!alunoId || !dataHora) {
            return res.status(400).json({ message: 'Dados incompletos. Faltando ID do aluno ou data/hora.' });
        }
        await Consulta.create({ aluno: alunoId, dataHora: dataHora });
        res.status(201).json({ message: 'Horário criado com sucesso!' });
    } catch (error) {
        console.error("Erro em criar-horario:", error);
        res.status(500).json({ message: 'Erro no servidor ao criar horário.' });
    }
});

// Rota para o COORDENADOR ver agendamentos pendentes
router.get('/pendentes', auth, async (req, res) => {
    if (req.user.tipo !== 'coordenador') return res.status(403).json({ message: 'Acesso negado.' });
    try {
        const pendentes = await Consulta.find({ status: 'pendente' }).populate('cliente', 'nome email').populate('aluno', 'nome');
        res.json(pendentes);
    } catch (error) { res.status(500).json({ error: 'Erro no servidor.' }); }
});

// Rota para o COORDENADOR confirmar um agendamento
router.post('/confirmar/:id', auth, async (req, res) => {
    if (req.user.tipo !== 'coordenador') return res.status(403).json({ message: 'Acesso negado.' });
    try {
        const consulta = await Consulta.findByIdAndUpdate(req.params.id, { status: 'confirmada' }, { new: true });
        if (!consulta) return res.status(404).json({ message: 'Consulta não encontrada.' });
        res.json({ message: 'Consulta confirmada!', consulta });
    } catch (error) { res.status(500).json({ error: 'Erro no servidor.' }); }
});

// Rota para o COORDENADOR rejeitar um agendamento
router.post('/rejeitar/:id', auth, async (req, res) => {
    if (req.user.tipo !== 'coordenador') {
        return res.status(403).json({ message: 'Acesso negado.' });
    }
    try {
        const consulta = await Consulta.findByIdAndUpdate(
            req.params.id, 
            { status: 'disponivel', $unset: { cliente: 1 } }, 
            { new: true }
        );
        if (!consulta) return res.status(404).json({ message: 'Consulta não encontrada.' });
        res.json({ message: 'Consulta rejeitada e horário liberado.', consulta });
    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor ao rejeitar a consulta.' });
    }
});

// Rota para o CLIENTE ver as SUAS PRÓPRIAS consultas
router.get('/cliente', auth, async (req, res) => {
    if (req.user.tipo !== 'cliente') return res.status(403).json({ message: 'Acesso negado.' });
    try {
        const consultas = await Consulta.find({ cliente: req.user.id }).populate('aluno', 'nome');
        res.json(consultas);
    } catch (error) { res.status(500).json({ error: 'Erro no servidor.' }); }
});

// Rota para o CLIENTE cancelar uma consulta que ele agendou
router.put('/cancelar/cliente/:id', auth, async (req, res) => {
    if (req.user.tipo !== 'cliente') return res.status(403).json({ message: 'Acesso negado.' });
    try {
        const consulta = await Consulta.findOne({ _id: req.params.id, cliente: req.user.id });
        if (!consulta) return res.status(404).json({ message: 'Consulta não encontrada.' });
        
        consulta.status = 'disponivel';
        consulta.cliente = null;
        await consulta.save();
        res.json({ message: 'Consulta cancelada com sucesso.' });
    } catch (error) { res.status(500).json({ error: 'Erro no servidor.' }); }
});

// Rota para o ALUNO ver a SUA PRÓPRIA agenda completa
router.get('/aluno', auth, async (req, res) => {
    // 1. Garante que quem está a pedir é um aluno
    if (req.user.tipo !== 'aluno') {
        return res.status(403).json({ message: 'Acesso negado.' });
    }

    try {
        // 2. Busca todas as consultas associadas ao ID do aluno logado
        const agenda = await Consulta.find({ aluno: req.user.id })
            .populate('cliente', 'nome'); // Puxa o nome do cliente, se houver

        res.json(agenda);
    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor ao buscar a agenda do aluno.' });
    }
});


module.exports = router;
