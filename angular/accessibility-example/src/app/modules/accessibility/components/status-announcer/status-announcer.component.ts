import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy
} from '@angular/core';
import { Subject } from 'rxjs';
import {
  debounceTime,
  delay,
  filter,
  takeUntil,
  tap
} from 'rxjs/operators';
import {
  LiveMessage,
  LiveMessageImportance,
  StatusMessage
} from '../../datatypes/status-announcement.datatypes';
import {
  StatusAnnouncementService
} from '../../services/status-announcement.service';

@Component({
  selector: 'app-status-announcer',
  templateUrl: './status-announcer.component.html',
  styleUrls: ['./status-announcer.component.css']
})
export class StatusAnnouncerComponent implements AfterViewInit, OnDestroy {

  // MSG_UPDATE_DELAY needs to be accounted for when setting MSG_CLEAR_DEBOUNCE.
  private static readonly MSG_CLEAR_DEBOUNCE: number = 200;
  private static readonly MSG_UPDATE_DELAY: number = 100;

  public readonly messageTypes: string[] = Object.values(LiveMessageImportance);
  public readonly statusMessages:
    Record<LiveMessageImportance, StatusMessage|null> =
    Object.values(LiveMessageImportance)
    .reduce((acc: object, cur: string) => (acc[cur] = null) || acc, {});

  private readonly destroyed$: Subject<boolean> = new Subject();

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly statusAnnouncementService: StatusAnnouncementService
  ) { }

  public msgTrackBy(index: number, messageType: string): string {
    return messageType;
  }

  public ngAfterViewInit(): void {
    this.initMessageUpdating();
    this.initMessageClearing();
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
  }

  private initMessageClearing(): void {
    /**
     * Automatically clear messages to allow announcing of subsequent identical
     * messages with some screen reader and browser combinations. Removal of the
     * messages also helps to avoid possible confusion in cases where a screen
     * reader user would navigate to a status message and the status would no
     * longer be relevant.
     */
    this.messageTypes.forEach((importance: string) => {
      this.statusAnnouncementService.statusAnnouncements.pipe(
        takeUntil(this.destroyed$),
        filter((msg: StatusMessage) => msg.importance === importance),
        /**
         * Based on testing at least a 100ms debounce is recommended for
         * clearing messages, otherwise the message may not be read by some
         * screen readers.
         */
        debounceTime(StatusAnnouncerComponent.MSG_CLEAR_DEBOUNCE)
      ).subscribe(this.resetMessage.bind(this));
    });
  }

  private initMessageUpdating(): void {
    this.statusAnnouncementService.statusAnnouncements.pipe(
      takeUntil(this.destroyed$),
      /**
       * Without a small delay to updating status messages the message may not
       * be read in some cases, e.g. when announcing status immediately after
       * navigation.
       */
      delay(StatusAnnouncerComponent.MSG_UPDATE_DELAY),
      tap((msg: StatusMessage) => {
        /**
         * The element displaying the status message is first cleared before
         * updating it with  a new message to prevent some screen reader +
         * browser combinations from sometimes reading it twice.
         * Solution insight source:
         * https://github.com/nvaccess/nvda/issues/7996#issuecomment-413641709
         * Some combinations seem to need the detectChanges() call in order
         * for it to work as intended.
         *
         * Because of automatic clearing of messages (see initMessageClearing)
         * this step is redundant in most use cases, but can be done just in
         * case.
         */
        this.resetMessage(msg);
        this.changeDetector.detectChanges();
      })
    ).subscribe(this.setMessage.bind(this));
  }

  private resetMessage(msg: StatusMessage): void {
    this.setMessage(new LiveMessage('', msg.importance), true);
  }

  private setMessage(msg: StatusMessage, empty?: boolean): void {
    if (typeof this.statusMessages[msg.importance] !== 'undefined') {
      this.statusMessages[msg.importance] = empty ? null : msg;
    }
  }

}
