import {Component, OnInit} from '@angular/core';
import {Router, ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';
import {Title} from '@angular/platform-browser';

import {GlobalSettings} from "../../global/global-settings";
import {DetailedListItem, DetailListInput} from '../../fe-core/components/detailed-list-item/detailed-list-item.component';
import {ModuleFooter, ModuleFooterData, FooterStyle} from '../../fe-core/components/module-footer/module-footer.component';
import {SliderCarousel, SliderCarouselInput} from '../../fe-core/components/carousels/slider-carousel/slider-carousel.component';
import {TitleComponent, TitleInputData} from '../../fe-core/components/title/title.component';
import {BackTabComponent} from '../../fe-core/components/backtab/backtab.component';
import {DraftHistoryService} from '../../services/draft-history.service';
import {ListPageService} from '../../services/list-page.service';
import {NoDataBox} from '../../fe-core/components/error/data-box/data-box.component';
import {ProfileHeaderService} from '../../services/profile-header.service';
import {PaginationFooter} from '../../fe-core/components/pagination-footer/pagination-footer.component';
import {LoadingComponent} from "../../fe-core/components/loading/loading.component";
import {ErrorComponent} from "../../fe-core/components/error/error.component";

import {SchedulesService} from '../../services/schedules.service';
import {SchedulesComponent} from '../../fe-core/components/schedules/schedules.component';
import {SidekickWrapper} from "../../fe-core/components/sidekick-wrapper/sidekick-wrapper.component";
import {ResponsiveWidget} from '../../fe-core/components/responsive-widget/responsive-widget.component';

declare var moment;

@Component({
    selector: 'schedules-page',
    templateUrl: './app/webpages/schedules-page/schedules.page.html',
    directives: [ROUTER_DIRECTIVES, SidekickWrapper, SchedulesComponent, ErrorComponent, LoadingComponent,PaginationFooter, BackTabComponent, TitleComponent, SliderCarousel, DetailedListItem,  ModuleFooter, ResponsiveWidget],
    providers: [SchedulesService, ProfileHeaderService, Title],
    inputs:[]
})

export class SchedulesPage implements OnInit{
  profileHeaderData: TitleInputData;
  errorData: any;
  paginationParameters:any;
  isError: boolean = false;
  tabData: any;
  limit:number = 10;
  isFirstRun:number = 0;

  schedulesData:any;
  scheduleFilter1:Array<any>;
  scheduleFilter2:Array<any>;
  selectedFilter1:string
  selectedFilter2:string;
  eventStatus: string;

  initialPage: number;
  initialTabKey: string;
  selectedTabKey: string;
  scope:string;

  constructor(private _schedulesService:SchedulesService,
          private profHeadService:ProfileHeaderService,
          private params: RouteParams,
          private _title: Title, private _router: Router) {
      _title.setTitle(GlobalSettings.getPageTitle("Schedules"));
      this.isFirstRun = 0;
      GlobalSettings.getParentParams(_router, parentParams => {
          this.scope = parentParams.scope;
          this.initialPage = Number(this.params.get("pageNum"));
          this.selectedTabKey = this.params.get("tab");
          this.selectedFilter1 = this.params.get("year");
          if(this.selectedTabKey == null){
            this.selectedTabKey = 'pregame';
          }
          this.initialTabKey = this.selectedTabKey;
          this.eventStatus = this.selectedTabKey;
      });

    }

  //grab tab to make api calls for post of pre event table
  private scheduleTab(tab) {
    this.isFirstRun = 0;
    this.initialPage = 1;
    if(tab == 'Upcoming Games'){
      this.eventStatus = 'pregame';
      this.selectedTabKey = this.eventStatus;
      this.getSchedulesData(this.eventStatus,this.initialPage, null, null);
    }else if(tab == 'Previous Games'){
      this.eventStatus = 'postgame';
      this.selectedTabKey = this.eventStatus;
      this.getSchedulesData(this.eventStatus, this.initialPage, this.selectedFilter1,this.selectedFilter2);
    }else{
      this.eventStatus = 'pregame';
      this.selectedTabKey = this.eventStatus;
      this.getSchedulesData(this.eventStatus, this.initialPage, this.selectedFilter1,this.selectedFilter2);// fall back just in case no status event is present
    }
    // Uncomment if we want to enable URL changing when switching tabs.
    // However! with the way the scroll-to-top is set up, it will move the
    // page to the top each time the tab is changed, which QA doesn't want.
    // if ( this.initialTabKey != this.selectedTabKey ) {
    //   var navigationParams = {
    //     pageNum: 1,
    //     tab: this.selectedTabKey
    //   };

    //   var teamName = this.params.get('teamName');
    //   var teamId = this.params.get('teamId');

    //   if(teamName){
    //     navigationParams['teamName'] = teamName;
    //   }
    //   if(teamId){
    //     navigationParams['teamId'] = teamId;
    //   }
    //   var navigationPage = teamName ? 'Schedules-page-team-tab' : 'Schedules-page-league-tab';
    //   this._router.navigate([navigationPage, navigationParams]);
    // }
  }

  private getSchedulesData(status, pageNum, year?, week?){
    var teamId = this.params.params['teamId']; //determines to call league page or team page for schedules-table
    if(typeof year == 'undefined'){
      year == new Date().getFullYear();
      this.selectedFilter1 = year;
    }
    if(teamId){
      this.profHeadService.getTeamProfile(Number(teamId))
      .subscribe(
        data => {
          this._title.setTitle(GlobalSettings.getPageTitle("Schedules", data.teamName));
          this.profileHeaderData = this.profHeadService.convertTeamPageHeader(data, "Current Season Schedule - " + data.teamName);
          this.errorData = {
            data: data.teamName + " has no record of any more games for the current season.",
            icon: "fa fa-calendar-times-o"
          }
        },
        err => {
          this.isError= true;
          console.log('Error: Schedules Profile Header API: ', err);
          // this.isError = true;
        }
      );
      this._schedulesService.getScheduleTable(this.schedulesData, this.scope, 'team', status, this.limit, this.initialPage, teamId, (schedulesData) => {
        this.schedulesData = schedulesData;
        if(this.schedulesData != null){
          if(status == 'pregame'){
            this.scheduleFilter1=null;
          }else{
            if(this.scheduleFilter1 == null){// only replaces if the current filter is not empty
              this.scheduleFilter1 = schedulesData.seasons;
              if(this.selectedFilter1 == null){
                this.schedulesData.seasons['data'][0].key;
              }
            }
          }
          this.tabData = schedulesData.tabs;
        }else if(this.schedulesData == null){
          this.isError = true;
        }
        this.setPaginationParams(schedulesData.pageInfo, status, pageNum);
      },year, week)
    }else{
      this._title.setTitle(GlobalSettings.getPageTitle("Schedules", "Football"));
      this.profHeadService.getLeagueProfile(this.scope)
      .subscribe(
        data => {
          var currentDate = new Date();// no stat for date so will grab current year client is on
          var display:string;
          if(currentDate.getFullYear() == currentDate.getFullYear()){// TODO must change once we have historic data
            display = "Current Season"
          }
          var pageTitle = display + " Schedules - " + data.headerData.leagueFullName;
          this.profileHeaderData = this.profHeadService.convertLeagueHeader(data.headerData, pageTitle);
          this.errorData = {
            data: data.headerData.leagueFullName + " has no record of any more games for the current season.",
            icon: "fa fa-calendar-times-o"
          }
        },
        err => {
          this.isError = true;
          console.log('Error: Schedules Profile Header API: ', err);
        }
      );
      if(status == 'pregame'){
        this.scheduleFilter1=null;
      }
      this._schedulesService.getScheduleTable(this.schedulesData, this.scope, 'league', status, this.limit, this.initialPage, null, (schedulesData) => {
        this.schedulesData = schedulesData;
        if(this.schedulesData != null){
          if(status == 'pregame'){
            this.scheduleFilter1=null;
          }else{
            if(this.scheduleFilter1 == null){// only replaces if the current filter is not empty
              this.scheduleFilter1 = schedulesData.seasons;
              if(this.selectedFilter1 == null && this.selectedFilter1 != schedulesData.seasons.data[0].key){
                this.selectedFilter1 = this.schedulesData.seasons.data[0].key;
              }
            }
          }
          if(this.scheduleFilter2 == null){
            this.scheduleFilter2 = schedulesData.weeks;
            if(this.selectedFilter2 == null){
              if(this.schedulesData.weeks != null){
                this.selectedFilter2 = this.schedulesData.weeks.data[0].key;
              }
            }
          }
          this.tabData = schedulesData != null ? schedulesData.tabs:null;
        }else if(this.schedulesData == null){
          this.isError = true;
        }
        this.setPaginationParams(schedulesData.pageInfo, status, pageNum);
      },year, week)
    }
  }

  private filterDropdown(filter){
    let tabCheck = 0;
    if(this.eventStatus == 'postgame'){
      tabCheck = 1;
    }
    if(this.isFirstRun > tabCheck){
      var teamId = this.params.params['teamId'];
      let filterChange = false;
      if(filter.value == 'filter1' && this.eventStatus == 'postgame' &&   this.selectedFilter1 != filter.key){
        this.selectedFilter1 = filter.key;
        filterChange = true;
      }
      if(!teamId){
        if(filter.value == 'filter2' && this.selectedFilter2 != filter.key){
          this.selectedFilter2 = filter.key;
          filterChange = true;
        }
      }
      if(filterChange){
        this.isFirstRun = 0;
        this.initialPage = 1;
        this.getSchedulesData(this.eventStatus, this.initialPage, this.selectedFilter1, this.selectedFilter2);
      }
    }
    this.isFirstRun++;
  }

  //PAGINATION
  //sets the total pages for particular lists to allow client to move from page to page without losing the sorting of the list
  setPaginationParams(input, tabKey: string, pageNum: number) {
      // var pageType;
      var navigationParams = {
        pageNum: pageNum,
        tab: tabKey
      };

      var teamName = this.params.get('teamName');
      var teamId = this.params.get('teamId');

      if(teamName){
        navigationParams['teamName'] = teamName;
      }
      if(teamId){
        navigationParams['teamId'] = teamId;
      }

      this.paginationParameters = {
        index: pageNum,
        max: input.totalPages,
        paginationType: 'module',
      };
  }

  newIndex(newPage) {
    window.scrollTo(0,0);
    this.isFirstRun = 0;
    this.initialPage = newPage;

    this.getSchedulesData(this.selectedTabKey, newPage, this.selectedFilter1,this.selectedFilter2);
  }

  ngOnInit() {
    if( !this.initialTabKey ){
      this.initialTabKey = 'pregame';
    }
    if ( this.initialPage <= 0 ) {
      this.initialPage = 1;
    }
    this.getSchedulesData(this.initialTabKey, this.initialPage, this.selectedFilter1,this.selectedFilter2);
  }

}
