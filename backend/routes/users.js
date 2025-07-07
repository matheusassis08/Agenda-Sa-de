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

// Editar o próprio perfil (cliente, aluno ou coordenador)
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

// Coordenador lista todos os alunos cadastrados
router.get('/alunos', auth, async (req, res) => {
    if (req.user.tipo !== 'coordenador') {
        return res.status(403).json({ message: 'Apenas coordenadores podem visualizar os alunos.' });
    }

    try {
        const alunos = await User.find({ tipo: 'aluno' }).select('nome email telefone foto matricula');
        res.json(alunos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar alunos.' });
    }
});

// Coordenador edita qualquer aluno
router.put('/editar-aluno/:id', auth, async (req, res) => {
  if (req.user.tipo !== 'coordenador') {
    return res.status(403).json({ message: 'Apenas coordenadores podem editar alunos.' });
  }

  try {
    const { nome, email, telefone, matricula } = req.body;

    // Encontra o aluno pelo ID e garante que é do tipo aluno
    const aluno = await User.findOne({ _id: req.params.id, tipo: 'aluno' });

    if (!aluno) {
      return res.status(404).json({ message: 'Aluno não encontrado.' });
    }

    // Atualiza os campos apenas se fornecidos
    if (nome) aluno.nome = nome;
    if (email) aluno.email = email;
    if (telefone) aluno.telefone = telefone;
    if (matricula) aluno.matricula = matricula;

    await aluno.save();

    res.json({ message: 'Aluno atualizado com sucesso!', aluno });
  } catch (error) {
    console.error('Erro ao atualizar aluno:', error);
    res.status(500).json({ message: 'Erro no servidor ao atualizar o aluno.' });
  }
});

// Coordenador exclui um aluno
router.delete('/excluir-aluno/:id', auth, async (req, res) => {
  if (req.user.tipo !== 'coordenador') {
    return res.status(403).json({ message: 'Apenas coordenadores podem excluir alunos.' });
  }

  try {
    const aluno = await User.findOneAndDelete({ _id: req.params.id, tipo: 'aluno' });

    if (!aluno) {
      return res.status(404).json({ message: 'Aluno não encontrado.' });
    }

    res.json({ message: 'Aluno excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir aluno:', error);
    res.status(500).json({ message: 'Erro no servidor ao excluir o aluno.' });
  }
});



module.exports = router;

