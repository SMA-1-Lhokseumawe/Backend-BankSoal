const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");

const { DataTypes } = Sequelize;

const Nilai = db.define('nilai', {
    skor: {
        type: DataTypes.DECIMAL(5,2),
        allowNull: false,
        validate: {
            min: 0,
            max: 100
        }
    },
    level: {
        type: DataTypes.STRING
    },
    jumlahSoal: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    jumlahJawabanBenar: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    pelajaranId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    kelasId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    siswaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true
});

module.exports = Nilai;