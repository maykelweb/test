import React, { useState } from 'react';

const ThumbsForm = () => {
  const [thumb, setThumb] = useState(null);

  const handleThumbClick = (value) => {
    setThumb(value);

    // Save conversation to text file
    // Get conversation
    var context = document.getElementById("results").innerHTML;

    //Save context to text file
    // Save to file
    // Create element with <a> tag
const link = document.createElement("a");

// Create a blog object with the file content which you want to add to the file
const file = new Blob([context], { type: "text/plain;charset=utf-8" });

// Add file content in the object URL
link.href = URL.createObjectURL(file);

// Add file name
link.download = "sample.txt";

// Add click event to <a> tag to save file.
link.click();
URL.revokeObjectURL(link.href);
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
