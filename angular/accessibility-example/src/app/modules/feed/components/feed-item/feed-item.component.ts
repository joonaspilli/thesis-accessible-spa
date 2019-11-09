import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { KeyboardControl } from '@datatypes/keyboard-control.datatypes';
import { Dialog, DialogService } from '@modules/dialog';
import { RequiredComponentProperties } from '@utilities';
import { FeedItem } from '../../datatypes/feed.datatypes';

@RequiredComponentProperties('item')
@Component({
  selector: 'app-feed-item',
  templateUrl: './feed-item.component.html',
  styleUrls: ['./feed-item.component.css']
})
export class FeedItemComponent implements OnInit {

  private static readonly KEY_OPEN: KeyboardControl =
    new KeyboardControl('Enter', {
      onMatchOptions: {
        preventDefault: true,
        stopImmediatePropagation: true
      }
    });

  @HostBinding('attr.aria-describedby') public hostDescribedBy: string;
  @HostBinding('attr.aria-labelledby') public hostLabelledBy: string;
  @HostBinding('attr.role') public readonly hostRole: string = 'article';
  @HostBinding('attr.tabindex') public readonly hostTabIndex: number = -1;
  @Input() public readonly item: FeedItem;
  @HostBinding('attr.aria-posinset')
    @Input() public readonly posInSet: number|null = null;
  @HostBinding('attr.aria-setsize')
    @Input() public readonly setSize: number|null = null;

  @Output() private readonly focuswithin: EventEmitter<HTMLElement> =
    new EventEmitter();

  constructor(
    private readonly dialogService: DialogService,
    public readonly elementRef: ElementRef
  ) { }

  public ngOnInit(): void {
    this.hostLabelledBy = this.item.labelledById;
    this.hostDescribedBy = this.item.describedById;
  }

  @HostListener('focusin')
  public onFocusWithin(): void {
    this.focuswithin.emit(this.elementRef.nativeElement);
  }

  @HostListener('keydown', ['$event'])
  public openItem(event?: KeyboardEvent): void {
    if (!event ||
      (event && FeedItemComponent.KEY_OPEN.matches(event))) {
      this.dialogService.openDialog(new Dialog({
        heading: this.item.heading,
        message: this.item.content
      }));
    }
  }

}
