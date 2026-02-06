import { useEffect, useState } from 'react';
import ResultsGrid from './ResultsGrid';
import { STRUCTURES_COLUMNS } from './columns/structures.columns';
import { fetchResults } from '../api/resultsApi';

export default function StructuresGrid() {
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    fetchResults('structures').then(res => {
      setRowData(res.data);
    });
  }, []);

  return (
    <ResultsGrid
      columnDefs={STRUCTURES_COLUMNS}
      rowData={rowData}
      storageKey="chembl:structures:columns"
    />

  );
}
