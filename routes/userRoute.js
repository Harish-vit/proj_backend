const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userRoute = express.Router();

userRoute.post("/loginn", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    const { email, password } = req.body;
    User.findOne({ email: email }, (err, user) => {
    if (user) {
      if (password === user.password) {
        const token = jwt.sign({ userId: user._id }, "your-secret-key", { expiresIn: "1h" });
        res.json({ message: "login success", user: user, token: token });
      } else {
        res.json({ message: "wrong credentials" });
      }
    } else {
      res.json({ message: "not registered" });
    }
  });
  });
});

userRoute.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    User.findOne({ email: email }, (err, user) => {
      if (user) {
        res.json({ message: "user already exists" });
      } else {
        const newUser = new User({ name, email, password });
        newUser.save(err => {
          if (err) {
            res.json(err);
          } else {
            res.json({ message: "successful" });
          }
        });
      }
    });
});

module.exports = userRoute;
