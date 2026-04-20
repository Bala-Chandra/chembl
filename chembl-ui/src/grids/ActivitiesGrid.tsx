// src/grids/ActivitiesGrid.tsx
import ResultsGrid from './ResultsGrid';
import { ACTIVITIES_COLUMNS } from './columns/activities.columns';
import type { ActivityRow } from '../types/rows/activity-row.type';
import { fetchResults } from '../api/resultsApi';

export default function ActivitiesGrid() {

  return (
    <ResultsGrid<ActivityRow>
      columnDefs={ACTIVITIES_COLUMNS}
      storageKey="activities-grid"
      fetchData={(page, size) =>
        fetchResults('activities', page, size).then(res => res.data)
      }

    />
  );
}
