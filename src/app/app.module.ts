import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ZipcodeEntryComponent } from './zipcode-entry/zipcode-entry.component';
import { ForecastsListComponent } from './forecasts-list/forecasts-list.component';
import { CurrentConditionsComponent } from './current-conditions/current-conditions.component';
import { MainPageComponent } from './main-page/main-page.component';
import { RouterModule } from '@angular/router';
import { routing } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CACHE_CONFIG, CacheConfig } from './cache-system/cache.config';
import { TabsComponent } from './tabs/tabs.component';

/*
 * Cache configured trough value provider.
 */
const TWO_HOURS = 2 * 60 * 60 * 1000; // 2 hours * 60 minutes/hour * 60 seconds/minute * 1000 milliseconds/second
const cacheConfig: CacheConfig<NgWeather> = {
  resources: [
    {
      name: 'currentConditions',
      cacheTime: TWO_HOURS,
    },
    {
      name: 'forecast',
      cacheTime: TWO_HOURS,
    },
    {
      name: 'locations',
      cacheTime: TWO_HOURS,
    },
  ],
};

export type NgWeather = 'currentConditions' | 'forecast' | 'locations';

@NgModule({
  declarations: [
    AppComponent,
    ZipcodeEntryComponent,
    ForecastsListComponent,
    CurrentConditionsComponent,
    MainPageComponent,
    TabsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    routing,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [
    {
      provide: CACHE_CONFIG,
      useValue: cacheConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
