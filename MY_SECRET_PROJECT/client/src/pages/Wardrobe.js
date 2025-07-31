import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Wardrobe = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [wardrobe, setWardrobe] = useState([]);

  const token = localStorage.getItem('token'); // store token after login

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      await axios.post('http://localhost:5000/api/upload/image', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchWardrobe(); // refresh
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const fetchWardrobe = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/upload/wardrobe', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const items = await Promise.all(res.data.map(async (item) => {
        const imageRes = await axios.get(`http://localhost:5000/api/upload/${item.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return { ...item, base64: imageRes.data.base64 };
      }));

      setWardrobe(items);
    } catch (err) {
      console.error('Error fetching wardrobe:', err);
    }
  };

  useEffect(() => {
    fetchWardrobe();
  }, []);

  return (
    <div>
      <h2>My Virtual Wardrobe</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
        {wardrobe.map((item) => (
          <div key={item.id} style={{ margin: '10px' }}>
            <img
              src={item.base64}
              alt={item.image_name}
              style={{ width: '150px', height: 'auto', border: '1px solid #ccc' }}
            />
            <p>{item.image_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wardrobe;
