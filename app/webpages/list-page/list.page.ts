import {Component, OnInit} from '@angular/core';
import {RouteParams} from '@angular/router-deprecated';
import {Title} from '@angular/platform-browser';

import {DetailedListItem, DetailListInput} from '../../fe-core/components/detailed-list-item/detailed-list-item.component';
import {ModuleFooter, ModuleFooterData, FooterStyle} from '../../fe-core/components/module-footer/module-footer.component';
import {SliderCarousel, SliderCarouselInput} from '../../fe-core/components/carousels/slider-carousel/slider-carousel.component';
import {TitleComponent, TitleInputData} from '../../fe-core/components/title/title.component';
import {BackTabComponent} from '../../fe-core/components/backtab/backtab.component';
import {DraftHistoryService} from '../../services/draft-history.service';
import {ListPageService} from '../../services/list-page.service';
import {NoDataBox} from '../../fe-core/components/error/data-box/data-box.component';
import {ProfileHeaderService} from '../../services/profile-header.service';
import {PaginationFooter, PaginationParameters} from '../../fe-core/components/pagination-footer/pagination-footer.component';
import {LoadingComponent} from "../../fe-core/components/loading/loading.component";
import {ErrorComponent} from "../../fe-core/components/error/error.component";
import {GlobalFunctions} from "../../global/global-functions";
import {GlobalSettings} from "../../global/global-settings";
import {DynamicWidgetCall} from "../../services/dynamic-list-page.service";
import {SidekickWrapper} from "../../fe-core/components/sidekick-wrapper/sidekick-wrapper.component";
import {ResponsiveWidget} from '../../fe-core/components/responsive-widget/responsive-widget.component';
import {DropdownComponent} from '../../fe-core/components/dropdown/dropdown.component';

@Component({
    selector: 'list-page',
    templateUrl: './app/webpages/list-page/list.page.html',
    directives: [SidekickWrapper, ErrorComponent, LoadingComponent,PaginationFooter, BackTabComponent, TitleComponent, SliderCarousel, DetailedListItem,  ModuleFooter, ResponsiveWidget, DropdownComponent],
    providers: [ListPageService, DynamicWidgetCall, Title, ProfileHeaderService],
    inputs:[]
})

export class ListPage implements OnInit {
  detailedDataArray: Array<DetailListInput>;
  carouselDataArray: Array<SliderCarouselInput>;
  footerData: ModuleFooterData;
  profileHeaderData: TitleInputData;
  footerStyle: FooterStyle = {
    ctaBoxClass: "list-footer",
    ctaBtnClass:"list-footer-btn",
    hasIcon: true,
  };
  paginationParameters:PaginationParameters;
  isError: boolean = false;
  tw: string;
  sw: string;
  input: string;
  pageNumber: number;
  sortSeason: Array<any>;

  constructor(private listService:ListPageService,
              private _profileService: ProfileHeaderService,
              private params: RouteParams,
              private dynamicWidget: DynamicWidgetCall,
              private _title: Title) {
    _title.setTitle(GlobalSettings.getPageTitle("Lists"));
    if(params.params['query'] != null){
      let query = params.params['query'];
      // Setup this way in case we want to switch out null with some default values
      let twArr = query.match(/tw-(.*?)(\+|$)/);
      this.tw = twArr != null && twArr.length > 1 ? twArr[1] : null;
      let swArr = query.match(/sw-(.*?)(\+|$)/);
      this.sw = swArr != null && swArr.length > 1 ? swArr[1] : null;
      // input always needs to be last item
      let inputArr = query.match(/input-(.*)/);
      this.input = inputArr != null &&  inputArr.length > 1 ? inputArr[1] : null;
      this.pageNumber = 1;
    }
  }

  getListPage(urlParams) {
    if(urlParams.query != null){
      this.getDynamicList();
    }else {
      this.getStandardList(urlParams);
    }
  }

  //PAGINATION
  //sets the total pages for particular lists to allow client to move from page to page without losing the sorting of the list
  setPaginationParams(input) {
      var info = input.listInfo;
      var params = this.params.params;
      var navigationParams = {
        pageNumber: params['pageNumber'],
        statName: params['statName'],
        season: params['season'],
        ordering: params['ordering'],
        perPageCount: params['perPageCount'],
        target: params['target'],
      };
      var navigationPage = this.detailedDataArray ? "List-page" : "Error-page";

      this.paginationParameters = {
        index: params['pageNumber'] != null ? Number(params['pageNumber']) : null,
        max: Number(input.pageCount),
        paginationType: 'page',
        navigationPage: navigationPage,
        navigationParams: navigationParams,
        indexKey: 'pageNumber'
      };
  }

  setDynamicPagination(input) {
    var navigationParams = {
      query: this.params.params['query']
    };

    var navigationPage = this.detailedDataArray ? "Dynamic-list-page" : "Error-page";

    this.paginationParameters = {
      index: this.pageNumber,
      max: Number(input.pageCount),
      paginationType: 'page',
      navigationPage: navigationPage,
      navigationParams: navigationParams,
      indexKey: 'pageNum'
    };
  }


  getStandardList(urlParams, season?){
    var errorMessage = "Sorry, we do not currently have any data for this list";
    this.listService.getListPageService(urlParams, errorMessage, season)
      .subscribe(
        list => {
          this._title.setTitle(GlobalSettings.getPageTitle(list.listDisplayName, "Lists"));
          this.profileHeaderData = list.profHeader;
          if (list.listData.length == 0) {//makes sure it only runs once
            this.detailedDataArray = null;
          } else {
            this.detailedDataArray = list.listData;
          }
          this.setPaginationParams(list.pagination);
          this.carouselDataArray = list.carData;
          this.sortSeason = list.seasons;
        },
        err => {
          this.isError = true;
          console.log('Error: list API: ', err);
          // this.isError = true;
        }
      );
  }

  getDynamicList() {
    if( !this.tw ){
      // Not enough parameter : display error message
      this.isError = true;
      return;
    }
    this.dynamicWidget.getWidgetData(this.tw, this.sw, this.input)
      .subscribe(
        list => {
          this._title.setTitle(GlobalSettings.getPageTitle(list.listDisplayTitle, "Lists"));
          this.profileHeaderData = list.profHeader;
          if (list.listData.length == 0) {//makes sure it only runs once
            this.detailedDataArray = null;
          } else {
            this.detailedDataArray = list.listData;
          }
          this.setDynamicPagination(list.pagination);
          this.carouselDataArray = list.carData;
        },

        err => {
          this.isError = true;
          console.log(err);
        }
      );
  }

  newIndex(index){
    this.pageNumber = index;
    window.scrollTo(0, 0);
  }


  ngOnInit(){
    this._profileService.getLeagueProfile()
    .subscribe(data => {
        this.getListPage(this.params.params);
    }, err => {
        console.log("Error loading MLB profile");
    });
    var date = new Date();
    var dateStr = (Number(date.getFullYear()) - 1).toString() + " / " + date.getFullYear();
    this.sortSeason = [
      {key: (Number(date.getFullYear()) - 1).toString(), value: dateStr}
    ];
  }
  dropdownChanged(event) {
    this.getStandardList(this.params.params, event);
  }
}
