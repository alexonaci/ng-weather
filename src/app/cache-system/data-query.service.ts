import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataStoreService } from './data-store.service';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Resource } from './cache.config';

@Injectable({
  providedIn: 'root',
})
export class DataQueryService<R extends Resource<string>> {
  constructor(
    private http: HttpClient,
    private dataStoreService: DataStoreService<Resource<string>>,
  ) {}

  /*
   * Generic method for querying a resource.
   * If the data is found in cache, it returns it. If not it performs a network call.
   */
  query<T>(resourceName: R['name'], key: string, url: string): Observable<T> {
    const cacheKey = `${resourceName}_${key}`;
    const cachedData = this.dataStoreService.getFromCache<T>(cacheKey);

    if (cachedData) {
      return of(cachedData);
    }

    return this.fetchFromNetwork<T>(url).pipe(
      catchError((error) => throwError({ message: 'Error occured', error })),
      tap((data) => {
        this.dataStoreService.updateCache<T>(cacheKey, data);
      }),
    );
  }

  private fetchFromNetwork<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }
}
