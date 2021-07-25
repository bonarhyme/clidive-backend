const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/userControllers");

const {
  checkForm,
  checkUsername,
  checkPassword,
  checkEmail,
} = require("../middleware/checkForms");

//  /api/user/register
router.post("/register", checkForm, registerUser);

//  /api/user/login
router.post("/login", checkUsername, loginUser);

module.exports = router;
