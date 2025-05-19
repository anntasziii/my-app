import React, { useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';

export default function BlockGraph({ blocks }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [language, setLanguage] = useState('python');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const newNodes = blocks.map((block, i) => ({
      id: block.id,
      data: { label: block.text },
      position: { x: 100, y: i * 100 },
    }));

    const newEdges = blocks.slice(0, -1).map((block, i) => ({
      id: `e${i}`,
      source: block.id,
      target: blocks[i + 1].id,
      type: 'smoothstep',
    }));

    setNodes(newNodes);
    setEdges(newEdges);
  }, [blocks, setNodes, setEdges]);

  const handleSendSchema = async () => {
    const schemaText = blocks.map((block) => block.text).join('\n');

    const body = {
      schema: schemaText,
      language: language
    };

    try {
      const response = await fetch('http://localhost:8080/kpz/schema', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setStatusMessage('Shell sent successfully!');
      } else {
        setStatusMessage('Error in schema!');
      }
    } catch (error) {
      setStatusMessage(`Server error: ${error.message}`);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        >
          <option value="python">Python</option>
          <option value="lava">Lava</option>
          <option value="cpp">C++</option>
          <option value="csharp">C#</option>
        </select>

        <button onClick={handleSendSchema} style={{ padding: '5px 10px' }}>
          Send schema
        </button>

        {statusMessage && (
          <span style={{ marginLeft: '15px', fontWeight: 'bold' }}>
            {statusMessage}
          </span>
        )}
      </div>

      <div style={{ height: 500, border: '2px solid gray', borderRadius: '10px', backgroundColor: '#FFFFFF' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
