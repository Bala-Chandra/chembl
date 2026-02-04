import type { SearchCategory } from '../types/search';

interface Props {
  value: SearchCategory;
  onChange: (v: SearchCategory) => void;
}

const categories: SearchCategory[] = [
  'structure',
  'target',
  'reference',
  'assay',
];

export default function SearchCategorySelect({ value, onChange }: Props) {
  return (
    <select value={value} onChange={e => onChange(e.target.value as SearchCategory)}>
      {categories.map(c => (
        <option key={c} value={c}>
          {c.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
