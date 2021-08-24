const Login = require('../models/loginModel');

exports.index = (req, res) => {
    res.render('login');
}
exports.register = async (req, res) => {
    const login = new Login(req.body);
    try {
        await login.register();
        if(login.error.length > 0) {
            req.flash('errors', login.error);
            req.session.save(() => {
                return res.redirect('/login/index');
            });
            return
        }
        req.flash('success', 'cadastro efetuado com sucesso');
        req.session.save(() => {
            return res.redirect('/login/index');
        });
    } catch(error) {
        console.error(error);
        res.render('404')
    }
}