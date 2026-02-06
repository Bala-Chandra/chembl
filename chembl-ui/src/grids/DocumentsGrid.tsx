// src/grids/DocumentsGrid.tsx
import { useEffect, useState } from 'react';
import ResultsGrid from './ResultsGrid';
import { DOCUMENTS_COLUMNS } from './columns/documents.columns';
import type { DocumentRow } from '../types/rows/document-row.type';
import { fetchResults } from '../api/resultsApi';

export default function DocumentsGrid() {
  const [rows, setRows] = useState<DocumentRow[]>([]);

  useEffect(() => {
    fetchResults('documents', 1, 25).then(res => {
      setRows(res.data.rows);
    });
  }, []);

  return (
    <ResultsGrid<DocumentRow>
      columnDefs={DOCUMENTS_COLUMNS}
      rowData={rows}
      storageKey="documents-grid"
    />
  );
}
