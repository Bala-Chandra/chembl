import type { SearchCounts as Counts } from '../types/search';
import styles from './SearchCounts.module.css';

interface Props {
  counts: Counts;
}

export default function SearchCounts({ counts }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <span className={styles.label}>Structures</span>
        <span className={styles.value}>
          {counts.structures.toLocaleString()}
        </span>
      </div>

      <div className={styles.item}>
        <span className={styles.label}>Documents</span>
        <span className={styles.value}>
          {counts.documents.toLocaleString()}
        </span>
      </div>

      <div className={styles.item}>
        <span className={styles.label}>Assays</span>
        <span className={styles.value}>
          {counts.assays.toLocaleString()}
        </span>
      </div>

      <div className={styles.item}>
        <span className={styles.label}>Activities</span>
        <span className={styles.value}>
          {counts.activities.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
