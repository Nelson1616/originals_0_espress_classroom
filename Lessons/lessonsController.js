const express = require('express');
const router = express.Router();
const Lesson = require('./Lesson');
const slugify = require('slugify');
const bcrypt = require('bcryptjs');

const userAuth = require('../Middlewares/userAuth');

router.post('/lesson/new', userAuth, (req, res) => {
    let route = req.body.route;
    let classroomId = req.body.classroomId;
    let categoryId = req.body.categoryId;
    res.render('lesson/create', {
       session: req.session, 
       classroomId: classroomId,
       categoryId: categoryId,
       route: route,
    });
});

router.post('/lesson/create', userAuth, (req, res) => {
    let route = req.body.route;
    let classroomId = req.body.classroomId;
    let categoryId = req.body.categoryId;
    let title = req.body.title;
    let description = req.body.description;
    let videoLink = req.body.videoLink;
    let taskLink = req.body.taskLink;
    let usersComplete = '';

    Lesson.create({
        classroomId: classroomId,
        categoryId: categoryId,
        title: title,
        description: description, 
        videoLink: videoLink,
        taskLink: taskLink,
        usersComplete: usersComplete,
    }).then(() => {
        res.redirect(route);
    }).catch(error => {
        res.render('error', {error: 'Erro ao criar aula --> ' + error});
    });
});

router.post('/lesson/update', userAuth, (req, res) => {
    let route = req.body.route;   
    let id = req.body.id;
    Lesson.findByPk(id).then(lesson => {
        res.render('lesson/edit', {
            session: req.session, 
            id: id,
            route: route,
            lesson: lesson,
         });
    }).catch(error => {
        res.render('error', {error: 'Erro ao encontrar aula --> ' + error});
    });
    
});

router.post('/lesson/edit', userAuth, (req, res) => {
    let route = req.body.route;
    let id = req.body.id;
    let title = req.body.title;
    let description = req.body.description;
    let videoLink = req.body.videoLink;
    let taskLink = req.body.taskLink;

    Lesson.update({
        title: title,
        description: description, 
        videoLink: videoLink,
        taskLink: taskLink,
    }, {where: {id: id}}).then(() => {
        res.redirect(route);
    }).catch(error => {
        res.render('error', {error: 'Erro ao atualizar aula --> ' + error});
    });
});

router.post('/lesson/delete', userAuth, (req, res) => {
    let route = req.body.route;
    let id = req.body.id;
    Lesson.destroy({where: {id: id}}).then(() => {
        res.redirect(route);
    }).catch(error => {
        res.render('error', {error: 'Erro ao apagar aula --> ' + error});
    });
});

module.exports = router;