// src/grids/ActivitiesGrid.tsx
import { useEffect, useState } from 'react';
import ResultsGrid from './ResultsGrid';
import { ACTIVITIES_COLUMNS } from './columns/activities.columns';
import type { ActivityRow } from '../types/rows/activity-row.type';
import { fetchResults } from '../api/resultsApi';

export default function ActivitiesGrid() {
  const [rows, setRows] = useState<ActivityRow[]>([]);

  useEffect(() => {
    fetchResults('activities', 1, 25).then(res => {
      setRows(res.data.rows);
    });
  }, []);

  return (
    <ResultsGrid<ActivityRow>
      columnDefs={ACTIVITIES_COLUMNS}
      rowData={rows}
      storageKey="activities-grid"
    />
  );
}
