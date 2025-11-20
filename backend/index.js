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
   return  res.status(500).json({ msg: "Error during signup", error: err.message });
  }
});

// ===== LOGIN ROUTE =====
app.post("/login", async (req, res) => {
  try {
    const { email, passWord } = req.body;
    

    const user = await User.findOne({ email });
    console.log(user ,"user");
    if (!user) return res.status(404).json({ msg: "User not found" });

    console.log("Plain Password:", passWord);
console.log("Hashed from DB:", user.passWord);

    const isMatch = await bcrypt.compare(passWord, user.passWord);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

   const token = jwt.sign(
  { _id: user._id, email: user.email, role: user.role || "user" },
  "SECRET123",
  { expiresIn: "1h" }
);


res.json({
  msg: "Login successful",
  token,
  user: { _id: user._id, name: user.name, email: user.email }
});
  } catch (err) {
   return res.status(500).json({ msg: "Error during login", error: err.message });
  }
});


//--Upload
app.post("/upload", auth, async (req, res) => {
  try {
    const { name, ImgUrl, user } = req.body;

    if (!name || !ImgUrl || !user) {
      return res.status(400).json({ msg: "Missing data" });
    }

    const newImage = new Image({
      name,
      ImgUrl,
      user,
      likeCount: 0,
    });

    await newImage.save();

    res.json({ msg: "Image uploaded successfully" });
    console.log(ImgUrl, "url saved");
  } catch (err) {
    console.error("Error during upload:", err.message);
   return res.status(500).json({ msg: "Error during upload", error: err.message });
  }
});


app.get("/upload", async (req, res) => {
  try {
    const images = await Image.find(); 
    res.json(images);
  } catch (err) {
    console.error("Error fetching images:", err.message);
   return res.status(500).json({ msg: "Error fetching images", error: err.message });
  }
});



app.post("/like/:id", auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user?._id;

    console.log("POST ID:", postId);
    console.log("USER ID:", userId);

    // User id missing?
    if (!userId) {
      return res.status(400).json({ success: false, message: "User not authenticated" });
    }

    // Find post
    const post = await Image.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Ensure likedBy is always an array
    if (!Array.isArray(post.likedBy)) {
      post.likedBy = [];
    }

    // Clean NULL values from likedBy (runtime cleanup)
    post.likedBy = post.likedBy.filter(id => id !== null);

    // Check if user already liked (null-safe)
    const alreadyLiked = post.likedBy.some(
      id => id && id.toString() === userId.toString()
    );

    // -------------------------------
    // 🔴 IF ALREADY LIKED → UNLIKE
    // -------------------------------
    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter(
        id => id && id.toString() !== userId.toString()
      );

      post.likeCount = Math.max(post.likeCount - 1, 0);

      await post.save();

      return res.json({
        success: true,
        message: "Like removed",
        likeCount: post.likeCount
      });
    }

    // -------------------------------
    // 🟢 IF NOT LIKED → LIKE
    // -------------------------------
    post.likedBy.push(userId);
    post.likeCount += 1;

    await post.save();

    return res.json({
      success: true,
      message: "Like added",
      likeCount: post.likeCount
    });

  } catch (err) {
    console.log("LIKE API ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});




app.listen(4001, () => console.log("🚀 Server running on port 4001"));
