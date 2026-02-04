import type { ColDef } from 'ag-grid-community';

interface Props {
  columns: ColDef[];
  onChange: (cols: ColDef[]) => void;
}

export default function ColumnSelector({ columns, onChange }: Props) {
  const toggle = (field?: string) => {
    onChange(
      columns.map(c =>
        c.field === field ? { ...c, hide: !c.hide } : c
      )
    );
  };

  return (
    <div style={{ marginBottom: 8 }}>
      {columns.map(c => (
        <label key={c.field} style={{ marginRight: 12 }}>
          <input
            type="checkbox"
            checked={!c.hide}
            onChange={() => toggle(c.field)}
          />
          {c.headerName}
        </label>
      ))}
    </div>
  );
}
