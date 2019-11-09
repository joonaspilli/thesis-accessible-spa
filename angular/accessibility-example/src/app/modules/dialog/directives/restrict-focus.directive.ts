import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';

@Directive({
  selector: '[appRestrictFocus]'
})
export class RestrictFocusDirective implements OnChanges, AfterContentInit, OnDestroy {

  private static readonly FOCUSABLE_QUERY: string = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"]):not([disabled])',
    'textarea:not([disabled])'
  ].join(', ');
  private static readonly RESTRICT_EVENTS: string[] = [
    'focus',
    'mousedown',
    'click'
  ];

  @Input('appRestrictFocus') private readonly enabled: boolean = true;
  private readonly eventListenerFn: () => void = this.restrictFocus.bind(this);
  private focusDirection: 'prev'|'next' = 'next';
  @Input('appRestrictFocusInitial') private readonly initial: boolean = true;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly el: ElementRef
  ) { }

  @HostListener('document:keydown', ['$event.key', '$event.shiftKey'])
  public detectFocusDirection(key: string, shiftKey: boolean): void {
    if (key === 'Tab') {
      if (shiftKey) {
        this.focusDirection = 'prev';
        return;
      }
      this.focusDirection = 'next';
    }
  }

  public ngAfterContentInit(): void {
    this.addListeners();
    if (this.initial) {
      this.focusWithin();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!changes.firstChange &&
      changes.enabled &&
      changes.enabled.currentValue) {
      this.focusWithin();
    }
  }

  public ngOnDestroy(): void {
    this.removeListeners();
  }

  private addListeners(): void {
    RestrictFocusDirective.RESTRICT_EVENTS.forEach((eventName: string) => {
      this.document.addEventListener(eventName, this.eventListenerFn, true);
    });
  }

  private focusWithin(): void {
    const focusableElements = this.el.nativeElement.querySelectorAll(
      RestrictFocusDirective.FOCUSABLE_QUERY
    );
    if (focusableElements.length) {
      if (this.focusDirection === 'prev') {
        focusableElements[focusableElements.length - 1].focus();
      } else {
        focusableElements[0].focus();
      }
    }
  }

  private removeListeners(): void {
    RestrictFocusDirective.RESTRICT_EVENTS.forEach((eventName: string) => {
      this.document.removeEventListener(eventName, this.eventListenerFn, true);
    });
  }

  private restrictFocus(event: FocusEvent|MouseEvent): void {
    if (this.enabled &&
      !this.el.nativeElement.contains(event.target)) {
      event.stopImmediatePropagation();
      event.preventDefault();
      this.focusWithin();
    }
  }

}
