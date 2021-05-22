const Sequelize = require('sequelize');
const connection = require('../Database/database');
const User = require('../Users/User');

const Classroom = connection.define('classrooms', {
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    enterCode: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    currentUsers: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    
});

User.hasMany(Classroom, {onDelete: 'cascade', hooks:true});
Classroom.belongsTo(User);

Classroom.sync({force: false});

module.exports = Classroom;