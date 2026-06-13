const express = require("express");

const {
  saveMessage,
  getMessages,
} = require("../controllers/chatController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, saveMessage);

router.get("/:jobId", authMiddleware, getMessages);

module.exports = router;