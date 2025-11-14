const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./User");
const Image = require("./Upload");
const auth = require("./Auth");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/instagram")
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Server is running..."));

// ===== SIGNUP ROUTE =====
app.post("/api/signUp", async (req, res) => {
  try {
    const { name, email, passWord } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(passWord, 10);
    const newUser = new User({ name, email, passWord: hashedPassword });
    await newUser.save();

    res.json({ msg: "Signup successful", user: newUser });
  } catch (err) {
    res.status(500).json({ msg: "Error during signup", error: err.message });
  }
});

// ===== LOGIN ROUTE =====
app.post("/login", async (req, res) => {
  try {
    const { email, passWord } = req.body;
    

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    console.log("Plain Password:", passWord);
console.log("Hashed from DB:", user.passWord);

    const isMatch = await bcrypt.compare(passWord, user.passWord);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { email: user.email, role: user.role || "user" },
      "SECRET123",
      { expiresIn: "1h" }
    );

    res.json({ msg: "Login successful", token });
  } catch (err) {
    res.status(500).json({ msg: "Error during login", error: err.message });
  }
});


//--Upload
app.post("/upload",auth, async (req, res) => {
  try {
    const { name, ImgUrl,user } = req.body;

    if (!name || !ImgUrl || !user ) {
      return res.status(400).json({ msg: "Missing name or ImgUrl" });
    }

    const newImage = new Image({ name, ImgUrl,user }); 
    await newImage.save();

    res.json({ msg: "✅ Image uploaded successfully" });
    console.log(ImgUrl, "url saved");
  } catch (err) {
    console.error("Error during upload:", err.message);
    res.status(500).json({ msg: "Error during upload", error: err.message });
  }
});

app.get("/upload", async (req, res) => {
  try {
    const images = await Image.find(); 
    res.json(images);
  } catch (err) {
    console.error("Error fetching images:", err.message);
    res.status(500).json({ msg: "Error fetching images", error: err.message });
  }
});


app.post("/like/:id", async (req, res) => {
  try {
    const postId = req.params.id;

const post = await Image.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.likeCount += 1; // increase by 1
    await post.save();

    return res.json({
      success: true,
      message: "Like added",
      likeCount: post.likeCount
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/unlike/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Image.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // ✅ Prevent negative like counts
    post.likeCount = Math.max((post.likeCount || 1) - 1, 0);
    await post.save();

    return res.json({
      success: true,
      message: "Like removed",
      likeCount: post.likeCount
    });
  } catch (error) {
    console.error("Error in unlike route:", error);
    res.status(500).json({ message: "Server Error" });
  }
});



app.listen(4001, () => console.log("🚀 Server running on port 4001"));
