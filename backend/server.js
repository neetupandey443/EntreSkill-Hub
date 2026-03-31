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
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ message: "All fields required" });
    }

    // 🔥 HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.json({ message: "User registered successfully" });

  } catch (error) {
    console.log("ERROR:", error);
    res.json({ message: "Server error" });
  }
});
// ================= LOGIN API =================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN DATA:", email, password);

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "User not found ❌" });
    }

    console.log("DB PASSWORD:", user.password);

    let isMatch = false;

    try {
      // try bcrypt compare
      isMatch = await bcrypt.compare(password, user.password);
    } catch (err) {
      console.log("bcrypt error, fallback");
      isMatch = password === user.password;
    }

    if (!isMatch) {
      return res.json({ message: "Invalid password ❌" });
    }

    const token = jwt.sign(
      { id: user._id },
      "secretkey123",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful ✅",
      token
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.json({ message: "Server error" });
  }
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