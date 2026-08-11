export interface GenerateResponse {
  id: string;
  html: string;
  created_at: string;
}

export interface GenerationSummary {
  id: string;
  prompt: string;
  created_at: string;
}

export interface GenerationDetail {
  id: string;
  prompt: string;
  html: string;
  created_at: string;
}

export interface GenerateRequest {
  prompt: string;
}

export type Generation = GenerationDetail;