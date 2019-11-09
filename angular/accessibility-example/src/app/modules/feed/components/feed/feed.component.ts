import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { WINDOW } from '@datatypes/injection-token.datatypes';
import {
  KeyboardControl,
  KeyboardControlCollection,
  KeyboardControlGroup
} from '@datatypes/keyboard-control.datatypes';
import {
  PoliteStatusMessage,
  StatusAnnouncementService
} from '@modules/accessibility';
import { RequiredComponentProperties } from '@utilities';
import {
  FeedControls,
  FeedItem,
  FeedMessages,
  FeedStatus
} from '../../datatypes/feed.datatypes';
import { FeedItemComponent } from '../feed-item/feed-item.component';

@RequiredComponentProperties<FeedComponent>('feedStatus', 'messages')
@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnChanges {

  private static readonly KB_CONTROLS: KeyboardControlCollection<FeedControls> =
    new KeyboardControlCollection({
      first: new KeyboardControlGroup(
        new KeyboardControl('f'),
        new KeyboardControl('k', { shiftKey: true })
      ),
      last: new KeyboardControlGroup(
        new KeyboardControl('j', { shiftKey: true }),
        new KeyboardControl('l')
      ),
      next: new KeyboardControlGroup(
        new KeyboardControl('j'),
        new KeyboardControl('n')
      ),
      previous: new KeyboardControlGroup(
        new KeyboardControl('k'),
        new KeyboardControl('p')
      )
    }).setOptions({
      onMatchOptions: {
        preventDefault: true,
        stopImmediatePropagation: true
      }
    });

  public get currentMessage(): string {
    const { checked, error, loading } = this.feedStatus;
    const messages = this.messages;
    if (error) {
      return messages.error;
    } else if (loading) {
      return this.items.length ? messages.loading : messages.firstLoad;
    } else {
      return checked ? messages.checked : messages.loaded;
    }
  }
  public get disableInfiniteScroll(): boolean {
    const { loading, checked, error } = this.feedStatus;
    return loading || checked || error;
  }
  @Input() public readonly feedStatus: FeedStatus;
  public readonly infiniteScrollContainer: Window = this.window;
  @Input() public readonly items: FeedItem[] = [];
  @Input() public readonly label: string;
  @Input() public readonly messages: FeedMessages = {
    checked: 'No more new items available.',
    error: 'Failed to load items.',
    firstLoad: 'Loading items...',
    loaded: 'More items loaded.',
    loading: 'Loading more items...'
  };
  public readonly scrollDistance: number = 5;
  @Input() public readonly setSize: number = -1;

  @ViewChild('feedEl', { static: false })
    private readonly feedEl: ElementRef;
  @ViewChildren(FeedItemComponent)
    private readonly feedItemComponents: QueryList<FeedItemComponent>;
  private focusedItem: HTMLElement;
  @Output() private readonly scrolled: EventEmitter<void> = new EventEmitter();

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(WINDOW) private readonly window: Window,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly statusAnnouncementService: StatusAnnouncementService
  ) { }

  public feedItemTrackBy(index: number, item: FeedItem): string {
    return item.labelledById;
  }

  @HostListener('keydown', ['$event'])
  public handleItemFocusChange(event: KeyboardEvent): void {
    if (!this.feedEl.nativeElement.contains(this.document.activeElement)) {
      return;
    }
    const direction = FeedComponent.KB_CONTROLS.match(event);
    if (direction) {
      this.moveItemFocus(direction);
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.items && changes.items.currentValue) {
      this.checkIfEnoughFeedItems();
    }
    if (changes.feedStatus) {
      this.statusAnnouncementService.announce(
        new PoliteStatusMessage(this.currentMessage)
      );
    }
  }

  public onScroll(): void {
    this.scrolled.emit();
  }

  public updateFocusedItem(item: HTMLElement): void {
    this.focusedItem = item;
  }

  private checkIfEnoughFeedItems(): void {
    this.changeDetector.detectChanges();
    const { nativeElement } = this.feedEl;
    const { innerHeight } = this.window;
    if (nativeElement.getBoundingClientRect().height < innerHeight) {
      this.scrolled.emit();
    }
  }

  private moveItemFocus(dir: FeedControls): void {
    let target: Element|null = null;
    if (dir === 'next' || dir === 'previous') {
      target = this.focusedItem
        ? this.focusedItem[`${dir}ElementSibling`]
        : null;
    } else if (dir === 'last' || dir === 'first') {
      target = this.feedItemComponents[dir].elementRef.nativeElement;
    }
    if (target instanceof HTMLElement &&
      this.feedEl.nativeElement.contains(target)) {
      target.focus();
      target.scrollIntoView();
    }
  }

}
