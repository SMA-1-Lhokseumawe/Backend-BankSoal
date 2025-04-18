const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");

const { DataTypes } = Sequelize;

const SubModul = db.define('sub_modul', {
    subJudul: {
        type: DataTypes.STRING
    },
    subDeskripsi: {
        type: DataTypes.STRING
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    modulId: {
        type: DataTypes.INTEGER
    },
    audio: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    video: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    urlAudio: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    urlVideo: {
        type: DataTypes.STRING,
        allowNull: true,
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

module.exports = SubModul