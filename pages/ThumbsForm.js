import React, { useState } from 'react';

const ThumbsForm = () => {
  const [thumb, setThumb] = useState(null);

  const handleThumbClick = (value) => {
    setThumb(value);
  };

  return (
    <div>
      <button 
        style={{ 
          filter: thumb === 'up' ? 'grayscale(0)' : 'grayscale(1)',
          WebkitFilter: thumb === 'up' ? 'grayscale(0)' : 'grayscale(1)'
        }} 
        onClick={() => handleThumbClick('up')}>👍</button>
      <button 
        style={{ 
          filter: thumb === 'down' ? 'grayscale(0)' : 'grayscale(1)',
          WebkitFilter: thumb === 'down' ? 'grayscale(0)' : 'grayscale(1)'
        }} 
        onClick={() => handleThumbClick('down')}>👎
      </button>
    </div>
  );
};

export default ThumbsForm;
