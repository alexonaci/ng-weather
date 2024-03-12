import {
  AfterContentChecked,
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Output,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { TabDirective } from './tab.directive';

@Component({
  selector: 'tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
})
export class TabsComponent implements AfterContentInit, AfterContentChecked {
  @ContentChildren(TabDirective)
  tabs: QueryList<TabDirective>;
  currentTab: TemplateRef<ElementRef> | undefined;
  @Output() tabClose = new EventEmitter();

  removeTab(index: number): void {
    this.tabClose.emit(index);
  }

  ngAfterContentInit(): void {
    this.currentTab = this.tabs?.get(0)?.template;
  }

  ngAfterContentChecked(): void {
    if (this.tabs?.length === 1) {
      this.currentTab = this.tabs?.get(0)?.template;
    }
  }
}
