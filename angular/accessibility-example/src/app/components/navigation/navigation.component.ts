import { Component, Input } from '@angular/core';
import { NavigationLink } from '@datatypes/navigation.datatypes';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

  @Input() public readonly ariaLabel: string;
  @Input() public readonly links: NavigationLink[] = [];
  public readonly routerLinkActiveOpts: {} = { exact: true };

  constructor() { }

}
