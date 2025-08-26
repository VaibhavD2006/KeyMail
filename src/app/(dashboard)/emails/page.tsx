"use client";
import React, { useState } from 'react';
import EmailList from '@/components/email/email-list';
import EmailForm from '@/components/email/email-form';

export default function EmailsPage() {
  const [refresh, setRefresh] = useState(0);
  return (
    <div>
      <h1>Emails</h1>
      <EmailForm key={refresh} />
      <button onClick={() => setRefresh(r => r + 1)} style={{ margin: '1em 0' }}>Refresh List</button>
      <EmailList key={refresh} />
    </div>
  );
}
