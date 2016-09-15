import {Component, AfterViewChecked, OnInit} from '@angular/core';
import {RouteParams, RouteConfig, RouterOutlet, ROUTER_DIRECTIVES, Router} from '@angular/router-deprecated';

import {GlobalFunctions} from "../global/global-functions";
import {FooterComponent} from "../fe-core/components/footer/footer.component";

import {HeaderComponent} from "../fe-core/components/header/header.component";

import {AboutUsPage} from "../webpages/about-us-page/about-us.page";
import {ContactUsPage} from "../webpages/contactus-page/contactus.page";
import {DisclaimerPage} from "../webpages/disclaimer-page/disclaimer.page";
import {ErrorPage} from "../webpages/error-page/error-page.page";
import {SearchPage} from '../webpages/search-page/search.page';


import {ListPage} from "../webpages/list-page/list.page";

import {ArticlePages} from "../webpages/article-pages/article-pages.page";

import {ArticleDataService} from "../global/global-article-page-service";
import {HeadlineDataService} from "../global/global-ai-headline-module-service";

import {SanitizeHtml} from "../fe-core/pipes/safe.pipe";
import {SanitizeStyle} from "../fe-core/pipes/safe.pipe";
import {GlobalSettings} from "../global/global-settings";

//FOR DEEP DIVE
import {SyndicatedArticlePage} from "../webpages/syndicated-article-page/syndicated-article-page.page";
import {DeepDivePage} from "../webpages/deep-dive-page/deep-dive.page";
import {PartnerHeader} from "../global/global-service";
declare var jQuery: any;

@Component({
    selector: 'my-app',
    templateUrl: './app/app-webpage/app.webpage.html',
    directives: [
        //Components for Main Layout
        HeaderComponent,
        FooterComponent,

        //Routing Directives
        RouterOutlet,
        ROUTER_DIRECTIVES
    ],
    providers: [PartnerHeader, ArticleDataService, HeadlineDataService],
    pipes:[SanitizeHtml, SanitizeStyle]
})

@RouteConfig([
    //Home Page
    {
      path: '/',
      name: 'Home-page',
      component: DeepDivePage,
      useAsDefault: true
    },
    //Misc. Pages

    {
        path: '/about-us',
        name: 'About-us-page',
        component: AboutUsPage,
    },
    {
        path: '/contact-us',
        name: 'Contact-us-page',
        component: ContactUsPage,
    },
    {
        path: '/disclaimer',
        name: 'Disclaimer-page',
        component: DisclaimerPage,
    },
    {
        path: '/search/:query',
        name: 'Search-page',
        component: SearchPage
    },
    //Module Pages
    {
        path: '/list/:query',
        name: 'Dynamic-list-page',
        component: ListPage
    },
    {
        path: '/list/:target/:statName/:season/:ordering/:perPageCount/:pageNumber',
        name: 'List-page',
        component: ListPage
    },
    {
        path: '/articles/:eventType/:eventID',
        name: 'Article-pages',
        component: ArticlePages
	  },
    {
        path: '/news/:articleType/:eventID',
        name: 'Syndicated-article-page',
        component: SyndicatedArticlePage
	  },
    {
        path: '/error',
        name: 'Error-page',
        component: ErrorPage
    },
    {
        path: '/not-found',
        name: 'NotFound-page',
        component: ErrorPage
    },
    {
        path: '/*path',
        redirectTo: ['NotFound-page']
    }
])

export class AppComponent implements OnInit{
  public partnerID: string;
  public partnerData: Object;
  public partnerScript:string;
  public shiftContainer:string;
  public hideHeader: boolean;
  private isPartnerZone:boolean = false;
  constructor(private _params: RouteParams,private _partnerData: PartnerHeader){
    this.hideHeader = GlobalSettings.getHomeInfo().hide;
    if(window.location.hostname.split(".")[0].toLowerCase() == "football"){
        this.partnerID = window.location.hostname.split(".")[1] + "." + window.location.hostname.split(".")[2];
        this.getPartnerHeader();
    }
  }

  getHeaderHeight(){
    var pageHeader = document.getElementById('pageHeader');
    if(pageHeader != null){
      return pageHeader.offsetHeight;
    }
  }

  getPartnerHeader(){//Since it we are receiving
    if(this.partnerID != null){
      this._partnerData.getPartnerData(this.partnerID)
        .subscribe(
          partnerScript => {
            this.partnerData = partnerScript;
            this.partnerScript = this.partnerData['results'].header.script;
          }
        );
    }
  }

  ngDoCheck(){
    var checkHeight = this.getHeaderHeight();
    if(this.shiftContainer != (checkHeight + 'px')){
      this.shiftContainer = checkHeight + 'px';
    }
  }

  setPageSize(){
    function getPartnerHeaderHeight(){
        var scrollTop = jQuery(window).scrollTop();
        var partnerHeight = 0;
        if( document.getElementById('partner') != null && scrollTop <=  (document.getElementById('partner').offsetHeight)){
            partnerHeight = document.getElementById('partner').offsetHeight - scrollTop;
        }
        return partnerHeight;
    }

    jQuery("#webContainer").removeClass('deep-dive-container directory-rails pick-a-team-container profile-container');
    // Handle all the exceptions here
    jQuery("deep-dive-page").parent().addClass('deep-dive-container');
    jQuery("directory-page").parent().addClass('directory-rails');
    jQuery("home-page").parent().addClass('pick-a-team-container');
    // Handle the basic (consistent) pages here
    // if(jQuery("deep-dive-page").add("directory-page").add("home-page").length < 1) {
    //     jQuery("sidekick-wrapper").parent().parent().addClass('basic-container');
    // }
    var isTakenOver = false;
    var intvl = setInterval(function(){
      //Looking at component/module tags
        var pageWrappers = jQuery("deep-dive-page").add("article-pages").add("syndicated-article-page").add("directory-page").add("home-page");
        // should only run once
        if (!isTakenOver && pageWrappers.add("sidekick-wrapper").length > 0 ){
            jQuery("#webContainer").removeClass('deep-dive-container directory-rails pick-a-team-container profile-container');
            // Handle all the exceptions here
            jQuery("deep-dive-page").parent().addClass('deep-dive-container');
            jQuery("directory-page").parent().addClass('directory-rails');
            jQuery("home-page").parent().addClass('pick-a-team-container');

            // Handle the basic (consistent) pages here
            // if(pageWrappers.length < 1) {
            //     jQuery("sidekick-wrapper").parent().parent().addClass('basic-container');
            // }
            //This has to be resize to trigger the takeover update
            try {
                window.dispatchEvent(new Event('resize'));
            }catch(e){
                //to run resize event on IE
                var resizeEvent = document.createEvent('UIEvents');
                resizeEvent.initUIEvent('resize', true, false, window, 0);
                window.dispatchEvent(resizeEvent);
            }
            isTakenOver = true;
            clearInterval(intvl);
            jQuery('#ddto-left-ad').css('top', (getPartnerHeaderHeight() + 65) + "px");
            jQuery('#ddto-right-ad').css('top', (getPartnerHeaderHeight() + 65) + "px");
        }
    },100);
    window.addEventListener("scroll",  function(){
        jQuery('#ddto-left-ad').css('top', (getPartnerHeaderHeight() + 65) + "px");
        jQuery('#ddto-right-ad').css('top', (getPartnerHeaderHeight() + 65) + "px");
    });

  }

  ngOnInit(){
    if(jQuery(".ddto-left-rail").length == 0) {
      var script = document.createElement("script");
      script.src = '//w1.synapsys.us/widgets/deepdive/rails/rails_2-0.js?selector=.web-container&adMarginTop=65&vertical=nfl';
      document.head.appendChild(script);
    }
    else {
      jQuery(".ddto-left-rail").remove();
      jQuery(".ddto-right-rail").remove();
      var script = document.createElement("script");
      script.src = '//w1.synapsys.us/widgets/deepdive/rails/rails_2-0.js?selector=.web-container&adMarginTop=65&vertical=nfl';
      document.head.appendChild(script);
    }
      this.shiftContainer = this.getHeaderHeight() + 'px';
      //  Need this for when you navigate to new page.  Load event is triggered from app.domain.ts
      window.addEventListener("load", this.setPageSize);
      // Initialize the first time app.webpage.ts loads
      this.setPageSize();


  }
}
