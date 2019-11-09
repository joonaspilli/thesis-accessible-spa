import { Injectable } from '@angular/core';
import { FeedItem } from '@modules/feed';
import { randomInt } from '@utilities';
import { Observable, of } from 'rxjs';
import { delay, take } from 'rxjs/operators';
import { ActivityFeedPost } from '../datatypes/activity-feed.datatypes';
import { getServerActivityFeedPostsPaginated } from '../mockdata/activity-feed.mockdata';

@Injectable({
  providedIn: 'root'
})
export class ActivityFeedDataService {

  constructor() { }

  public getPosts(page: number): Observable<FeedItem[]> {
    return of(
      this.toFeedItems(getServerActivityFeedPostsPaginated(page))
    ).pipe(
      take(1),
      delay(randomInt(500, 1500))
    );
  }

  private toFeedItems(posts: ActivityFeedPost[]): FeedItem[] {
    return posts.map((item: ActivityFeedPost) => new FeedItem(item));
  }

}
