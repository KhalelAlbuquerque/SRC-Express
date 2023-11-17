const {Sequelize} = require('sequelize')


const db = new Sequelize( "express" , "root", "1234", {
    host: "localhost",
    dialect: 'mysql'
})


module.exports  = db