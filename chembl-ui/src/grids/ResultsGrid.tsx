import { AgGridReact } from 'ag-grid-react';
import type {
  ColDef,
  GridApi,
  IGetRowsParams,
} from 'ag-grid-community';
import { useRef, useState, useMemo } from 'react';
import ColumnChooser from '../components/ColumnChooser';

interface Props<T> {
  columnDefs: ColDef[];
  fetchData: (page: number, pageSize: number) => Promise<{
    rows: T[];
    total: number;
  }>;
  storageKey: string;
  onGridReady?: (api: GridApi) => void;
}

export default function ResultsGrid<T>({
  columnDefs,
  fetchData,
  storageKey,
  onGridReady,
}: Props<T>) {
  const apiRef = useRef<GridApi | null>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [showChooser, setShowChooser] = useState(false);

  const pageSize = 25;

  // ✅ datasource for infinite scrolling + pagination
  const datasource = useMemo(() => {
    return {
      getRows: async (params: IGetRowsParams) => {
        const page = params.startRow / pageSize + 1;

        try {
          const res = await fetchData(page, pageSize);

          params.successCallback(
            res.rows,
            res.total // ✅ THIS enables correct total count in AG Grid
          );
        } catch {
          params.failCallback();
        }
      },
    };
  }, [fetchData]);

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

      {/* Column chooser */}
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

          // ✅ IMPORTANT
          rowModelType="infinite"
          datasource={datasource}

          pagination
          paginationPageSize={pageSize}
          cacheBlockSize={pageSize}

          suppressMovableColumns={false}

          onGridReady={params => {
            apiRef.current = params.api;
            setGridApi(params.api);

            // Restore column state
            const saved = localStorage.getItem(storageKey);
            if (saved) {
              params.api.applyColumnState({
                state: JSON.parse(saved),
                applyOrder: true,
              });
            }

            onGridReady?.(params.api);
          }}

          // ✅ persist column order
          onColumnMoved={params => {
            const state = params.api.getColumnState();
            localStorage.setItem(storageKey, JSON.stringify(state));
          }}
        />
      </div>
    </div>
  );
}