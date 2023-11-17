const db = require('./db')
const { DataTypes } = require( 'sequelize')

const UserSchema = db.define('User', {
    login:{
        type: DataTypes.STRING,
        required: true
    },
    password:{
        type: DataTypes.STRING,
        required: true
    },
})

module.exports = {User: UserSchema}