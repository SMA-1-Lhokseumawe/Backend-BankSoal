const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");

const Users = require("./UserModel.js")

const { DataTypes } = Sequelize;

const Post = db.define('post', {
    judul: {
        type: DataTypes.STRING
    },
    content: {
        type: DataTypes.STRING
    },
    kategori: {
        type: DataTypes.STRING
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    url: {
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

Users.hasMany(Post);
Post.belongsTo(Users, {foreignKey: 'userId'})

module.exports = Post