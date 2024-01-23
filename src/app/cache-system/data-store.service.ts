import { Inject, Injectable } from '@angular/core';
import { CACHE_CONFIG, CacheConfig, Resource } from './cache.config';
import { CacheEntry } from './data-store.type';

@Injectable({
  providedIn: 'root',
})
export class DataStoreService<R extends Resource<string>> {
  constructor(@Inject(CACHE_CONFIG) private config: CacheConfig<string>) {}

  updateCache<T>(key: R['name'], data: T): void {
    const cacheEntry: CacheEntry<T> = { data: data, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(cacheEntry));
  }

  getFromCache<T>(key: R['name']): T | null {
    const cacheEntry: CacheEntry<T> = this.parsefromLocalStorage(key);
    if (!cacheEntry) {
      return null;
    }
    const configuredResource = this.config.resources.find((e) => key.includes(e.name));
    if (!configuredResource) {
      return null;
    }
    if (Date.now() - cacheEntry.timestamp < configuredResource.cacheTime) {
      return cacheEntry.data;
    }
    return null;
  }

  updateStorage<T>(key: R['name'], data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getFromStorage<T>(key: R['name']): T {
    return this.parsefromLocalStorage(key);
  }

  removeFromStorage(key: R['name']) {
    localStorage.removeItem(key);
  }

  /*
   * Added method for parsing the localstorage to handle the case
   * when the result of getItem can be null.
   */
  private parsefromLocalStorage<T>(key: string): T {
    const item = localStorage.getItem(key);
    const parsedItem = item ? JSON.parse(item) : null;
    return parsedItem;
  }
}
