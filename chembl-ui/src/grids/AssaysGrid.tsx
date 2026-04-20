// src/grids/AssaysGrid.tsx
import ResultsGrid from './ResultsGrid';
import { ASSAYS_COLUMNS } from './columns/assays.columns';
import type { AssayRow } from '../types/rows/assay-row.type';
import { fetchResults } from '../api/resultsApi';

export default function AssaysGrid() {
  

  return (
    <ResultsGrid<AssayRow>
      columnDefs={ASSAYS_COLUMNS}
      storageKey="assays-grid"
      fetchData={(page, size) =>
        fetchResults('assays', page, size).then(res => res.data)
      }
    />
  );
}
