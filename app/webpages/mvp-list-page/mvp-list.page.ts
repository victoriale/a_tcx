import {Component, Output,EventEmitter, OnInit} from '@angular/core';
import {Router, ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';
import {Title} from '@angular/platform-browser';

import {TitleComponent, TitleInputData} from '../../fe-core/components/title/title.component';
import {BackTabComponent} from '../../fe-core/components/backtab/backtab.component';
import {DraftHistoryService} from '../../services/draft-history.service';
import {VerticalGlobalFunctions} from '../../global/vertical-global-functions';
import {ListPageService, positionMVPTabData} from '../../services/list-page.service';
import {FooterStyle} from '../../fe-core/components/module-footer/module-footer.component';
import {ProfileHeaderService} from '../../services/profile-header.service';
import {PaginationFooter, PaginationParameters} from '../../fe-core/components/pagination-footer/pagination-footer.component';
import {LoadingComponent} from "../../fe-core/components/loading/loading.component";
import {ErrorComponent} from "../../fe-core/components/error/error.component";
import {GlobalFunctions} from "../../global/global-functions";
import {GlobalSettings} from "../../global/global-settings";
import {DynamicWidgetCall} from "../../services/dynamic-list-page.service";
import {SidekickWrapper} from "../../fe-core/components/sidekick-wrapper/sidekick-wrapper.component";
import {MVPListComponent, MVPTabData} from '../../fe-core/components/mvp-list/mvp-list.component';
import {ResponsiveWidget} from '../../fe-core/components/responsive-widget/responsive-widget.component';

@Component({
    selector: 'mvp-list-page',
    templateUrl: './app/webpages/mvp-list-page/mvp-list.page.html',
    directives: [ROUTER_DIRECTIVES, SidekickWrapper, ErrorComponent, LoadingComponent, PaginationFooter, BackTabComponent, TitleComponent, MVPListComponent, ResponsiveWidget],
    providers: [ListPageService, ProfileHeaderService, Title],
    inputs:[]
})

export class MVPListPage implements OnInit{

  @Output() tabSelectedListener = new EventEmitter();

  scope: string;
  tabs: Array<positionMVPTabData>;
  profileHeaderData: TitleInputData;
  paginationParameters:PaginationParameters;
  listType: string;
  position: string;
  tab: string;
  pageNum: any;
  queryParams: any;
  isError: boolean = false;
  selectedTabName: string;
  globalMVPPosition: string;
  season: number;
  listMax:number = 20;

  displayPosition: string;

  public sportLeagueAbbrv: string = GlobalSettings.getSportLeagueAbbrv().toLowerCase();
  public collegeDivisionAbbrv: string = GlobalSettings.getCollegeDivisionAbbrv();
  public collegeDivisionFullAbbrv: string = GlobalSettings.getCollegeDivisionFullAbbrv();

  footerStyle: FooterStyle = {
    ctaBoxClass: " mvp-page-car-footer",
    ctaBtnClass:"",
    hasIcon: true,
  };

  constructor(private _service:ListPageService,
              private _params: RouteParams,
              private _profileService: ProfileHeaderService,
              private _title: Title, private _router: Router) {
    _title.setTitle(GlobalSettings.getPageTitle("Most Valuable Players"));

    GlobalSettings.getParentParams(this._router, parentParams => {
        this.scope = parentParams.scope;

        this.listType = _params.get("type");
        this.tab = _params.get("tab");
        this.pageNum = _params.get("pageNum");

        //Initial set for global MVP position
        this.globalMVPPosition = this.listType;
        this.position = this.listType;

        this.queryParams = { //Initial load for mvp Data
          scope: this.scope, //TODO change to active scope
          target: 'player',
          position: this.listType,
          statName: this.tab,
          ordering: 'asc',
          perPageCount: 20,
          pageNumber: this.pageNum,
          season: '2015'
        };
        this.startUp();
    });
  }

  ngOnInit(){
    this.position = this.listType;
  }

  startUp(){
    if ( this.scope == this.collegeDivisionAbbrv.toLowerCase() ) {
      this.scope = this.collegeDivisionFullAbbrv;
    }

    this.displayPosition = this.listType != null ? VerticalGlobalFunctions.convertPositionAbbrvToPlural(this.listType) : this.globalMVPPosition;

    this.profileHeaderData = {
      imageURL: GlobalSettings.getSiteLogoUrl(), //TODO
      imageRoute: ["League-page"],
      text1: 'Last Updated: ',//+ GlobalFunctions.formatUpdatedDate(data.listData[0].lastUpdate),
      text2: 'United States',
      text3: "Most Valuable Players - " + this.scope.toUpperCase() + this.displayPosition,
      icon: 'fa fa-map-marker'
    };

    this._profileService.getLeagueProfile()
      .subscribe(data => {
        this.profileHeaderData = {
          imageURL: GlobalSettings.getImageUrl(data.headerData.leagueLogo),
          imageRoute: ["League-page"],
          text1: 'Last Updated: ' + GlobalFunctions.formatUpdatedDate(data.headerData.lastUpdated),
          text2: 'United States',
          text3: "Most Valuable Players - " + this.scope.toUpperCase() + " " + this.displayPosition,
          icon: 'fa fa-map-marker'
        };
        this.loadTabs();
      }, err => {
        console.log("Error loading profile");
      });
  }


  loadTabs() {
    this.tabs = this._service.getMVPTabs(this.listType, 'page');

    if ( this.tabs != null && this.tabs.length > 0 ) {
      var selectedTab = this.tabs.filter(tab => tab.tabDataKey == this.queryParams.statName)[0];

      if ( this.queryParams.statName ) {
        var matchingTabs = this.tabs.filter(tab => tab.tabDataKey == this.queryParams.statName);

        if ( matchingTabs.length > 0 ) {
          selectedTab = matchingTabs[0];
        }
      }
      this.selectedTabName = selectedTab.tabDisplayTitle;

      this.getStandardList(selectedTab);
    }
  }

  //PAGINATION
  //sets the total pages for particular lists to allow client to
  //move from page to page without losing the sorting of the list
  setPaginationParams(input) {
      var params = this._params.params;

      //path: '/directory/:type/:startsWith/page/:page',
      var navigationParams = {
        type: this.listType,
        tab: this.tab,
        pageNum: this.pageNum
      };

      if(params['scope'] != null) {
         navigationParams['scope'] = params['scope'];
      }

      var navigationPage = 'MVP-list-tab-page';
      let max = Math.ceil(input.listInfo.resultCount/this.listMax); //NEED Number of entries from API

      this.paginationParameters = {
        index: params['pageNum'] != null ? Number(params['pageNum']) : null,
        max: max,
        paginationType: 'page',
        navigationPage: navigationPage,
        navigationParams: navigationParams,
        indexKey: 'pageNum'
      };
  } //setPaginationParams(input)

  getStandardList(tab: positionMVPTabData){

    this.queryParams.statName = tab.tabDataKey;

    this._service.getListModuleService(tab, this.queryParams)
      .subscribe(
        tab => {
          if ( tab.data.listInfo ) {
            tab.data.listInfo.pageNum = this.pageNum;
          }
          this.setPaginationParams(tab.data);
        },
        err => {
          this.isError = true;
          console.log('Error: List MVP API: ', err);
        }
      );
  }

  tabSelected(event) {

    var tabRoute;
    var tabNameFrom = this.selectedTabName; //get the tab we are changing from into a var before we change it
    var tabNameTo = event.tab.tabDisplayTitle;

    if ( this.selectedTabName != event.tab.tabDisplayTitle ) {
      this.queryParams.pageNum = this.pageNum;
    }
    if (!event.tab.listData) { //let the page handle the service call if there's no data
      this.getStandardList(event.tab);
    }
    else {

    }
    this.selectedTabName = event.tab.tabDisplayTitle;//line added to update the current tab variable when tabs are changed without reloading the page

    //actually redirect the page on tab change to update the URL for deep linking and to fix the pagination bug
    if (tabNameTo !== tabNameFrom) {
      tabRoute = ["MVP-list-tab-page", { type: event.position, tab: event.tab.tabDataKey, pageNum: this.pageNum}];
      this._router.navigate(tabRoute);
     }
     this.tabs = this.checkToResetTabs(event);

     if(event.tab != null){
       var matches = this.checkMatchingTabs(event);
       this.globalMVPPosition = event.position;

       if (matches != null) {
         tabRoute = ["MVP-list-tab-page", { type: event.position, tab: matches.tabDataKey, pageNum: this.pageNum}];
         this._router.navigate(tabRoute);
       }
     }
  } //tabSelected(tab: positionMVPTabData)

  private positionDropdown(event) {

    var pageRoute;
    this.tabs = this.checkToResetTabs(event);

    if(event.tab != null){

      var matches = this.checkMatchingTabs(event);

      this.globalMVPPosition = event.position;

      if(matches != null){
        this.queryParams = {
          scope:  this.scope, //TODO change to active scope
          target: 'player',
          position: event.position,
          statName: matches.tabDataKey,
          ordering: 'asc',
          perPageCount: this.listMax,
          pageNumber: this.pageNum,
          season: '2015'
        }
        this.getStandardList(matches);
      }

      pageRoute = ["MVP-list-tab-page", { type: event.position, tab: matches.tabDataKey, pageNum: this.pageNum}];
      this._router.navigate(pageRoute);
    }
  }

  private checkToResetTabs(event) {
    let localPosition = event.position;

    if ( localPosition != this.globalMVPPosition ) {
      return this._service.getMVPTabs(event.position, 'page');
    } else {
      return this.tabs;
    } //private checkToResetTabs
  } //private checkToResetTabs

  private checkMatchingTabs(event) {
    let tabRoute;
    let localPosition = event.position;
    let listName = event.tab.tabDataKey;

    if(event.position != this.globalMVPPosition){
      this.tabs[0].isLoaded = false;
      return this.tabs[0];
    } else {
      return this.tabs.filter(tab => tab.tabDataKey == this.queryParams.statName)[0];
    }
  } //private checkMatchingTabs
}
