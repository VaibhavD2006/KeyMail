"use client";
import React, { useState } from 'react';
import MilestoneList from '@/components/milestone/milestone-list';
import MilestoneForm from '@/components/milestone/milestone-form';

export default function MilestonesPage() {
  const [refresh, setRefresh] = useState(0);
  return (
    <div>
      <h1>Milestones</h1>
      <MilestoneForm key={refresh} />
      <button onClick={() => setRefresh(r => r + 1)} style={{ margin: '1em 0' }}>Refresh List</button>
      <MilestoneList key={refresh} />
    </div>
  );
}
