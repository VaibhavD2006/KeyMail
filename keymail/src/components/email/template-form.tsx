import React, { useState } from 'react';

export default function TemplateForm() {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, subject, body }),
      });
      if (res.ok) {
        setMessage('Template saved!');
        setName('');
        setSubject('');
        setBody('');
      } else {
        setMessage('Error saving template.');
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
        <label>Subject:</label>
        <input value={subject} onChange={e => setSubject(e.target.value)} required />
      </div>
      <div>
        <label>Body:</label>
        <textarea value={body} onChange={e => setBody(e.target.value)} required rows={6} />
      </div>
      <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Template'}</button>
      {message && <div>{message}</div>}
    </form>
  );
}
