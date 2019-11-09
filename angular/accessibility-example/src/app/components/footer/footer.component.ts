import { Component, Input } from '@angular/core';
import { NavigationLink } from '@datatypes/navigation.datatypes';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  @Input() public readonly links: NavigationLink[] = [];

  constructor() { }

}
