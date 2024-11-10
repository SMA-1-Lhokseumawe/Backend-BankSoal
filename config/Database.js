const { Sequelize } = require("sequelize");

const db = new Sequelize('bank_soal', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = db