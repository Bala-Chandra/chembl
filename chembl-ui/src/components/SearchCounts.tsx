interface Props {
  counts: {
    structures: number;
    documents: number;
    assays: number;
    activities: number;
  };
}

export default function SearchCounts({ counts }: Props) {
  return (
    <div className="counts-row">
      <Count label="Structures" value={counts.structures} />
      <Count label="Documents" value={counts.documents} />
      <Count label="Assays" value={counts.assays} />
      <Count label="Activities" value={counts.activities} />
    </div>
  );
}

function Count({ label, value }: { label: string; value: number }) {
  return (
    <div className="count-card">
      <div className="count-value">{value}</div>
      <div className="count-label">{label}</div>
    </div>
  );
}
