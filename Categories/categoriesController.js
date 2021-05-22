const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');
const bcrypt = require('bcryptjs');

const userAuth = require('../Middlewares/userAuth');

router.post('/category/create' , userAuth, (req, res) => {
    let id = req.body.id;
    let route = req.body.route;
    let title = req.body.title;

    Category.create({
        title: title,
        classroomId: id,
    }).then(() => {
        res.redirect(route);
    }).catch(error => {
        res.render('error', {error: 'Erro ao criar categoria --> ' + error});
    });
});

router.post('/category/edit' , userAuth, (req, res) => {
    let id = req.body.id;
    let route = req.body.route;
    let title = req.body.title;

    Category.update({
        title: title
    }, {where: {id: id}}).then(() => {
        res.redirect(route);
    }).catch(error => {
        res.render('error', {error: 'Erro ao editar categoria --> ' + error});
    });
});

router.post('/category/delete' , userAuth, (req, res) => {
    let id = req.body.id;
    let route = req.body.route;

    Category.destroy({where: {id: id}}).then(() => {
        res.redirect(route);
    }).catch(error => {
        res.render('error', {error: 'Erro ao excluir categoria --> ' + error});
    });
});

module.exports = router;