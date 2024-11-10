const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");

const { DataTypes } = Sequelize;

const Siswa = db.define('siswa', {
    username: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    nama: {
        type: DataTypes.STRING
    },
    kelas: {
        type: DataTypes.STRING
    },
    gender: {
        type: DataTypes.STRING
    },
    umur: {
        type: DataTypes.INTEGER
    },
    alamat: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    refresh_token: {
        type: DataTypes.TEXT
    },
}, {
    freezeTableName: true
});

module.exports = Siswa