const express = require("express");

const {
  applyForProperty,
  getOwnerApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Tenant applies for property
router.post(
  "/",
  authMiddleware,
  applyForProperty
);

// Owner gets all applications
router.get(
  "/owner",
  authMiddleware,
  getOwnerApplications
);

// Owner approves/rejects application
router.put(
  "/decision",
  authMiddleware,
  updateApplicationStatus
);

module.exports = router;