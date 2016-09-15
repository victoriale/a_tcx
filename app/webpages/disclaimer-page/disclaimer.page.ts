import {Component} from '@angular/core';
import {Router, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {Injector} from '@angular/core';
import {Title} from '@angular/platform-browser';

import {BackTabComponent} from '../../fe-core/components/backtab/backtab.component';
import {TitleComponent} from '../../fe-core/components/title/title.component';
import {WidgetModule} from "../../fe-core/modules/widget/widget.module";
import {TitleInputData} from "../../fe-core/components/title/title.component";
import {GlobalSettings} from '../../global/global-settings';
import {GlobalFunctions} from '../../global/global-functions';
import {SidekickWrapper} from "../../fe-core/components/sidekick-wrapper/sidekick-wrapper.component";
import {ResponsiveWidget} from '../../fe-core/components/responsive-widget/responsive-widget.component';

@Component({
    selector: 'Disclaimer-page',
    templateUrl: './app/webpages/disclaimer-page/disclaimer.page.html',

    directives: [SidekickWrapper, BackTabComponent, TitleComponent, WidgetModule, ROUTER_DIRECTIVES, ResponsiveWidget],
    providers: [Title],
})

export class DisclaimerPage {
    public widgetPlace: string = "widgetForPage";
    public pageName: string;
    public pageLinkName: string;
    public contactUsLinkName: string;
    public titleData: TitleInputData;

    constructor(private _router:Router, private _title: Title) {
      _title.setTitle(GlobalSettings.getPageTitle("Disclaimer"));
      GlobalSettings.getParentParams(_router, parentParams => this.loadData(parentParams.partnerID));
    }

    loadData(partnerID:string) {
      this.pageLinkName = GlobalSettings.getHomePage(partnerID).replace(/https?:\/\//, "");

      this.pageName = partnerID ? GlobalSettings.getBasePartnerTitle() : GlobalSettings.getBaseTitle();
      this.titleData = {
          imageURL : GlobalSettings.getSiteLogoUrl(),
          text1: 'Last Updated: Thursday, August 4, 2016.',
          text2 : ' United States',
          text3 : GlobalFunctions.convertToPossessive(this.pageName) + " Disclaimer",
          text4 : '',
          icon: 'fa fa-map-marker'
      };

      var subpath = this._router.generate(["Contact-us-page"]).toRootUrl();
      this.contactUsLinkName = this.pageLinkName + (subpath.charAt(0) == "/" ? "" : "/") + subpath;
    }
}
