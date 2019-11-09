import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { onPathChange } from '@utilities';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, takeWhile } from 'rxjs/operators';
import {
  AccessibleRouteData,
  DocumentTitle,
  DocumentTitleData,
  DocumentTitleLevel,
  DocumentTitleSection,
  DocumentTitleStructure,
  RouteAccessibilityData,
  RouteTitleData,
  SetDocumentTitleOptions
} from '../datatypes/route-purpose.datatypes';
import {
  PoliteStatusMessage
} from '../datatypes/status-announcement.datatypes';
import { StatusAnnouncementService } from './status-announcement.service';

@Injectable({
  providedIn: 'root'
})
export class RoutePurposeService {

  public get mainHeading(): Observable<string> {
    return this.mainHeading$.asObservable();
  }

  private automaticHeadingUpdatingEnabled: boolean = false;
  private automaticTitleUpdatingEnabled: boolean = false;
  private readonly documentTitle: DocumentTitle = new DocumentTitle({
    application: { sections: { application: this.titleService.getTitle() } }
  });
  private readonly mainHeading$: BehaviorSubject<string> =
    new BehaviorSubject('');
  private mainHeadingAutoInclude: DocumentTitleStructure = [
    DocumentTitleSection.Title,
    DocumentTitleSection.Modifier
  ];
  private navigationAnnouncementsEnabled: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly statusAnnouncementService: StatusAnnouncementService,
    private readonly titleService: Title
  ) { }

  public disableAutomaticHeadingUpdating(): void {
    this.automaticHeadingUpdatingEnabled = false;
  }

  public disableAutomaticTitleUpdating(): void {
    this.automaticTitleUpdatingEnabled = false;
  }

  public disableNavigationAnnouncements(): void {
    this.navigationAnnouncementsEnabled = false;
  }

  public enableAutomaticHeadingUpdating(): void {
    if (!this.automaticHeadingUpdatingEnabled) {
      this.automaticHeadingUpdatingEnabled = true;
      onPathChange(this.router).pipe(
        takeWhile(() => this.automaticHeadingUpdatingEnabled),
        switchMap((route: ActivatedRoute) => route.data),
        map((data: AccessibleRouteData) => data.accessibility)
      ).subscribe(this.handleNavigationHeadingChange.bind(this));
    }
  }

  public enableAutomaticTitleUpdating(): void {
    if (!this.automaticTitleUpdatingEnabled) {
      this.automaticTitleUpdatingEnabled = true;
      onPathChange(this.router).pipe(
        takeWhile(() => this.automaticTitleUpdatingEnabled),
        switchMap((route: ActivatedRoute) => route.data),
        map((data: AccessibleRouteData) => data.accessibility.title)
      ).subscribe(this.handleNavigationTitleChange.bind(this));
    }
  }

  public enableNavigationAnnouncements(): void {
    if (!this.navigationAnnouncementsEnabled) {
      this.navigationAnnouncementsEnabled = true;
      onPathChange(this.router).pipe(
        takeWhile(() => this.navigationAnnouncementsEnabled),
        switchMap((route: ActivatedRoute) => route.data),
        map((data: AccessibleRouteData) => data.accessibility)
      ).subscribe(this.handleNavigationAnnouncement.bind(this));
    }
  }

  public setDocumentTitle(
    level: DocumentTitleLevel,
    data: DocumentTitleData,
    options: SetDocumentTitleOptions = {}
  ): void {
    this.documentTitle.setTitle(level, data, options.merge);
    this.titleService.setTitle(this.documentTitle.getTitle());
    if (options.updateMainContentHeading) {
      this.setMainHeading(this.documentTitle.getTitle(
        options.mainHeadingInclude ||
        this.mainHeadingAutoInclude
      ));
    }
  }

  public setMainHeading(heading: string): void {
    this.mainHeading$.next(heading);
  }

  public setMainHeadingAutoInclude(include: DocumentTitleStructure): void {
    this.mainHeadingAutoInclude = include;
  }

  private handleNavigationAnnouncement(data: RouteAccessibilityData): void {
    const title = data.title.sections.title;
    const heading = data.heading;
    /**
     * The heading will be read by screen readers as it gets focused, so we
     * announce the route title only if it is not the same as the heading.
     */
    if (heading && heading !== title) {
      this.statusAnnouncementService.announce(
        new PoliteStatusMessage(title)
      );
    }
  }

  private handleNavigationHeadingChange(data: RouteAccessibilityData): void {
    this.setMainHeading(data.heading || data.title.sections.title);
  }

  private handleNavigationTitleChange(data: RouteTitleData): void {
    this.setDocumentTitle(DocumentTitleLevel.Route, data);
  }

}
