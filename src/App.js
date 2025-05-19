import React, { useState } from 'react';
import ThreadManager from './components/ThreadManager';
import TestEditor from './components/TestEditor';
import getSchemaFromThreads from './components/getSchemaFromThreads';

function App() {
  const [threads, setThreads] = useState([]);
  const [tests, setTests] = useState([]);
  const [language] = useState('python');

  const handleSubmit = async () => {
    if (threads.length === 0) {
      alert('Please add at least one thread');
      return;
    }
    if (tests.length === 0) {
      alert('Please add at least one test');
      return;
    }

    const schema = getSchemaFromThreads(threads, language);

    const payload = {
      schema,
      tests,
    };

    try {
      const response = await fetch('http://localhost:8080/kpz/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        alert('OK — test passed');
      } else if (response.status === 400) {
        alert('Bug in user schema — error in schema');
      } else {
        alert('Something went wrong');
      }
    } catch (error) {
      alert('Error sending data to backend');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: 20, backgroundColor: '#f5f5f5' }}>
      <h1 className="text-3xl font-bold mb-6 text-center">Multi-threaded Flowchart</h1>

      <ThreadManager threads={threads} setThreads={setThreads} />

      <TestEditor tests={tests} setTests={setTests} />

      <button
        onClick={handleSubmit}
        style={{
          marginTop: 20,
          padding: '10px 20px',
          fontSize: 16,
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }}
      >
        Run Tests
      </button>
    </div>
  );
}

export default App;
