const express = require("express");

const {
  createReview,
  getWorkerReviews,
} = require("../controllers/reviewController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createReview
);

router.get(
  "/:workerId",
  authMiddleware,
  getWorkerReviews
);

module.exports = router;