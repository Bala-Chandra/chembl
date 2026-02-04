import { useEffect, useRef, useState } from 'react';
import type { AutocompleteItem, SearchCategory } from '../types/search';
import { fetchAutocomplete } from '../api/searchApi';

interface Props {
  category: SearchCategory;
  onSelect: (item: AutocompleteItem) => void;
}

export default function AutocompleteInput({ category, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<AutocompleteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const abortRef = useRef<AbortController | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // ------------------------------------------------------------
  // Fetch autocomplete (debounced via setTimeout)
  // ------------------------------------------------------------
  useEffect(() => {
    if (query.length < 3) {
      setItems([]);
      setOpen(false);
      return;
    }

    setLoading(true);

    const timeoutId = setTimeout(async () => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      try {
        const res = await fetchAutocomplete(
          category,
          query,
          abortRef.current.signal
        );

        setItems(res.data);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      abortRef.current?.abort();
    };
  }, [query, category]);

  // ------------------------------------------------------------
  // Close dropdown on outside click
  // ------------------------------------------------------------
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // ------------------------------------------------------------
  // Keyboard navigation
  // ------------------------------------------------------------
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex(i => Math.min(i + 1, items.length - 1));
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex(i => Math.max(i - 1, 0));
    }

    if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault();
      selectItem(items[highlightIndex]);
    }

    if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const selectItem = (item: AutocompleteItem) => {
    setQuery(item.label);
    setOpen(false);
    setHighlightIndex(-1);
    onSelect(item);
  };

  // ------------------------------------------------------------
  // Highlight matching text
  // ------------------------------------------------------------
  const renderLabel = (label: string) => {
    const idx = label.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return label;

    return (
      <>
        {label.slice(0, idx)}
        <strong>{label.slice(idx, idx + query.length)}</strong>
        {label.slice(idx + query.length)}
      </>
    );
  };

  return (
    <div ref={wrapperRef} className="autocomplete">
      <input
        value={query}
        placeholder={`Search ${category} (min 3 chars)`}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => items.length > 0 && setOpen(true)}
        onKeyDown={onKeyDown}
      />

      {loading && <div className="hint">Searching…</div>}

      {!loading && query.length > 0 && query.length < 3 && (
        <div className="hint">Type at least 3 characters</div>
      )}

      {open && (
        <ul className="dropdown">
          {items.length === 0 && !loading && (
            <li className="empty">No matches found</li>
          )}

          {items.map((item, i) => (
            <li
              key={item.value}
              className={i === highlightIndex ? 'active' : ''}
              onMouseEnter={() => setHighlightIndex(i)}
              onMouseDown={() => selectItem(item)} // prevents blur bug
            >
              {renderLabel(item.label)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
