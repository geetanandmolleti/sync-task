require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

/* ---------- CONNECT TO SYNCTASK ---------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to DB:", mongoose.connection.name))
  .catch((err) => console.error("❌ DB connection error:", err));

/* ---------- SCHEMAS ---------- */
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const NoteSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  text: String,
  order: Number,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
const Note = mongoose.model("Note", NoteSchema);

/* ---------- AUTH MIDDLEWARE ---------- */
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

/* ---------- SIGNUP ---------- */
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hashedPassword });

    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({ message: "Signup failed" });
  }
});

/* ---------- LOGIN ---------- */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Login successful", username: user.name, token });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

/* ---------- NOTES ---------- */
// Get all notes
app.get("/notes", auth, async (req, res) => {
  const notes = await Note.find({ userId: req.userId }).sort({ order: 1 });
  res.json(notes);
});

// Add note
app.post("/notes", auth, async (req, res) => {
  const count = await Note.countDocuments({ userId: req.userId });
  const note = await Note.create({
    userId: req.userId,
    text: req.body.text,
    order: count,
  });
  res.json(note);
});

// Delete note
app.delete("/notes/:id", auth, async (req, res) => {
  await Note.deleteOne({ _id: req.params.id, userId: req.userId });
  res.json({ message: "Deleted" });
});

// Reorder notes (drag & drop)
app.put("/notes/reorder", auth, async (req, res) => {
  const updates = req.body; // [{id, order}]
  const bulk = updates.map((n) => ({
    updateOne: {
      filter: { _id: n.id, userId: req.userId },
      update: { order: n.order },
    },
  }));
  await Note.bulkWrite(bulk);
  res.json({ message: "Reordered" });
});

/* ---------- START SERVER ---------- */
app.listen(5500, () => console.log("Server running on port 5500"));
