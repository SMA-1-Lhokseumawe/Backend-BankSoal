const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");

const Users = require("./UserModel.js")
const Modul = require("./ModulModel.js");

const { DataTypes } = Sequelize;

const SubModul = db.define('sub_modul', {
    subJudul: {
        type: DataTypes.STRING
    },
    subDeskripsi: {
        type: DataTypes.STRING
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    modulId: {
        type: DataTypes.INTEGER
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

Users.hasMany(SubModul);
SubModul.belongsTo(Users, {foreignKey: 'userId'})

Modul.hasMany(SubModul);
SubModul.belongsTo(Modul, { 
    foreignKey: 'modulId', 
    as: 'modul'
});

module.exports = SubModul