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
        ts.canonical_smiles
      FROM temp_structures ts
      LEFT JOIN compound_properties cp
        ON ts.molregno = cp.molregno
      ORDER BY ts.chembl_id
      LIMIT $1 OFFSET $2;
    `;

    const result = await client.query<StructureRow>(sql, [pageSize, offset]);

    return result.rows;
  }

  // ------------------------------------------------------------------
  // DOCUMENTS
  // ------------------------------------------------------------------
  async getDocuments(sessionId: string, page = 1, pageSize = 25) {
    const client = this.searchService.getSessionClient(sessionId);
    const offset = (page - 1) * pageSize;

    const sql = `
      SELECT
        d.doc_id,
        d.pubmed_id,
        d.journal,
        d.year,
        d.volume,
        d.issue,
        d.first_page,
        d.last_page,
        d.doi
      FROM temp_documents d
      ORDER BY d.year DESC
      LIMIT $1 OFFSET $2;
    `;

    return (await client.query<DocumentRow>(sql, [pageSize, offset])).rows;
  }

  // ------------------------------------------------------------------
  // ASSAYS
  // ------------------------------------------------------------------
  async getAssays(sessionId: string, page = 1, pageSize = 25) {
    const client = this.searchService.getSessionClient(sessionId);
    const offset = (page - 1) * pageSize;

    const sql = `
      SELECT
        a.assay_id,
        a.assay_type,
        a.description,
        a.assay_category,
        a.confidence_score,
        td.chembl_id AS target_chembl_id,
        td.pref_name AS target_name,
        a.organism,
        a.relationship_type,
        a.bao_format,
        ta.doc_id
      FROM temp_assays a
      LEFT JOIN target_assays ta ON a.assay_id = ta.assay_id
      LEFT JOIN target_dictionary td ON ta.tid = td.tid
      ORDER BY a.assay_id
      LIMIT $1 OFFSET $2;
    `;

    return (await client.query<AssayRow>(sql, [pageSize, offset])).rows;
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
        ta.standard_relation,
        ta.standard_value,
        ta.standard_units,
        ta.pchembl_value,
        ta.data_validity_comment,
        ta.activity_comment,
        ta.bao_endpoint,
        ta.uo_units,
        ta.recorded_by
      FROM temp_activities ta
      JOIN temp_structures ts
        ON ta.molregno = ts.molregno
      ORDER BY ta.activity_id
      LIMIT $1 OFFSET $2;
    `;

    return (await client.query<ActivityRow>(sql, [pageSize, offset])).rows;
  }
}
