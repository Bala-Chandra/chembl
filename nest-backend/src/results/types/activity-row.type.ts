export interface ActivityRow {
  activity_id: number;

  chembl_id: string; // molecule chembl_id
  assay_id: number;
  doc_id: number | null;

  standard_type: string | null; // IC50, Ki, EC50, etc.
  standard_relation: string | null; // =, <, >
  standard_value: number | null;
  standard_units: string | null;

  pchembl_value: number | null;

  data_validity_comment: string | null;
  activity_comment: string | null;

  bao_endpoint: string | null;
  uo_units: string | null;
  recorded_by: string | null;
}
