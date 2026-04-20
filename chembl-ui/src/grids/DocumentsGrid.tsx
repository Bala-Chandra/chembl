// src/grids/DocumentsGrid.tsx
import ResultsGrid from './ResultsGrid';
import { DOCUMENTS_COLUMNS } from './columns/documents.columns';
import type { DocumentRow } from '../types/rows/document-row.type';
import { fetchResults } from '../api/resultsApi';

export default function DocumentsGrid() {

  return (
    <ResultsGrid<DocumentRow>
      columnDefs={DOCUMENTS_COLUMNS}
      storageKey="documents-grid"
      fetchData={(page, size) =>
        fetchResults('documents', page, size).then(res => res.data)
      }
    />
  );
}
