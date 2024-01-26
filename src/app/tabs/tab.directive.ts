import { Directive, ElementRef, Input, TemplateRef, ViewChild } from '@angular/core';

@Directive({
  selector: '[tab]',
})
export class TabDirective {
  @Input('tab')
  name: TemplateRef<ElementRef>;

  constructor(public template: TemplateRef<ElementRef>) {}
}
