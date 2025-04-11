const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");
const { DataTypes } = Sequelize;

const Post = db.define('post', {
    judul: {
        type: DataTypes.STRING
    },
    content: {
        type: DataTypes.STRING
    },
    kategori: {
        type: DataTypes.JSON
    },
    namaProfile: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    urlImageProfile: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    images: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    url: {
        type: DataTypes.JSON,
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

module.exports = Post;