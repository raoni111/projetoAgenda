const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: 'N/A' },
  email: { type: String, required: false, default: 'N/A' },
  telefone: { type: String, required: false, default: 'N/A'},
  criadoEm: { type: Date, default: Date.now}
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

function Contato(body) {
  this.body = body;
  this.errors = [];
  this.user = null;
  this.contato = null;
}
Contato.prototype.register = async function() {
  this.valida()
  
  if(this.errors.length > 0) return;
  this.contato = await ContatoModel.create(this.body);
  
}
Contato.prototype.valida = function() {
  this.clearUp()
  if(this.body.email && !validator.isEmail(this.body.email)) {
    this.errors.push('O email nao e valido!');
  }
  
  if(!this.body.nome) this.errors.push('O campo nome e requerido')
  if(!this.body.email && !this.body.telefone) this.errors.push('Você tem que ter pelo menos um meio de contato: e-mail ou telefone')
}
Contato.prototype.clearUp = function() {
  for(const key in this.body) {
    if(typeof this.body[key] !== 'string') {
      this.body[kay] = '';
    }
  }
  this.body = {
    nome: this.body.nome,
      sobrenome: this.body.sobrenome,
      email: this.body.email,
      telefone: this.body.telefone
    }
}
Contato.prototype.edit = async function(id) {
  if(typeof id !== 'string') return;
  this.valida()
  if(this.errors.length > 0) return;
  this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true});
}

//Metodos estaticos
Contato.buscaId = async (id) => {
  const user = await ContatoModel.findById(id);
  return user
}
Contato.buscaContatos = async () => {
  const contatos = await ContatoModel.find().sort( {criadoEm: -1} );
  return contatos;
}
Contato.delete = async (id) =>  {
  if(typeof id !== 'string') return;
  const contato = await ContatoModel.findOneAndDelete({_id: id,});
  return contato;
}

module.exports = Contato;
