import React, { useEffect, useState } from "react";
import axios from "axios";

const FetchImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
            // const res = await axios.get("http://localhost:4001/upload");
        const res = await axios.get("https://instagram-clone-1-zlk3.onrender.com/upload");
        setImages(res.data);
      } catch (err) {
        console.error("Error fetching images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading images...</p>;
  }

  return (
    <div style={{ 
      display: "flex", 
      flexWrap: "wrap", 
      justifyContent: "center", 
      gap: "20px",
      padding: "20px"
    }}>
      {images.length === 0 ? (
        <h3>No images found.</h3>
      ) : (
        images.map((img) => (
          <div 
            key={img._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "10px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)"
            }}
          >
            <img 
              src={img.ImgUrl} 
              alt={img.name} 
              style={{
                width: "250px",
                height: "250px",
                objectFit: "cover",
                borderRadius: "10px"
              }} 
            />
            <p style={{ textAlign: "center", marginTop: "5px" }}>{img.name}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default FetchImages;
