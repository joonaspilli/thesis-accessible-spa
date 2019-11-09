import { Data, Route } from '@angular/router';

export enum DocumentTitleSection {
  Application = 'application',
  Modifier = 'modifier',
  Notification = 'notification',
  Title = 'title'
}

export type DocumentTitleStructure = DocumentTitleSection[];

export type DocumentTitleSectionData =
  Partial<Record<DocumentTitleSection, string>>;

export type DocumentTitleDelimiterData =
  Partial<Record<DocumentTitleSection, string>>;

export interface DocumentTitleData {
  delimiters?: DocumentTitleDelimiterData;
  sections?: DocumentTitleSectionData;
}

export interface RouteTitleData extends DocumentTitleData {
  sections: DocumentTitleSectionData &
    Required<Pick<DocumentTitleSectionData, DocumentTitleSection.Title>>;
}

export interface RouteAccessibilityData {
  heading?: string;
  title: RouteTitleData;
}

export interface AccessibleRouteData extends Data {
  accessibility: RouteAccessibilityData;
}

export interface AccessibleRoute extends Route {
  children?: AccessibleRoutes;
  data: AccessibleRouteData;
}

export type AccessibleRoutes = AccessibleRoute[];

export interface SetDocumentTitleOptions {
  mainHeadingInclude?: DocumentTitleStructure;
  merge?: boolean;
  updateMainContentHeading?: boolean;
}

export enum DocumentTitleLevel {
  Application = 'application',
  Route = 'route',
  Context = 'context'
}

export type DocumentTitleLevelStructure = DocumentTitleLevel[];

export type DocumentTitleDescription =
  Partial<Record<DocumentTitleLevel, DocumentTitleData>>;

export class DocumentTitle {

  private defaultTitleData: DocumentTitleData = {
    delimiters: {
      notification: ' ',
      title: ' ',
      modifier: ' - ',
      application: ' | '
    }
  };
  private digestedData: DocumentTitleData|null = null;
  private titleLevelStructure: DocumentTitleLevelStructure = [
    DocumentTitleLevel.Application,
    DocumentTitleLevel.Route,
    DocumentTitleLevel.Context
  ];
  private titleStructure: DocumentTitleStructure = [
    DocumentTitleSection.Notification,
    DocumentTitleSection.Title,
    DocumentTitleSection.Modifier,
    DocumentTitleSection.Application
  ];

  constructor(private readonly data: DocumentTitleDescription = {}) { }

  public getTitle(
    include: DocumentTitleStructure = this.titleStructure
  ): string {
    const data = this.digestedData || (this.digestedData = this.digestData());
    const { sections, delimiters } = data;
    if (sections) {
      return this.titleStructure
        .filter((section: DocumentTitleSection) => include.includes(section))
        .reduce((accTitle: string, curSection: DocumentTitleSection) => {
          const section = sections[curSection] || '';
          if (accTitle && delimiters && section) {
            accTitle += delimiters[curSection] || '';
          }
          return accTitle += section;
        }, '');
    } else {
      return '';
    }
  }

  public setDefaultTitleData(data: DocumentTitleData): void {
    this.defaultTitleData = data;
  }

  public setTitle(
    level: DocumentTitleLevel,
    data: DocumentTitleData,
    merge: boolean = false
  ): void {
    this.data[level] = merge ? this.mergeData(this.data[level], data) : data;
    this.digestedData = null;
  }

  public setTitleLevelStructure(structure: DocumentTitleLevelStructure): void {
    this.titleLevelStructure = structure;
  }

  public setTitleStructure(structure: DocumentTitleStructure): void {
    this.titleStructure = structure;
  }

  private digestData(): DocumentTitleData {
    return this.mergeData(
      { ...this.defaultTitleData },
      ...this.titleLevelStructure.map((key: string) => this.data[key] || {}),
    );
  }

  private mergeData(
    ...data: (DocumentTitleData|undefined)[]
  ): DocumentTitleData {
    return data.reduce((acc: DocumentTitleData, cur: DocumentTitleData) => ({
      sections: { ...acc.sections, ...cur.sections },
      delimiters: { ...acc.delimiters, ...cur.delimiters }
    }), {});
  }

}
