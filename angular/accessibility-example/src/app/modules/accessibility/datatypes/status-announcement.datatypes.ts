export enum LiveMessageImportance {
  Assertive = 'assertive',
  Polite = 'polite'
}

export interface LiveMessageOptions {
  isAlert?: boolean;
}

export class LiveMessage implements Required<LiveMessageOptions> {
  public readonly isAlert: boolean = false;
  constructor(
    public message: string,
    public readonly importance: LiveMessageImportance,
    options: LiveMessageOptions = {}
  ) {
    Object.assign(this, options);
  }
}

export class AssertiveStatusMessage extends LiveMessage {
  constructor(message: string, options?: LiveMessageOptions) {
    super(message, LiveMessageImportance.Assertive, options);
  }
}

export class PoliteStatusMessage extends LiveMessage {
  constructor(message: string, options?: LiveMessageOptions) {
    super(message, LiveMessageImportance.Polite, options);
  }
}

export type StatusMessage =
  LiveMessage|PoliteStatusMessage|AssertiveStatusMessage;
