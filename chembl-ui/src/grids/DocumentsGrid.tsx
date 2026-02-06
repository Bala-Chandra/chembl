import { useEffect, useState } from 'react';
import ResultsGrid from './ResultsGrid';
import { fetchResults } from '../api/resultsApi';
import { DOCUMENTS_COLUMNS } from './columns/documents.columns';

export default function DocumentsGrid() {
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    fetchResults('documents').then(res => {
      setRowData(res.data);
    });
  }, []);

  return (
    <ResultsGrid
      columnDefs={DOCUMENTS_COLUMNS}
      rowData={rowData}
      storageKey="chembl:documents:columns"
    />

  );
}
