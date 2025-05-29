import React, { useEffect, useState } from 'react';
import { scanTodos, createTodo } from './dynamo';
import './App.css'

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    console.log('AWS Region:', import.meta.env.VITE_APP_AWS_REGION); // Verification: should log 'us-east-1'
    async function fetchTodos() {
      const items = await scanTodos();
      setTodos(items);
    }
    fetchTodos();
  }, []);

  const handleAdd = async () => {
    if (!input.trim()) return;
    const newTodo = {
      id: Date.now().toString(),
      text: input,
      completed: false,
    };
    await createTodo(newTodo);
    setTodos((prev) => [...prev, newTodo]);
    setInput('');
  };

  return (
    <>
      <h1>Vite + React + Tailwind CSS</h1>
      <div style={{ margin: '1rem 0' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a todo"
        />
        <button onClick={handleAdd}>Add</button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  )
}

export default App
