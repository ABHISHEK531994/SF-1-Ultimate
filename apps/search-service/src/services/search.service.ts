// /apps/search-service/src/services/search.service.ts
import { meiliClient, INDEXES } from '../config/meilisearch';
import { redis, CACHE_KEYS, CACHE_TTL } from '../config/redis';
import { logger } from '../utils/logger';

export interface SearchOptions {
  query: string;
  index: keyof typeof INDEXES;
  filters?: string;
  sort?: string[];
  limit?: number;
  offset?: number;
  attributesToRetrieve?: string[];
  attributesToHighlight?: string[];
}

export interface SearchResult<T = any> {
  hits: T[];
  totalHits: number;
  processingTimeMs: number;
  query: string;
  limit: number;
  offset: number;
  facetDistribution?: Record<string, Record<string, number>>;
}

export class SearchService {
  /**
   * Universal Search (alle Indexes)
   */
  async searchAll(query: string, options: {
    limit?: number;
    filters?: Record<string, string>;
  } = {}): Promise<{
    strains: SearchResult;
    threads: SearchResult;
    grows: SearchResult;
    users: SearchResult;
  }> {
    const limit = options.limit || 5;
    
    const [strains, threads, grows, users] = await Promise.all([
      this.search({ query, index: 'STRAINS', limit }),
      this.search({ query, index: 'THREADS', limit }),
      this.search({ query, index: 'GROWS', limit }),
      this.search({ query, index: 'USERS', limit })
    ]);
    
    return { strains, threads, grows, users };
  }
  
  /**
   * Search in spezifischem Index
   */
  async search<T = any>(options: SearchOptions): Promise<SearchResult<T>> {
    const {
      query,
      index,
      filters,
      sort,
      limit = 20,
      offset = 0,
      attributesToRetrieve,
      attributesToHighlight
    } = options;
    
    // Cache-Key
    const cacheKey = CACHE_KEYS.searchResults(
      `${index}:${query}:${filters}:${sort}:${limit}:${offset}`
    );
    
    // Cache-Check
    const cached = await redis.get(cacheKey);
    if (cached) {
      logger.debug(`[Search] Cache hit for: ${query}`);
      return JSON.parse(cached);
    }
    
    try {
      const indexName = INDEXES[index];
      const meiliIndex = meiliClient.index(indexName);
      
      const result = await meiliIndex.search(query, {
        filter: filters,
        sort,
        limit,
        offset,
        attributesToRetrieve,
        attributesToHighlight
      });
      
      const searchResult: SearchResult<T> = {
        hits: result.hits as T[],
        totalHits: result.estimatedTotalHits || 0,
        processingTimeMs: result.processingTimeMs,
        query,
        limit,
        offset,
        facetDistribution: result.facetDistribution
      };
      
      // In Cache speichern
      await redis.setex(
        cacheKey,
        CACHE_TTL.searchResults,
        JSON.stringify(searchResult)
      );
      
      logger.info(`[Search] Query: "${query}" in ${index} -> ${searchResult.totalHits} hits`);
      
      return searchResult;
      
    } catch (error) {
      logger.error('[Search] Error:', error);
      throw error;
    }
  }
  
  /**
   * Autocomplete / Suggestions
   */
  async suggest(query: string, index: keyof typeof INDEXES, limit = 5): Promise<string[]> {
    if (query.length < 2) return [];
    
    const result = await this.search({
      query,
      index,
      limit,
      attributesToRetrieve: ['name', 'title', 'username']
    });
    
    return result.hits.map((hit: any) => 
      hit.name || hit.title || hit.username
    );
  }
  
  /**
   * Faceted Search (mit Filtern)
   */
  async facetedSearch(options: SearchOptions & {
    facets?: string[];
  }): Promise<SearchResult & { facets: Record<string, Record<string, number>> }> {
    const { query, index, facets = [], ...restOptions } = options;
    
    const indexName = INDEXES[index];
    const meiliIndex = meiliClient.index(indexName);
    
    const result = await meiliIndex.search(query, {
      ...restOptions,
      facets
    });
    
    return {
      hits: result.hits,
      totalHits: result.estimatedTotalHits || 0,
      processingTimeMs: result.processingTimeMs,
      query,
      limit: options.limit || 20,
      offset: options.offset || 0,
      facets: result.facetDistribution || {}
    };
  }
  
  /**
   * Recent Searches tracken
   */
  async trackSearch(userId: string, query: string, index: string): Promise<void> {
    const key = CACHE_KEYS.recentSearches(userId);
    
    // Als sortiertes Set speichern (Score = Timestamp)
    await redis.zadd(key, Date.now(), JSON.stringify({ query, index }));
    
    // Nur letzte 20 behalten
    await redis.zremrangebyrank(key, 0, -21);
    
    // TTL setzen
    await redis.expire(key, CACHE_TTL.recentSearches);
    
    // Popularity-Counter
    await redis.zincrby(CACHE_KEYS.popularSearches, 1, query);
  }
  
  /**
   * Recent Searches abrufen
   */
  async getRecentSearches(userId: string, limit = 10): Promise<Array<{ query: string; index: string }>> {
    const key = CACHE_KEYS.recentSearches(userId);
    
    // Neueste zuerst
    const results = await redis.zrevrange(key, 0, limit - 1);
    
    return results.map(r => JSON.parse(r));
  }
  
  /**
   * Popular Searches
   */
  async getPopularSearches(limit = 10): Promise<Array<{ query: string; count: number }>> {
    const results = await redis.zrevrange(
      CACHE_KEYS.popularSearches,
      0,
      limit - 1,
      'WITHSCORES'
    );
    
    const searches: Array<{ query: string; count: number }> = [];
    
    for (let i = 0; i < results.length; i += 2) {
      searches.push({
        query: results[i],
        count: parseInt(results[i + 1])
      });
    }
    
    return searches;
  }
  
  /**
   * Clear Search History
   */
  async clearRecentSearches(userId: string): Promise<void> {
    await redis.del(CACHE_KEYS.recentSearches(userId));
  }
}

export const searchService = new SearchService();
