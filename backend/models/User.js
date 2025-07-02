const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true, required: true },
  senha: { type: String, required: true },
  tipo: { 
    type: String, 
    enum: ['coordenador', 'aluno', 'cliente'], 
    required: true 
  },
  telefone: { type: String, required: false },
  matricula: { type: String, required: false }
});

module.exports = mongoose.model('User', userSchema);
