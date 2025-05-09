const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");

const { DataTypes } = Sequelize;

const Modul = db.define('modul', {
    judul: {
        type: DataTypes.STRING
    },
    deskripsi: {
        type: DataTypes.STRING
    },
    durasi: {
        type: DataTypes.STRING
    },
    kelasId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    pelajaranId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    }
}, {
    freezeTableName: true
});

module.exports = Modul