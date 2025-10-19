import React, { useEffect, useState } from 'react';

export default function AirtableEmailList() {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');

  useEffect(() => {
    fetch('/api/airtable/emails')
      .then(res => res.json())
      .then(setEmails)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await fetch('/api/airtable/emails', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setEmails(emails.filter(e => e.id !== id));
  };

  const startEdit = (email: any) => {
    setEditingId(email.id);
    setEditSubject(email.subject);
    setEditBody(email.body);
  };

  const handleEdit = async (id: string) => {
    const res = await fetch('/api/airtable/emails', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, subject: editSubject, body: editBody }),
    });
    const updated = await res.json();
    setEmails(emails.map(e => e.id === id ? updated : e));
    setEditingId(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Emails</h2>
      <ul>
        {emails.map(email => (
          <li key={email.id} style={{ marginBottom: 8 }}>
            {editingId === email.id ? (
              <>
                <input value={editSubject} onChange={e => setEditSubject(e.target.value)} />
                <input value={editBody} onChange={e => setEditBody(e.target.value)} />
                <button onClick={() => handleEdit(email.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{email.subject}: {email.body}</span>
                <button onClick={() => startEdit(email)}>Edit</button>
                <button onClick={() => handleDelete(email.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
