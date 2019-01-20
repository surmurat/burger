const Sequelize = require('sequelize');
const BurgerModel = require('../models/burger');

const sequelize = new Sequelize('burgers_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const Burgers = BurgerModel(sequelize, Sequelize);

sequelize.sync({force:true}).then(()=> { console.log('Database & tables created!')});

module.exports = {
    Burgers
};