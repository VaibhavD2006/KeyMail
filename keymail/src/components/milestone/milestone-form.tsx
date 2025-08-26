import React, { useState } from 'react';

export default function MilestoneForm() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date }),
      });
      if (res.ok) {
        setMessage('Milestone saved!');
        setTitle('');
        setDate('');
      } else {
        setMessage('Error saving milestone.');
      }
    } catch (err) {
      setMessage('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <div>
        <label>Title:</label>
        <input value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Date:</label>
        <input value={date} onChange={e => setDate(e.target.value)} required type="date" />
      </div>
      <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Milestone'}</button>
      {message && <div>{message}</div>}
    </form>
  );
}
