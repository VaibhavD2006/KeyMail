import React, { useEffect, useState } from 'react';

export default function MilestoneList() {
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');

  useEffect(() => {
    fetch('/api/milestones')
      .then(res => res.json())
      .then(setMilestones)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await fetch('/api/milestones', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const startEdit = (milestone: any) => {
    setEditingId(milestone.id);
    setEditTitle(milestone.title);
    setEditDate(milestone.date?.slice(0, 10) || '');
  };

  const handleEdit = async (id: string) => {
    const res = await fetch('/api/milestones', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, title: editTitle, date: editDate }),
    });
    const updated = await res.json();
    setMilestones(milestones.map(m => m.id === id ? updated : m));
    setEditingId(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Milestones</h2>
      <ul>
        {milestones.map(milestone => (
          <li key={milestone.id} style={{ marginBottom: 8 }}>
            {editingId === milestone.id ? (
              <>
                <input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                <input value={editDate} onChange={e => setEditDate(e.target.value)} type="date" />
                <button onClick={() => handleEdit(milestone.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{milestone.title} ({milestone.date?.slice(0, 10)})</span>
                <button onClick={() => startEdit(milestone)}>Edit</button>
                <button onClick={() => handleDelete(milestone.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
