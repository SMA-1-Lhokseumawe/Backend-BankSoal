const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");
const { DataTypes } = Sequelize;

const Notification = db.define('notification', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        // Types could be: 'comment', 'like', etc.
    },
    urlImageProfile: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sourceUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // User who triggered the notification (commenter)
    },
    targetUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // User who receives the notification (post owner)
    }
}, {
    freezeTableName: true
});

module.exports = Notification;