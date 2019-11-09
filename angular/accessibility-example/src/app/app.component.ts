import { Component, OnInit } from '@angular/core';
import { NavigationLink } from '@datatypes/navigation.datatypes';
import { DocumentTitleLevel, SkipLink } from '@modules/accessibility';
import { RoutePurposeService } from '@modules/accessibility';
import { DialogService } from '@modules/dialog';
import { randomInt } from '@utilities';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public readonly footerNavLinks: NavigationLink[] = [{
    path: 'help',
    label: 'Help Center'
  }];
  public readonly mainNavLinks: NavigationLink[] = [{
    path: '',
    label: 'Home',
  }, {
    path: 'profile',
    label: 'Profile'
  }, {
    path: 'help',
    label: 'Help Center'
  }];
  public readonly skipNavLinks: SkipLink[] = [{
    anchorId: 'nav',
    label: 'Skip to main navigation'
  }, {
    anchorId: 'main',
    label: 'Skip to main content'
  }, {
    anchorId: 'dialog',
    label: 'Skip to open dialog',
    display: this.dialogService.dialogOpen
  }, {
    anchorId: 'footer',
    label: 'Skip to footer',
    mediaQuery: '(min-width: 56.25rem)'
  }];

  constructor(
    private readonly dialogService: DialogService,
    private readonly routePurposeService: RoutePurposeService
  ) { }

  public ngOnInit(): void {
    this.routePurposeService.enableAutomaticTitleUpdating();
    this.routePurposeService.enableAutomaticHeadingUpdating();
    this.routePurposeService.enableNavigationAnnouncements();
    this.routePurposeService.setDocumentTitle(DocumentTitleLevel.Application, {
      sections: {
        notification: `(${randomInt(5, 30)})`
      }
    }, {
      merge: true
    });
  }

}
