import { Component, computed, inject, signal, Signal } from '@angular/core';
import { WeatherService } from '../weather.service';
import { LocationService } from '../location.service';
import { Router } from '@angular/router';
import { ConditionsAndZip } from '../conditions-and-zip.type';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
})
export class CurrentConditionsComponent {
  private router = inject(Router);
  protected weatherService = inject(WeatherService);
  protected locationService = inject(LocationService);
  currentConditions: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();
  tabData = computed(() => {
    const result = this.currentConditions().map((c) => ({ code: c.zip, title: c.data.name }));
    return result;
  });
  index = signal(0);

  showForecast(zipcode: string) {
    this.router.navigate(['/forecast', zipcode]);
  }

  changeActiveItem(index: number): void {
    this.index.update(() => index);
  }

  closeTab(zip: string): void {
    this.weatherService.removeCurrentConditions(zip);
    this.index.update(() => 0);
  }
}
