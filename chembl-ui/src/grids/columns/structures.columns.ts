import type { ColDef } from 'ag-grid-community';

export const STRUCTURES_COLUMNS: ColDef[] = [
  {
    headerName: '',
    field: 'chembl_id',
    width: 70,
    cellRenderer: () => '🧬', // placeholder (no image yet)
  },
  { field: 'chembl_id', headerName: 'ChEMBL ID', pinned: 'left' },
  { field: 'pref_name', headerName: 'Name' },
  { field: 'max_phase', headerName: 'Max Phase' },
  { field: 'mw', headerName: 'MW' },
  { field: 'alogp', headerName: 'ALogP' },
  { field: 'psa', headerName: 'PSA' },
  { field: 'hba', headerName: 'HBA' },
  { field: 'hbd', headerName: 'HBD' },
  { field: 'rtb', headerName: 'Rot Bonds' },
  {
    field: 'num_ro5_violations',
    headerName: 'RO5 Violations',
  },
  {
    field: 'canonical_smiles',
    headerName: 'SMILES',
    flex: 1,
    wrapText: true,
    autoHeight: true,
  },
];
