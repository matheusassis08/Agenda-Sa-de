const mongoose = require('mongoose');

const consultaSchema = new mongoose.Schema({
  aluno: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  dataHora: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['disponivel', 'pendente', 'confirmada', 'cancelada'],
    default: 'disponivel'
  }
});

module.exports = mongoose.model('Consulta', consultaSchema);
