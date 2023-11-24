const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userRoute = express.Router();

userRoute.post("/login", (req, res) => {
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

userRoute.post("/register", async (req, res) => {
  try {
    const { name, email, password, selectedGenres } = req.body;
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      res.json({ message: "user already exists" });
    } else {
      const newUser = new User({ name, email, password, selectedGenres });
      await newUser.save();
      res.json({ message: "successful" });
    }
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
userRoute.put("/editname", async (req, res) => {
  const { email, name } = req.body;

  try {
    await User.findOneAndUpdate({ email: email }, { name: name });
    res.json({ message: "Name updated successfully" });
  } catch (error) {
    console.error('Error updating name:', error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
userRoute.put("/editpassword", async (req, res) => {
  const { email, password } = req.body;

  try {
    await User.findOneAndUpdate({ email: email }, { password: password });
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error('Error updating password:', error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userRoute.put("/addgenre", async (req, res) => {
  const { email, genre } = req.body;

  try {
    await User.findOneAndUpdate({ email: email }, { $push: { selectedGenres: genre } });
    res.json({ message: "Genre added successfully" });
  } catch (error) {
    console.error('Error adding genre:', error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userRoute.put("/deletegenre", async (req, res) => {
  const { email, genre } = req.body;

  try {
    await User.findOneAndUpdate({ email: email }, { $pull: { selectedGenres: genre } });
    res.json({ message: "Genre deleted successfully" });
  } catch (error) {
    console.error('Error deleting genre:', error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = userRoute;
