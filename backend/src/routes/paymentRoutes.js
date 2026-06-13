const express = require("express");

const {
  createPayment,
  getMyPayments,
  getOwnerPayments,
  markPaymentPaid,
  markPaymentFailed,
} = require("../controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Tenant creates payment record
router.post("/create", authMiddleware, createPayment);

// Tenant payment history
router.get("/my", authMiddleware, getMyPayments);

// Owner payment dashboard
router.get("/owner", authMiddleware, getOwnerPayments);

// Mark payment successful
router.put("/success", authMiddleware, markPaymentPaid);

// Mark payment failed
router.put("/fail", authMiddleware, markPaymentFailed);

module.exports = router;