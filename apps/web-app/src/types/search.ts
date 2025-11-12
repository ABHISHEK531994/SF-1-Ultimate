export interface SearchResult {
  id: string;
  type: 'STRAIN' | 'THREAD' | 'GROW' | 'USER';
  title: string;
  description?: string;
  imageUrl?: string;
  url: string;
  metadata?: Record<string, any>;
  score: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  took: number;
  facets?: Record<string, any>;
}

export interface SearchFilters {
  type?: string[];
  category?: string[];
  dateRange?: {
    from?: string;
    to?: string;
  };
}
