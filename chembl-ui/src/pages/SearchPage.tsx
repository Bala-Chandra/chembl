import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AutocompleteInput from '../components/AutocompleteInput';
import SearchCategorySelect from '../components/SearchCategorySelect';
import SearchCounts from '../components/SearchCounts';
import type {
  SearchCategory,
  SearchCounts as Counts,
  AutocompleteItem,
} from '../types/search';
import {
  fetchCounts,
  createSearchSession,
  fetchDefaultCounts,
} from '../api/searchApi';
import styles from './SearchPage.module.css';
import { useSearch } from '../search/useSearch';

export default function SearchPage() {
  const [category, setCategory] = useState<SearchCategory>('structure');
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [countsLocal, setCountsLocal] = useState<Counts | null>(null);

  const { setCounts } = useSearch(); // ✅ hook at top
  const navigate = useNavigate();

  useEffect(() => {
    fetchDefaultCounts()
      .then(res => {
        setCountsLocal(res.data);
        setCounts(res.data);
      })
      .catch(() => {
        setCountsLocal(null);
        setCounts(null);
      });
  }, [setCounts]);

  const onSelect = async (item: AutocompleteItem) => {
    setSelectedValue(item.value);

    const res = await fetchCounts(category, item.value);

    setCountsLocal(res.data);
    setCounts(res.data);
  };

  const onSearch = async () => {
    if (!selectedValue) return;

    await createSearchSession(category, selectedValue);
    navigate('/results');
  };

  const enableSearch = Boolean(selectedValue);

  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        <SearchCategorySelect
          value={category}
          onChange={v => {
            setCategory(v);
            setSelectedValue(null);
            setCountsLocal(null);
            setCounts(null);
          }}
        />

        <AutocompleteInput
          category={category}
          onSelect={onSelect}
        />

        <button
          className={styles.searchBtn}
          disabled={!enableSearch}
          onClick={onSearch}
        >
          🔍 Search
        </button>
      </div>

      {countsLocal && <SearchCounts counts={countsLocal} />}
    </div>
  );
}