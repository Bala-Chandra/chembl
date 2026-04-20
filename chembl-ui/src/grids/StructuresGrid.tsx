import ResultsGrid from './ResultsGrid';
import { STRUCTURES_COLUMNS } from './columns/structures.columns';
import type { StructureRow } from '../types/rows/structure-row.type';
import { fetchResults } from '../api/resultsApi';

export default function StructuresGrid() {
  return (
    <ResultsGrid<StructureRow>
      columnDefs={STRUCTURES_COLUMNS}
      storageKey="structures-grid"
      fetchData={(page, size) =>
        fetchResults('structures', page, size).then(res => res.data)
      }
    />
  );
}