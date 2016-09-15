import {Component, OnInit, Input} from '@angular/core';
import {RouteParams} from "@angular/router-deprecated";
import {Title} from '@angular/platform-browser';

import {BackTabComponent} from "../../fe-core/components/backtab/backtab.component";
import {TitleComponent, TitleInputData} from "../../fe-core/components/title/title.component";
import {CircleImageData} from "../../fe-core/components/images/image-data";
import {PlayerStatsComponent} from "../../fe-core/components/player-stats/player-stats.component";
import {LoadingComponent} from '../../fe-core/components/loading/loading.component';
import {ErrorComponent} from '../../fe-core/components/error/error.component';
import {DropdownComponent} from '../../fe-core/components/dropdown/dropdown.component';

import {PlayerStatsService} from '../../services/player-stats.service';
import {ProfileHeaderService} from '../../services/profile-header.service';
import {MLBPlayerStatsTableData, MLBPlayerStatsTableModel} from '../../services/player-stats.data';

import {Division, Conference, SportPageParameters} from '../../global/global-interface';
import {GlobalFunctions} from '../../global/global-functions';
import {GlobalSettings} from "../../global/global-settings";
import {VerticalGlobalFunctions} from '../../global/vertical-global-functions';
import {SidekickWrapper} from "../../fe-core/components/sidekick-wrapper/sidekick-wrapper.component";
import {ResponsiveWidget} from "../../fe-core/components/responsive-widget/responsive-widget.component";

@Component({
    selector: 'Player-stats-page',
    templateUrl: './app/webpages/player-stats-page/player-stats.page.html',

    directives: [SidekickWrapper, BackTabComponent, TitleComponent, PlayerStatsComponent, LoadingComponent, ErrorComponent, DropdownComponent, ResponsiveWidget],
    providers: [ProfileHeaderService, PlayerStatsService],
})

export class PlayerStatsPage implements OnInit {
  public tabs: Array<MLBPlayerStatsTableData>;

  public pageParams: SportPageParameters = {}

  public titleData: TitleInputData = {
    imageURL: "/app/public/profile_placeholder.png",
    imageRoute: null,
    text1: "Last Updated: [date]",
    text2: "United States",
    text3: "Player Stats",
    icon: "fa fa-map-marker"
  }

  profileLoaded: boolean = false;
  hasError: boolean = false;
  lastUpdatedDateSet:boolean = false;
    tabName:string;


  constructor(private _params: RouteParams,
              private _title: Title,
              private _profileService: ProfileHeaderService,
              private _statsService: PlayerStatsService) {
    this._title.setTitle(GlobalSettings.getPageTitle("Player Stats"));
    var teamId = _params.get("teamId");
    if ( teamId !== null && teamId !== undefined ) {
      this.pageParams.teamId = Number(teamId);
    }
    if(this.tabName=="undefined"){
        this.tabName="Passing";
    }

  }

  ngOnInit() {
    if ( this.pageParams.teamId ) {
      this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(
        data => {
          this.profileLoaded = true;
          this.pageParams = data.pageParams;
          this._title.setTitle(GlobalSettings.getPageTitle("Player Stats", data.teamName));
          var teamRoute = VerticalGlobalFunctions.formatTeamRoute(data.teamName, data.pageParams.teamId ? data.pageParams.teamId.toString() : null);
          this.setupTitleData(teamRoute, data.teamName, data.fullProfileImageUrl);
          this.tabs = this._statsService.initializeAllTabs(data.teamName, false);
        },
        err => {
          this.hasError = true;
          console.log("Error getting player stats data for " + this.pageParams.teamId + ": " + err);
        }
      );
    }
    else {
      this._title.setTitle(GlobalSettings.getPageTitle("Player Stats", "MLB"));
      this.setupTitleData(["League-page"]);
    }
  }

  private setupTitleData(route: Array<any>, teamName?: string, imageUrl?: string) {
    var title = this._statsService.getPageTitle(teamName);
    this.titleData = {
      imageURL: imageUrl,
      imageRoute: route,
      text1: "",
      text2: "United States",
      text3: title,
      icon: "fa fa-map-marker"
    };
  }

  private playerStatsTabSelected(tabData: Array<any>) {

    this._statsService.getStatsTabData(tabData, this.pageParams, data => {
        this.getLastUpdatedDateForPage(data);

        var seasonArray=tabData[0];
        var seasonIds=seasonArray.seasonIds;
        var seasonTab = seasonIds.find(function (e) {
            if( e.value===tabData[1]){
                return true;
            }

        });

        if (tabData[0].tabActive=="Special"){
            if(seasonTab){
               //console.log("year clicked");
            }else{
                this.tabName=tabData[1];
            }
        }else{
            this.tabName=tabData[0].tabActive;
        };
        //tabData[0].tabActive!="Special"&&tabData[1]!="2015"||tabData[1]!="2014"?this.tabName=tabData[1]:this.tabName=tabData[0].tabActive;

      });
  }

  private getLastUpdatedDateForPage(table: MLBPlayerStatsTableModel) {
    //Getting the first 'lastUpdatedDate' listed in the StandingsData
    if ( !this.lastUpdatedDateSet && table && table.rows && table.rows.length > 0 ) {
      var lastUpdated = table.rows[0].lastUpdate;
      this.titleData.text1 = "Last Updated: " + GlobalFunctions.formatUpdatedDate(lastUpdated, false);
      this.lastUpdatedDateSet = true;
    }
  }
}
