import { Component, OnInit, Input } from '@angular/core';
import { DeepDiveService } from '../../../services/deep-dive.service';
import { ArticleStackData, VideoStackData } from "../../../fe-core/interfaces/deep-dive.data";
import { BoxScoresService } from '../../../services/box-scores.service';
import { GlobalSettings } from "../../../global/global-settings";
import { VerticalGlobalFunctions } from "../../../global/vertical-global-functions";

declare var moment;
declare var jQuery: any;

@Component({
  selector: 'deep-dive-section-front',
  templateUrl: './app/ui-modules/deep-dive-blocks/deep-dive-section-front/deep-dive-section-front.module.html',
})

export class DeepDiveSectionFront implements OnInit {
  @Input() scope: string;
  @Input() geoLocation: string;
  @Input() category: string;
  @Input() deepDiveType: any;
  articleData: Array<ArticleStackData>;
  articleCallLimit:number = 31;
  callApi: boolean = true;
  blockIndex: number = 1;
  boxScoresData: any;
  boxScoresScroll: boolean= true;
  currentBoxScores: any;
  dateParam: any;
  newArray: Array<any> = [];
  videoDataTop: Array<VideoStackData>;
  videoDataBatch: Array<VideoStackData>;
  videoCallLimit:number = 5;
  safeCounter: number = 0;
  searchData: any;
  routeSubscription:any;
  constructor(private _boxScoresService: BoxScoresService, private _deepDiveData: DeepDiveService){}
  getFirstArticleStackData(pageNum){
    if(this.callApi){
      this.callApi = false;
      this.routeSubscription = this._deepDiveData.getDeepDiveBatchService(this.scope, this.articleCallLimit, pageNum)
      .subscribe(data => {
        if(data){
          this.articleData = this._deepDiveData.transformToArticleStack(data, this.scope);
          var obj = {
              stackTop1: this.articleData.length > 0 ? this.articleData.splice(0,1) : null,
              stackRow1: this.articleData.length > 0 ? this.articleData.splice(0,6) : null,
              recData: this.articleData.length > 0 ? this.articleData.splice(0,6) : null,
              stackTop2: this.articleData.length > 0 ? this.articleData.splice(0,1) : null,
              stackRow2: this.articleData.length > 0 ? this.articleData.splice(0,4) : null,
          };
          this.newArray.push(obj);
          this.callApi = true;
        } else {
          this.callApi = false;
        }
      },
      err => {
        console.log("Error getting article data:", err);
      });
    }
  }

  getDeepDiveVideo(pageNum){
      this._deepDiveData.getDeepDiveVideoBatchService(this.scope, this.videoCallLimit, pageNum, this.geoLocation).subscribe(
        data => {
          if(data){
            this.videoDataBatch = this._deepDiveData.transformSportVideoBatchData(data, this.scope);
          }
        },
        err => {
          console.log("Error getting video batch data:", err);
      });
  }

  private onScroll(event) {
    if (this.callApi && (this.blockIndex <= this.newArray.length) && (jQuery(document).height() - window.innerHeight - jQuery("footer").height() <= jQuery(window).scrollTop())) {
      //fire when scrolled into footer
      this.blockIndex = this.blockIndex + 1;
      this.callModules(this.blockIndex);
    }
  }

  //API for Box Scores
  private getBoxScores(dateParams?) {
    // if(this.safeCounter < 10){
      if ( dateParams != null ) {
        this.dateParam = dateParams;
      }
      this._boxScoresService.getBoxScores(this.boxScoresData, this.dateParam.scope, this.dateParam, (boxScoresData, currentBoxScores) => {
        this.boxScoresData = boxScoresData;
        this.currentBoxScores = currentBoxScores;
        // this.safeCounter = 0;
        if(this.currentBoxScores == null && boxScoresData.transformedDate[dateParams.date] == null) {
          if(boxScoresData.previousGameDate != null && boxScoresData.transformedDate[dateParams.date] == null){
            this.dateParam.date = this.dateParam.date ? boxScoresData.previousGameDate.event_date : null;
            this.boxScoresData = null;
            this.currentBoxScores = null;
            this.safeCounter++;
            // this.getBoxScores(this.dateParam);
          }else{
            this.safeCounter = 0;
          }
          return;
        }
      });
    // }else{
    //   this.dateParam = null;
    //   this.boxScoresData = null;
    //   this.currentBoxScores = null;
    // }
  }

  callModules(pageNum){
    this.getDeepDiveVideo(pageNum);
    this.getFirstArticleStackData(pageNum);
    if(GlobalSettings.getTCXscope(this.scope).showBoxScores){
      this.getBoxScores(this.dateParam);
    }else{
      this.dateParam = null;
    }
  }

  ngOnChanges(event) {
    if(event.scope != null){
      if(event.scope.currentValue != event.scope.previousValue){// if route has changed
        this.scope = event.scope.currentValue;
        this.boxScoresData = null;
        this.currentBoxScores = null;
        this.dateParam == null;
        this.getDateParams();
        window.scrollTo(0,0);
      }
      if(this.dateParam == null){
        this.getDateParams();
      }
      this.blockIndex = 1;
      this.newArray = [];
      this.callApi = true;
      this.articleData = null;
      this.createSearchBox(this.scope);
      this.callModules(this.blockIndex);
    }
  }

  ngOnInit() {
    this.createSearchBox(this.scope);
    this.getDateParams();
    this.callModules(this.blockIndex);
  }

  ngOnDestroy(){
    this.routeSubscription.unsubscribe();
  }

  navigateSearch(e) {
    if(e.key == "Enter"){
      var rel_url = VerticalGlobalFunctions.createSearchLink(this.scope) + e.target.value;
      var fullSearchUrl = GlobalSettings.getOffsiteLink(this.scope, rel_url);
      window.open(fullSearchUrl);
    }
  }
  changeScope(event){
    this.searchData.searchModTitle = GlobalSettings.getTCXscope(event).searchTitle + " " + GlobalSettings.getTCXscope(this.scope).displayName.toUpperCase();
    this.searchData.searchSubTitle = GlobalSettings.getTCXscope(this.scope).searchSubTitle;
  }
  createSearchBox(scope){
    var modSearchTitle;
    let sportsList;
    if(this.category == "sports"){
      modSearchTitle = GlobalSettings.getTCXscope(scope).searchTitle + " " + GlobalSettings.getTCXscope(scope).displayName.toUpperCase();
      sportsList = [
        {
          key: 'NFL',
          value: "NFL",
        },
        {
          key: 'NCAAF',
          value: "NCAAF",
        },
        {
          key: 'NBA',
          value: "NBA",
        },
        {
          key: 'NCAAM',
          value: "NCAAM",
        },
        {
          key: 'MLB',
          value: "MLB",
        },
        {
          key: 'NHL',
          value: "NHL",
        },
      ];
    }else{
      sportsList = null;
      modSearchTitle = GlobalSettings.getTCXscope(scope).searchTitle;
    }
    this.searchData = {
      category: scope,
      searchModTitle: modSearchTitle,
      searchSubText: GlobalSettings.getTCXscope(scope).searchSubTitle,
      searchPlaceHolderText: GlobalSettings.getTCXscope(scope).placeHolderText,
      searchBackground: GlobalSettings.getTCXscope(scope).searchBackground,
      searchScopeDropdown:sportsList
    };
  }

  getDateParams(){
    //Box Scores
    var currentUnixDate = new Date().getTime();
    //convert currentDate(users local time) to Unix and push it into boxScoresAPI as YYYY-MM-DD in EST using moment timezone (America/New_York)
    this.dateParam ={
      scope: this.scope,//current profile page
      teamId: '',
      date: moment.tz( currentUnixDate , 'America/New_York' ).format('YYYY-MM-DD')
    }
  }
}
