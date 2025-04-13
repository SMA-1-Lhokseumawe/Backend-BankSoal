const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");

const { DataTypes } = Sequelize;

const NilaiSoal = db.define('nilai_soal', {
    nilaiId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'nilai',
            key: 'id'
        }
    },
    soalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'soal',
            key: 'id'
        }
    }
}, {
    freezeTableName: true,
});

module.exports = NilaiSoal;