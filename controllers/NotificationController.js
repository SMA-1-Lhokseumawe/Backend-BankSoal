const Notification = require("../models/NotificationModel.js");
const Users = require("../models/UserModel.js");
const Post = require("../models/PostModel.js");

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: {
        targetUserId: req.userId
      },
      include: [
        {
          model: Users,
          as: "sourceUser",
          attributes: ["username", "email"]
        },
        {
          model: Post,
          attributes: ["id", "judul"]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id: req.params.id,
        targetUserId: req.userId // Security check to ensure user owns this notification
      }
    });
    
    if (!notification) {
      return res.status(404).json({ msg: "Notification not found" });
    }
    
    await Notification.update(
      { isRead: true },
      {
        where: {
          id: req.params.id
        }
      }
    );
    
    res.status(200).json({ msg: "Notification marked as read" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      {
        where: {
          targetUserId: req.userId,
          isRead: false
        }
      }
    );
    res.status(200).json({ msg: "All notifications marked as read" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.count({
      where: {
        targetUserId: req.userId,
        isRead: false
      }
    });
    
    res.status(200).json({ count });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id: req.params.id,
        targetUserId: req.userId // Security check
      }
    });
    
    if (!notification) {
      return res.status(404).json({ msg: "Notification not found" });
    }
    
    await Notification.destroy({
      where: {
        id: req.params.id
      }
    });
    
    res.status(200).json({ msg: "Notification deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification
};