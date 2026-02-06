import { useEffect, useState } from 'react';
import ResultsGrid from './ResultsGrid';
import { fetchResults } from '../api/resultsApi';
import { ASSAYS_COLUMNS } from './columns/assays.columns';

export default function AssaysGrid() {
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    fetchResults('assays').then(res => {
      setRowData(res.data);
    });
  }, []);

  return (
    <ResultsGrid
      columnDefs={ASSAYS_COLUMNS}
      rowData={rowData}
       storageKey="chembl:assays:columns"
    />
  );
}
