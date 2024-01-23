import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { LocationUpdate, LOCATIONS, Operation } from './location.type';
import { DataStoreService } from './cache-system/data-store.service';
import { CachedResources } from './app.module';
import { Resource } from './cache-system/cache.config';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private locations$ = new BehaviorSubject<string[]>(this.loadInitialLocations());
  private changeNotifier$ = new Subject<LocationUpdate>();

  constructor(private dataStoreService: DataStoreService<Resource<CachedResources>>) {}

  locationChanges(): Observable<string[]> {
    return this.locations$.asObservable();
  }

  operationChanges(): Observable<LocationUpdate> {
    return this.changeNotifier$.asObservable();
  }

  addLocation(zipcode: string): void {
    const locations = this.dataStoreService.getFromStorage<string[]>(LOCATIONS);
    const existingLocations = locations ?? [];
    this.changeNotifier$.next({ zipcode, operation: Operation.ADD });
    this.updateStorage([...existingLocations, zipcode]);
  }

  removeLocation(zipcode: string): void {
    const locations = this.dataStoreService.getFromStorage<string[]>(LOCATIONS);
    this.changeNotifier$.next({ zipcode, operation: Operation.DELETE });
    this.updateStorage(locations.filter((loc) => loc !== zipcode));
  }

  private updateStorage(updatedLocations: string[]): void {
    const locationsList = Array.from(new Set(updatedLocations));
    this.dataStoreService.updateStorage(LOCATIONS, locationsList);
  }

  private loadInitialLocations(): string[] {
    const locations = this.dataStoreService.getFromStorage<string[]>(LOCATIONS);
    return locations ?? [];
  }
}
