// index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const userRoute = require("./routes/userRoute");

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

app.use("/user", userRoute);

app.listen(4000, () => {
  console.log("Server started on port 4000");
});
