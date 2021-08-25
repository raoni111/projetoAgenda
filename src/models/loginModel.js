const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  senha: { type: String, required: true }
});

const LoginModel = mongoose.model('Ligin', LoginSchema);

class  Login {
    constructor(body) {
        this.body = body;
        this.error = [];
        this.user = null;
    }
    async login() {
        this.valida()
        if(this.error.length > 0) return;
        this.user = await LoginModel.findOne( { email: this.body.email});
        if(!this.user) {
            this.error.push('O usuario nao existe!');
        }
        if(!bcrypt.compareSync(this.body.senha, this.user.senha)) {
            this.error.push('Senha invalida');
            this.user = null;
        }

    }
    async register() {
        this.valida()
        if(this.error.length > 0) return;
        
        this.usuarioExiste()
        if(this.error.length > 0) return;
        
        const salt = bcrypt.genSaltSync()
        this.body.senha = bcrypt.hashSync(this.body.senha, salt);

        this.user = await LoginModel.create(this.body);
    }
    async usuarioExiste() {
        this.user = await LoginModel.findOne( { email: this.body.email});
        if(this.user) this.error.push('Usuario ja existe');

    }
    valida() {
        this.clearUp()
        if(!validator.isEmail(this.body.email)) {
            this.error.push('O email nao e valido!');
        }
        if(this.body.senha.length < 3 || this.body.senha.length > 50) {
            this.error.push('A senha precisa ter entre 3 e 50 caracteries');
        }
    }
    clearUp() {
        for(const key in this.body) {
            if(typeof this.body[key] !== 'string') {
                this.body[kay] = '';
            }
        }
        this.body = {
            email: this.body.email,
            senha: this.body.senha
        }
    }
}

module.exports = Login;
