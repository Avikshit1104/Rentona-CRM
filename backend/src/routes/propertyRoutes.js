const express = require("express");

const {
  createProperty,
  getProperties,
  getMyProperties,
} = require("../controllers/propertyController");

const authMiddleware = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get(
  "/my",
  authMiddleware,
  getMyProperties
);

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  createProperty
);

router.get("/", getProperties);

module.exports = router;