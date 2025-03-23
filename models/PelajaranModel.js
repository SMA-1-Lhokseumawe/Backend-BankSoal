const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");

const Users = require("./UserModel.js")
const Kelas = require("./KelasModel.js");

const { DataTypes } = Sequelize;

const Pelajaran = db.define('pelajaran', {
    pelajaran: {
        type: DataTypes.STRING
    },
    kelasId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
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

Users.hasMany(Pelajaran);
Pelajaran.belongsTo(Users, {foreignKey: 'userId'})

Kelas.hasMany(Pelajaran);
Pelajaran.belongsTo(Kelas, { 
    foreignKey: 'kelasId', 
    as: 'kelas' 
});

module.exports = Pelajaran