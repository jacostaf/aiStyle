import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Dropzone from 'react-dropzone';
import ClipLoader from 'react-spinners/ClipLoader';

const App = () => {
  const [query, setQuery] = useState('');
  const [outfit, setOutfit] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = async () => {
    setLoading(true);
    setOutfit([]);
    try {
      const response = await axios.post(`${backendUrl}/api/query`, { query });
      setOutfit(response.data.outfit || []);
    } catch (error) {
      console.error('Error fetching outfit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (acceptedFiles) => {
    setFiles([...files, ...acceptedFiles]);
  };

  const handleCloset = async () => {
    setLoading(true);
    setOutfit([]);
    try {
      const response = await axios.post(`${backendUrl}/api/closet`, { files });
      setOutfit(response.data.outfit || []);
    } catch (error) {
      console.error('Error building outfit from closet:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Stylist</h1>
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder="Enter a style or keyword..."
        />
        <button onClick={handleSearch}>Get Outfit</button>
        <h2>Upload Your Closet</h2>
        <Dropzone onDrop={handleDrop}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <p>Drag & drop some files here, or click to select files</p>
            </div>
          )}
        </Dropzone>
        <button onClick={handleCloset}>Build Outfit from Closet</button>
      </header>
      {loading ? (
        <div className="spinner">
          <ClipLoader size={50} color={"#61dafb"} loading={loading} />
        </div>
      ) : (
        <div className="outfit">
          {Array.isArray(outfit) && outfit.length > 0 ? (
            outfit.map((item, index) => (
              <div key={index} className="outfit-item">
                {item.image && <img src={item.image} alt={item.name} />}
                <p>{item.name}</p>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  Buy Now
                </a>
              </div>
            ))
          ) : (
            <p>No outfit suggestions available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
