import { useEffect, useState } from 'react';
import ResultsGrid from './ResultsGrid';
import { fetchResults } from '../api/resultsApi';
import { ACTIVITIES_COLUMNS } from './columns/activities.columns';

export default function ActivitiesGrid() {
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    fetchResults('activities').then(res => {
      setRowData(res.data);
    });
  }, []);

  return (
    <ResultsGrid
      columnDefs={ACTIVITIES_COLUMNS}
      rowData={rowData}
       storageKey="chembl:activities:columns"
    />
  );
}
