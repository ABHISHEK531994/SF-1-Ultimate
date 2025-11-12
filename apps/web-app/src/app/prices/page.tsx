'use client';

import { useState } from 'react';
import { Search, TrendingDown, TrendingUp, ExternalLink, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';

interface PriceData {
  strainName: string;
  seedbank: string;
  price: number;
  currency: string;
  seedCount: number;
  url: string;
  inStock: boolean;
}

export default function PricesPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PriceData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'seedbank'>('price');

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/prices/search?q=${encodeURIComponent(query)}`);
      setResults(response.prices || []);
    } catch (error) {
      console.error('Price search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === 'price') {
      const priceA = a.price / a.seedCount;
      const priceB = b.price / b.seedCount;
      return priceA - priceB;
    }
    return a.seedbank.localeCompare(b.seedbank);
  });

  const cheapest = sortedResults[0];
  const mostExpensive = sortedResults[sortedResults.length - 1];

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block icon-emboss p-8 rounded-2xl mb-5 bg-gradient-to-br from-green-500 to-emerald-500">
            <Search className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-6xl font-black text-cannabis mb-3">Preisvergleich</h1>
          <p className="text-2xl text-emerald-200 font-bold">
            Finde die besten Preise für deine Lieblings-Strains
          </p>
        </div>

        {/* Search */}
        <div className="neo-deep rounded-2xl p-8 mb-8">
          <div className="flex gap-4">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Suche nach Strain... (z.B. 'Northern Lights')"
              className="flex-1 input-inset rounded-xl px-6 py-4 text-white text-xl"
              disabled={isLoading}
            />
            <button
              onClick={handleSearch}
              disabled={!query.trim() || isLoading}
              className="bubble-soft px-10 py-4 rounded-xl font-black text-white text-xl"
            >
              {isLoading ? 'Suche...' : 'Suchen'}
            </button>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="neo-deep rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-cannabis mb-2">
                  {results.length}
                </div>
                <div className="text-lg text-emerald-200 font-bold">Angebote gefunden</div>
              </div>
              {cheapest && (
                <div className="neo-deep rounded-2xl p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingDown className="w-6 h-6 text-green-400" />
                    <div className="text-4xl font-black text-green-400">
                      €{(cheapest.price / cheapest.seedCount).toFixed(2)}
                    </div>
                  </div>
                  <div className="text-lg text-emerald-200 font-bold">Günstigster Preis/Seed</div>
                </div>
              )}
              {mostExpensive && (
                <div className="neo-deep rounded-2xl p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="w-6 h-6 text-red-400" />
                    <div className="text-4xl font-black text-red-400">
                      €{(mostExpensive.price / mostExpensive.seedCount).toFixed(2)}
                    </div>
                  </div>
                  <div className="text-lg text-emerald-200 font-bold">Teuerster Preis/Seed</div>
                </div>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-cannabis">Alle Angebote</h3>
              <div className="flex gap-3">
                <Button
                  variant={sortBy === 'price' ? 'default' : 'outline'}
                  onClick={() => setSortBy('price')}
                  className="font-bold"
                >
                  Nach Preis
                </Button>
                <Button
                  variant={sortBy === 'seedbank' ? 'default' : 'outline'}
                  onClick={() => setSortBy('seedbank')}
                  className="font-bold"
                >
                  Nach Seedbank
                </Button>
              </div>
            </div>

            {/* Price Cards */}
            <div className="space-y-4">
              {sortedResults.map((price, index) => (
                <div key={index} className="neo-deep rounded-2xl p-6 hover:scale-105 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-2xl font-black text-cannabis mb-2">{price.seedbank}</h4>
                      <p className="text-lg text-emerald-100 font-medium mb-2">
                        {price.strainName}
                      </p>
                      <div className="flex items-center gap-4">
                        <span className="badge-3d px-4 py-1 text-base text-white font-bold">
                          {price.seedCount} Seeds
                        </span>
                        {price.inStock ? (
                          <span className="text-green-400 font-bold">✓ Verfügbar</span>
                        ) : (
                          <span className="text-red-400 font-bold">✗ Ausverkauft</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-5xl font-black text-cannabis mb-2">
                        €{price.price.toFixed(2)}
                      </div>
                      <div className="text-lg text-emerald-200 font-bold mb-3">
                        €{(price.price / price.seedCount).toFixed(2)}/Seed
                      </div>
                      <a
                        href={price.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bubble-soft px-6 py-3 rounded-xl font-bold text-white"
                      >
                        Zum Shop
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && results.length === 0 && query && (
          <div className="neo-deep rounded-2xl p-12 text-center">
            <Search className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-white mb-2">Keine Ergebnisse</h3>
            <p className="text-lg text-emerald-200 font-medium">
              Versuche es mit einem anderen Strain-Namen
            </p>
          </div>
        )}

        {/* Initial State */}
        {results.length === 0 && !query && (
          <div className="neo-deep rounded-2xl p-12 text-center">
            <Search className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-white mb-2">Starte deine Suche</h3>
            <p className="text-lg text-emerald-200 font-medium">
              Gib einen Strain-Namen ein, um Preise zu vergleichen
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
