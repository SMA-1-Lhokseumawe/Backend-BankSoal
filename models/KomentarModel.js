const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");

const Users = require("./UserModel.js")
const Post = require("./PostModel.js");

const { DataTypes } = Sequelize;

const Komentar = db.define('komentar', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    postId: {
        type: DataTypes.INTEGER
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

Users.hasMany(Komentar);
Komentar.belongsTo(Users, {foreignKey: 'userId'})

Post.hasMany(Komentar);
Komentar.belongsTo(Post, { 
    foreignKey: 'postId', 
    as: 'post'
});

module.exports = Komentar