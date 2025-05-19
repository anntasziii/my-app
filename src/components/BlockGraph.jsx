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
  const [testInput, setTestInput] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

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
  }, [blocks]);

  const sendSchema = async () => {
    try {
      const res = await fetch('http://localhost:8080/kpz/schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schema: blocks, language }),
      });

      if (res.ok) {
        setResponseMessage('Schema sent successfully');
      } else {
        setResponseMessage(`Error: Server responded with status ${res.status}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage('Server is not available');
    }
  };

  const sendTests = async () => {
    try {
      const parsedTests = JSON.parse(testInput);

      const res = await fetch('http://localhost:8080/kpz/schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schema: blocks, tests: parsedTests, language }),
      });

      if (res.ok) {
        setResponseMessage('Test passed');
      } else if (res.status === 400) {
        setResponseMessage('Bug in schema — incorrect response');
      } else {
        setResponseMessage(`Unknown error (status ${res.status})`);
      }
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage('Invalid test input (JSON expected)');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Flowchart Builder</h1>

      <div style={{ marginBottom: '10px' }}>
        <label>
          Language:&nbsp;
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="c++">C++</option>
            <option value="c#">C#</option>
          </select>
        </label>
        <button onClick={sendSchema} style={{ marginLeft: '20px' }}>
          Send Schema
        </button>
      </div>

      <div style={{ height: 500, border: '2px solid #ccc', borderRadius: 8, marginBottom: '20px', background: '#fff' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>

      <div>
        <label>
          Enter tests (JSON format):
          <textarea
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            rows={6}
            style={{ width: '100%', fontFamily: 'monospace', marginTop: '10px' }}
          />
        </label>
        <button
        onClick={sendTests}
        style={{
          marginTop: 20,
          padding: '10px 20px',
          fontSize: 16,
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }}>
        Send Tests
      </button>
      </div>

      {responseMessage && (
        <div style={{ marginTop: '15px', fontWeight: 'bold', color: '#333' }}>
          {responseMessage}
        </div>
      )}
    </div>
  );
}
