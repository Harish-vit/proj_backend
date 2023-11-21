const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

mongoose.set("strictQuery", true);

mongoose.connect("mongodb+srv://test:Ikjfk4yIJGiUuC2S@cluster0.7fkzvdk.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to DB");
}).catch((err) => {
  console.error("Error connecting to DB:", err);
});

// user schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = new mongoose.model("User", userSchema);

// routes routes
app.post("/Login", (req, res) => {
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

app.post("/Register", (req, res) => {
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

app.listen(4000, () => {
  console.log("Server started on port 4000");
});
