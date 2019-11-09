export interface OnEventMatchOptions {
  preventDefault?: boolean;
  stopImmediatePropagation?: boolean;
  stopPropagation?: boolean;
}

export interface KeyboardControlOptions {
  caseInsensitive?: boolean;
  onMatchOptions?: OnEventMatchOptions|null;
  shiftKey?: boolean;
}

export class KeyboardControl {

  private options: Required<KeyboardControlOptions> = {
    caseInsensitive: true,
    onMatchOptions: null,
    shiftKey: false
  };

  constructor(public readonly key: string, options?: KeyboardControlOptions) {
    if (options) {
      this.setOptions(options);
    }
  }

  public matches(
    event: KeyboardEvent,
    onMatch: OnEventMatchOptions|null = this.options.onMatchOptions
  ): boolean {
    const { caseInsensitive, shiftKey } = this.options;
    const key = caseInsensitive ? this.key.toLowerCase() : this.key;
    const eventKey = caseInsensitive ? event.key.toLowerCase() : event.key;
    const matches = eventKey === key && event.shiftKey === shiftKey;
    if (matches && onMatch) {
      if (onMatch.preventDefault) {
        event.preventDefault();
      }
      if (onMatch.stopImmediatePropagation) {
        event.stopImmediatePropagation();
      } else if (onMatch.stopPropagation) {
        event.stopPropagation();
      }
    }
    return matches;
  }

  public setOptions(options: KeyboardControlOptions): KeyboardControl {
    this.options = { ...this.options, ...options };
    return this;
  }

}

export class KeyboardControlGroup {

  public readonly controls: KeyboardControl[];

  constructor(...controls: KeyboardControl[]) {
    this.controls = controls;
  }

  public matches(event: KeyboardEvent, options?: OnEventMatchOptions): boolean {
    return this.controls.some(
      (control: KeyboardControl) => control.matches(event, options)
    );
  }

  public setOptions(options: KeyboardControlOptions): KeyboardControlGroup {
    this.controls.forEach(
      (control: KeyboardControl) => control.setOptions(options)
    );
    return this;
  }

}

export type KeyboardControlRecord<K extends string = string> =
  Record<K, KeyboardControl|KeyboardControlGroup>;

export class KeyboardControlCollection<K extends string = string> {

  public readonly controls: KeyboardControlRecord<K>;

  constructor(controls: KeyboardControlRecord<K>) {
    this.controls = controls;
  }

  public match(event: KeyboardEvent): K|undefined {
    for (const key in this.controls) {
      if (this.controls[key].matches(event)) {
        return key;
      }
    }
  }

  public setOptions(
    options: KeyboardControlOptions
  ): KeyboardControlCollection<K> {
    Object.keys(this.controls).forEach(
      (key: string) => this.controls[key].setOptions(options)
    );
    return this;
  }

}
