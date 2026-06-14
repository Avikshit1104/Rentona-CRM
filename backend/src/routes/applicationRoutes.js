const express = require("express");

const {
  applyForProperty,
  getOwnerApplications,
  getMyApprovedApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, applyForProperty);

router.get("/owner", authMiddleware, getOwnerApplications);

router.get("/my-approved", authMiddleware, getMyApprovedApplications);

router.put("/decision", authMiddleware, updateApplicationStatus);

module.exports = router;