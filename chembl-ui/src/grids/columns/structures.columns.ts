import type { ColDef } from "ag-grid-community";

export const STRUCTURES_COLUMNS: ColDef[] = [
    
  { headerName: '', field: 'image', width: 70 }, // structure image / placeholder
  { field: 'chembl_id', headerName: 'ChEMBL ID', pinned: 'left' },
  { field: 'pref_name', headerName: 'Preferred Name' },
  { field: 'max_phase', headerName: 'Max Phase' },
  { field: 'mw', headerName: 'Mol Weight' },
  { field: 'alogp', headerName: 'ALogP' },
  { field: 'psa', headerName: 'PSA' },
  { field: 'hba', headerName: 'HBA' },
  { field: 'hbd', headerName: 'HBD' },
  { field: 'rtb', headerName: 'Rotatable Bonds' },
  { field: 'num_ro5_violations', headerName: 'RO5 Violations' },
  { field: 'canonical_smiles', headerName: 'SMILES' },
];
