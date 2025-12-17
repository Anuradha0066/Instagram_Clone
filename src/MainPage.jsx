
import React, { useState, useReducer,useEffect } from 'react'
import { fetchCartData } from './CartData.jsx';
import Sidebar from './Sidebar.jsx'
import axios from 'axios';
import { AuthProvider, useAuth } from './context/AuthContext'

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_SEARCH':
      return { ...state, search: action.payload };
    default:
      return state;
  }
};

const MainPage = () => {
  let initialData = {}
  let [posts, setPosts] = useState([])
  let [search, SetSearch] = useReducer(reducer, initialData)
  const [likedPosts, setLikedPosts] = useState(new Set())
  const [savedPosts, setSavedPosts] = useState(new Set())
  const [commentInputs, setCommentInputs] = useState({});

 const [loading, setLoading] = useState(true);
   // STORIES
  const [stories, setStories] = useState([]);
  const [storyUrl, setStoryUrl] = useState("");
  const [activeStory, setActiveStory] = useState(null); // 🔥 viewer

  // ✅ Load liked posts from localStorage ONCE
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("likedPosts")) || [];
    setLikedPosts(new Set(saved));
  }, []);

  // ✅ Fetch posts from backend
  useEffect(() => {
    // axios.get("http://localhost:4001/upload").then((res) => setPosts(res.data));
    axios.get("https://instagram-clone-1-zlk3.onrender.com/upload").then((res) => setPosts(res.data));
  }, []);

  // ✅ ✅ FINAL ONE-TIME LIKE FUNCTION (no unlike)
 
const { token } = useAuth();

const handleLike = async (id) => {
  if (!token) {
    alert("Please login first!");
    return;
  }

  try {
      // const res = await fetch(`http://localhost:4001/like/${id}`, {
    const res = await fetch(`https://instagram-clone-1-zlk3.onrender.com/like/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({})
    });

    // Unauthorized from backend
    if (res.status === 401) {
      console.log("401 from backend");
      return;
    }

    const data = await res.json();   // <<<< IMPORTANT
    console.log("LIKE API DATA:", data);

    const updatedLikes = data.likeCount;

    // Update posts UI
    setPosts(prev =>
      prev.map(p =>
        p._id === id ? { ...p, likeCount: updatedLikes } : p
      )
    );

    // Update likedPosts
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      localStorage.setItem("likedPosts", JSON.stringify([...newSet]));
      return newSet;
    });

  } catch (err) {
    console.error("LIKE ERROR:", err);
  }
};


const handleComment = async (postId, text) => {
  if (!token) return alert("Login first!");
  if (!text || text.trim() === "") return; // Prevent empty comments

  try {
    // const res = await fetch(`http://localhost:4001/comments/${postId}`, {
    const res = await fetch(`https://instagram-clone-1-zlk3.onrender.com/comments/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: text.trim() }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("COMMENT ERROR:", errorData);
      return;
    }

    const data = await res.json();
    console.log("COMMENT ADDED:", data);

    // 🔥 UPDATE COMMENTS ARRAY IN UI
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? { 
              ...p, 
              commentCount: (p.commentCount || 0) + 1,
              comments: [...(p.comments || []), data.comment], // add new comment
            }
          : p
      )
    );
  } catch (err) {
    console.error("COMMENT ERROR:", err);
  }
};

const toggleComments = (postId) => {
  setPosts(prev =>
    prev.map(p =>
      p._id === postId
        ? { ...p, showComments: !p.showComments }
        : p
    )
  );
};


const timeAgo = (date) => {
  if (!date) return "Just now";

  const postDate = new Date(date);
  if (isNaN(postDate)) return "Just now";

  const now = new Date();
  const diff = Math.floor((now - postDate) / 1000); // difference in seconds

  if (diff < 60) return "Just now";          // < 1 minute
  if (diff < 3600) return `${Math.floor(diff / 60)}m`; // < 1 hour
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`; // < 1 day
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`; // < 7 days
  return postDate.toLocaleDateString(); // older than a week: show date
};



  const handleSave = (postId) => {
    setSavedPosts(prev => {
      const newSaved = new Set(prev)
      if (newSaved.has(postId)) {
        newSaved.delete(postId)
      } else {
        newSaved.add(postId)
      }
      return newSaved
    })
  }


   useEffect(() => {
    const fetchStories = async () => {
      const token = localStorage.getItem("token");
      // const res = await axios.get(`http://localhost:4001/stories`, {
      const res = await axios.get(`https://instagram-clone-1-zlk3.onrender.com/stories`, {
        headers: { Authorization: token },
      });
      setStories(res.data);
    };

    fetchStories();
  }, []);

  // upload story
  const uploadStory = async () => {
    if (!storyUrl) return alert("Enter image URL");

    const token = localStorage.getItem("token");

    await axios.post(
      // `http://localhost:4001/story`,
      `https://instagram-clone-1-zlk3.onrender.com/story`,
      { mediaUrl: storyUrl },
      { headers: { Authorization: token } }
    );

    setStoryUrl("");

    // const res = await axios.get(`http://localhost:4001/stories`, {
    const res = await axios.get(`https://instagram-clone-1-zlk3.onrender.com/stories`, {
      headers: { Authorization: token },
    });
    setStories(res.data);
  };

  return (
    <div className="bg-black min-h-screen flex">
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 ml-[245px] flex flex-col items-center overflow-y-auto">
        <div className="pt-8 flex flex-col items-center w-full max-w-[470px] px-4">
          {/* ================= STORIES ================= */}
          <div className="bg-[#121212] p-3 rounded-lg">
            <div className="flex gap-4 overflow-x-auto">

              {/* YOUR STORY */}
              <div className="flex flex-col items-center">
                <div className="p-[2px] rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/992/992651.png"
                    className="h-14 w-14 rounded-full"
                    alt="add"
                  />
                </div>
                <input
                  value={storyUrl}
                  onChange={(e) => setStoryUrl(e.target.value)}
                  placeholder="URL"
                  className="text-xs bg-black text-white mt-1 w-16 outline-none"
                />
                <button
                  onClick={uploadStory}
                  className="text-blue-500 text-xs"
                >
                  Add
                </button>
              </div>

              {/* OTHER STORIES */}
              {stories.map((story) => (
                <div
                  key={story._id}
                  onClick={() => setActiveStory(story)}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <div className="p-[2px] rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500">
                    <img
                      src={story.mediaUrl}
                      className="h-14 w-14 rounded-full object-cover"
                      alt=""
                    />
                  </div>
                  <p className="text-white text-xs mt-1">
                    {story.user.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {loading && (
            <p className="text-gray-400 text-center">Loading...</p>
          )}


          {/* Posts */}
          <div className="w-full space-y-4">
            {posts.map((post, index) => (
              <div key={index} className="bg-[#121212] rounded-lg overflow-hidden">
                {/* Post Header */}
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <div className="gradient-border rounded-full p-[2px]">
                      <div className="bg-black rounded-full p-[1px]">
                        <img
                          className="h-8 w-8 rounded-full object-cover"
                          src={post.ImgUrl}
                          alt={post.name}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{post.name}</p>
                      <p className="text-gray-400 text-xs">Original audio</p>
                    </div>
                  </div>
                  <button className="text-white hover:opacity-80">
                    <svg aria-label="More options" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
                      <circle cx="12" cy="12" r="1.5"></circle>
                      <circle cx="6" cy="12" r="1.5"></circle>
                      <circle cx="18" cy="12" r="1.5"></circle>
                    </svg>
                  </button>
                </div>

                {/* Post Image */}
                <div className="relative aspect-square">
                  <img
                    className="w-full h-full object-cover"
                    src={post.ImgUrl}
                    alt="post"
                    onDoubleClick={() => handleLike(post._id)}
                  />
                </div>

                {/* Post Actions */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() =>{
                          handleLike(post._id);
                         
                        }}
                        className="text-white hover:opacity-80"
                      >
                        {likedPosts.has(post._id) ? (
                          <svg aria-label="Unlike" fill="#FF3040" height="24" role="img" viewBox="0 0 48 48" width="24">
                            <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                          </svg>
                        ) : (
                          <svg aria-label="Like" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
                            <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
                          </svg>
                        )}
                      </button>
                     <button 
  className="text-white hover:opacity-80 flex items-center gap-1"
  onClick={() => toggleComments(post._id)}
>
  <svg
    aria-label="Comment"
    fill="currentColor"
    height="24"
    role="img"
    viewBox="0 0 24 24"
    width="24"
  >
    <path
      d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
      fill="none"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="2"
    ></path>
  </svg>

  {/* Comment count */}
  <span className="text-sm text-gray-300">
    {post.commentCount || post.comments?.length || 0}
  </span>
</button>


                      <button className="text-white hover:opacity-80">
                        <svg aria-label="Share Post" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
                          <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
                          <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon>
                        </svg>
                      </button>
                    </div>
                    <button 
                      onClick={() => handleSave(index)}
                      className="text-white hover:opacity-80"
                    >
                      {savedPosts.has(index) ? (
                        <svg aria-label="Remove" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
                          <path d="M20 22a.999.999 0 0 1-.687-.273L12 14.815l-7.313 6.912A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z"></path>
                        </svg>
                      ) : (
                        <svg aria-label="Save" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
                          <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Likes count */}
                  <p className="text-white text-sm font-semibold mb-1">
                    {post.likeCount || 0 }likes
                  </p>

                  {/* Caption */}
                  <p className="text-white text-sm">
                    <span className="font-semibold mr-2">{post.name}</span>
                    Exploring beautiful moments ✨
                  </p>

                 {/* Comments */}
<div className="mt-2">
  {/* Always show the first comment */}
  {post.comments && post.comments.length > 0 && (
    <p className="text-white text-sm">
      <span className="font-semibold mr-2">{post.comments[0].user?.username}</span>
      {post.comments[0].text}
    </p>
  )}

  {/* Show rest of comments only if toggled */}
  {post.showComments && post.comments && post.comments.slice(1).map((c, idx) => (
    <p key={idx} className="text-white text-sm">
      <span className="font-semibold mr-2">{c.user?.username}</span>
      {c.text}
    </p>
  ))}
</div>

{/* Timestamp */}
<p className="text-gray-400 text-[10px] mt-1 uppercase">
  {timeAgo(post.createdAt)}
</p>

{/* Add comment */}
<div className="border-t border-gray-800 p-3 flex items-center">
  <button className="text-white mr-4">
    <svg aria-label="Emoji" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm-3-8a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm6 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-3 4a4 4 0 0 1-4-4h2a2 2 0 0 0 4 0h2a4 4 0 0 1-4 4z" />
    </svg>
  </button>

  <input
    type="text"
    placeholder="Add a comment..."
    className="bg-transparent text-white text-sm flex-1 focus:outline-none placeholder-gray-500"
    value={commentInputs[post._id] || ""}
    onChange={(e) =>
      setCommentInputs({ ...commentInputs, [post._id]: e.target.value })
    }
  />

  <button
    className={`text-blue-500 text-sm font-semibold ${
      commentInputs[post._id] ? "opacity-100" : "opacity-50"
    }`}
    onClick={() => {
      handleComment(post._id, commentInputs[post._id]);
      setCommentInputs({ ...commentInputs, [post._id]: "" });

      // Update UI immediately with new comment
      const newComment = {
        _id: Date.now(),
        text: commentInputs[post._id],
        user: { username: "You" }, // Replace with logged-in username if available
      };

      setPosts(prev =>
        prev.map(p =>
          p._id === post._id
            ? {
                ...p,
                comments: p.comments ? [newComment, ...p.comments] : [newComment],
                // commentCount: (p.commentCount || 0) + 1,
              }
            : p
        )
      );
    }}
  >
    Post
  </button>
  </div>
</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainPage
