import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import ResultsGrid from '../components/ResultsGrid';
import ColumnSelector from '../components/ColoumnSelector';
import {
  structureColumns,
  documentColumns,
  assayColumns,
  activityColumns,
} from '../results/columns';

const tabs = ['structures', 'documents', 'assays', 'activities'] as const;

export default function ResultsPage() {
  const { state } = useLocation();
  const { category, value } = state;

  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('structures');

  const [colsMap, setColsMap] = useState({
    structures: structureColumns,
    documents: documentColumns,
    assays: assayColumns,
    activities: activityColumns,
  });

  const columns = colsMap[activeTab];

  return (
    <div>
      <h2>Search Results</h2>

      {/* Tabs */}
      <div style={{ marginBottom: 12 }}>
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            disabled={activeTab === t}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Column selector */}
      <ColumnSelector
        columns={columns}
        onChange={cols =>
          setColsMap(prev => ({ ...prev, [activeTab]: cols }))
        }
      />

      {/* Grid */}
      <ResultsGrid
        type={activeTab}
        category={category}
        value={value}
        columns={columns}
      />
    </div>
  );
}
