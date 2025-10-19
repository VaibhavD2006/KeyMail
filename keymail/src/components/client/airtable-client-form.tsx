import React, { useState } from 'react';

export default function AirtableClientForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/airtable/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      if (res.ok) {
        setMessage('Client saved!');
        setName('');
        setEmail('');
      } else {
        setMessage('Error saving client.');
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
        <label>Name:</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <label>Email:</label>
        <input value={email} onChange={e => setEmail(e.target.value)} required type="email" />
      </div>
      <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Client'}</button>
      {message && <div>{message}</div>}
    </form>
  );
}
