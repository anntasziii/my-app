import React, { useState } from 'react';

function BlockInput({ onAdd }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter block operation (e.g., V1 = 5)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ padding: '8px', fontSize: '16px', width: '300px' }}
      />
      <button type="submit" style={{ marginLeft: '10px', padding: '8px' }}>
        Add Block
      </button>
    </form>
  );
}

export default BlockInput;
