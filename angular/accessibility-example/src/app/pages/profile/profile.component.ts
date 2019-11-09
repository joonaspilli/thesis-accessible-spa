import { Component, OnInit } from '@angular/core';
import { DocumentTitleLevel, RoutePurposeService } from '@app/modules/accessibility';
import { AlertDialog, Dialog, DialogData, DialogService } from '@modules/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public readonly user: string = 'John Smith';

  constructor(
    private readonly dialogService: DialogService,
    private readonly routePurposeService: RoutePurposeService
  ) { }

  public logOutConfirm(isModal: boolean): void {
    const exampleData: DialogData = {
      heading: 'Confirmation',
      message: 'Are you sure you want to log out?',
      buttons: [{
        text: 'Cancel'
      }, {
        text: 'Yes, I want to log out'
      }]
    };
    if (isModal) {
      this.dialogService.openDialog(new AlertDialog(exampleData));
    } else {
      this.dialogService.openDialog(new Dialog({ ...exampleData, isModal }));
    }
  }

  public ngOnInit(): void {
    this.routePurposeService.setDocumentTitle(DocumentTitleLevel.Route, {
      sections: {
        modifier: this.user
      }
    }, {
      merge: true,
      updateMainContentHeading: true
    });
  }

}
