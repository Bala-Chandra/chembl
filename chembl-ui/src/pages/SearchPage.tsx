import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AutocompleteInput from '../components/AutocompleteInput';
import SearchCategorySelect from '../components/SearchCategorySelect';
import SearchCounts from '../components/SearchCounts';
import type { SearchCategory, SearchCounts as Counts, AutocompleteItem } from '../types/search';
import { fetchCounts } from '../api/searchApi';

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

  const enableSearch =
    counts && Object.values(counts).some(v => v > 0);

  return (
    <div className="search-page">
      <h2>ChEMBL Search</h2>

      <SearchCategorySelect
        value={category}
        onChange={v => {
          setCategory(v);
          setCounts(null);
          setSelectedValue(null);
        }}
      />

      <AutocompleteInput
        category={category}
        onSelect={onSelect}
      />

      {counts && <SearchCounts counts={counts} />}

      <button
        disabled={!enableSearch}
        onClick={() =>
          navigate('/results', {
            state: { category, value: selectedValue },
          })
        }
      >
        Search
      </button>
    </div>
  );
}
