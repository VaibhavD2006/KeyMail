import React, { useEffect, useState } from 'react';

export default function EmailForm() {
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [templates, setTemplates] = useState<any[]>([]);
  const [templateId, setTemplateId] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/templates')
      .then(res => res.json())
      .then(setTemplates);
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/emails/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, templateId }),
      });
      const data = await res.json();
      setBody(data.content || '');
    } catch (err) {
      setMessage('Error generating email.');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, from, subject, body }),
      });
      if (res.ok) {
        setMessage('Email sent!');
        setTo('');
        setFrom('');
        setSubject('');
        setBody('');
        setPrompt('');
      } else {
        setMessage('Error sending email.');
      }
    } catch (err) {
      setMessage('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={e => { e.preventDefault(); handleSend(); }} style={{ maxWidth: 500 }}>
      <div>
        <label>To:</label>
        <input value={to} onChange={e => setTo(e.target.value)} required />
      </div>
      <div>
        <label>From:</label>
        <input value={from} onChange={e => setFrom(e.target.value)} required />
      </div>
      <div>
        <label>Subject:</label>
        <input value={subject} onChange={e => setSubject(e.target.value)} required />
      </div>
      <div>
        <label>Template:</label>
        <select value={templateId} onChange={e => setTemplateId(e.target.value)} required>
          <option value="">Select a template</option>
          {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
      <div>
        <label>Prompt for GPT:</label>
        <input value={prompt} onChange={e => setPrompt(e.target.value)} />
        <button type="button" onClick={handleGenerate} disabled={loading || !templateId || !prompt}>Generate with GPT</button>
      </div>
      <div>
        <label>Body:</label>
        <textarea value={body} onChange={e => setBody(e.target.value)} required rows={8} />
      </div>
      <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send Email'}</button>
      {message && <div>{message}</div>}
    </form>
  );
}
