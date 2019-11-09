import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccessibilityModule } from '@modules/accessibility';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FeedItemComponent } from './components/feed-item/feed-item.component';
import { FeedComponent } from './components/feed/feed.component';

@NgModule({
  declarations: [
    FeedComponent,
    FeedItemComponent
  ],
  imports: [
    CommonModule,
    InfiniteScrollModule,
    AccessibilityModule
  ],
  exports: [
    FeedComponent,
    FeedItemComponent
  ]
})
export class FeedModule { }
