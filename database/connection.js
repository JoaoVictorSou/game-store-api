const Sequelize = require('sequelize')

const connection = new Sequelize('gamestore', 'root', "Py$552210", {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
})
 
module.exports = connection