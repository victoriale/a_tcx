import {Component, OnInit, Input} from '@angular/core';
import {RouteParams, Router} from "@angular/router-deprecated";
import {Title} from '@angular/platform-browser';

import {BackTabComponent} from "../../fe-core/components/backtab/backtab.component";
import {GlossaryComponent, GlossaryData} from "../../fe-core/components/glossary/glossary.component";

import {TitleComponent, TitleInputData} from "../../fe-core/components/title/title.component";
import {CircleImageData, ImageData} from "../../fe-core/components/images/image-data";
import {StandingsComponent} from "../../fe-core/components/standings/standings.component";
import {LoadingComponent} from '../../fe-core/components/loading/loading.component';
import {ErrorComponent} from '../../fe-core/components/error/error.component';

import {ProfileHeaderService} from '../../services/profile-header.service';
import {StandingsService} from '../../services/standings.service';
import {TDLStandingsTabdata,VerticalStandingsTableData} from '../../services/standings.data';

import {Division, Conference, SportPageParameters} from '../../global/global-interface';
import {GlobalSettings} from '../../global/global-settings';
import {GlobalFunctions} from '../../global/global-functions';
import {VerticalGlobalFunctions} from '../../global/vertical-global-functions';
import {SidekickWrapper} from "../../fe-core/components/sidekick-wrapper/sidekick-wrapper.component";

@Component({
    selector: 'Standings-page',
    templateUrl: './app/webpages/standings-page/standings.page.html',
    directives: [GlossaryComponent, SidekickWrapper, BackTabComponent, TitleComponent, StandingsComponent, LoadingComponent, ErrorComponent],
    providers: [StandingsService, ProfileHeaderService, Title],
})

export class StandingsPage{
  public tabs: Array<TDLStandingsTabdata>;
  public pageParams: SportPageParameters = {}
  public titleData: TitleInputData;
  public profileLoaded: boolean = false;
  public hasError: boolean = false;
  public scope: string;
  public glossary: Array<GlossaryData>;
  public seasonsArray: Array<any>;
  constructor(private _params: RouteParams,
              private _router:Router,
              private _title: Title,
              private _profileService: ProfileHeaderService,
              private _standingsService: StandingsService,
              private _mlbFunctions: VerticalGlobalFunctions) {
    _title.setTitle(GlobalSettings.getPageTitle("Standings"));
    GlobalSettings.getParentParams(_router, parentParams => {
        this.scope = parentParams.scope;
        var type = _params.get("type");
        if ( type !== null && type !== undefined ) {
          type = type.toLowerCase();
          this.pageParams.conference = Conference[type];
        }
        var teamId = _params.get("teamId");
        if ( type == "team" && teamId !== null && teamId !== undefined ) {
          this.pageParams.teamId = Number(teamId);
        }
        this.pageParams.scope = this.scope;
        this.getTabs();
        this.getGlossaryValue();
    });
  }
  getGlossaryValue():Array<GlossaryData>{
    if(this.scope == 'fbs'){
      this.glossary = [
          {
            key: "<span class='text-heavy'>W/L/T</span>",
            value: "Total Wins"
          },
          {
            key: "<span class='text-heavy'>CONF</span>",
            value: "Conference Record"
          },
          {
            key: "<span class='text-heavy'>STRK</span>",
            value: "Current Streak"
          },
          {
            key: "<span class='text-heavy'>HM</span>",
            value: "Home Record"
          },
          {
            key: "<span class='text-heavy'>RD</span>",
            value: "Road Record"
          },
          {
            key: "<span class='text-heavy'>PF</span>",
            value: "Total Points For"
          },
          {
            key: "<span class='text-heavy'>PA</span>",
            value: "Total Points Against"
          },
          {
            key: "<span class='text-heavy'>RANK</span>",
            value: "Team Rank"
          }
        ]
    }else{
      this.glossary = [
          {
            key: "<span class='text-heavy'>W/L/T</span>",
            value: "Total Wins"
          },
          {
            key: "<span class='text-heavy'>PCT</span>",
            value: "Winning Percentage"
          },
          {
            key: "<span class='text-heavy'>DIV</span>",
            value: "Division Record"
          },
          {
            key: "<span class='text-heavy'>CONF</span>",
            value: "Conference Record"
          },
          {
            key: "<span class='text-heavy'>STRK</span>",
            value: "Current Streak"
          },
          {
            key: "<span class='text-heavy'>PF</span>",
            value: "Total Points For"
          },
          {
            key: "<span class='text-heavy'>PA</span>",
            value: "Total Points Against"
          }
        ]
    }
    return this.glossary;
  }
  getTabs() {
    this.getGlossaryValue();
    if ( this.pageParams.teamId ) {
      this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(
        data => {
          this.profileLoaded = true;
          this.pageParams = data.pageParams;
          this.pageParams.scope = this.scope;
          var teamFullName = data.headerData.teamMarket + ' ' + data.headerData.teamName;
          this._title.setTitle(GlobalSettings.getPageTitle("Standings", teamFullName));
          var title = this._standingsService.getPageTitle(this.pageParams, teamFullName);
          this.titleData = this._profileService.convertTeamPageHeader(data, title)
          this.tabs = this._standingsService.initializeAllTabs(this.pageParams);
        },
        err => {
          this.hasError = true;
          console.log("Error getting team profile data for " + this.pageParams.teamId, err);
        }
      );
    }
    else {
      this._title.setTitle(GlobalSettings.getPageTitle("Standings", this.pageParams.scope));
      var title = this._standingsService.getPageTitle(this.pageParams, null);
      this.titleData = this.titleData = {
        imageURL: GlobalSettings.getSiteLogoUrl(),
        imageRoute: ["League-page"],
        text1: "",
        text2: "United States",
        text3: title,
        icon: "fa fa-map-marker"
      }
      this.tabs = this._standingsService.initializeAllTabs(this.pageParams);
    }
  }

  private standingsTabSelected(tabData: Array<any>) {
    this.pageParams.scope = this.scope;
    this._standingsService.getStandingsTabData(tabData, this.pageParams, data => {
      this.getLastUpdatedDateForPage(data);
    });
  }

  private standingsFilterSelected(tabData: Array<any>) {
    this.pageParams.scope = this.scope;
    this._standingsService.getStandingsTabData(tabData, this.pageParams, data => {
      this.getLastUpdatedDateForPage(data);
    });
  }

  private getLastUpdatedDateForPage(data: VerticalStandingsTableData[]) {
      //Getting the first 'lastUpdatedDate' listed in the StandingsData
      if ( data && data.length > 0 &&
        data[0].tableData && data[0].tableData.rows &&
        data[0].tableData.rows.length > 0 ) {
          var lastUpdated = data[0].tableData.rows[0].lastUpdated;
          this.titleData.text1 = "Last Updated: " + GlobalFunctions.formatUpdatedDate(lastUpdated, false);
      }
  }
}
