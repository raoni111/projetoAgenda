const Contato = require('../models/contatoModel')
exports.index = (req, res) => {
    res.render('contato', {
        contato: {}
    });
}
exports.register = async (req, res) => {
    const contato = new Contato(req.body);
    try {
        await contato.register();
        if(contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => res.redirect('/contato/index'));
            return;
        }
        req.flash('success', 'Contato registrado com sucesso.');
        req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
        return;
    } catch(e) {
        console.error(e);
        return res.render('404');
    }
}
exports.editContato = async (req, res) => {
    if(!req.params.id) return res.render('404');
    try {
        const contato = await Contato.buscaId(req.params.id);
        if(!contato)  return res.render('404');
        res.render('contato', { contato: contato });
    } catch(error) {
        console.error(error)
        res.render('404')
    }
    
}
exports.edit = async (req, res) => {
    try {
        if(!req.params.id) return res.render('404');
        const contato = new Contato(req.body);
        await contato.edit(req.params.id);
        if(contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => res.redirect(`/contato/index/${req.params.id}`));
            return;
        }
        req.flash('success', 'Contato editado com sucesso.');
        req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
    } catch(error) {
        console.log(error);
        res.render('404');
    }
}