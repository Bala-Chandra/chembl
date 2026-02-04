import { Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { randomUUID } from 'crypto';
import type { AutocompleteItem } from './types/search.types';
/**
 * Returned to frontend to enable Search button
 */
export interface SearchCounts {
  structures: number;
  documents: number;
  assays: number;
  activities: number;
}

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

  async getCounts(chemblId: string): Promise<SearchCounts> {
    const sql = `
      SELECT
        COUNT(DISTINCT md.molregno)::int  AS structures,
        COUNT(DISTINCT d.doc_id)::int     AS documents,
        COUNT(DISTINCT a.assay_id)::int   AS assays,
        COUNT(a.activity_id)::int         AS activities
      FROM molecule_dictionary md
      LEFT JOIN activities a ON md.molregno = a.molregno
      LEFT JOIN docs d ON a.doc_id = d.doc_id
      WHERE md.chembl_id = $1;
    `;

    const result = await this.pool.query<SearchCounts>(sql, [chemblId]);

    return result.rows[0];
  }

  // ---------------------------------------------------------------------------
  // 2️⃣ CREATE SEARCH SESSION (TEMP TABLE STRATEGY)
  // ---------------------------------------------------------------------------

  async createSearchSession(chemblId: string): Promise<{ sessionId: string }> {
    const client = await this.pool.connect();
    const sessionId = randomUUID();

    try {
      await client.query('BEGIN');

      // ---- TEMP STRUCTURES (base molecule) -------------------------------
      await client.query(
        `
        CREATE TEMP TABLE temp_structures AS
        SELECT
          md.molregno,
          md.chembl_id,
          md.pref_name,
          md.max_phase,
          cs.canonical_smiles
        FROM molecule_dictionary md
        JOIN compound_structures cs
          ON md.molregno = cs.molregno
        WHERE md.chembl_id = $1;
        `,
        [chemblId],
      );

      await client.query(
        `CREATE INDEX idx_temp_structures_molregno ON temp_structures (molregno);`,
      );

      // ---- TEMP ACTIVITIES (hub table) -----------------------------------
      await client.query(`
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
        JOIN temp_structures ts
          ON a.molregno = ts.molregno;
      `);

      await client.query(
        `CREATE INDEX idx_temp_activities_assay_id ON temp_activities (assay_id);`,
      );
      await client.query(
        `CREATE INDEX idx_temp_activities_doc_id ON temp_activities (doc_id);`,
      );

      // ---- TEMP ASSAYS ----------------------------------------------------
      await client.query(`
        CREATE TEMP TABLE temp_assays AS
        SELECT DISTINCT
          ass.assay_id,
          ass.assay_type,
          ass.description
        FROM assays ass
        JOIN temp_activities ta
          ON ass.assay_id = ta.assay_id;
      `);

      // ---- TEMP DOCUMENTS -------------------------------------------------
      await client.query(`
        CREATE TEMP TABLE temp_documents AS
        SELECT DISTINCT
          d.doc_id,
          d.pubmed_id,
          d.year
        FROM docs d
        JOIN temp_activities ta
          ON d.doc_id = ta.doc_id;
      `);

      await client.query('COMMIT');

      // Store session
      this.sessions.set(sessionId, client);

      // Optional safety cleanup (10 min idle timeout)
      setTimeout(() => this.closeSession(sessionId), 10 * 60 * 1000);

      return { sessionId };
    } catch (error) {
      await client.query('ROLLBACK');
      client.release();
      throw error;
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
}
