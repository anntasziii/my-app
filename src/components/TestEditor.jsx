import React, { useState } from 'react';

function TestEditor({ tests, setTests }) {
  const [input, setInput] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');

  const addTest = () => {
    if (input.trim() === '') return;
    setTests([...tests, { input, expectedOutput }]);
    setInput('');
    setExpectedOutput('');
  };

  const removeTest = (index) => {
    setTests(tests.filter((_, i) => i !== index));
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Test Cases</h2>
      <textarea
        placeholder="Input data"
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={3}
        style={{ width: '100%', marginBottom: 8 }}
      />
      <textarea
        placeholder="Expected output"
        value={expectedOutput}
        onChange={e => setExpectedOutput(e.target.value)}
        rows={3}
        style={{ width: '100%', marginBottom: 8 }}
      />
      <button onClick={addTest}>Add Test</button>

      <ul style={{ marginTop: 15 }}>
        {tests.map((test, i) => (
          <li key={i} style={{ marginBottom: 10, backgroundColor: '#eee', padding: 8 }}>
            <div><strong>Input:</strong></div>
            <pre>{test.input}</pre>
            <div><strong>Expected Output:</strong></div>
            <pre>{test.expectedOutput}</pre>
            <button onClick={() => removeTest(i)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TestEditor;
