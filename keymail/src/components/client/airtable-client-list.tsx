import React, { useEffect, useState } from 'react';

export default function AirtableClientList() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  useEffect(() => {
    fetch('/api/airtable/clients')
      .then(res => res.json())
      .then(setClients)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await fetch('/api/airtable/clients', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setClients(clients.filter(c => c.id !== id));
  };

  const startEdit = (client: any) => {
    setEditingId(client.id);
    setEditName(client.name);
    setEditEmail(client.email);
  };

  const handleEdit = async (id: string) => {
    const res = await fetch('/api/airtable/clients', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name: editName, email: editEmail }),
    });
    const updated = await res.json();
    setClients(clients.map(c => c.id === id ? updated : c));
    setEditingId(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Clients</h2>
      <ul>
        {clients.map(client => (
          <li key={client.id} style={{ marginBottom: 8 }}>
            {editingId === client.id ? (
              <>
                <input value={editName} onChange={e => setEditName(e.target.value)} />
                <input value={editEmail} onChange={e => setEditEmail(e.target.value)} />
                <button onClick={() => handleEdit(client.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{client.name} ({client.email})</span>
                <button onClick={() => startEdit(client)}>Edit</button>
                <button onClick={() => handleDelete(client.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
