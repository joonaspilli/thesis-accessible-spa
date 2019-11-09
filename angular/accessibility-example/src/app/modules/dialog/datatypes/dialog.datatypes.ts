/**
 * NOTE: With Google Chrome, NVDA and a role of "alertdialog" the dialog heading
 * and description are not read by NVDA. No solution found.
 * Related issue on GitHub: https://github.com/nvaccess/nvda/issues/9368
 */
export enum DialogType {
  Alert = 'alertdialog',
  Dialog = 'dialog'
}

/**
 * As this is just a demonstration implementation, all buttons are indentical in
 * their interactions.
 */
export interface DialogButton {
  text: string;
}

// Array of DialogButtons, minimum of one button.
type DialogButtons = { 0: DialogButton } & Array<DialogButton>;

export interface DialogData {
  buttons?: DialogButtons;
  heading: string;
  isModal?: boolean;
  message: string;
}

export class Dialog implements Required<DialogData> {
  public readonly buttons: DialogButtons = [{ text: 'Close' }];
  public readonly dialogType: DialogType = DialogType.Dialog;
  public readonly heading: string;
  public readonly isModal: boolean = true;
  public readonly message: string;

  constructor(data: DialogData) {
    Object.assign(this, data);
    if (!this.isModal) {
      console.warn(
        'Non-modal dialogs have only a minimal, incomplete and likely an ' +
        'inaccessible implementation. Used solely for testing purposes.'
      );
    }
  }
}

export class AlertDialog extends Dialog {
  public readonly dialogType: DialogType = DialogType.Alert;
  // ARIA 1.1 recommends that alertdialogs are always modal.
  constructor(data: Omit<DialogData, 'isModal'>) {
    super({ ...data, isModal: true });
  }
}
