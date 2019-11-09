import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges
} from '@angular/core';

@Directive({
  selector: '[appVHidden]'
})
export class VHiddenDirective implements OnChanges {

  @HostBinding('class.a11y-vhidden') public hostVHidden: boolean = true;

  private listener: (() => void)|null = null;
  @Input('appVHidden') private readonly unlessFocused: boolean = false;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly el: ElementRef,
    private readonly renderer: Renderer2
  ) { }

  public ngOnChanges(changes: SimpleChanges): void {
    this.updateHidden();
    if (changes.unlessFocused) {
      const { previousValue, currentValue } = changes.unlessFocused;
      if (!previousValue && currentValue) {
        this.listener = this.renderer.listen(
          this.document,
          'focusin',
          this.updateHidden.bind(this)
        );
      } else if (!currentValue && previousValue && this.listener) {
        this.listener();
        this.listener = null;
      }
    }
  }

  public updateHidden(): void {
    if (this.unlessFocused) {
      const { nativeElement } = this.el;
      const { activeElement } = this.document;
      this.hostVHidden = !nativeElement.contains(activeElement);
    }
  }

}
