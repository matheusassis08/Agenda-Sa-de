const express = require('express');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware de autenticação
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

// Rota para um utilizador autenticado editar o seu próprio perfil (nome e telefone)
router.put('/perfil', auth, async (req, res) => {
    try {
        const { nome, telefone } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { nome, telefone },
            { new: true }
        ).select('-senha');

        if (!updatedUser) {
            return res.status(404).json({ message: 'Utilizador não encontrado.' });
        }
        res.json({ message: 'Perfil atualizado com sucesso!', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor ao atualizar o perfil.' });
    }
});

module.exports = router;
