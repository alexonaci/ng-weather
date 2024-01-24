import { Injectable, Signal, signal } from '@angular/core';
import { Observable, from, zip } from 'rxjs';

import { CurrentConditions } from './current-conditions/current-conditions.type';
import { ConditionsAndZip } from './conditions-and-zip.type';
import { Forecast } from './forecasts-list/forecast.type';
import { LocationService } from './location.service';
import { filter, tap } from 'rxjs/operators';
import { LOCATIONS, Operation } from './location.type';
import { CachedResources } from './app.module';
import { Resource } from './cache-system/cache.config';
import { DataQueryService } from './cache-system/data-query.service';
import { DataStoreService } from './cache-system/data-store.service';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  static URL = 'https://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL =
    'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  private currentConditions = signal<ConditionsAndZip[]>([]);

  constructor(
    private dataQueryService: DataQueryService<Resource<CachedResources>>,
    private locationService: LocationService,
    private dataStoreService: DataStoreService<Resource<CachedResources>>,
  ) {
    this.listenToLocationChanges();
    this.listenToLocationOperations();
  }

  addCurrentConditions(zipcode: string): void {
    const queryUrl = `${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`;
    this.dataQueryService.query<CurrentConditions>('currentConditions', zipcode, queryUrl).subscribe({
      next: (data) => {
        this.addToStateAndStorage(zipcode, data);
      },
      error: () => {
        this.locationService.removeLocation(zipcode);
      },
    });
  }

  removeCurrentConditions(zipcode: string) {
    this.currentConditions.update((conditions) => {
      return conditions.filter((condition) => condition.zip !== zipcode);
    });
    const locations = this.dataStoreService.getFromStorage<string[]>(LOCATIONS);
    this.updateStorage(locations.filter((loc) => loc !== zipcode));
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }

  getForecast(zipcode: string): Observable<Forecast> {
    const queryUrl = `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`;
    return from(this.dataQueryService.query<Forecast>('forecast', zipcode, queryUrl));
  }

  getWeatherIcon(id: number): string {
    if (id >= 200 && id <= 232) return WeatherService.ICON_URL + 'art_storm.png';
    else if (id >= 501 && id <= 511) return WeatherService.ICON_URL + 'art_rain.png';
    else if (id === 500 || (id >= 520 && id <= 531)) return WeatherService.ICON_URL + 'art_light_rain.png';
    else if (id >= 600 && id <= 622) return WeatherService.ICON_URL + 'art_snow.png';
    else if (id >= 801 && id <= 804) return WeatherService.ICON_URL + 'art_clouds.png';
    else if (id === 741 || id === 761) return WeatherService.ICON_URL + 'art_fog.png';
    else return WeatherService.ICON_URL + 'art_clear.png';
  }

  private addToStateAndStorage(zipcode: string, data: CurrentConditions) {
    const locations = this.dataStoreService.getFromStorage<string[]>(LOCATIONS);
    const existingLocations = locations ?? [];
    this.updateStorage([...existingLocations, zipcode]);
    this.currentConditions.update((conditions) => [...conditions, { zip: zipcode, data }]);
  }

  private listenToLocationOperations(): void {
    this.locationService
      .operationChanges()
      .pipe(
        tap((update) => {
          const locationAlreadyPresent = this.currentConditions().some((condition) => condition.zip === update.zipcode);
          if (locationAlreadyPresent) {
            return;
          }
          if (update.operation === Operation.ADD) {
            this.addCurrentConditions(update.zipcode);
          } else {
            this.removeCurrentConditions(update.zipcode);
          }
        }),
      )
      .subscribe();
  }

  private listenToLocationChanges(): void {
    this.locationService
      .locationChanges()
      .pipe(
        filter((locations) => Boolean(locations) && locations?.length > 0),
        tap((locations) => {
          locations.forEach((zipcode) => {
            const locationRendered = this.currentConditions().some((item) => item.zip === zipcode);
            if (locationRendered) {
              return;
            }
            this.addCurrentConditions(zipcode);
          });
        }),
      )
      .subscribe();
  }

  private updateStorage(updatedLocations: string[]): void {
    const locationsList = Array.from(new Set(updatedLocations));
    this.dataStoreService.updateStorage(LOCATIONS, locationsList);
  }
}
