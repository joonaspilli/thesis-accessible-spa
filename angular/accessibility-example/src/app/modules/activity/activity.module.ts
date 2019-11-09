import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FeedModule } from '@modules/feed';
import { ActivityFeedComponent } from './components/activity-feed/activity-feed.component';

@NgModule({
  declarations: [
    ActivityFeedComponent
  ],
  imports: [
    CommonModule,
    FeedModule
  ],
  exports: [
    ActivityFeedComponent
  ]
})
export class ActivityModule { }
