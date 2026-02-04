import { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { fetchResults } from '../api/resultsApi';

interface Props {
  type: 'structures' | 'documents' | 'assays' | 'activities';
  category: string;
  value: string;
  columns: ColDef[];
}

export default function ResultsGrid<T>({
  type,
  category,
  value,
  columns,
}: Props) {
  const [rowData, setRowData] = useState<T[]>([]);

  useEffect(() => {
    fetchResults(type, {
      category,
      value,
      page: 1,        // fixed for now
      pageSize: 25,
    }).then(res => {
      setRowData(res.data.rows as T[]);
    });
  }, [type, category, value]);

  return (
    <div className="ag-theme-alpine" style={{ height: 500 }}>
      <AgGridReact<T>
        rowData={rowData}
        columnDefs={columns}
        pagination
        paginationPageSize={25}
      />
    </div>
  );
}
