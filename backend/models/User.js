// backend/models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true, required: true }, // É bom adicionar required
  senha: { type: String, required: true },
  tipo: { 
    type: String, 
    enum: ['coordenador', 'aluno', 'cliente'], 
    required: true 
  },
  // NOVOS CAMPOS ADICIONADOS
  telefone: { type: String, required: false }, // Opcional
  matricula: { type: String, required: false } // Opcional
});

module.exports = mongoose.model('User', userSchema);