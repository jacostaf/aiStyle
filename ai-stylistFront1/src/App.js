import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Dropzone from 'react-dropzone';

const App = () => {
  const [query, setQuery] = useState('');
  const [outfit, setOutfit] = useState([]);
  const [closet, setCloset] = useState([]);
  const [files, setFiles] = useState([]);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/query`, { query });
      setOutfit(response.data.outfit.split('\n'));
    } catch (error) {
      console.error('Error fetching outfit:', error);
    }
  };

  const handleDrop = (acceptedFiles) => {
    setFiles([...files, ...acceptedFiles]);
  };

  const handleCloset = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/closet`, { files });
      setOutfit(response.data.outfit.split('\n'));
    } catch (error) {
      console.error('Error building outfit from closet:', error);
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
      <div className="outfit">
        {outfit.map((item, index) => (
          <div key={index} className="outfit-item">
            <p>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
