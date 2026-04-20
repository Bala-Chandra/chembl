import { Injectable } from '@nestjs/common';
import { SearchService } from '../search/search.service';
import { StructureRow } from './types/structure-row.type';
import { DocumentRow } from './types/document-row.type';
import { AssayRow } from './types/assay-row.type';
import { ActivityRow } from './types/activity-row.type';

@Injectable()
export class ResultsService {
  constructor(private readonly searchService: SearchService) {}

  // ------------------------------------------------------------------
  // STRUCTURES (already done)
  // ------------------------------------------------------------------
  async getStructures(sessionId: string, page = 1, pageSize = 25) {
    const client = this.searchService.getSessionClient(sessionId);
    const offset = (page - 1) * pageSize;

    const sql = `
    SELECT
      ts.chembl_id,
      ts.pref_name,
      ts.max_phase,
      cp.mw_freebase        AS mw,
      cp.alogp,
      cp.psa,
      cp.hba,
      cp.hbd,
      cp.rtb,
      cp.num_ro5_violations,
      ts.canonical_smiles,
      COUNT(*) OVER() AS total_count   -- ✅ key addition
    FROM temp_structures ts
    LEFT JOIN compound_properties cp
      ON ts.molregno = cp.molregno
    ORDER BY ts.chembl_id
    LIMIT $1 OFFSET $2;
  `;

    const result = await client.query<StructureRow & { total_count: string }>(
      sql,
      [pageSize, offset],
    );

    const rows = result.rows;

    const total = rows.length > 0 ? Number(rows[0].total_count) : 0;

    return {
      rows,
      total,
    };
  }

  // ------------------------------------------------------------------
  // DOCUMENTS
  // ------------------------------------------------------------------
  async getDocuments(sessionId: string, page = 1, pageSize = 25) {
    const client = this.searchService.getSessionClient(sessionId);
    const offset = (page - 1) * pageSize;

    const sql = `
    SELECT
      d.doc_id
      , d.pubmed_id
      , d.journal
      , d.year
      , COUNT(*) OVER()::int AS total_count
    FROM temp_documents d
    ORDER BY d.year DESC NULLS LAST
    LIMIT $1 OFFSET $2;
  `;

    const result = await client.query<DocumentRow & { total_count: string }>(
      sql,
      [pageSize, offset],
    );

    const rows = result.rows;

    const total = rows.length > 0 ? Number(rows[0].total_count) : 0;

    return {
      rows,
      total,
    };
  }

  // ------------------------------------------------------------------
  // ASSAYS
  // ------------------------------------------------------------------
  async getAssays(sessionId: string, page = 1, pageSize = 25) {
    const client = this.searchService.getSessionClient(sessionId);
    const offset = (page - 1) * pageSize;

    const sql = `
    SELECT
      a.assay_id
    , a.assay_type
    , a.description
    , a.assay_category
    , td.chembl_id AS target_chembl_id
    , td.pref_name AS target_name
    , td.organism
    , ass.relationship_type
    , ass.bao_format
    , COUNT(*) OVER()::int AS total_count
    FROM temp_assays a
    LEFT JOIN assays ass
      ON a.assay_id = ass.assay_id
    LEFT JOIN target_dictionary td
      ON ass.tid = td.tid
    ORDER BY a.assay_id
    LIMIT $1 OFFSET $2;
  `;

    const result = await client.query<AssayRow & { total_count: number }>(sql, [
      pageSize,
      offset,
    ]);

    const rows = result.rows;
    const total = rows.length ? rows[0].total_count : 0;

    return { rows, total };
  }

  // ------------------------------------------------------------------
  // ACTIVITIES
  // ------------------------------------------------------------------
  async getActivities(sessionId: string, page = 1, pageSize = 25) {
    const client = this.searchService.getSessionClient(sessionId);
    const offset = (page - 1) * pageSize;

    const sql = `
      SELECT
        ta.activity_id,
        ts.chembl_id,
        ta.assay_id,
        ta.doc_id,
        ta.standard_type,
        ta.standard_value,
        ta.standard_units,
        COUNT(*) OVER()::int AS total_count
      FROM temp_activities ta
      JOIN temp_structures ts
        ON ta.molregno = ts.molregno
      ORDER BY ta.activity_id
      LIMIT $1 OFFSET $2;
    `;

    const result = await client.query<ActivityRow & { total_count: number }>(
      sql,
      [pageSize, offset],
    );

    const rows = result.rows;
    const total = rows.length ? rows[0].total_count : 0;

    return { rows, total };
  }
}
