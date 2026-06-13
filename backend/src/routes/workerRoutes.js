const express = require("express");

const {
  getWorkers,
  getNearbyWorkers,
  recommendWorkers,
  assignWorker,
  workerDecision,
  getWorkerJobs,
  markJobDone,
  getJobDetails,
} = require("../controllers/workerController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/job/:jobId",
  authMiddleware,
  getJobDetails
);

// Get workers by skill
router.get(
  "/",
  authMiddleware,
  getWorkers
);

// Get nearby workers
router.get(
  "/nearby",
  authMiddleware,
  getNearbyWorkers
);

// AI recommended workers
router.get(
  "/recommend",
  authMiddleware,
  recommendWorkers
);

// Assign worker to complaint
router.post(
  "/assign",
  authMiddleware,
  assignWorker
);

// Worker accepts/rejects job
router.put(
  "/decision",
  authMiddleware,
  workerDecision
);

// Worker dashboard jobs
router.get(
  "/jobs",
  authMiddleware,
  getWorkerJobs
);

// Worker marks job completed
router.put(
  "/done",
  authMiddleware,
  markJobDone
);

module.exports = router;