const express = require("express");
const upload = require("../middleware/uploadMiddleware");

const {
  createComplaint,
  getAllComplaints,
} = require("../controllers/complaintController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  createComplaint
);

router.get("/", authMiddleware, getAllComplaints);

module.exports = router;