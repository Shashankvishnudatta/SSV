import { useState } from 'react';
import { api } from '../lib/api';
import type { Generation } from '../types';
export function useGenerate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentGeneration, setCurrentGeneration] = useState<Generation | null>(null);

  const generate = async (promptToSubmit: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.generateWebsite(promptToSubmit);
      const newGen: Generation = {
        ...result,
        prompt: promptToSubmit,
      };
      setCurrentGeneration(newGen);
      return newGen;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    generate,
    loading,
    error,
    currentGeneration,
    setCurrentGeneration,
  };
}