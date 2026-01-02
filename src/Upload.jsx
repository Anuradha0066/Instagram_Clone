import React, { useState } from "react";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

const API_URL = 'http://localhost:4001';
// const API_URL = 'https://instagram-clone-1-rfrs.onrender.com'

const supabaseUrl = "https://zgixahnpyabhkjbwbywm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnaXhhaG5weWFiaGtqYndieXdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODY3MzUsImV4cCI6MjA4MDg2MjczNX0.g1AEFO8V_quNLlTIO5Vde0mdhH8ctQcuEr_KrhITLtc";
const supabase = createClient(supabaseUrl, supabaseKey);

const Upload = () => {
  const [Img, setImg] = useState(null);

  const handleFileChange = (e) => {
    setImg(e.target.files[0]);
  };

  async function save() {
    if (!Img) {
      alert("Please select an image first!");
      return;
    }

    try {
      // 1️⃣ Upload image to Supabase
        const { data, error } = await supabase.storage
  .from("insta")
  .upload("insta_images/" + Img.name, Img, { upsert: true });

      if (error) throw error;

      // 2️⃣ Get public URL
      const imageUrl = `${supabaseUrl}/storage/v1/object/public/insta/insta_images/${Img.name}`;
      console.log("Image URL:", imageUrl);

      // 3️⃣ Send metadata to backend
     await axios.post(
    `${API_URL}/upload`,
  // "https://instagram-clone-1-rfrs.onrender.com/upload",
  {
    name: Img.name,
    ImgUrl: imageUrl,
    user: [JSON.parse(localStorage.getItem("instagram_user"))._id], 
  },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("instagram_token")}`
    }
  }
);




      alert("✅ Image uploaded and saved successfully!");
      setImg(null);
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Error uploading image. Check console for details.");
    }
  }

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center gap-4">
      <input type="file" onChange={handleFileChange} className="border p-2 rounded" />
      <button
        onClick={save}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Upload
      </button>
    </div>
  );
};

export default Upload;
