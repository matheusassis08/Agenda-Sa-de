const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  senha: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['coordenador', 'aluno', 'cliente'],
    required: true
  },
  telefone: {
    type: String,
    default: ''
  },
  matricula: {
    type: String,
    default: ''
  },
  foto: {
    type: String, // base64 ou URL da imagem
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);


