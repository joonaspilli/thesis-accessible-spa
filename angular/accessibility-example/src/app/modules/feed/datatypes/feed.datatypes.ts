import { randomId } from '@utilities';

export interface FeedStatus {
  busy: boolean;
  checked: boolean;
  error: boolean;
  loading: boolean;
}

export interface FeedMessages {
  checked: string;
  error: string;
  firstLoad: string;
  loaded: string;
  loading: string;
}

export interface FeedItemData {
  content: string;
  heading: string;
  id?: string;
}

export class FeedItem implements Required<FeedItemData> {

  public readonly content: string;
  public readonly describedById: string;
  public readonly heading: string;
  public readonly id: string;
  public readonly labelledById: string;

  constructor(data: FeedItemData) {
    Object.assign(this, data);
    if (!data.id) {
      this.id = randomId();
    }
    this.labelledById = `fi-l-${this.id}`;
    this.describedById = `fi-d-${this.id}`;
  }

}

export type FeedControls = 'next'|'previous'|'last'|'first';
