// src/grids/AssaysGrid.tsx
import { useEffect, useState } from 'react';
import ResultsGrid from './ResultsGrid';
import { ASSAYS_COLUMNS } from './columns/assays.columns';
import type { AssayRow } from '../types/rows/assay-row.type';
import { fetchResults } from '../api/resultsApi';

export default function AssaysGrid() {
  const [rows, setRows] = useState<AssayRow[]>([]);

  useEffect(() => {
    fetchResults('assays', 1, 25).then(res => {
      setRows(res.data.rows);
    });
  }, []);

  return (
    <ResultsGrid<AssayRow>
      columnDefs={ASSAYS_COLUMNS}
      rowData={rows}
      storageKey="assays-grid"
    />
  );
}
