import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {
  Router,
} from '@angular/router';
import { WINDOW } from '@datatypes/injection-token.datatypes';
import { getFragmentlessUrl, onPathChange } from '@utilities';
import { fromEvent, Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  takeUntil
} from 'rxjs/operators';
import { SkipLink } from '../../datatypes/skip-nav.datatypes';

@Component({
  selector: 'app-skip-nav',
  templateUrl: './skip-nav.component.html',
  styleUrls: ['./skip-nav.component.css']
})
export class SkipNavComponent implements OnChanges, OnInit, OnDestroy {

  private static readonly RESIZE_REACTION_DEBOUNCE: number = 100;

  @Input() public readonly bottom: boolean = false;
  public displayedLinks: SkipLink[];
  public linkPrefix: string = '';
  @Input() public readonly links: SkipLink[] = [];
  public visuallyHidden: boolean = true;

  private readonly destroyed$: Subject<boolean> = new Subject();
  private readonly windowResize: Observable<Event> =
    fromEvent(this.window, 'resize').pipe(
      debounceTime(SkipNavComponent.RESIZE_REACTION_DEBOUNCE)
    );

  constructor(
    @Inject(WINDOW) private readonly window: Window,
    private readonly router: Router
  ) { }

  public getLinkTrackBy(index: number, link: SkipLink): string {
    return `${index}${link.anchorId}`;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.links && changes.links.currentValue) {
      this.updateDisplayedLinks();
    }
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
  }

  public ngOnInit(): void {
    // Rerun possible media queries.
    this.windowResize
      .pipe(takeUntil(this.destroyed$))
      .subscribe(this.updateDisplayedLinks.bind(this));
    // Update link prefix.
    onPathChange(this.router).pipe(
      takeUntil(this.destroyed$),
      map(() => getFragmentlessUrl(this.router)),
      distinctUntilChanged()
    /**
     * anchorScrolling approach described here:
     * https://stackoverflow.com/questions/44441089/angular4-scrolling-to-anchor
     * would be simpler, but unfortunately does not move keyboard focus to
     * anchored element and is therefore quite useless for keyboard users.
     * However, anchorScrolling should be enabled as it will cause the view to
     * scroll to the anchored element on first navigation to the application
     * from an anchored url.
     *
     * An alternative solution would be to use element.focus() but that would
     * require making sure the anchored element is focusable, which might be
     * troublesome in some cases.
     */
    ).subscribe(this.updateLinkPrefix.bind(this));
  }

  private updateDisplayedLinks(): void {
    this.displayedLinks = this.links
      .filter((link: SkipLink) => (
        link.mediaQuery ? this.window.matchMedia(link.mediaQuery).matches : true
      ));
  }

  private updateLinkPrefix(currentPath: string): void {
    this.linkPrefix = currentPath;
  }

}
