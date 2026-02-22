import { useState, useCallback, useRef } from 'react';
import { OwnerService, SearchOwnerResult } from '../services/owner.service';

export const useSearch = () => {
  const [results, setResults] = useState<SearchOwnerResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  const searchOwners = useCallback((query: string) => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        const owners = await OwnerService.searchOwners(query);
        setResults(owners);
      } catch (e) {
        console.error("Search hook error:", e);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, []);

  return { results, isLoading, searchOwners };
};