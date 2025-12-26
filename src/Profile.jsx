import { useEffect, useState } from "react";
import axios from "axios";

const Me = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("instagram_token");
  const API_URL = 'http://localhost:4001';
// const API_URL = 'https://instagram-clone-1-rfrs.onrender.com'

useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/me`, {
        // const { data } = await axios.get("https://instagram-clone-1-rfrs.onrender.com/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch posts separately
        const postRes = await axios.get(`${API_URL}/my-posts`, {
        // const postRes = await axios.get("https://instagram-clone-1-rfrs.onrender.com/my-posts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser({ ...data, posts: postRes.data });
      } catch (err) {
        console.log("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [token]);

  if (!user) {
    return <p className="text-white">Loading...</p>;
  }
console.log(user);

  return (
    <div className="text-white p-6">
      <h1 className="text-3xl font-bold mb-4">My Profile</h1>

      <div className="flex gap-6">
        {/* Profile Pic */}
        <img
          src={
            user.profilePic ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          className="w-28 h-28 rounded-full object-cover"
          alt="Profile"
        />

        {/* Basic Info */}
        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="opacity-80">{user.email}</p>

          <div className="flex gap-6 mt-2">
            <p>
              <b>{user.followersCount}</b> followers
            </p>
            <p>
              <b>{user.followingCount}</b> following
            </p>
          </div>

          <p className="mt-2">{user.bio || "No bio added yet"}</p>
        </div>
      </div>
      <hr className="my-6 border-gray-600" />

      {/* Posts Section */}
      <h2 className="text-xl mb-2">My Posts</h2>

      <div className="grid grid-cols-3 gap-2">
        {user.posts?.length > 0 ? (
          user.posts.map((post) => (
            <img
              key={post._id}
              src={post.ImgUrl}
              alt="Post"
              className="w-full h-40 object-cover"
            />
          ))
        ) : (
          <p>No posts yet</p>
        )}
      </div>
    </div>
  );
};

export default Me;
