import type { SearchCounts } from '../types/search';

export default function SearchCounts({ counts }: { counts: SearchCounts }) {
  return (
    <div className="counts">
      <span>Structures: {counts.structures}</span>
      <span>Documents: {counts.documents}</span>
      <span>Assays: {counts.assays}</span>
      <span>Activities: {counts.activities}</span>
    </div>
  );
}
