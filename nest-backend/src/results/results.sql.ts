export const buildStructuresSql = () => `
SELECT
  md.chembl_id,
  md.pref_name,
  cs.canonical_smiles,
  md.max_phase
FROM molecule_dictionary md
JOIN compound_structures cs
  ON md.molregno = cs.molregno
WHERE md.chembl_id = $1
ORDER BY md.chembl_id
LIMIT $2 OFFSET $3;
`;

export const buildDocumentsSql = () => `
SELECT DISTINCT
  d.doc_id,
  d.pubmed_id,
  d.year
FROM activities a
JOIN docs d ON a.doc_id = d.doc_id
JOIN molecule_dictionary md ON a.molregno = md.molregno
WHERE md.chembl_id = $1
ORDER BY d.year DESC NULLS LAST
LIMIT $2 OFFSET $3;
`;

export const buildAssaysSql = () => `
SELECT DISTINCT
  ass.assay_id,
  ass.assay_type,
  ass.description
FROM activities a
JOIN assays ass ON a.assay_id = ass.assay_id
JOIN molecule_dictionary md ON a.molregno = md.molregno
WHERE md.chembl_id = $1
ORDER BY ass.assay_id
LIMIT $2 OFFSET $3;
`;

export const buildActivitiesSql = () => `
SELECT
  act.activity_id,
  act.standard_type,
  act.standard_value,
  act.standard_units
FROM activities act
JOIN molecule_dictionary md ON act.molregno = md.molregno
WHERE md.molecule_chembl_id = $1
ORDER BY act.activity_id
LIMIT $2 OFFSET $3;
`;
