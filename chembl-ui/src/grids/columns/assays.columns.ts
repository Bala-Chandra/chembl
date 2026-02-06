import type { ColDef } from "ag-grid-community";

export const ASSAYS_COLUMNS: ColDef[] = [
  { headerName: '🧪', field: 'icon', width: 60 },
  { field: 'assay_id', headerName: 'Assay ID', pinned: 'left' },
  { field: 'assay_type', headerName: 'Assay Type' },
  { field: 'description', headerName: 'Description' },
  { field: 'assay_category', headerName: 'Category' },
  { field: 'confidence_score', headerName: 'Confidence' },
  { field: 'target_chembl_id', headerName: 'Target ChEMBL ID' },
  { field: 'target_name', headerName: 'Target Name' },
  { field: 'organism', headerName: 'Organism' },
  { field: 'relationship_type', headerName: 'Relationship' },
  { field: 'bao_format', headerName: 'BAO Format' },
  { field: 'doc_id', headerName: 'Doc ID' },
];
