import React, { useState, useEffect } from 'react';

const defaultTasks = [
  { id: 1, text: 'Create an emergency contact list', completed: false },
  { id: 2, text: 'Assemble a disaster supply kit', completed: false },
  { id: 3, text: 'Identify nearby shelters or safe zones', completed: false },
  { id: 4, text: 'Plan evacuation routes', completed: false },
  { id: 5, text: 'Prepare important documents', completed: false },
];

export default function Checklist() {
  // Load from localStorage if available
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('checklistTasks');
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  // Save to localStorage when tasks change
  useEffect(() => {
    localStorage.setItem('checklistTasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>Preparedness Checklist</h2>

      <div style={{ background: '#eee', height: '20px', borderRadius: '10px', overflow: 'hidden', marginBottom: '15px' }}>
        <div
          style={{
            background: '#4caf50',
            width: `${progressPercent}%`,
            height: '100%',
            transition: 'width 0.3s ease'
          }}
        />
      </div>

      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {tasks.map(task => (
          <li key={task.id} style={{ marginBottom: '10px' }}>
            <label>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                style={{ marginRight: '10px' }}
              />
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.text}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
