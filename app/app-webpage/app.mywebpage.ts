import {Component, OnInit} from '@angular/core';
import {RouteParams, RouteConfig, RouterOutlet, ROUTER_DIRECTIVES} from '@angular/router-deprecated';

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

import {PartnerHeader} from "../global/global-service";
import {SanitizeHtml} from "../fe-core/pipes/safe.pipe";
import {SanitizeStyle} from "../fe-core/pipes/safe.pipe";
import {GlobalSettings} from "../global/global-settings";

//FOR DEEP DIVE
import {DeepDivePage} from "../webpages/deep-dive-page/deep-dive.page";
import {SyndicatedArticlePage} from "../webpages/syndicated-article-page/syndicated-article-page.page";
declare var jQuery: any;

@Component({
    selector: 'my-house',
    templateUrl: './app/app-webpage/app.webpage.html',

    directives: [
        //Components for Main Layout
        HeaderComponent,
        FooterComponent,

        //Routing Directives
        RouterOutlet,
        ROUTER_DIRECTIVES
    ],
    providers: [ArticleDataService, HeadlineDataService, PartnerHeader],
    pipes:[SanitizeHtml,SanitizeStyle]
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
        path: '/about',
        name: 'About-us-page',
        component: AboutUsPage,
    },
    {
        path: '/contactus',
        name: 'Contact-us-page',
        component: ContactUsPage,
    },
    {
        path: '/disclaimer',
        name: 'Disclaimer-page',
        component: DisclaimerPage,
    },
    {
        path: '/s/:query',
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
    },
])

export class MyAppComponent implements OnInit{
  public partnerID: string;
  public partnerData: Object;
  public partnerScript:string;
  public shiftContainer:string;
  public hideHeader:boolean;
  private isPartnerZone:boolean = false;
  constructor(private _partnerData: PartnerHeader, private _params: RouteParams){
    var parentParams = _params.params;

    if( parentParams['partner_id'] !== null){
        this.partnerID = parentParams['partner_id'];
        this.getPartnerHeader();
    }

    this.hideHeader = GlobalSettings.getHomeInfo().hide;
  }

  getHeaderHeight(){
    var pageHeader = document.getElementById('pageHeader');
    // console.log("page header", pageHeader);
    if(pageHeader != null){
      // console.log("page header", pageHeader.offsetHeight);
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
    }else{
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
            jQuery('#ddto-left-ad').css('top', (getPartnerHeaderHeight() + 100) + "px");
            jQuery('#ddto-right-ad').css('top', (getPartnerHeaderHeight() + 100) + "px");
        }
    },100);
    window.addEventListener("scroll",  function(){
        jQuery('#ddto-left-ad').css('top', (getPartnerHeaderHeight() + 100) + "px");
        jQuery('#ddto-right-ad').css('top', (getPartnerHeaderHeight() + 100) + "px");
    });
  }

  ngOnInit(){
    var script = document.createElement("script");
    script.src = '//w1.synapsys.us/widgets/deepdive/rails/rails_2-0.js?selector=.web-container&adMarginTop=65&vertical=nfl';
    document.head.appendChild(script);
    this.shiftContainer = this.getHeaderHeight() + 'px';
    //  Need this for when you navigate to new page.  Load event is triggered from app.domain.ts
    window.addEventListener("load", this.setPageSize);
    // Initialize the first time app.webpage.ts loads
    this.setPageSize();
  }
}
