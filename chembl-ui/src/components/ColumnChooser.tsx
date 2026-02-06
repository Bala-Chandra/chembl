import { useEffect, useRef } from 'react';
import type { ColDef, GridApi } from 'ag-grid-community';
import styles from './ColumnChooser.module.css';

interface Props {
  gridApi: GridApi;
  columns: ColDef[];
  storageKey: string;
  onClose: () => void;
}

export default function ColumnChooser({
  gridApi,
  columns,
  storageKey,
  onClose,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const toggle = (field: string) => {
    const col = gridApi.getColumn(field);
    if (!col) return;

    const visible = col.isVisible();
    gridApi.setColumnsVisible([field], !visible);

    persist();
  };

  const persist = () => {
    const state = gridApi.getColumnState();
    localStorage.setItem(storageKey, JSON.stringify(state));
  };

  return (
    <div ref={ref} className={styles.panel}>
      <div className={styles.title}>Columns</div>

      {columns
        .filter(c => c.field)
        .map(col => (
          <label key={col.field} className={styles.item}>
            <input
              type="checkbox"
              checked={gridApi.getColumn(col.field!)?.isVisible()}
              onChange={() => toggle(col.field!)}
            />
            {col.headerName}
          </label>
        ))}
    </div>
  );
}
