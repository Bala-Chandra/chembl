import type { ColDef } from "ag-grid-community";

export const ACTIVITIES_COLUMNS: ColDef[] = [
  { headerName: '⚗️', field: 'icon', width: 60 },
  { field: 'activity_id', headerName: 'Activity ID', pinned: 'left' },
  { field: 'chembl_id', headerName: 'Molecule ChEMBL ID' },
  { field: 'assay_id', headerName: 'Assay ID' },
  { field: 'doc_id', headerName: 'Doc ID' },
  { field: 'standard_type', headerName: 'Type' },
  { field: 'standard_relation', headerName: 'Relation' },
  { field: 'standard_value', headerName: 'Value' },
  { field: 'standard_units', headerName: 'Units' },
  { field: 'pchembl_value', headerName: 'pChEMBL' },
  { field: 'data_validity_comment', headerName: 'Validity' },
  { field: 'activity_comment', headerName: 'Comment' },
  { field: 'bao_endpoint', headerName: 'BAO Endpoint' },
  { field: 'uo_units', headerName: 'UO Units' },
  { field: 'recorded_by', headerName: 'Recorded By' },
];
