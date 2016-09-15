import {Component, OnInit} from '@angular/core';
import {Router, RouteParams, RouteConfig} from '@angular/router-deprecated';
import {Title} from '@angular/platform-browser';

import {SportPageParameters} from '../../global/global-interface';
import {LoadingComponent} from '../../fe-core/components/loading/loading.component';
import {ErrorComponent} from '../../fe-core/components/error/error.component';

import {DYKModule, dykModuleData} from "../../fe-core/modules/dyk/dyk.module";
import {DykService} from '../../services/dyk.service';

import {FAQModule, faqModuleData} from "../../fe-core/modules/faq/faq.module";
import {FaqService} from '../../services/faq.service';

import {BoxScoresModule} from '../../fe-core/modules/box-scores/box-scores.module';
import {BoxScoresService} from '../../services/box-scores.service';

import {TwitterModule, twitterModuleData} from "../../fe-core/modules/twitter/twitter.module";
import {TwitterService} from '../../services/twitter.service';

import {SeasonStatsService} from '../../services/season-stats.service';
import {SeasonStatsModule} from '../../fe-core/modules/season-stats/season-stats.module';

import {ComparisonModule, ComparisonModuleData} from '../../fe-core/modules/comparison/comparison.module';
import {ComparisonStatsService} from '../../services/comparison-stats.service';

import {CommentModule} from '../../fe-core/modules/comment/comment.module';

import {StandingsModule, StandingsModuleData} from '../../fe-core/modules/standings/standings.module';
import {TDLStandingsTabdata} from '../../services/standings.data';
import {StandingsService} from '../../services/standings.service';

import {ProfileHeaderData, ProfileHeaderModule} from '../../fe-core/modules/profile-header/profile-header.module';
import {ProfileHeaderService} from '../../services/profile-header.service';

import {HeadlineComponent} from '../../fe-core/components/headline/headline.component';

import {NewsModule} from '../../fe-core/modules/news/news.module';
import {NewsService} from '../../services/news.service';

import {SchedulesModule} from '../../fe-core/modules/schedules/schedules.module';
import {SchedulesService} from '../../services/schedules.service';

import {GlobalSettings} from "../../global/global-settings";
import {ImagesService} from "../../services/carousel.service";
import {ImagesMedia} from "../../fe-core/components/carousels/images-media-carousel/images-media-carousel.component";
import {GlobalFunctions} from "../../global/global-functions";
import {ListOfListsService} from "../../services/list-of-lists.service";
import {ListOfListsModule} from "../../fe-core/modules/list-of-lists/list-of-lists.module";

import {DailyUpdateModule} from "../../fe-core/modules/daily-update/daily-update.module";
import {DailyUpdateService, DailyUpdateData} from "../../services/daily-update.service";

import {SidekickWrapper} from "../../fe-core/components/sidekick-wrapper/sidekick-wrapper.component";

import {ResponsiveWidget} from '../../fe-core/components/responsive-widget/responsive-widget.component';

declare var moment;

@Component({
    selector: 'Player-page',
    templateUrl: './app/webpages/player-page/player.page.html',
    directives: [
      SidekickWrapper,
      LoadingComponent,
      ErrorComponent,
      SchedulesModule,
      BoxScoresModule,
      ProfileHeaderModule,
      StandingsModule,
      HeadlineComponent,
      CommentModule,
      DYKModule,
      FAQModule,
      TwitterModule,
      SeasonStatsModule,
      ComparisonModule,
      NewsModule,
      ListOfListsModule,
      DailyUpdateModule,
      ImagesMedia,
      ResponsiveWidget
    ],
    providers: [
      BoxScoresService,
      SchedulesService,
      StandingsService,
      ProfileHeaderService,
      ImagesService,
      NewsService,
      FaqService,
      DykService,
      ListOfListsService,
      SeasonStatsService,
      ComparisonStatsService,
      DailyUpdateService,
      TwitterService,
      Title
    ],
})

export class PlayerPage implements OnInit {
  public widgetPlace: string = "widgetForModule";
  pageParams:SportPageParameters;
  partnerID:string = null;
  hasError: boolean = false;

  profileHeaderData: ProfileHeaderData;
  standingsData:StandingsModuleData;
  dailyUpdateData: DailyUpdateData;
  seasonStatsData: any;
  comparisonModuleData: ComparisonModuleData;

  boxScoresData:any;
  currentBoxScores:any;
  dateParam:any;

  imageData:Array<any>;
  copyright:any;
    imageTitle:any;
  profileType:string = "player";
  isProfilePage:boolean = true;
  profileName:string;
  teamName: string;
  teamId:number;
  newsDataArray: Array<Object>;
  faqData: Array<faqModuleData>;
  dykData: Array<dykModuleData>;
  listOfListsData: Object; // paginated data to be displayed
  twitterData: Array<twitterModuleData>;

  schedulesData:any;
  scheduleFilter1:Array<any>;
  selectedFilter1:string;
  eventStatus: string;
  isFirstRun:number = 0;

  scope: string;

  constructor(private _params:RouteParams,
              private _router:Router,
              private _title: Title,
              private _standingsService:StandingsService,
              private _boxScores:BoxScoresService,
              private _schedulesService:SchedulesService,
              private _profileService:ProfileHeaderService,
              private _imagesService:ImagesService,
              private _newsService: NewsService,
              private _faqService: FaqService,
              private _dykService: DykService,
              private _lolService : ListOfListsService,
              private _twitterService: TwitterService,
              private _seasonStatsService: SeasonStatsService,
              private _comparisonService: ComparisonStatsService,
              private _dailyUpdateService: DailyUpdateService) {
      this.pageParams = {
          playerId: Number(_params.get("playerId"))
      };

    GlobalSettings.getParentParams(_router, parentParams => {
        this.partnerID = parentParams.partnerID;
        this.scope = parentParams.scope;
        this.pageParams.scope = this.scope;
    });
  }

  ngOnInit() {
      this.setupPlayerProfileData();
  }

  private setupPlayerProfileData() {
      this._profileService.getPlayerProfile(this.pageParams.playerId).subscribe(
          data => {
              /*** About [Player Name] ***/
              this.pageParams = data.pageParams;
              this.profileName = data.headerData.playerFullName;
              this.teamName = data.headerData.teamFullName;
              this.teamId = data.headerData.teamId;

              this._title.setTitle(GlobalSettings.getPageTitle(this.profileName));
              this.profileHeaderData = this._profileService.convertToPlayerProfileHeader(data);

              this.setupTeamProfileData();
              this.dailyUpdateModule(this.pageParams.playerId);


              //get current date for box-scores
              var currentUnixDate = new Date().getTime();
              this.dateParam ={
                profile:'player',
                teamId:this.teamId, // teamId if it exists
                date: moment.tz( currentUnixDate , 'America/New_York' ).format('YYYY-MM-DD')
                // date: '2015-09-11'
              }
              this.getBoxScores(this.dateParam);

              /*** Keep Up With Everything [Player Name] ***/
              this.eventStatus = 'pregame';
              this.getSchedulesData(this.eventStatus);//grab pregame data for upcoming games
              this.setupSeasonstatsData();
              this.setupComparisonData();
              /*** Other [League Name] Content You May Love ***/
              this.getImages(this.imageData);
              this.getDykService();
              this.getFaqService();
              this.setupListOfListsModule();
              this.getNewsService();

              /*** Interact With [League Name]’s Fans ***/
              this.getTwitterService();
          },
          err => {
              this.hasError = true;
              console.log("Error getting player profile data for " + this.pageParams.playerId + ": " + err);
          }
      );
  }

private dailyUpdateModule(playerId: number) {
    this._dailyUpdateService.getPlayerDailyUpdate(playerId)
        .subscribe(data => {
            this.dailyUpdateData = data;
        },
        err => {
            this.dailyUpdateData = this._dailyUpdateService.getErrorData();
            console.log("Error getting daily update data", err);
        });
}

  private setupSeasonstatsData() {
      this._seasonStatsService.getPlayerStats(Number(this.pageParams.playerId), this.scope)
      .subscribe(
          data => {
              this.seasonStatsData = data;
          },
          err => {
              console.log("Error getting season stats data for "+ this.pageParams.playerId, err);
          });
  }

  //grab tab to make api calls for post of pregame table
  private scheduleTab(tab) {
    this.isFirstRun = 0;
      if(tab == 'Upcoming Games'){
        this.eventStatus = 'pregame';
        this.getSchedulesData(this.eventStatus, null);
      }else if(tab == 'Previous Games'){
        this.eventStatus = 'postgame';
        this.getSchedulesData(this.eventStatus, this.selectedFilter1);
      }else{
        this.eventStatus = 'postgame';
        this.getSchedulesData(this.eventStatus, this.selectedFilter1);// fall back just in case no status event is present
      }
  }
  private filterDropdown(filter){
    let tabCheck = 0;
    if(this.eventStatus == 'postgame'){
      tabCheck = 1;
    }
    if(this.isFirstRun > tabCheck){
      this.selectedFilter1 = filter.key;
      this.getSchedulesData(this.eventStatus, this.selectedFilter1);
    }
    this.isFirstRun++;
  }

  //api for Schedules
  private getSchedulesData(status, year?){
    var limit = 5;
    this._schedulesService.getScheduleTable(this.schedulesData, this.scope, 'team', status, limit, 1, this.teamId, (schedulesData) => {
      if(status == 'pregame'){
        this.scheduleFilter1=null;
      }else{
        if(this.scheduleFilter1 == null){// only replaces if the current filter is not empty
          this.scheduleFilter1 = schedulesData.seasons;
        }
      }
      this.schedulesData = schedulesData;
    }, year) //year if null will return current year and if no data is returned then subract 1 year and try again
  }

  private getTwitterService() {
    this._twitterService.getTwitterService("team", this.pageParams.teamId) //getting team twitter information for now
        .subscribe(data => {
            this.twitterData = data;
        },
        err => {
            console.log("Error getting twitter data");
        });
    }

    private getDykService() {
        this._dykService.getDykService(this.profileType, this.pageParams.playerId)
            .subscribe(data => {
                this.dykData = data;
            },
            err => {
                console.log("Error getting did you know data");
            });
    }

    private getFaqService(){
      this._faqService.getFaqService(this.profileType, this.pageParams.playerId)
          .subscribe(data => {
            this.faqData = data;
          },
          err => {
              console.log("Error getting faq data for player", err);
          });
    }

    private getNewsService() {
      let params = {
        limit:10,
        pageNum:1,
        id: this.pageParams.teamId
      }
        this._newsService.getNewsService(this.scope,params,'player','module')
            .subscribe(data => {
                this.newsDataArray = data.news;
            },
            err => {
                console.log("Error getting news data");
            });
    }
    //api for BOX SCORES
    //function for MLB/Team Profiles
    private getBoxScores(dateParams?) {
        if ( dateParams != null ) {
            this.dateParam = dateParams;
        }
        this._boxScores.getBoxScores(this.boxScoresData, this.profileName, this.dateParam, (boxScoresData, currentBoxScores) => {
            this.boxScoresData = boxScoresData;
            this.currentBoxScores = currentBoxScores;
        })
    }

    private getImages(imageData) {
        this._imagesService.getImages(this.profileType, this.pageParams.playerId)
            .subscribe(data => {
                return this.imageData = data.imageArray, this.copyright = data.copyArray, this.imageTitle = data.titleArray;
            },
            err => {
                console.log("Error getting image data" + err);
            });
    }

    //This gets team-specific data such as
    // conference and division
    private setupTeamProfileData() {
        this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(
            data => {
                var teamFullName = data.headerData.teamMarket + ' ' + data.teamName;
                this.standingsData = this._standingsService.loadAllTabsForModule(data.pageParams, this.scope, null, teamFullName);
            },
            err => {
                console.log("Error getting player profile data for " + this.pageParams.playerId + ": " + err);
            }
        );
    }

    private standingsTabSelected(tabData: Array<any>) {
        //only show 5 rows in the module;
        this.pageParams.scope = this.scope;
        this._standingsService.getStandingsTabData(tabData, this.pageParams, (data) => {}, 5);
    }

    private setupComparisonData() {
        this._comparisonService.getInitialPlayerStats(this.scope, this.pageParams).subscribe(
            data => {
              this.comparisonModuleData = data;
            },
            err => {
                console.log("Error getting comparison data for "+ this.pageParams.playerId, err);
            });
    }

    setupListOfListsModule() {
      let params = {
        targetId : this.pageParams.playerId,
        limit : 5,
        pageNum : 1,
        scope: this.scope
      }
      this._lolService.getListOfListsService(params, "player", "module")
        .subscribe(
          listOfListsData => {
            this.listOfListsData = listOfListsData.listData;
            // this.listOfListsData["type"] = "player";
            // this.listOfListsData["id"] = this.pageParams.playerId;
          },
          err => {
            console.log('Error: listOfListsData API: ', err);
          }
        );
    }
}
