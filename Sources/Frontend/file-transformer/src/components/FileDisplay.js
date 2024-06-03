import React, { useRef } from 'react';

function FileDisplay({ text }) {
    return (
      <div className="file-display">
        <textarea value={text} readOnly />
      </div>
    );
  }
export default FileDisplay;