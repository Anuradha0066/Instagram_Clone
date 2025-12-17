import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UserProfile = () => {
  const { name } = useParams();
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const token = localStorage.getItem("instagram_token");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4001/user/${name}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(data.user);
        setIsFollowing(data.isFollowing);
      } catch (err) {
        console.log("Error fetching user profile:", err);
      }
    };

    fetchUserProfile();
  }, [name, token]);

  const handleFollow = async () => {
    try {
      await axios.post(
        `http://localhost:4001/follow/${user._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIsFollowing((prev) => !prev);
    } catch (err) {
      console.log("Follow error:", err);
    }
  };

  if (!user) {
    return <p className="text-white">Loading...</p>;
  }

  return (
    <div className="text-white p-6">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>

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

        {/* Info */}
        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>

<button
            onClick={handleFollow}
            className={`mt-2 px-4 py-1 rounded ${
              isFollowing ? "bg-gray-500" : "bg-blue-600"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
          

          <div className="flex gap-6 mt-2">
            <p>
              <b>{user.posts?.length || 0}</b> posts
            </p>
            <p>
              <b>{user.followers?.length || 0}</b> followers
            </p>
            <p>
              <b>{user.following?.length || 0}</b> following
            </p>
          </div>
        </div>
      </div>

      <hr className="my-6 border-gray-600" />

      {/* Posts */}
      <h2 className="text-xl mb-2">Posts</h2>

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

export default UserProfile;
