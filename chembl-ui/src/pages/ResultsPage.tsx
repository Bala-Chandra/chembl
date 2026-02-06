import { useState } from 'react';
import StructuresGrid from '../grids/StructuresGrid';
import DocumentsGrid from '../grids/DocumentsGrid';
import AssaysGrid from '../grids/AssaysGrid';
import ActivitiesGrid from '../grids/ActivitiesGrid';

const tabs = ['structures', 'documents', 'assays', 'activities'] as const;
type Tab = typeof tabs[number];

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('structures');

  return (
    <div className="results-page">
      <div className="tabs">
        {tabs.map(t => (
          <button
            key={t}
            className={activeTab === t ? 'active' : ''}
            onClick={() => setActiveTab(t)}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {activeTab === 'structures' && <StructuresGrid />}
      {activeTab === 'documents' && <DocumentsGrid />}
      {activeTab === 'assays' && <AssaysGrid />}
      {activeTab === 'activities' && <ActivitiesGrid />}
    </div>
  );
}
