'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, X, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchFilters } from '@/components/search/search-filters';
import { SearchResults } from '@/components/search/search-results';
import type { SearchResponse, SearchFilters as SearchFiltersType } from '@/types/search';

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'relevance' | 'date'>('relevance');

  // Perform search
  const performSearch = async (searchQuery: string, currentFilters: SearchFiltersType, currentPage: number) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams({
        q: searchQuery,
        page: currentPage.toString(),
        limit: '20',
        sort: sortBy,
      });

      // Add filters
      if (currentFilters.type?.length) {
        params.append('type', currentFilters.type.join(','));
      }
      if (currentFilters.category?.length) {
        params.append('category', currentFilters.category.join(','));
      }
      if (currentFilters.dateRange?.from) {
        params.append('dateFrom', currentFilters.dateRange.from);
      }
      if (currentFilters.dateRange?.to) {
        params.append('dateTo', currentFilters.dateRange.to);
      }

      const response = await apiClient.get(`/search?${params.toString()}`);
      setResults(response);
    } catch (error) {
      console.error('Search failed:', error);
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial search when query changes
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      setPage(1);
      performSearch(q, filters, 1);
    }
  }, [searchParams]);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  // Handle filter change
  const handleFilterChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters);
    setPage(1);
    performSearch(query, newFilters, 1);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    performSearch(query, filters, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle sort change
  const handleSortChange = (newSort: 'relevance' | 'date') => {
    setSortBy(newSort);
    setPage(1);
    performSearch(query, filters, 1);
  };

  const totalPages = results ? Math.ceil(results.total / 20) : 0;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Search Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Suche nach Strains, Threads, Grows, Usern..."
                className="pl-10 h-12 text-base"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <Button type="submit" size="lg" disabled={!query.trim()}>
              Suchen
            </Button>
            <Button
              type="button"
              variant={showFilters ? 'default' : 'outline'}
              size="lg"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-5 w-5" />
              Filter
            </Button>
          </form>

          {/* Results Info */}
          {results && (
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <div>
                <span className="font-medium text-foreground">{results.total.toLocaleString()}</span> Ergebnisse
                für <span className="font-medium text-foreground">"{results.query}"</span>
                <span className="ml-2">({results.took}ms)</span>
              </div>
              
              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <span>Sortieren:</span>
                <Button
                  variant={sortBy === 'relevance' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleSortChange('relevance')}
                >
                  Relevanz
                </Button>
                <Button
                  variant={sortBy === 'date' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleSortChange('date')}
                >
                  Datum
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto flex-1 px-6 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="w-64 flex-shrink-0">
              <SearchFilters
                filters={filters}
                facets={results?.facets}
                onChange={handleFilterChange}
              />
            </aside>
          )}

          {/* Results */}
          <main className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : results ? (
              <>
                <SearchResults results={results.results} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                    >
                      Zurück
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 7) {
                          pageNum = i + 1;
                        } else if (page <= 4) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 3) {
                          pageNum = totalPages - 6 + i;
                        } else {
                          pageNum = page - 3 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                    >
                      Weiter
                    </Button>
                  </div>
                )}
              </>
            ) : query ? (
              <div className="py-20 text-center">
                <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Keine Ergebnisse gefunden</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Versuche es mit anderen Suchbegriffen
                </p>
              </div>
            ) : (
              <div className="py-20 text-center">
                <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Starte deine Suche</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Suche nach Strains, Forum-Threads, Grow-Tagebüchern oder Usern
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
