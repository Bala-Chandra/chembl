// grids/StructuresGrid.tsx
import { useEffect, useState } from 'react';
import ResultsGrid from './ResultsGrid';
import { STRUCTURES_COLUMNS } from './columns/structures.columns';
import type { StructureRow } from '../types/rows/structure-row.type';
import { fetchResults } from '../api/resultsApi';

export default function StructuresGrid() {
  const [rows, setRows] = useState<StructureRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults('structures', 1, 25).then(res => {
      setRows(res.data.rows); // 🔴 THIS WAS MISSING
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading structures…</div>;
  }

  return (
    <ResultsGrid<StructureRow>
      columnDefs={STRUCTURES_COLUMNS}
      rowData={rows}
      storageKey="structures-grid"
    />
  );
}
