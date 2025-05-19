import React, { useState } from 'react';

function CodeEditor({ onCodeChange }) {
  const [code, setCode] = useState('');

  const handleChange = (event) => {
    setCode(event.target.value);
    if (onCodeChange) {
      onCodeChange(event.target.value);
    }
  };

  return (
    <div>
      <h3>Enter Program Code:</h3>
      <textarea
        value={code}
        onChange={handleChange}
        rows={10}
        style={{ width: '100%', fontFamily: 'monospace' }}
      />
    </div>
  );
}

export default CodeEditor;