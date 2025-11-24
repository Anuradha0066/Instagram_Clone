import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar.jsx';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return setResults([]);

    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`http://localhost:4001/users`, { params: { search: query } });
      setResults(res.data || []);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen flex">
      <Sidebar />
      <div className="flex-1 ml-[245px] p-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-white text-2xl mb-4">Search users</h2>
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name"
              className="flex-1 p-2 rounded bg-[#0b0b0b] text-white border border-gray-800"
            />
            <button className="px-4 py-2 bg-blue-600 rounded text-white">Search</button>
          </form>

          {loading && <p className="text-gray-400">Searching...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div className="space-y-3">
            {results.length === 0 && !loading && (
              <p className="text-gray-400">No users found.</p>
            )}

            {results.map((u) => (
              <div key={u._id} className="p-3 bg-[#121212] rounded flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-white">{u.name?.[0]?.toUpperCase() || 'U'}</div>
                <div>
                  <div className="text-white font-semibold">{u.name}</div>
                  <div className="text-gray-400 text-sm">{u.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
