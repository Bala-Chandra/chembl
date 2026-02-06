import type { ColDef } from "ag-grid-community";

export const DOCUMENTS_COLUMNS: ColDef[] = [
  { headerName: '📄', field: 'icon', width: 60 },
  { field: 'doc_id', headerName: 'Doc ID', pinned: 'left' },
  { field: 'pubmed_id', headerName: 'PubMed ID' },
  { field: 'journal', headerName: 'Journal' },
  { field: 'year', headerName: 'Year' },
  { field: 'volume', headerName: 'Volume' },
  { field: 'issue', headerName: 'Issue' },
  { field: 'first_page', headerName: 'First Page' },
  { field: 'last_page', headerName: 'Last Page' },
  { field: 'doi', headerName: 'DOI' },
];
