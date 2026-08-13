import type {
  GenerateRequest,
  GenerateResponse,
  GenerationSummary,
  GenerationDetail,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function generateWebsite(prompt: string): Promise<GenerateResponse> {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt } as GenerateRequest),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Generation failed with status: ${response.status}`);
  }

  return response.json();
}

export async function getGenerations(): Promise<GenerationSummary[]> {
  const response = await fetch(`${API_BASE_URL}/generations`);

  if (!response.ok) {
    throw new Error('Failed to fetch past generations.');
  }

  return response.json();
}

export async function getGenerationById(id: string): Promise<GenerationDetail> {
  const response = await fetch(`${API_BASE_URL}/generations/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch generation details for ID: ${id}`);
  }

  return response.json();
}

export const api = {
  generateWebsite,
  generateSite: generateWebsite,
  getGenerations,
  getGenerationById,
};