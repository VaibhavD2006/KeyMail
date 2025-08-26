"use client";
import React, { useState } from 'react';
import ClientList from '@/components/client/client-list';
import ClientForm from '@/components/client/client-form';

export default function ClientsPage() {
  const [refresh, setRefresh] = useState(0);
  return (
    <div>
      <h1>Clients</h1>
      <ClientForm key={refresh} />
      <button onClick={() => setRefresh(r => r + 1)} style={{ margin: '1em 0' }}>Refresh List</button>
      <ClientList key={refresh} />
    </div>
  );
}
