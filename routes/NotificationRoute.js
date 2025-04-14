const express = require("express");
const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification
} = require("../controllers/NotificationController.js");
const { verifyUser } = require("../middleware/AuthUser.js") 

const router = express.Router();

router.get('/notifications', verifyUser, getMyNotifications);
router.get('/notifications/unread-count', verifyUser, getUnreadCount);
router.patch('/notifications/read-all', verifyUser, markAllAsRead);
router.patch('/notifications/:id/read', verifyUser, markAsRead);
router.delete('/notifications/:id', verifyUser, deleteNotification);

module.exports = router;