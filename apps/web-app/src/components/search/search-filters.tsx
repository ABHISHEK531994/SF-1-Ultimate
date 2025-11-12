'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SearchFilters as SearchFiltersType } from '@/types/search';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  facets?: Record<string, any>;
  onChange: (filters: SearchFiltersType) => void;
}

export function SearchFilters({ filters, facets, onChange }: SearchFiltersProps) {
  const [localFilters, setLocalFilters] = useState<SearchFiltersType>(filters);

  const handleTypeToggle = (type: string) => {
    const current = localFilters.type || [];
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    
    const newFilters = { ...localFilters, type: updated };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handleCategoryToggle = (category: string) => {
    const current = localFilters.category || [];
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    
    const newFilters = { ...localFilters, category: updated };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handleClearAll = () => {
    const newFilters: SearchFiltersType = {};
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const hasActiveFilters = 
    (localFilters.type?.length || 0) > 0 ||
    (localFilters.category?.length || 0) > 0 ||
    !!localFilters.dateRange?.from ||
    !!localFilters.dateRange?.to;

  const types = [
    { value: 'STRAIN', label: 'Strains', count: facets?.types?.STRAIN || 0 },
    { value: 'THREAD', label: 'Forum-Threads', count: facets?.types?.THREAD || 0 },
    { value: 'GROW', label: 'Grow-Tagebücher', count: facets?.types?.GROW || 0 },
    { value: 'USER', label: 'User', count: facets?.types?.USER || 0 },
  ];

  const categories = [
    { value: 'indica', label: 'Indica' },
    { value: 'sativa', label: 'Sativa' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'cbd', label: 'CBD-Reich' },
    { value: 'autoflower', label: 'Autoflower' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filter</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
          >
            Alle löschen
          </Button>
        )}
      </div>

      {/* Type Filter */}
      <div>
        <h4 className="mb-3 text-sm font-medium">Typ</h4>
        <div className="space-y-2">
          {types.map((type) => (
            <label
              key={type.value}
              className="flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-accent"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={localFilters.type?.includes(type.value) || false}
                  onChange={() => handleTypeToggle(type.value)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm">{type.label}</span>
              </div>
              {type.count > 0 && (
                <span className="text-xs text-muted-foreground">
                  {type.count.toLocaleString()}
                </span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Category Filter (nur für Strains) */}
      {(localFilters.type?.includes('STRAIN') || !localFilters.type?.length) && (
        <div>
          <h4 className="mb-3 text-sm font-medium">Kategorie</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category.value}
                className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-accent"
              >
                <input
                  type="checkbox"
                  checked={localFilters.category?.includes(category.value) || false}
                  onChange={() => handleCategoryToggle(category.value)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm">{category.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters */}
      {hasActiveFilters && (
        <div>
          <h4 className="mb-3 text-sm font-medium">Aktive Filter</h4>
          <div className="flex flex-wrap gap-2">
            {localFilters.type?.map((type) => (
              <button
                key={type}
                onClick={() => handleTypeToggle(type)}
                className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground hover:bg-primary/90"
              >
                <span>{types.find(t => t.value === type)?.label}</span>
                <X className="h-3 w-3" />
              </button>
            ))}
            {localFilters.category?.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryToggle(category)}
                className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground hover:bg-primary/90"
              >
                <span>{categories.find(c => c.value === category)?.label}</span>
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
