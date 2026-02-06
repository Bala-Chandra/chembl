// src/types/rows/assay-row.type.ts

export interface AssayRow {
  assay_id: number;
  assay_type: string | null;
  assay_category: string | null;
  description: string | null;
}
