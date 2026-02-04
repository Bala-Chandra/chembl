import { useEffect, useRef, useState } from 'react';
import type { AutocompleteItem, SearchCategory } from '../types/search';
import { fetchAutocomplete } from '../api/searchApi';

export interface AutocompleteInputProps {
  category: SearchCategory;
  onSelect: (item: AutocompleteItem) => void;
}

export default function AutocompleteInput({
  category,
  onSelect,
}: AutocompleteInputProps) {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<AutocompleteItem[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (query.length < 3) {
      return;
    }

    const timeoutId = setTimeout(async () => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      const res = await fetchAutocomplete(
        category,
        query,
        abortRef.current.signal
      );

      setItems(res.data);
    }, 350);

    return () => {
      clearTimeout(timeoutId);
      abortRef.current?.abort();
    };
  }, [query, category]);

  return (
    <div style={{ position: 'relative' }}>
      <input
        value={query}
        placeholder={`Search ${category} (min 3 chars)`}
        onChange={e => setQuery(e.target.value)}
      />

      {items.length > 0 && (
        <ul className="dropdown">
          {items.map(item => (
            <li
              key={item.value}
              onClick={() => {
                setQuery(item.label);
                setItems([]);
                onSelect(item);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
