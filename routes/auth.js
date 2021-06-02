const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const {
  validateRegister,
  validateLogin,
} = require("../middlewares/auth-validate");
const user = require("../models/user");

router.post("/authenticate", validateLogin, authController.authenticate);

router.post("/logout", authController.logout);

router.post("/register", validateRegister, authController.register);

module.exports = router;
