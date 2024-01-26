import {
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
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabDirective)
  tabs: QueryList<TabDirective>;
  currentTab: TemplateRef<ElementRef> | undefined;
  @Output() tabClose = new EventEmitter();

  removeTab(index: number): void {
    this.tabClose.emit(index);
    this.currentTab = undefined;
  }

  ngAfterContentInit(): void {
    this.currentTab = this.tabs?.get(0)?.template;
  }
}
