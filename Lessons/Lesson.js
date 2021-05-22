const Sequelize = require('sequelize');
const connection = require('../Database/database');
const Category = require('../Categories/Category');
const Classroom = require('../Classroom/Classroom');

const Lesson = connection.define('lessons', {
    title: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    videoLink: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    taskLink: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    usersComplete: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    
    
});

Category.hasMany(Lesson, {onDelete: 'cascade', hooks:true});
Lesson.belongsTo(Category);

Classroom.hasMany(Lesson, {onDelete: 'cascade', hooks:true});
Lesson.belongsTo(Classroom);

Lesson.sync({force: false});

module.exports = Lesson;