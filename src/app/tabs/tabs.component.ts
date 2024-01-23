import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TabItem } from './tabs.component.type';

@Component({
  selector: 'tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  @Input() items: TabItem[] = [];
  @Output() private activeTabChange = new EventEmitter<number>();
  @Output() private closeTabChange = new EventEmitter<string>();

  changeActiveTab(index: number): void {
    this.activeTabChange.emit(index);
  }

  closeTab(code: string): void {
    this.closeTabChange.emit(code);
  }

  trackTab(_: number, item: TabItem): string | null {
    return item ? item.code : null;
  }
}
