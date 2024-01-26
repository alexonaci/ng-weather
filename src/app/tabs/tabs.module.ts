import { NgModule } from '@angular/core';
import { TabsComponent } from './tabs.component';
import { TabDirective } from './tab.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [TabsComponent, TabDirective],
  exports: [TabsComponent, TabDirective],
  imports: [CommonModule],
})
export class TabsModule {}
