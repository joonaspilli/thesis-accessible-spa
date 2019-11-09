import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DialogComponent } from './components/dialog/dialog.component';
import { RestrictFocusDirective } from './directives/restrict-focus.directive';

@NgModule({
  declarations: [
    DialogComponent,
    RestrictFocusDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DialogComponent
  ]
})
export class DialogModule { }
