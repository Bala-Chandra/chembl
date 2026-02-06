export interface StructureRow {
  chembl_id: string;
  pref_name: string | null;
  max_phase: number | null;

  mw: number | null; // mw_freebase
  alogp: number | null;
  psa: number | null;
  hba: number | null;
  hbd: number | null;
  rtb: number | null;
  num_ro5_violations: number | null;

  canonical_smiles: string | null;
}
