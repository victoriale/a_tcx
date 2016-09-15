import {Component, Injector} from '@angular/core';
import {Router,ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {Title} from '@angular/platform-browser';

import {GlobalSettings} from '../../global/global-settings';
import {SidekickWrapper} from "../../fe-core/components/sidekick-wrapper/sidekick-wrapper.component";

@Component({
    selector: 'Error-page',
    templateUrl: './app/webpages/error-page/error-page.page.html',
    directives: [SidekickWrapper],
    providers: [Title],
})
export class ErrorPage {
  public errorMessage: string;
  public pageLink: string;

  constructor(private _router:Router, private _title: Title) {
      _title.setTitle(GlobalSettings.getPageTitle("Page Not Found"));
      GlobalSettings.getParentParams(_router, parentParams => this.loadData(parentParams.partnerID));
  }

  loadData(partnerID:string) {
    this.pageLink = GlobalSettings.getHomePage(partnerID);
    this.errorMessage = "Oops! That page doesn't exist! Try Refreshing or go to <a class='text-master' href='/'"+ this.pageLink +"'> our home page</a>!";
  }
}
