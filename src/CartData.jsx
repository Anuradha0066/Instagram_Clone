import axios from "axios";

const API_URL = 'http://localhost:4001';
//  const API_URL = 'https://instagram-clone-1-rfrs.onrender.com'
export const fetchCartData = async () => {
  try {
    const res = await axios.get(`${API_URL}/upload`);
    // const res = await axios.get("https://instagram-clone-1-rfrs.onrender.com/upload");
    return res.data; // This returns an array of image objects from MongoDB
  } catch (err) {
    console.error("Error fetching data:", err.message);
    return [];
  }
};
