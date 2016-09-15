import {Component, OnInit, Input} from '@angular/core';
import {RouteParams} from "@angular/router-deprecated";
import {Title} from '@angular/platform-browser';

import {BackTabComponent} from "../../fe-core/components/backtab/backtab.component";
import {TitleComponent, TitleInputData} from "../../fe-core/components/title/title.component";
import {CircleImageData, ImageData} from "../../fe-core/components/images/image-data";
import {LoadingComponent} from '../../fe-core/components/loading/loading.component';
import {ErrorComponent} from '../../fe-core/components/error/error.component';
import {MLBSeasonStatsTabData, MLBSeasonStatsTableData} from '../../services/season-stats-page.data';
import {GlobalFunctions} from '../../global/global-functions';
import {VerticalGlobalFunctions} from '../../global/vertical-global-functions';
import {Season, SportPageParameters} from '../../global/global-interface';
import {GlobalSettings} from '../../global/global-settings';

import {SeasonStatsComponent} from "../../fe-core/components/season-stats/season-stats.component";
import {ProfileHeaderService} from '../../services/profile-header.service';
import {SeasonStatsPageService} from '../../services/season-stats.service';
import {SidekickWrapper} from "../../fe-core/components/sidekick-wrapper/sidekick-wrapper.component";
import {ResponsiveWidget} from '../../fe-core/components/responsive-widget/responsive-widget.component';

@Component({
    selector: 'Season-stats-page',
    templateUrl: './app/webpages/season-stats-page/season-stats.page.html',
    directives: [SidekickWrapper, BackTabComponent, TitleComponent, SeasonStatsComponent, LoadingComponent, ErrorComponent, ResponsiveWidget],
    providers: [SeasonStatsPageService, ProfileHeaderService, Title],
})

export class SeasonStatsPage implements OnInit {
  public widgetPlace: string = "widgetForPage";
  public tabs: Array<MLBSeasonStatsTabData>;

  public pageParams: SportPageParameters = {}

  public profileLoaded: boolean = false;

  public hasError: boolean = false;

  public titleData: TitleInputData;

  constructor(private _params: RouteParams,
              private _profileService: ProfileHeaderService,
              private _seasonStatsPageService: SeasonStatsPageService,
              private _mlbFunctions: VerticalGlobalFunctions,
              private _title: Title) {
    _title.setTitle(GlobalSettings.getPageTitle("Season Stats"));
    var playerId = _params.get("playerId");
    this.pageParams.playerId = Number(playerId);
  }

  private setupTitleData(imageUrl: string, teamName: string, playerId: string, playerName: string) {
    var profileLink = ["League-page"];
    if ( playerId ) {
      profileLink = VerticalGlobalFunctions.formatPlayerRoute(teamName, playerName, playerId);
    }
    var title = this._seasonStatsPageService.getPageTitle(this.pageParams, playerName);
    this.titleData = {
      imageURL: imageUrl,
      imageRoute: profileLink,
      text1: "",
      text2: "United States",
      text3: title,
      icon: "fa fa-map-marker"
    };
  }

  ngOnInit() {
    if ( this.pageParams.playerId ) {
      this._profileService.getPlayerProfile(this.pageParams.playerId).subscribe(
        data => {
          this.profileLoaded = true;
          this.pageParams = data.pageParams;
          this._title.setTitle(GlobalSettings.getPageTitle("Season Stats", data.headerData.playerFullName));
          this.setupTitleData(data.fullProfileImageUrl, data.headerData.teamFullName, data.pageParams.playerId.toString(), data.headerData.playerFullName);
          this.tabs = this._seasonStatsPageService.initializeAllTabs(this.pageParams);
        },
        err => {
          this.hasError = true;

          console.log("Error getting season stats data: " + err);
        }
      );
    }
  }

  private seasonStatsTabSelected(tab: MLBSeasonStatsTabData) {
    this._seasonStatsPageService.getSeasonStatsTabData(tab, this.pageParams, data => {
      this.getLastUpdatedDateForPage(data);
    });
  }

  private getLastUpdatedDateForPage(data: MLBSeasonStatsTableData[]) {
      if ( data && data.length > 0 &&
        data[0].tableData && data[0].tableData.rows &&
        data[0].tableData.rows.length > 0 ) {
          var lastUpdated = data[0].tableData.rows[0].lastUpdated;
          this.titleData.text1 = "Last Updated: " + GlobalFunctions.formatUpdatedDate(lastUpdated, false);
      }
  }
}
