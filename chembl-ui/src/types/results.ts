export interface StructureRow {
  chembl_id: string;
  pref_name: string | null;
  canonical_smiles: string;
  max_phase: number | null;
}

export interface DocumentRow {
  doc_id: number;
  pubmed_id: string | null;
  year: number | null;
}

export interface AssayRow {
  assay_id: number;
  assay_type: string;
  description: string | null;
}

export interface ActivityRow {
  activity_id: number;
  standard_type: string | null;
  standard_value: number | null;
  standard_units: string | null;
}
