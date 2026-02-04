import type { ColDef } from 'ag-grid-community';

export const structureColumns: ColDef[] = [
  { field: 'chembl_id', headerName: 'ChEMBL ID' },
  { field: 'pref_name', headerName: 'Name' },
  { field: 'canonical_smiles', headerName: 'SMILES' },
  { field: 'max_phase', headerName: 'Max Phase' },
];

export const documentColumns: ColDef[] = [
  { field: 'doc_id', headerName: 'Doc ID' },
  { field: 'pubmed_id', headerName: 'PubMed ID' },
  { field: 'year', headerName: 'Year' },
];

export const assayColumns: ColDef[] = [
  { field: 'assay_id', headerName: 'Assay ID' },
  { field: 'assay_type', headerName: 'Type' },
  { field: 'description', headerName: 'Description' },
];

export const activityColumns: ColDef[] = [
  { field: 'activity_id', headerName: 'Activity ID' },
  { field: 'standard_type', headerName: 'Type' },
  { field: 'standard_value', headerName: 'Value' },
  { field: 'standard_units', headerName: 'Units' },
];
