import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MainContentComponent } from './components/main-content/main-content.component';
import { SkipNavComponent } from './components/skip-nav/skip-nav.component';
import { StatusAnnouncerComponent } from './components/status-announcer/status-announcer.component';
import { VHiddenDirective } from './directives/v-hidden.directive';

@NgModule({
  declarations: [
    MainContentComponent,
    SkipNavComponent,
    StatusAnnouncerComponent,
    VHiddenDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MainContentComponent,
    SkipNavComponent,
    StatusAnnouncerComponent,
    VHiddenDirective
  ]
})
export class AccessibilityModule { }
