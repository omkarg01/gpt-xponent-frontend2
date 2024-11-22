import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ApplicationService } from '../application.service';
import { Subscription } from 'rxjs';
import { MY_APPLICATIONS } from '../utils/constants';

@Component({
  selector: 'app-application-main',
  templateUrl: './application-main.component.html',
  styleUrls: ['./application-main.component.scss']
})
export class ApplicationMainComponent implements OnInit, OnDestroy {
  breadcrumbsSubscription = new Subscription();
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
  breadCrumbItems: MenuItem[] = [];

  constructor(
    private readonly applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.checkForBreadcrumbItems()
  }

  checkForBreadcrumbItems = () => {
    this.breadcrumbsSubscription = this.applicationService.breadcrumbSubject.subscribe(params => {
      this.breadCrumbItems = params;
    })
  }

  onBreadcrumbClick = (event: any) => {
    const { item } = event
    if (item?.label === 'My Applications') {
      this.breadCrumbItems = MY_APPLICATIONS
    }
  }

  ngOnDestroy(): void {
    this.breadcrumbsSubscription.unsubscribe();
  }
}
