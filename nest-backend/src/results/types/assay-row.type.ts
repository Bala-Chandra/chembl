export interface AssayRow {
  assay_id: number;
  assay_type: string | null;
  description: string | null;
  assay_category: string | null;

  confidence_score: number | null;

  target_chembl_id: string | null;
  target_name: string | null;

  organism: string | null;
  relationship_type: string | null;
  bao_format: string | null;

  doc_id: number | null;
}
