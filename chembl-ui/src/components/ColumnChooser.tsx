import { useEffect, useRef, useState } from 'react';
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

  // Initialize visibility state from the grid API
  const [visibility, setVisibility] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      columns
        .filter(c => c.field)
        .map(c => [c.field!, gridApi.getColumn(c.field!)?.isVisible() ?? true])
    )
  );

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
    const newVisible = !visibility[field];

    // Update grid
    gridApi.setColumnsVisible([field], newVisible);

    // Update local state → triggers re-render
    setVisibility(prev => ({ ...prev, [field]: newVisible }));

    // Persist to localStorage
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
              checked={visibility[col.field!] ?? true}
              onChange={() => toggle(col.field!)}
            />
            {col.headerName}
          </label>
        ))}
    </div>
  );
}