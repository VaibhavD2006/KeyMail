import React, { useEffect, useState } from 'react';

export default function TemplateList() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');

  useEffect(() => {
    fetch('/api/templates')
      .then(res => res.json())
      .then(setTemplates)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await fetch('/api/templates', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setTemplates(templates.filter(t => t.id !== id));
  };

  const startEdit = (template: any) => {
    setEditingId(template.id);
    setEditName(template.name);
    setEditSubject(template.subject);
    setEditBody(template.body);
  };

  const handleEdit = async (id: string) => {
    const res = await fetch('/api/templates', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name: editName, subject: editSubject, body: editBody }),
    });
    const updated = await res.json();
    setTemplates(templates.map(t => t.id === id ? updated : t));
    setEditingId(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Email Templates</h2>
      <ul>
        {templates.map(template => (
          <li key={template.id} style={{ marginBottom: 8 }}>
            {editingId === template.id ? (
              <>
                <input value={editName} onChange={e => setEditName(e.target.value)} />
                <input value={editSubject} onChange={e => setEditSubject(e.target.value)} />
                <textarea value={editBody} onChange={e => setEditBody(e.target.value)} rows={4} />
                <button onClick={() => handleEdit(template.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{template.name} - {template.subject}</span>
                <button onClick={() => startEdit(template)}>Edit</button>
                <button onClick={() => handleDelete(template.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
