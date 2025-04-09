const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");

const Users = require("./UserModel.js")

const { DataTypes } = Sequelize;

const Kelas = db.define('kelas', {
    kelas: {
        type: DataTypes.INTEGER
    },
    namaKelas: {
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

Users.hasMany(Kelas);
Kelas.belongsTo(Users, {foreignKey: 'userId'})

module.exports = Kelas