import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { WINDOW } from '@datatypes/injection-token.datatypes';
import { KeyboardControl } from '@datatypes/keyboard-control.datatypes';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Dialog } from '../../datatypes/dialog.datatypes';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit, OnDestroy {

  private static readonly BODY_MODAL_CLASS: string = 'modal-open';

  private static readonly KEY_CLOSE: KeyboardControl =
    new KeyboardControl('Escape', {
      onMatchOptions: {
        preventDefault: true,
        stopImmediatePropagation: true
      }
    });

  public dialog: Dialog|null;
  public readonly modalOpen$: Observable<boolean> =
    this.dialogService.modalOpen;

  private readonly destroyed$: Subject<boolean> = new Subject();
  @ViewChild('dialogHeadingEl', { static: false })
    private readonly dialogHeadingEl: ElementRef;
  @ViewChild('dialogWindowEl', { static: false })
    private readonly dialogWindowEl: ElementRef;
  private savedScrollPos: number;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(WINDOW) private readonly window: Window,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly dialogService: DialogService,
    private readonly renderer: Renderer2
  ) { }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.handleDialogClose();
  }

  public ngOnInit(): void {
    this.dialogService.dialog
      .pipe(takeUntil(this.destroyed$))
      .subscribe(this.handleDialog.bind(this));
  }

  @HostListener('keydown', ['$event'])
  public onClose(event?: KeyboardEvent): void {
    if (!event ||
      (event && DialogComponent.KEY_CLOSE.matches(event))) {
      this.dialogService.closeDialog();
    }
  }

  @HostListener('document:focusin', ['$event.relatedTarget'])
  public updatePreviousFocus(prevFocusedEl: EventTarget): void {
    // Update previously focused element with a non-modal dialog.
    if (this.dialog && !this.dialog.isModal) {
      const activeElement = this.document.activeElement;
      const dialogEl = this.dialogWindowEl.nativeElement;
      if (prevFocusedEl instanceof HTMLElement &&
        dialogEl.contains(activeElement) &&
        !dialogEl.contains(prevFocusedEl) &&
        // With some browsers the previous element might be html or window.
        this.document.body.contains(prevFocusedEl)) {
        this.dialogService.updatePreviousFocus(prevFocusedEl);
      }
    }
  }

  private handleDialog(dialog: Dialog|null): void {
    this.dialog = dialog;
    if (dialog) {
      this.handleDialogOpen(dialog);
    } else {
      this.handleDialogClose();
    }
  }

  private handleDialogClose(): void {
    // Undo body stylings.
    this.renderer.removeStyle(document.body, 'top');
    this.renderer.removeClass(document.body, DialogComponent.BODY_MODAL_CLASS);
    if (this.savedScrollPos) {
      this.window.scrollTo(0, this.savedScrollPos);
      this.savedScrollPos = 0;
    }
  }

  private handleDialogOpen(dialog: Dialog): void {
    // Change detection is necessary to have the heading element exist in DOM.
    this.changeDetector.detectChanges();
    this.dialogHeadingEl.nativeElement.focus();
    /**
     * Manipulations to body's CSS top, position and window scrolling are
     * required in order to retain the scroll position when opening/closing the
     * modal element and to prevent scrolling background content on iOS Safari
     * when the modal is open.
     */
    if (dialog.isModal) {
      this.savedScrollPos = this.window.scrollY;
      this.renderer.setStyle(document.body, 'top', `-${this.savedScrollPos}px`);
      this.renderer.addClass(document.body, DialogComponent.BODY_MODAL_CLASS);
    }
  }

}
