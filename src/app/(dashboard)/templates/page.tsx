"use client";
import React, { useState } from 'react';
import TemplateList from '@/components/email/template-list';
import TemplateForm from '@/components/email/template-form';

export default function TemplatesPage() {
  const [refresh, setRefresh] = useState(0);
  return (
    <div>
      <h1>Email Templates</h1>
      <TemplateForm key={refresh} />
      <button onClick={() => setRefresh(r => r + 1)} style={{ margin: '1em 0' }}>Refresh List</button>
      <TemplateList key={refresh} />
    </div>
  );
}
