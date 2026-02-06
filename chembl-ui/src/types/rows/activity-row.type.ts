// src/types/rows/activity-row.type.ts

export interface ActivityRow {
  activity_id: number;
  molregno: number;
  assay_id: number;
  doc_id: number;
  standard_type: string | null;
  standard_value: string | null;
  standard_units: string | null;
}
