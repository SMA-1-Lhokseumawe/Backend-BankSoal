const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");

const { DataTypes } = Sequelize;

const Siswa = db.define('siswa', {
    nis: {
        type: DataTypes.INTEGER
    },
    nama: {
        type: DataTypes.STRING
    },
    email: {
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
}, {
    freezeTableName: true
});

module.exports = Siswa