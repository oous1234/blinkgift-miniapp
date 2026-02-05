import { useState, useCallback, useRef } from 'react';
import { OwnerService } from '../services/owner.service';
import { UserProfile } from '../types/domain';

export const useSearch = () => {
  const [results, setResults] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  const searchOwners = useCallback((query: string) => {
    if (query.length < 2) {
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
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, []);

  return { results, isLoading, searchOwners };
};