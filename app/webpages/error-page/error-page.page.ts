import {Component, Injector} from '@angular/core';
import {Title} from '@angular/platform-browser';
import { SeoService } from "../../global/seo.service";
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalSettings } from "../../global/global-settings";

@Component({
    selector: 'Error-page',
    templateUrl: './app/webpages/error-page/error-page.page.html',
})
export class ErrorPage {
  public errorMessage: string;
  public pageLink: string;
  public partnerID: string;
  public homeUrl: any;
  constructor(private _title: Title, private _seoService: SeoService, private _activatedRoute: ActivatedRoute) {
      this._seoService.setTitle('Error Page');
      this._seoService.setMetaRobots('NOINDEX, NOFOLLOW');
      this._activatedRoute.params.subscribe(
          (params:any) => {
            GlobalSettings.storedPartnerId(params.partner_id);
          });
  }

  loadData(partnerID:string) {
    console.log(partnerID, this.homeUrl);
    if(this.partnerID){
      this.homeUrl = ["/"+this.partnerID, "news"];
    }else{
      this.homeUrl = ["/news-feed"];
    }
    this.errorMessage = "Oops! That page doesn't exist! Try Refreshing or go to <a class='text-master' href='/'"+ this.pageLink +"'> our home page</a>!";
  }
}
