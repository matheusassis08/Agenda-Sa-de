const mongoose = require('mongoose');

const AlunoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  // Outros campos do aluno podem ser adicionados aqui
});

module.exports = mongoose.model('Aluno', AlunoSchema);

