const express = require("express");

const {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/my", authMiddleware, getMyNotifications);

router.put("/read", authMiddleware, markNotificationRead);

router.put("/read-all", authMiddleware, markAllNotificationsRead);

module.exports = router;