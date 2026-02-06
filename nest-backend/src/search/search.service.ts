import { Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { randomUUID } from 'crypto';
import type {
  AutocompleteItem,
  SearchCategory,
  SearchCounts,
} from './types/search.types';
/**
 * Returned to frontend to enable Search button
 */

/**
 * In-memory map:
 * sessionId → dedicated DB client (TEMP tables live here)
 */
type SearchSessionMap = Map<string, PoolClient>;

@Injectable()
export class SearchService {
  private readonly sessions: SearchSessionMap = new Map();

  constructor(private readonly pool: Pool) {}

  // ---------------------------------------------------------------------------
  // 1️⃣ COUNTS (stateless, cheap, safe)
  // ---------------------------------------------------------------------------
  async getDefaultCounts(): Promise<SearchCounts> {
    const sql = `
    SELECT
      (SELECT COUNT(*) FROM molecule_dictionary)::int AS structures,
      (SELECT COUNT(*) FROM docs)::int                AS documents,
      (SELECT COUNT(*) FROM assays)::int              AS assays,
      (SELECT COUNT(*) FROM activities)::int          AS activities;
  `;

    const result = await this.pool.query<SearchCounts>(sql);
    return result.rows[0];
  }

  async getCounts(
    category: SearchCategory,
    value: string,
  ): Promise<SearchCounts> {
    const whereClause = this.resolveActivityFilter(category);

    const sql = `
    SELECT
      COUNT(DISTINCT a.molregno)::int  AS structures,
      COUNT(DISTINCT a.doc_id)::int    AS documents,
      COUNT(DISTINCT a.assay_id)::int  AS assays,
      COUNT(a.activity_id)::int        AS activities
    FROM activities a
    WHERE ${whereClause};
  `;

    const result = await this.pool.query<SearchCounts>(sql, [value]);

    return result.rows[0];
  }

  // ---------------------------------------------------------------------------
  // 2️⃣ CREATE SEARCH SESSION (TEMP TABLE STRATEGY)
  // ---------------------------------------------------------------------------

  async createSearchSession(
    category: SearchCategory,
    value: string,
  ): Promise<{ sessionId: string }> {
    const client = await this.pool.connect();
    const sessionId = randomUUID();

    try {
      await client.query('BEGIN');

      // 1️⃣ TEMP ACTIVITIES (category-aware)
      const whereClause = this.resolveActivityFilter(category);

      await client.query(
        `
      CREATE TEMP TABLE temp_activities AS
      SELECT
        a.activity_id,
        a.molregno,
        a.assay_id,
        a.doc_id,
        a.standard_type,
        a.standard_value,
        a.standard_units
      FROM activities a
      WHERE ${whereClause};
    `,
        [value],
      );

      await client.query(`
      CREATE INDEX idx_temp_activities_molregno ON temp_activities (molregno);
      CREATE INDEX idx_temp_activities_assay_id ON temp_activities (assay_id);
      CREATE INDEX idx_temp_activities_doc_id   ON temp_activities (doc_id);
    `);

      // 2️⃣ TEMP STRUCTURES
      await client.query(`
      CREATE TEMP TABLE temp_structures AS
      SELECT DISTINCT
        md.molregno,
        md.chembl_id,
        md.pref_name,
        md.max_phase,
        cs.canonical_smiles
      FROM molecule_dictionary md
      JOIN compound_structures cs ON md.molregno = cs.molregno
      JOIN temp_activities ta     ON md.molregno = ta.molregno;
    `);

      // 3️⃣ TEMP DOCUMENTS
      await client.query(`
      CREATE TEMP TABLE temp_documents AS
      SELECT DISTINCT
        d.doc_id,
        d.pubmed_id,
        d.year,
        d.journal
      FROM docs d
      JOIN temp_activities ta ON d.doc_id = ta.doc_id;
    `);

      // 4️⃣ TEMP ASSAYS
      await client.query(`
      CREATE TEMP TABLE temp_assays AS
      SELECT DISTINCT
        ass.assay_id,
        ass.assay_type,
        ass.description,
        ass.assay_category
      FROM assays ass
      JOIN temp_activities ta ON ass.assay_id = ta.assay_id;
    `);

      await client.query('COMMIT');

      this.sessions.set(sessionId, client);
      setTimeout(() => this.closeSession(sessionId), 10 * 60 * 1000);

      return { sessionId };
    } catch (e) {
      await client.query('ROLLBACK');
      client.release();
      throw e;
    }
  }

  // ---------------------------------------------------------------------------
  // 3️⃣ SESSION ACCESS (used by ResultsService)
  // ---------------------------------------------------------------------------

  getSessionClient(sessionId: string): PoolClient {
    const client = this.sessions.get(sessionId);
    if (!client) {
      throw new Error('Invalid or expired search session');
    }
    return client;
  }

  // ---------------------------------------------------------------------------
  // 4️⃣ CLEANUP
  // ---------------------------------------------------------------------------

  closeSession(sessionId: string): void {
    const client = this.sessions.get(sessionId);
    if (client) {
      client.release();
      this.sessions.delete(sessionId);
    }
  }
  // ---------------------------------------------------------------------------
  // AUTOCOMPLETE (v1: structure only)
  // ---------------------------------------------------------------------------
  async autocompleteStructure(
    query: string,
    limit = 10,
  ): Promise<AutocompleteItem[]> {
    const sql = `
    SELECT
      chembl_id AS value,
      chembl_id AS label
    FROM molecule_dictionary
    WHERE chembl_id ILIKE $1
    ORDER BY chembl_id
    LIMIT $2;
  `;

    const result = await this.pool.query<AutocompleteItem>(sql, [
      `${query}%`,
      limit,
    ]);

    return result.rows;
  }

  async autocompleteTarget(
    query: string,
    limit = 10,
  ): Promise<AutocompleteItem[]> {
    const sql = `
    SELECT
      chembl_id AS value,
      pref_name AS label
    FROM target_dictionary
    WHERE pref_name ILIKE $1
    ORDER BY pref_name
    LIMIT $2;
  `;

    const result = await this.pool.query<AutocompleteItem>(sql, [
      `%${query}%`,
      limit,
    ]);

    return result.rows;
  }

  async autocompleteAssay(
    query: string,
    limit = 10,
  ): Promise<AutocompleteItem[]> {
    const sql = `
    SELECT
      assay_id::text AS value,
      description AS label
    FROM assays
    WHERE description ILIKE $1
    ORDER BY assay_id
    LIMIT $2;
  `;

    const result = await this.pool.query<AutocompleteItem>(sql, [
      `%${query}%`,
      limit,
    ]);

    return result.rows;
  }

  async autocompleteReference(
    query: string,
    limit = 10,
  ): Promise<AutocompleteItem[]> {
    const sql = `
    SELECT
      doc_id::text AS value,
      pubmed_id::text    AS label
    FROM docs
    WHERE pubmed_id::text ILIKE $1
    ORDER BY pubmed_id
    LIMIT $2;
  `;

    const result = await this.pool.query<AutocompleteItem>(sql, [
      `${query}%`,
      limit,
    ]);

    return result.rows;
  }

  private resolveActivityFilter(category: SearchCategory): string {
    switch (category) {
      case 'structure':
        return `a.molregno IN (
        SELECT molregno
        FROM molecule_dictionary
        WHERE chembl_id = $1
      )`;

      case 'target':
        return `a.assay_id IN (
      SELECT ass.assay_id
      FROM assays ass
      JOIN target_dictionary td
        ON ass.tid = td.tid
      WHERE td.chembl_id = $1
    )
  `;

      case 'assay':
        return `a.assay_id = $1::int`;

      case 'reference':
        return `a.doc_id = $1::int`;

      default:
        throw new Error('Unsupported category');
    }
  }
}
