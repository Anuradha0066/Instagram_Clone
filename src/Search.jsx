import React, { useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar.jsx";
import FollowButton from "./FollowButton.jsx";  // <-- your button
import { useNavigate } from "react-router-dom";

const API_URL = 'http://localhost:4001';
// const API_URL = 'https://instagram-clone-1-rfrs.onrender.com'

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("instagram_token");
  const currentUserId = JSON.parse(atob(token.split(".")[1])).id;
const navigate = useNavigate();


  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/search`, {
      // const res = await axios.get("https://instagram-clone-1-rfrs.onrender.com/search", {
        params: { q: query },
      });

      const updated = res.data.map((u) => ({
        ...u,
        isFollowing: u.followers.includes(currentUserId),
      }));

      setResults(updated);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async (userId, index) => {
    try {
      const res = await axios.post(
        `${API_URL}/follow/${userId}`,
        // `https://instagram-clone-1-rfrs.onrender.com/follow/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const message = res.data.message; // "Followed" | "Unfollowed"

      setResults((prev) => {
        const arr = [...prev];
        arr[index].isFollowing = message === "Followed";
        return arr;
      });
    } catch (err) {
      console.log("Follow error:", err);
    }
  };

  return (
    <div className="bg-black min-h-screen flex">
      <Sidebar />

      {/* DO NOT REMOVE MARGIN LEFT */}
      <div className="flex-1 ml-[245px] p-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-white text-2xl mb-4">Search users</h2>

          {/* SEARCH INPUT */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name"
              className="flex-1 p-2 rounded bg-[#0b0b0b] text-white border border-gray-800"
            />
            <button className="px-4 py-2 bg-blue-600 rounded text-white">
              Search
            </button>
          </form>

          {loading && <p className="text-gray-400">Searching...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* RESULTS */}
          <div className="space-y-3">
            {results.map((u, index) => (
            <div
  key={u._id}
  className="p-3 bg-[#121212] rounded flex items-center justify-between border border-gray-700"
>
  {/* CLICKABLE USER INFO */}
  <div
    className="flex items-center gap-3 cursor-pointer"
    onClick={() => navigate(`/user/${u.name}`)}
  >
    <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
      {u.name?.[0]?.toUpperCase()}
    </div>

    <div>
      <div className="text-white font-semibold hover:underline">
        {u.name}
      </div>
      <div className="text-gray-400 text-sm">{u.email}</div>
    </div>
  </div>

  {/* FOLLOW BUTTON */}
  <FollowButton
    targetUserId={u._id}
    isFollowing={u.isFollowing}
    onChange={(newIsFollowing) => {
      setResults(prev => {
        const copy = [...prev];
        copy[index] = { ...copy[index], isFollowing: newIsFollowing };
        return copy;
      });
    }}
  />
</div>

            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Search;
