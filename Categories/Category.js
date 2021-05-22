const Sequelize = require('sequelize');
const connection = require('../Database/database');
const Classroom = require('../Classroom/Classroom');

const Category = connection.define('categories', {
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    }, 
    
});

Classroom.hasMany(Category, {onDelete: 'cascade', hooks:true});
Category.belongsTo(Classroom);

Category.sync({force: false});

module.exports = Category;