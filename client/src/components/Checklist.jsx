//client/src/components/Checklist.jsx
import React, { useEffect, useState } from 'react';
import './Checklist.css';

export default function Checklist() {
  //Initialize checklist items from localStorage or default list
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('checklist_items');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Emergency water supply', checked: false },
      { id: 2, text: 'Flashlight with batteries', checked: false },
      { id: 3, text: 'First aid kit', checked: false },
    ];
  });

  const [newItem, setNewItem] = useState('');

  //Sync items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('checklist_items', JSON.stringify(items));
  }, [items]);

  //Toggle checked state of an item
  const toggleItem = (id) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  //Add new checklist item
  const addItem = () => {
    if (!newItem.trim()) return;
    setItems(prev => [
      ...prev,
      { id: Date.now(), text: newItem.trim(), checked: false },
    ]);
    setNewItem('');
  };

  //Delete an item by ID
  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const checkedCount = items.filter(item => item.checked).length;
  const progress = items.length === 0 ? 0 : (checkedCount / items.length) * 100;

  //Front end jsx code
  return (
    <div className="checklist-container">
      <h2>Preparedness Checklist</h2>

      <div className="checklist-progress">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
        <span>{Math.round(progress)}% Complete</span>
      </div>

      <ul className="checklist-items">
        {items.map(item => (
          <li key={item.id} className={item.checked ? 'checked' : ''}>
            <label>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleItem(item.id)}
              />
              {item.text}
            </label>
            <button onClick={() => deleteItem(item.id)}>✕</button>
          </li>
        ))}
      </ul>

      <div className="checklist-add">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add a new item..."
        />
        <button onClick={addItem}>Add</button>
      </div>
    </div>
  );
}
