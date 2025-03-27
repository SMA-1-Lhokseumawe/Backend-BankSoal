const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");

const Users = require("./UserModel.js")

const { DataTypes } = Sequelize;

const Guru = db.define('guru', {
    nip: {
        type: DataTypes.BIGINT(225)
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
    tanggalLahir: {
        type: DataTypes.DATE
    },
    alamat: {
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

Users.hasMany(Guru);
Guru.belongsTo(Users, {foreignKey: 'userId'})

module.exports = Guru