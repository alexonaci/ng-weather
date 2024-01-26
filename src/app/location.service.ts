import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { LocationUpdate, LOCATIONS, Operation } from './location.type';
import { DataStoreService } from './cache-system/data-store.service';
import { NgWeather } from './app.module';
import { Resource } from './cache-system/cache.config';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private locations$ = new BehaviorSubject<string[]>(this.loadInitialLocations());
  private changeNotifier$ = new Subject<LocationUpdate>();

  constructor(private dataStoreService: DataStoreService<Resource<NgWeather>>) {}

  locationChanges(): Observable<string[]> {
    return this.locations$.asObservable();
  }

  operationChanges(): Observable<LocationUpdate> {
    return this.changeNotifier$.asObservable();
  }

  addLocation(zipcode: string): void {
    this.changeNotifier$.next({ zipcode, operation: Operation.ADD });
  }

  removeLocation(zipcode: string): void {
    this.changeNotifier$.next({ zipcode, operation: Operation.DELETE });
  }

  private loadInitialLocations(): string[] {
    const locations = this.dataStoreService.getFromStorage<string[]>(LOCATIONS);
    return locations ?? [];
  }
}
