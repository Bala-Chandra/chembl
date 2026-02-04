export type SearchCategory =
  | 'structure'
  | 'target'
  | 'reference'
  | 'assay';

export interface AutocompleteItem {
  label: string;
  value: string;
}

export interface SearchCounts {
  structures: number;
  documents: number;
  assays: number;
  activities: number;
}
