const mongoose = require('mongoose');

const consultaSchema = new mongoose.Schema({
  aluno: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dataHora: Date,
  status: { type: String, enum: ['pendente', 'confirmada', 'cancelada'], default: 'pendente' }
});

module.exports = mongoose.model('Consulta', consultaSchema);