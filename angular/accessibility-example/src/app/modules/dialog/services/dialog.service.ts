import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  Inject,
  Injectable
} from '@angular/core';
import { DocumentTitleLevel, RoutePurposeService } from '@modules/accessibility';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertDialog, Dialog } from '../datatypes/dialog.datatypes';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  public get dialog(): Observable<Dialog|null> {
    return this.dialog$.asObservable();
  }
  public get dialogOpen(): Observable<boolean> {
    return this.dialogOpen$.asObservable();
  }
  public get modalOpen(): Observable<boolean> {
    return this.modalOpen$.asObservable();
  }

  private readonly dialog$: BehaviorSubject<Dialog|null> =
    new BehaviorSubject(null);
  private readonly dialogOpen$: BehaviorSubject<boolean> =
    new BehaviorSubject(false);
  private readonly modalOpen$: BehaviorSubject<boolean> =
    new BehaviorSubject(false);
  private prevFocus: HTMLElement|null = null;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly applicationRef: ApplicationRef,
    private readonly routePurposeService: RoutePurposeService
  ) { }

  public closeDialog(): void {
    const { isModal } = this.dialog$.getValue() || { isModal: false };
    this.dialog$.next(null);
    this.dialogOpen$.next(false);
    if (isModal) {
      this.modalOpen$.next(false);
    }
    this.restoreFocus();
    this.routePurposeService.setDocumentTitle(DocumentTitleLevel.Context, {});
  }

  public openDialog(dialog: Dialog|AlertDialog): void {
    if (this.dialog$.getValue()) {
      this.closeDialog();
    }
    this.storeFocus();
    this.dialog$.next(dialog);
    this.dialogOpen$.next(true);
    if (dialog.isModal) {
      this.modalOpen$.next(true);
      this.routePurposeService.setDocumentTitle(DocumentTitleLevel.Context, {
        sections: {
          modifier: dialog.heading
        },
        delimiters: {
          modifier: ' - '
        }
      });
    }
  }

  public updatePreviousFocus(element: HTMLElement|null): void {
    this.prevFocus = element;
  }

  private restoreFocus(): void {
    if (this.prevFocus) {
      // Allow DOM to update, otherwise focus may be lost with some browsers.
      this.applicationRef.tick();
      if (this.document.body.contains(this.prevFocus)) {
        this.prevFocus.focus();
      }
      this.prevFocus = null;
    }
  }

  private storeFocus(): void {
    const el = this.document.activeElement;
    this.prevFocus = el instanceof HTMLElement ? el : null;
  }

}
