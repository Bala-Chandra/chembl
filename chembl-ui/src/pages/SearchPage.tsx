import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AutocompleteInput from '../components/AutocompleteInput';
import SearchCategorySelect from '../components/SearchCategorySelect';
import SearchCounts from '../components/SearchCounts';
import type {
  SearchCategory,
  SearchCounts as Counts,
  AutocompleteItem,
} from '../types/search';
import { fetchCounts, createSearchSession } from '../api/searchApi';
import styles from './SearchPage.module.css';

export default function SearchPage() {
  const [category, setCategory] = useState<SearchCategory>('structure');
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [counts, setCounts] = useState<Counts | null>(null);

  const navigate = useNavigate();

  const onSelect = async (item: AutocompleteItem) => {
    setSelectedValue(item.value);

    const res = await fetchCounts(category, item.value);
    setCounts(res.data);
  };

  const onSearch = async () => {
    if (!selectedValue) return;

    await createSearchSession(selectedValue);
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

      {counts && <SearchCounts counts={counts} />}
    </div>
  );
}
