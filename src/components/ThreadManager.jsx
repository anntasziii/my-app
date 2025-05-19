import React, { useState } from 'react';
import BlockGraph from './BlockGraph';
import BlockInput from './BlockInput';
import BlockPreview from './BlockPreview';

function parseScriptToBlocks(script) {
  const lines = script.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const blocks = [];
  let idCounter = 1;
  const stackIf = [];

  lines.forEach((line) => {
    let block = null;

    if (line === 'start') {
      block = { id: idCounter++, type: 'start', text: 'Start' };
    } else if (line === 'end') {
      block = { id: idCounter++, type: 'end', text: 'End' };
    } else if (line.startsWith('input ')) {
      const vars = line.substring(6).split(',').map(v => v.trim());
      vars.forEach(v => {
        blocks.push({ id: idCounter++, type: 'input', text: `Input ${v}` });
      });
      return;
    } else if (line.startsWith('c ')) {
      block = { id: idCounter++, type: 'const', text: line };
    } else if (line.startsWith('v ')) {
      block = { id: idCounter++, type: 'operation', text: line.substring(2).trim() };
    } else if (line.startsWith('if ')) {
      block = { id: idCounter++, type: 'if', text: line.substring(3).trim() };
      stackIf.push(block.id);
    } else if (line === 'else') {
      block = { id: idCounter++, type: 'else', text: 'Else' };
    } else if (line === 'endif') {
      block = { id: idCounter++, type: 'endif', text: 'End If' };
      stackIf.pop();
    } else if (line.startsWith('print ')) {
      block = { id: idCounter++, type: 'print', text: line.substring(6).trim() };
    } else {
      block = { id: idCounter++, type: 'operation', text: line };
    }

    if (block) blocks.push(block);
  });

  return script
    .split('\n')
    .filter(line => line.trim() !== '')
    .map((line, i) => ({ id: `b${i}`, text: line.trim() }));
}

export default function ThreadManager() {
  const [threads, setThreads] = useState([
    { id: 1, name: 'Thread 1', blocks: [], scriptText: '' }
  ]);
  const [activeThreadId, setActiveThreadId] = useState(1);

  const activeThread = threads.find(t => t.id === activeThreadId);

  // При зміні скрипту парсимо блоки і оновлюємо потік
  const updateScript = (newScript) => {
    const newBlocks = parseScriptToBlocks(newScript);
    setThreads(threads.map(t =>
      t.id === activeThreadId ? { ...t, scriptText: newScript, blocks: newBlocks } : t
    ));
  };

  // При додаванні блоку — оновлюємо скрипт і блоки
  const addBlock = (text) => {
    const updatedBlocks = [...activeThread.blocks, { id: `b${Date.now()}`, text }];
    const updatedScript = updatedBlocks.map(b => b.text).join('\n');
    setThreads(threads.map(t =>
      t.id === activeThreadId ? { ...t, blocks: updatedBlocks, scriptText: updatedScript } : t
    ));
  };

  return (
    <div>
      <div>
        {threads.map(thread => (
          <button key={thread.id} onClick={() => setActiveThreadId(thread.id)}>
            {thread.name}
          </button>
        ))}
        <button onClick={() => {
          const newId = threads.length + 1;
          setThreads([...threads, { id: newId, name: `Thread ${newId}`, blocks: [], scriptText: '' }]);
          setActiveThreadId(newId);
        }}>
          + Add Thread
        </button>
      </div>

      <textarea
        value={activeThread.scriptText}
        onChange={e => updateScript(e.target.value)}
        rows={10}
        style={{ width: '100%', fontFamily: 'monospace', marginTop: 10 }}
      />

      <BlockPreview blocks={activeThread.blocks} />
      <BlockInput onAdd={addBlock} />

      <BlockGraph blocks={activeThread.blocks} />
    </div>
  );
}