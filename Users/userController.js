const express = require('express');
const router = express.Router();
const User = require('./User');
const slugify = require('slugify');
const bcrypt = require('bcryptjs');

router.get('/singin', (req, res) => {
    res.render('singin');  
});

router.get('/login', (req, res) => {
    res.render('login', {
        session: req.session,
    });  
});

router.post('/user/create', (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let currentRooms = '';

    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);

    User.create({
        name: name,
        email: email,
        password: hash,
        currentRooms: currentRooms,
    }).then(() => {
        req.session.name = name;
        req.session.email = email;
        req.session.currentRooms = currentRooms;
        res.redirect('/login');
    }).catch(error => {
        res.render('error', {error: error,});
    });
});

router.post('/user/auth', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({where: {email: email,},}).then(user => {
        let correct = bcrypt.compareSync(password, user.password);
        if(correct)
        {
            req.session.userId = user.id;
            req.session.name = user.name;
            req.session.email = user.email;
            req.session.currentRooms = user.currentRooms;
            res.redirect('/home');
        }
        else
        {
            res.render('error', {error: 'Senha Incorreta'});
        }
    }).catch(error => {
        res.render('error', {error: 'Email Inválido'});
    });
});

router.get('/logout', (req, res) => {
    req.session.userId = '';
    req.session.name = '';
    req.session.email = '';
    req.session.currentRooms = '';
    res.redirect('/');
});


module.exports = router;