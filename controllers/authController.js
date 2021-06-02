const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");

// email sender server
const nodemailer = require("nodemailer");
const user = require("../models/user");
const { validationResult } = require("express-validator");
const { generateToken } = require("../util/jwt-token");

module.exports.authenticate = (req, res, next) => {
  let password = req.body.password;
  // check if any validation errors
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "Invalid credentials" });
  }
  // find the user
  User.findOne({ email: req.body.email })
    .then((user) => {
      // if founf store in session and change the login status
      if (user) {
        // console.log("user found was => ", user);
        bcryptjs.compare(password, user.password).then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            // NOTE: can save the session forcebly before page is loaded so that the view is updated correctly
            // req.session.save(error => {res.redirect('/');});
            user.password = "";
            user["session"] = req.session;
            // create token
            let token = generateToken(user);
            return res.status(200).json({
              message: "Authenticated",
              user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isLoggedIn: true,
                token: token,
              },
            });
          }
          // if password do not match
          return res
            .status(401)
            .json({ error: true, message: "Invalid password!!" });
        });
      } else {
        // if user not found then redirect to login page
        return res
          .status(401)
          .json({ error: true, message: "Invalid email!!" });
      }
      // next();
    })
    .catch((err) => {
      console.log("oooooooooooo");
      req.session.isLoggedIn = false;
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

module.exports.logout = (req, res, next) => {
  req.session.isLoggedIn = false;
  req.session.user = null;
  req.session.destroy((error) => {
    console.log(error);
    res.json({ message: "Logged Out" });
  });
};

module.exports.register = (req, res, next) => {
  console.log("body--", req.body);
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).json({ message: "Invalid data" });
  }
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res
          .status(422)
          .json({ message: "Email address already taken!!" });
      }
      return bcryptjs
        .hash(password, 12)
        .then((hashPassword) => {
          console.log("hashPassword=>", hashPassword);
          let user = new User({
            name,
            email,
            password: hashPassword,
            categories: { expenses: [] },
          });
          return user.save();
        })
        .then((results) => {
          // redirect
          res
            .status(201)
            .json({ message: "Registered successfully!!", user: results });
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
