import axios from "axios";

export const fetchCartData = async () => {
  try {
    const res = await axios.get("http://localhost:4001/upload");
    return res.data; // This returns an array of image objects from MongoDB
  } catch (err) {
    console.error("Error fetching data:", err.message);
    return [];
  }
};
