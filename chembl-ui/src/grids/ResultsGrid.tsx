import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridApi } from 'ag-grid-community';
import { useRef, useState } from 'react';
import ColumnChooser from '../components/ColumnChooser';

interface Props<T> {
  columnDefs: ColDef[];
  rowData: T[];
  storageKey: string;
  onGridReady?: (api: GridApi) => void;
}

export default function ResultsGrid<T>({
  columnDefs,
  rowData,
  storageKey,
  onGridReady,
}: Props<T>) {
  const apiRef = useRef<GridApi | null>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [showChooser, setShowChooser] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 6,
        }}
      >
        <button
          onClick={() => setShowChooser(v => !v)}
          disabled={!gridApi}
        >
          ⚙ Columns
        </button>
      </div>

      {/* Column chooser popup */}
      {showChooser && gridApi && (
        <ColumnChooser
          gridApi={gridApi}
          columns={columnDefs}
          storageKey={storageKey}
          onClose={() => setShowChooser(false)}
        />
      )}

      {/* AG Grid */}
      <div className="ag-theme-alpine" style={{ height: 600 }}>
        <AgGridReact<T>
          columnDefs={columnDefs}
          rowData={rowData}
          pagination
          paginationPageSize={25}
          suppressMovableColumns
          onGridReady={params => {
            apiRef.current = params.api;
            setGridApi(params.api);

            // Restore persisted column state
            const saved = localStorage.getItem(storageKey);
            if (saved) {
              params.api.applyColumnState({
                state: JSON.parse(saved),
                applyOrder: true,
              });
            }

            onGridReady?.(params.api);
          }}
        />
      </div>
    </div>
  );
}
