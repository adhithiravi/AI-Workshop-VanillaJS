/**
 * usePies Hook - React hook for pie data management
 * Converts fetchPies and fetchMonthly functions to React hooks
 */

import { useState, useEffect, useCallback } from 'react';
import { Pie, UsePiesReturn } from '../types/pie';
import { pieService } from '../services/pieService';

export const usePies = (category?: string): UsePiesReturn => {
  const [pies, setPies] = useState<Pie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPies = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await pieService.getPies(category);
      setPies(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch pies';
      setError(errorMessage);
      console.error('Error fetching pies:', err);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchPies();
  }, [fetchPies]);

  return {
    pies,
    loading,
    error,
    refetch: fetchPies
  };
};

export const useMonthlyPies = (): UsePiesReturn => {
  const [pies, setPies] = useState<Pie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMonthlyPies = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await pieService.getMonthlyPies();
      setPies(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch monthly pies';
      setError(errorMessage);
      console.error('Error fetching monthly pies:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonthlyPies();
  }, [fetchMonthlyPies]);

  return {
    pies,
    loading,
    error,
    refetch: fetchMonthlyPies
  };
};

export const useSearchPies = (query: string, category?: string): UsePiesReturn => {
  const [pies, setPies] = useState<Pie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPies = useCallback(async () => {
    if (!query.trim()) {
      setPies([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await pieService.searchPies(query, category);
      setPies(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search pies';
      setError(errorMessage);
      console.error('Error searching pies:', err);
    } finally {
      setLoading(false);
    }
  }, [query, category]);

  useEffect(() => {
    searchPies();
  }, [searchPies]);

  return {
    pies,
    loading,
    error,
    refetch: searchPies
  };
};
