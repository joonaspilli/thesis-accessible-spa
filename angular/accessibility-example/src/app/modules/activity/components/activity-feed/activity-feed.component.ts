import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FeedItem, FeedMessages, FeedStatus } from '@modules/feed';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  ActivityFeedDataService
} from '../../services/activity-feed-data.service';

@Component({
  selector: 'app-activity-feed',
  templateUrl: './activity-feed.component.html',
  styleUrls: ['./activity-feed.component.css']
})
export class ActivityFeedComponent implements OnInit, OnDestroy {

  public feedCurrentPage: number = 0;
  public readonly feedMessages: FeedMessages = {
    checked: 'No more new posts available.',
    error: 'Failed to load posts.',
    firstLoad: 'Loading posts...',
    loaded: 'posts loaded.',
    loading: 'Loading more posts...'
  };
  public feedStatus: FeedStatus = {
    busy: false,
    error: false,
    checked: false,
    loading: false
  };
  public posts: FeedItem[] = [];
  public totalPostCount: number = -1;

  private readonly destroyed$: Subject<boolean> = new Subject();

  constructor(
    private readonly activityFeedDataService: ActivityFeedDataService,
  ) { }

  public getPosts(): void {
    if (this.feedStatus.loading || this.feedStatus.checked) {
      return;
    }
    this.updateFeedStatus({ loading: true });
    this.activityFeedDataService.getPosts(this.feedCurrentPage)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((posts: FeedItem[]) => {
        this.updateFeedStatus({ loading: false });
        if (!posts.length) {
          this.updateFeedStatus({ checked: true });
          this.totalPostCount = this.posts.length;
        } else {
          this.handleMorePosts(posts);
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
  }

  public ngOnInit(): void {
    this.getPosts();
  }

  private handleMorePosts(posts: FeedItem[]): void {
    const count = posts.length;
    this.feedMessages.loaded = `${count} posts loaded.`;
    this.posts = this.posts.concat(posts);
    ++this.feedCurrentPage;
  }

  private updateFeedStatus(newStatus: Partial<FeedStatus>): void {
    this.feedStatus = { ...this.feedStatus, ...newStatus };
  }

}
