const express = require('express');
const router = express.Router();
const Classroom = require('./Classroom');
const slugify = require('slugify');
const bcrypt = require('bcryptjs');

const userAuth = require('../Middlewares/userAuth');
const Category = require('../Categories/Category');
const Lesson = require('../Lessons/Lesson');
const User = require('../Users/User');

router.get('/home', userAuth, (req, res) => {
    Classroom.findAll({where: {userId: req.session.userId}}).then(rooms => {
        User.findByPk(req.session.userId).then(user => {
            let currentRooms = user.currentRooms.split(',');
            Classroom.findAll({where: {id: currentRooms}}).then(outherRooms => {
                let newCurrentRooms = '';
                outherRooms.forEach(newCurrentRoom => {
                    newCurrentRooms += newCurrentRoom.id + ',';
                });
                User.update({currentRooms: newCurrentRooms}, {where: {id: user.id}}).then(() => {
                    res.render('classroom/index', {
                        session: req.session,
                        rooms: rooms,
                        outherRooms: outherRooms,
                    });
                }).catch(error => {
                    res.render('error', {error: 'Erro eu atualizar usuário --> ' + error});
                });
                
            });   
        });



        
    });
    
});

router.get('/classroom/create', userAuth, (req, res) => {
    res.render('classroom/create', {
        session: req.session,
    });
});

router.post('/classroom/create', userAuth, (req, res) => {
    let userId = req.session.userId;
    let title = req.body.title;
    let description = req.body.description;
    let enterCode = req.body.enterCode;
    let currentUsers = '';

    Classroom.create({
        userId: userId,
        title: title,
        description: description,
        enterCode: enterCode,
        currentUsers: currentUsers,
    }).then(() => {
       res.redirect('/home'); 
    }).catch(error => {
        res.render('error', {error: 'Erro ao criar Sala --> ' + error});
    });
});

router.get('/classroom/edit/:id',userAuth, (req, res) => {
    let id = req.params.id;
    Classroom.findByPk(id).then(room => {
        res.render('classroom/edit', {
            session: req.session,
            room: room,           
        });
    }).catch(error => {
        res.render('error', {error: 'Sala não encontrada --> ' + error});
    });
});

router.post('/classroom/edit/',userAuth, (req, res) => {
    let id = req.body.id;
    let title = req.body.title;
    let description = req.body.description;
    let enterCode = req.body.enterCode;

    Classroom.update({
        title: title,
        description: description,
        enterCode: enterCode,
    }, {where: {id: id}}).then(() => {
        res.redirect('/home');
    }).catch(error => {
        res.render('error', {error: 'Erro eu atualizar sala --> ' + error});
    });
});

router.post('/classroom/delete/', userAuth, (req, res) => {
    let id = req.body.id;
    Classroom.destroy({where: {id: id}}).then(() => {
        res.redirect('/home');
    }).catch(error => {
        res.render('error', {error: 'Sala não encontrada --> ' + error});
    });
});

router.get('/classroom/room/:id', userAuth, (req, res) => {
    let id = req.params.id;
    Classroom.findOne({where: {id: id}, include: [{model: Lesson}]}).then(room => {
        Category.findAll({where: {classroomId: room.id},}).then(categories => {
            if(room.userId == req.session.userId)
            {  
                let currentUsers = room.currentUsers.split(',');
                User.findAll({where: {id: currentUsers}}).then(users => {
                    res.render('classroom/teacher', {
                        session: req.session,
                        categories: categories,
                        room: room, 
                        lessons: room.lessons,
                        users: users,
                    });
                });               
            }
            else
            {
                res.render('classroom/student', {
                    session: req.session,
                    categories: categories,
                    room: room, 
                    lessons: room.lessons,
                });
            }
        });
        
    }).catch(error => {
        res.render('error', {error: 'Sala não encontrada --> ' + error});
    });
});

router.post('/classroom/enter', userAuth, (req, res) => {
    let enterCode = req.body.enterCode;
    Classroom.findOne({where: {enterCode: enterCode}}).then(room => {
        User.findByPk(req.session.userId).then(user => {
            Classroom.update({
                currentUsers: room.currentUsers + user.id + ','
            }, {where: {id: room.id}}).then(() => {
                User.update({
                    currentRooms: user.currentRooms + room.id + ','
                }, {where: {id: user.id}}).then(() => {

                    res.redirect('/home');

                }).catch(error => {
                    res.render('error', {error: 'Não foi possível acessar seu Usuário --> ' + error});
                });
            }).catch(error => {
                res.render('error', {error: 'Não foi possível acessar a Sala --> ' + error});
            });
        }).catch(error => {
            res.render('error', {error: 'Seu usuário não foi encontrado --> ' + error});
        });
    }).catch(error => {
        res.render('error', {error: 'Sala não encontrada --> ' + error});
    });
});

router.post('/classroom/kickout', userAuth, (req, res) => {
    let id = req.body.id;
    let roomId = req.body.roomId;
    let route = req.body.route;

    Classroom.findByPk(roomId).then(room => {
        let currentUsers = room.currentUsers.split(',');
        currentUsers.splice(currentUsers.indexOf(''), 1);
        currentUsers.splice(currentUsers.indexOf(id), 1);
        let newCurrentUsers = '';
        currentUsers.forEach(currentUser => {
            newCurrentUsers += currentUser + ','
        });

        User.findByPk(id).then(user => {
            let currentRooms = user.currentRooms.split(',');
            currentRooms.splice(currentRooms.indexOf(''), 1);
            currentRooms.splice(currentRooms.indexOf(roomId), 1);
            let newCurrentRooms = '';
            currentRooms.forEach(currentRoom => {
                newCurrentRooms += currentRoom + ',';
            });

            Classroom.update({currentUsers: newCurrentUsers}, {where: {id: roomId}}).then(() => {
                User.update({currentRooms: newCurrentRooms}, {where: {id: id}}).then(() => {
                    res.redirect(route);
                }).catch(error => {
                    res.render('error', {error: 'Não foi possível atualizar o usuário --> ' + error});
                });
            }).catch(error => {
                res.render('error', {error: 'Não foi possível atualizar a sala --> ' + error});
            });
            
        }).catch(error => {
            res.render('error', {error: 'Usuário não encontrado --> ' + error});
        });
    }).catch(error => {
        res.render('error', {error: 'Sala não encontrada --> ' + error});
    });
});

module.exports = router;

