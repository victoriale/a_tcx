import {Component, OnInit} from '@angular/core';
import {Router, RouteParams} from '@angular/router-deprecated';
import {Title} from '@angular/platform-browser';

import {TitleComponent, TitleInputData} from '../../fe-core/components/title/title.component';
import {BackTabComponent} from '../../fe-core/components/backtab/backtab.component';
import {TransactionsService} from '../../services/transactions.service';
import {ProfileHeaderService} from '../../services/profile-header.service';
import {LoadingComponent} from "../../fe-core/components/loading/loading.component";
import {ErrorComponent} from "../../fe-core/components/error/error.component";
import {GlobalSettings} from "../../global/global-settings";
import {GlobalFunctions} from "../../global/global-functions";
import {VerticalGlobalFunctions} from "../../global/vertical-global-functions";
import {SidekickWrapper} from "../../fe-core/components/sidekick-wrapper/sidekick-wrapper.component";
import {TransactionsComponent, TransactionTabData} from '../../fe-core/components/transactions/transactions.component';
import {SportPageParameters} from '../../global/global-interface';
import {PaginationFooter, PaginationParameters} from '../../fe-core/components/pagination-footer/pagination-footer.component';
import {ResponsiveWidget} from '../../fe-core/components/responsive-widget/responsive-widget.component';

declare var moment:any;

@Component({
    selector: 'transactions-page',
    templateUrl: './app/webpages/transactions-page/transactions.page.html',
    directives: [PaginationFooter, SidekickWrapper, ErrorComponent, LoadingComponent, BackTabComponent, TitleComponent, TransactionsComponent, ResponsiveWidget],
    providers: [TransactionsService, ProfileHeaderService, Title],
    inputs:[]
})

export class TransactionsPage implements OnInit{
  profileHeaderData: TitleInputData;
  pageParams:SportPageParameters;

  tabs: Array<TransactionTabData>;

  isError: boolean = false;
  profileName: string;
  sort: string = "desc";
  limit: number;
  pageNum: number;
  selectedTabKey: string;
  listSort: string = "recent";

  transactionsActiveTab: any;
  transactionsData:TransactionTabData;
  transactionFilter1: Array<any>;
  dropdownKey1: string;

  paginationParameters: PaginationParameters;

  public scope: string;
  public partnerID:string;
  public sportLeagueAbbrv: string = GlobalSettings.getSportLeagueAbbrv();
  public collegeDivisionAbbrv: string = GlobalSettings.getCollegeDivisionAbbrv();

  constructor(private _router:Router,
              private _transactionsService:TransactionsService,
              private _profileService:ProfileHeaderService,
              private _params: RouteParams,
              private _title: Title) {

    _title.setTitle(GlobalSettings.getPageTitle("Transactions"));

    this.pageParams = {
      teamId: _params.get("teamId") ? Number(_params.get("teamId")) : null
    };

    GlobalSettings.getParentParams(this._router, parentParams => {
        this.partnerID = parentParams.partnerID;
        this.scope = parentParams.scope;
      }
    );

    this.limit = Number(this._params.params['limit']);
    this.pageNum = Number(this._params.params['pageNum']);

    if ( this.pageNum === 0 ) {
      this.pageNum = 1; //page index starts at one
    }
  }

  ngOnInit(){
    this.getProfileInfo();
  }

  getProfileInfo() {
    if ( this.pageParams.teamId ) {
      this._profileService.getTeamProfile(this.pageParams.teamId)
      .subscribe(
          data => {
            //var stats = data.headerData.stats;
            var profileHeaderData = this._profileService.convertTeamPageHeader(data, "");
            this.profileName = data.headerData.teamMarket + " " + data.headerData.teamName;
            this._title.setTitle(GlobalSettings.getPageTitle("Transactions", this.profileName));
            this.tabs = this._transactionsService.getTabsForPage(this.profileName, this.pageParams.teamId);
            profileHeaderData.text3 = this.tabs[0].tabDisplay + ' - ' + this.profileName;
            this.profileHeaderData = profileHeaderData;

            var teamRoute = VerticalGlobalFunctions.formatTeamRoute(data.teamName, this.pageParams.teamId.toString());
          },
          err => {
            this.isError= true;
              console.error('Error: transactionsData Profile Header API: ', err);
              // this.isError = true;
          }
      );
    }
    else {
      this._profileService.getLeagueProfile()
        .subscribe(
          data => {
            this.profileName = this.scope.toUpperCase();
            var profileHeaderData = this._profileService.convertLeagueHeader(data.headerData, "");
            this._title.setTitle(GlobalSettings.getPageTitle("Transactions", this.profileName));

            this.tabs = this._transactionsService.getTabsForPage(this.profileName, this.pageParams.teamId);
            profileHeaderData.text3 = this.tabs[0].tabDisplay + ' - ' + this.profileName;
            this.profileHeaderData = profileHeaderData;

            var teamRoute = VerticalGlobalFunctions.formatTeamRoute(this.profileName, null);
          },
          err => {
            this.isError= true;
              console.error('Error: transactionsData Profile Header API: ', err);
              // this.isError = true;
          }
        )
    }
  } //getProfileInfo()

  getTransactionsPage() {
    var matchingTabs = this.tabs.filter(tab => tab.tabDataKey == this.selectedTabKey);
    if ( matchingTabs.length > 0 ) {
      var tab = matchingTabs[0];

      this._transactionsService.getTransactionsService(this.transactionsActiveTab, this.pageParams.teamId, 'page', this.dropdownKey1, 'desc', this.limit, this.pageNum)
        .subscribe(
          transactionsData => {

            if ( this.transactionFilter1 == undefined ) {
              this.transactionFilter1 = this._transactionsService.formatYearDropown();
              if(this.dropdownKey1 == null){
                this.dropdownKey1 = this.transactionFilter1[0].key;
              }
            }

            this.setPaginationParams(transactionsData);
        }, err => {
          console.log("Error loading transaction data");
        })
    }
  } //getTransactionsPage()

  transactionsTab(tab) {
    if ( this.selectedTabKey ) {
      this.profileHeaderData.text3 = tab.tabDisplay + ' - ' + this.profileName;
    }
    this.selectedTabKey = tab.tabDataKey;
    this.transactionsActiveTab = tab;

    this.getTransactionsPage();
  } //transactionsTab(tab)

  transactionsFilterDropdown(filter) {
    if ( this.transactionsActiveTab == null ) {
      this.transactionsActiveTab = this.transactionsData[0];
    }
    this.dropdownKey1 = filter;

    this.getTransactionsPage();
  } //transactionsFilterDropdown(filter)

  setPaginationParams(input) {
      var params = this._params.params;

      //path: '/directory/:type/:startsWith/page/:page',
      var navigationParams = {
        limit: params['limit'],
        pageNum: params['pageNum']
      };

      if(params['scope'] != null) {
         navigationParams['scope'] = params['scope'];
      }

      if(params['teamId'] != null) {
         navigationParams['teamId'] = params['teamId'];
      }

      if(params['teamName'] != null) {
         navigationParams['teamName'] = params['teamName'];
      }

      var navigationPage = params['teamId'] != null ? 'Transactions-page' : 'Transactions-tdl-page';
      let max = Math.ceil(input.totalTransactions/this.limit); //NEED Number of entries from API

      this.paginationParameters = {
        index: params['pageNum'] != null ? Number(params['pageNum']) : null,
        max: max,
        paginationType: 'page',
        navigationPage: navigationPage,
        navigationParams: navigationParams,
        indexKey: 'pageNum'
      };
  } //setPaginationParams(input)
}
