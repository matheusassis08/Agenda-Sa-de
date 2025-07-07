const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  senha: { type: String, required: true },
  tipo: { 
    type: String, 
    enum: ['coordenador', 'aluno', 'cliente'], 
    required: true 
  },
  telefone: { type: String },
  matricula: { type: String },
  foto: { type: String } // <-- Novo campo para base64 ou URL da imagem
});

module.exports = mongoose.model('User', userSchema);
