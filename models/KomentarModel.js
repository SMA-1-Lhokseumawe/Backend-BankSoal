const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");
const { DataTypes } = Sequelize;

const Komentar = db.define('komentar', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    postId: {
        type: DataTypes.INTEGER
    },
    namaProfile: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    urlImageProfile: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    }
}, {
    freezeTableName: true
});

module.exports = Komentar;