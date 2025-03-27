const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");

const Users = require("./UserModel.js")
const Kelas = require("./KelasModel.js");

const { DataTypes } = Sequelize;

const Siswa = db.define('siswa', {
    nis: {
        type: DataTypes.BIGINT(225)
    },
    nama: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    kelasId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
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
    gayaBelajar: {
        type: DataTypes.JSON,
        allowNull: true
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

Users.hasMany(Siswa);
Siswa.belongsTo(Users, {foreignKey: 'userId'})

Kelas.hasMany(Siswa);
Siswa.belongsTo(Kelas, { 
    foreignKey: 'kelasId', 
    as: 'kelas' 
});

module.exports = Siswa