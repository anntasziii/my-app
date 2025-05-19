import React, { useState } from 'react';
import ThreadManager from './components/ThreadManager';


function App() {
  const [threads, setThreads] = useState([]);
  return (
    <div style={{ padding: 20, backgroundColor: '#f5f5f5' }}>
      <h1 className="text-3xl font-bold mb-6 text-center">Multi-threaded Flowchart</h1>

      <ThreadManager threads={threads} setThreads={setThreads} />

    </div>
  );
}

export default App;