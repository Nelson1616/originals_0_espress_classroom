//Config do Express
const express = require('express'); 
const app = express(); 

//Config do EJS
app.set('view engine', 'ejs');
app.use(express.static('public'));

//Config do BodyParser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Config do Banco de Dados
const connection = require('./Database/database');
connection.authenticate().then(() => {
    console.log('Conectado ao Banco de Dados');
}).catch((error) => {
    console.log(error);
});

//Config Session
const session = require('express-session');
app.use(session({
    secret: 'qwertyuiop',
    cookie: {maxAge: 600000},
}));

//Config dos Controllers
const usersController = require('./Users/userController');
const User = require('./Users/User');
app.use('/', usersController);

const classroomsController = require('./Classroom/classroomsController');
const Classroom = require('./Classroom/Classroom');
app.use('/', classroomsController);

const categoriesController = require('./Categories/categoriesController');
const Category = require('./Categories/Category');
app.use('/', categoriesController);

const lessonsController = require('./Lessons/lessonsController');
const Lesson = require('./Lessons/Lesson');
app.use('/', lessonsController);











//Rotas
app.get('/', (req, res) => {
    res.render('wellcome');
});










//Ligando o Servidor
app.listen(8000, () => {
    console.log('O servidor está rodando');
});