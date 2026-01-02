import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = 'http://localhost:4001';
//  const API_URL = 'https://instagram-clone-1-rfrs.onrender.com'

/**
 * Props:
 * - targetUserId: id of the user to follow/unfollow
 * - isFollowing: boolean (initial state from parent)
 * - onChange: function(newIsFollowing: boolean) -> optional callback to notify parent
 */
const FollowButton = ({ targetUserId, isFollowing: initialFollowing = false, onChange }) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [hover, setHover] = useState(false);
  const [loading, setLoading] = useState(false);

  // keep local state synced if parent changes the prop later
  useEffect(() => {
    setIsFollowing(initialFollowing);
  }, [initialFollowing]);

  const handleClick = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("instagram_token");
      const res = await axios.post(
        `${API_URL}/follow/${targetUserId}`,
        // `https://instagram-clone-1-rfrs.onrender.com/follow/${targetUserId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
       console.log("Follow response:", res);
      // backend returns message: "Followed" or "Unfollowed"
      const msg = res?.data?.message || "";
      const nowFollowing = msg === "Followed";

      // update local state and notify parent
      setIsFollowing(nowFollowing);
      if (typeof onChange === "function") onChange(nowFollowing);

    } catch (err) {
      console.error("Follow error:", err);
      // optional: show toast / alert
    } finally {
      setLoading(false);
      setHover(false); // reset hover to avoid transient label mismatch
    }
  };

  // Button label logic:
  // - loading: "..."
  // - when following: default "Following", hover -> "Unfollow"
  // - when not following: "Follow"
  const label = loading
    ? "..."
    : isFollowing
    ? hover
      ? "Unfollow"
      : "Following"
    : "Follow";

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={loading}
      className={`px-4 py-1 rounded text-sm font-semibold transition-all ${
        isFollowing
          ? "bg-[#262626] text-white border border-gray-600"
          : "bg-blue-600 text-white"
      } ${loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {label}
    </button>
  );
};

export default FollowButton;
