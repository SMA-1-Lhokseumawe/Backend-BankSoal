const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");

const Users = require("./UserModel.js")
const Kelas = require("./KelasModel.js");
const Pelajaran = require("./PelajaranModel.js");

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

Users.hasMany(Modul);
Modul.belongsTo(Users, {foreignKey: 'userId'})

Kelas.hasMany(Modul);
Modul.belongsTo(Kelas, { 
    foreignKey: 'kelasId', 
    as: 'kelas' 
});

Pelajaran.hasMany(Modul);
Modul.belongsTo(Pelajaran, { 
    foreignKey: 'pelajaranId', 
    as: 'pelajaran' 
});

module.exports = Modul