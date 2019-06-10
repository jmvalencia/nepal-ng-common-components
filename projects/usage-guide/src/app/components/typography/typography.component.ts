import { Component } from '@angular/core';
import { BreadcrumbService } from '../../breadcrumb.service';

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.scss']
})
export class TypographyComponent {

  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
        {label: 'Theming'},
        {label: 'Typography', routerLink: ['/typography']}
    ]);
  }

}
