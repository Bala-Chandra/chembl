import AsyncSelect from 'react-select/async';
import type { SingleValue } from 'react-select';
import type { AutocompleteItem, SearchCategory } from '../types/search';
import { fetchAutocomplete } from '../api/searchApi';

interface Props {
  category: SearchCategory;
  onSelect: (item: AutocompleteItem) => void;
}

export default function AutocompleteInput({ category, onSelect }: Props) {
  /**
   * This function is called automatically by react-select
   * whenever inputValue changes.
   */
  const loadOptions = async (
    inputValue: string
  ): Promise<AutocompleteItem[]> => {
    if (inputValue.length < 3) {
      return [];
    }

    const res = await fetchAutocomplete(category, inputValue);
    return res.data;
  };

  const handleChange = (
    option: SingleValue<AutocompleteItem>
  ) => {
    if (option) {
      onSelect(option);
    }
  };

  return (
    <AsyncSelect
      key={category}               // 🔑 CRITICAL: reset when category changes
      cacheOptions
      defaultOptions={false}
      loadOptions={loadOptions}
      onChange={handleChange}
      isClearable

      placeholder={`Search ${category} (min 3 chars)`}

      noOptionsMessage={({ inputValue }) =>
        inputValue.length < 3
          ? 'Type at least 3 characters'
          : 'No matches found'
      }

      styles={{
        container: base => ({
          ...base,
          width: 420,
        }),
        control: base => ({
          ...base,
          minHeight: 42,
          borderRadius: 8,
        }),
        menu: base => ({
          ...base,
          zIndex: 50,
        }),
      }}
    />
  );
}
