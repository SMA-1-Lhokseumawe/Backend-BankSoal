const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");

const Users = require("./UserModel.js")

const { DataTypes } = Sequelize;

const Guru = db.define('guru', {
    nip: {
        type: DataTypes.INTEGER
    },
    nama: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    gender: {
        type: DataTypes.STRING
    },
    ttl: {
        type: DataTypes.STRING
    },
    alamat: {
        type: DataTypes.STRING
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

Users.hasMany(Guru);
Guru.belongsTo(Users, {foreignKey: 'userId'})

module.exports = Guru