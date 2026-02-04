import { Injectable } from '@nestjs/common';
import { SearchService } from '../search/search.service';

@Injectable()
export class ResultsService {
  constructor(private readonly searchService: SearchService) {}

  async getResults(
    type: 'structures' | 'documents' | 'assays' | 'activities',
    sessionId: string,
    page: number,
    pageSize: number,
  ) {
    const client = this.searchService.getSessionClient(sessionId);
    const offset = (page - 1) * pageSize;

    let sql: string;

    switch (type) {
      case 'structures':
        sql = `
          SELECT
            chembl_id,
            pref_name,
            canonical_smiles,
            max_phase
          FROM temp_structures
          ORDER BY chembl_id
          LIMIT $1 OFFSET $2;
        `;
        break;

      case 'documents':
        sql = `
          SELECT
            doc_id,
            pubmed_id,
            year
          FROM temp_documents
          ORDER BY year DESC NULLS LAST
          LIMIT $1 OFFSET $2;
        `;
        break;

      case 'assays':
        sql = `
          SELECT
            assay_id,
            assay_type,
            description
          FROM temp_assays
          ORDER BY assay_id
          LIMIT $1 OFFSET $2;
        `;
        break;

      case 'activities':
        sql = `
          SELECT
            activity_id,
            standard_type,
            standard_value,
            standard_units
          FROM temp_activities
          ORDER BY activity_id
          LIMIT $1 OFFSET $2;
        `;
        break;

      default:
        throw new Error('Invalid result type');
    }

    const result = await client.query(sql, [pageSize, offset]);

    return {
      rows: result.rows,
    };
  }
}
