// src/types/rows/structure-row.type.ts

export interface StructureRow {
  chembl_id: string;
  pref_name: string | null;
  max_phase: string | null;
  mw: string | null;
  alogp: string | null;
  psa: string | null;
  hba: number | null;
  hbd: number | null;
  rtb: number | null;
  num_ro5_violations: number | null;
  canonical_smiles: string;
}
