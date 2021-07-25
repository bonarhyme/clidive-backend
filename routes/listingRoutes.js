const express = require("express");
const router = express.Router();

var multer = require("multer");
const storage = multer.diskStorage({});

const admin = require("../middleware/adminAuthMiddleware");
const protect = require("../middleware/authMiddleware");

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, file.fieldname + "-" + Date.now());
  } else {
    cb("invalid image file!", false);
  }
};

var upload = multer({ storage, fileFilter });

const {
  createListing,
  getListings,
  updateSingleListing,
} = require("../controllers/ListingsController");

//  /api/listing/new
router.post("/new", protect, admin, upload.array("images"), createListing);

//  /api/listing/all
router.get("/all", getListings);

//  /api/listing/:id/update
router.put("/:id/update", protect, admin, updateSingleListing);

module.exports = router;
