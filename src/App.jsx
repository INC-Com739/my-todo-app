import React, { useEffect, useState } from 'react';
import { scanTodos, createTodo, updateTodo, deleteTodo } from './dynamo';
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

  const handleUpdate = async (id, currentCompleted) => {
    const updated = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !currentCompleted } : todo
    );
    setTodos(updated);
    await updateTodo({ id, text: updated.find(t => t.id === id).text, completed: !currentCompleted });
  };

  const handleDelete = async (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    await deleteTodo(id);
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
          <li key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleUpdate(todo.id, todo.completed)}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.text}</span>
            <button onClick={() => handleDelete(todo.id)} style={{ color: 'red', marginLeft: 8 }}>×</button>
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
