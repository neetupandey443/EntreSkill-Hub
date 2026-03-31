const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect("mongodb+srv://neetupandey582_db_user:NDOrC4lTXhC5F2Ez@cluster0.njjfcx7.mongodb.net/entreskill?retryWrites=true&w=majority")
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

// ================= USER SCHEMA =================
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

// ================= REGISTER API =================
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // 🔥 password ko encrypt karo
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword
  });

  await newUser.save();

  res.json({ message: "User registered successfully ✅" });
});

// ================= LOGIN API =================
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ message: "User not found ❌" });
  }

  // 🔥 password compare
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.json({ message: "Invalid password ❌" });
  }

  // 🔥 token create
  const token = jwt.sign(
    { id: user._id },
    "secretkey123",
    { expiresIn: "1h" }
  );

  res.json({
    message: "Login successful ✅",
    token
  });
});

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

// ================= SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running 🚀");
});