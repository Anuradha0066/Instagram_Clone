const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./User");
const Image = require("./Upload");
const auth = require("./Auth");
const Profile = require("./Profile");
const Comment = require("./comment");
const Story = require("./story");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MongoUrl)
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Server is running..."));

// ===== SIGNUP ROUTE =====
app.post("/api/signUp", async (req, res) => {
  try {
    const { name, email, passWord } = req.body;

    // CHECK IF USER ALREADY EXISTS
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // GENERATE USERNAME AUTOMATICALLY
    const makeUsername = (name) => {
      const clean = name.toLowerCase().replace(/\s+/g, "_");
      const rand = Math.floor(100 + Math.random() * 900);
      return `${clean}${rand}`;
    };

    const username = makeUsername(name);

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(passWord, 10);

    // CREATE NEW USER
    const newUser = new User({
      name,
      email,
      passWord: hashedPassword,
      username,          // <-- FIXED!!
      bio: "",           // optional
      profilePic: "",    // optional
       followers: [],
       following: [],
      posts: [],
    });

    await newUser.save();

    return res.json({ msg: "Signup successful", user: newUser });
  } catch (err) {
    return res.status(500).json({
      msg: "Error during signup",
      error: err.message,
    });
  }
});


// ===== LOGIN ROUTE =====
app.post("/login", async (req, res) => {
  try {
    const { email, passWord } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(passWord, user.passWord);
    if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

    const token = jwt.sign({ id: user._id }, "SECRET_KEY", { expiresIn: "7d" });

    res.json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username, // 🔥 IMPORTANT
        profilePic: user.profilePic,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//--Upload
app.post("/upload", auth, async (req, res) => {
  try {
    const { name, ImgUrl } = req.body;

    const newImage = new Image({
      name,
      ImgUrl,
      user: req.user.id,
      likeCount: 0
    });

    await newImage.save();

    // Save post in user document
    await User.findByIdAndUpdate(req.user.id, {
      $push: { posts: newImage._id }
    });

    res.json({ msg: "Image uploaded successfully" });

  } catch (err) {
    res.status(500).json({ msg: "Error during upload", error: err.message });
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

app.post("/follow/:id", auth, async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user.id; // FIXED

    if (!targetUserId || !currentUserId) {
      return res.json({ success: false, message: "User not found" });
    }

    // Fetch users
    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check if already following
    const alreadyFollowing = targetUser.followers.some(
      id => id.toString() === currentUserId.toString()
    );

    if (alreadyFollowing) {
      // UNFOLLOW
      targetUser.followers = targetUser.followers.filter(
        id => id.toString() !== currentUserId.toString()
      );

      currentUser.following = currentUser.following.filter(
        id => id.toString() !== targetUserId.toString()
      );

      await targetUser.save();
      await currentUser.save();

      return res.json({ success: true, message: "Unfollowed" });
    }

    // FOLLOW
    targetUser.followers.push(currentUserId);
    currentUser.following.push(targetUserId);

    await targetUser.save();
    await currentUser.save();

    return res.json({ success: true, message: "Followed" });

  } catch (err) {
    console.error("FOLLOW API ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



app.get('/search', async(req,res)=>{
  let query= req.query.q
  if(!query){
    return res.json([]);
  }
  let user=await User.find({
    $or:[
      {name:{$regex:query,$options:"i"}}
      //regex: copmare string whether match or not , $options: case insensitive
      
    ]
  }).limit(5)
return res.json(user)
})

app.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate("posts")
      .select("-passWord");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/comments/:postId", auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const userID = req.user.id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ msg: "Missing data" });
    }

    let commentData = new Comment({
      text,
      post: postId,
      user: userID
    });

    await commentData.save();

    // populate the user field to get username
    await commentData.populate("user", "username");

    res.json({
      success: true,
      message: "Comment added",
      comment: commentData
    });

  } catch (err) {
    console.error("COMMENT ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/me",auth,async(req,res)=>{
  try{
    const user=await User.findById(req.user.id)
    .select("-passWord")
    .populate("followers","name email")
    .populate("following","name email")
    .populate("posts");  // <-- ADD THIS
  
  if(!user){
    return res.status(404).json({msg:"User not found"})
  }
   res.json({
  _id: user._id,
  name: user.name,
  email: user.email,
  followersCount: user.followers?.length || 0,
  followingCount: user.following?.length || 0,
  followers: user.followers || [],
  following: user.following || []
});


}
catch(err){
  res.status(500).json({error:err.message})
}
});


app.get("/my-posts",auth,async(req,res)=>{
  try{
    const posts =await Image.find({user:req.user.id})
    .sort({createdAt:-1})
    
    res.json(posts)
  }
  catch(err){
    res.status(500).json({error:err.message})
  }
})


// GET OTHER USER PROFILE
app.get("/user/:name", auth, async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name })
      .select("-passWord")
      .populate("posts")
      .populate("followers")
      .populate("following");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if current user follows this profile
    const isFollowing = user.followers.some(
      (id) => id._id.toString() === req.user.id.toString()
    );

    res.json({
      user,
      isFollowing
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post("/story", auth, async (req, res) => {
  const { mediaUrl } = req.body;
  if (!mediaUrl) return res.status(400).json({ msg: "media required" });

  const story = new Story({
    mediaUrl,
    user: req.user._id,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
  });

  await story.save();
  res.json({ msg: "Story uploaded" });
});


app.get("/stories", auth, async (req, res) => {
  const me = await User.findById(req.user._id);

  const allowedUsers = [
    req.user._id,
    ...me.following,
    ...me.followers,
  ];

  const stories = await Story.find({
    user: { $in: allowedUsers },
    expiresAt: { $gt: new Date() }, // not expired
  })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  res.json(stories);
});


app.listen(4001, () => console.log("🚀 Server running on port 4001"));
