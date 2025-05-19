import React from 'react';

function BlockPreview({ blocks }) {
  return (
    <div style={{ marginTop: 20 }}>
      <h3>Block Scheme Preview</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {blocks.map((block) => (
          <div
            key={block.id}
            style={{
              border: '2px solid #333',
              padding: '10px 20px',
              borderRadius: '8px',
              backgroundColor: '#f5f5f5',
              fontFamily: 'monospace'
            }}
          >
            {block.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlockPreview;
