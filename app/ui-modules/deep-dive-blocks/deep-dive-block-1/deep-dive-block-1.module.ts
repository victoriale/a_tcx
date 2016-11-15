import { Component, OnInit, Input } from '@angular/core';
import { DeepDiveService } from '../../../services/deep-dive.service';
import { ArticleStackData, VideoStackData } from "../../../fe-core/interfaces/deep-dive.data";
import { BoxScoresService } from '../../../services/box-scores.service';
import { GlobalSettings } from "../../../global/global-settings";

declare var moment;

@Component({
  selector: 'deep-dive-block-1',
  templateUrl: './app/ui-modules/deep-dive-blocks/deep-dive-block-1/deep-dive-block-1.module.html',
})

export class DeepDiveBlock1 implements OnInit {
  @Input() scope: string;
  @Input() geoLocation: string;
  @Input() category:string;
  videoDataTop: Array<VideoStackData>;
  videoDataBatch: Array<VideoStackData>;
  firstStackTop: Array<ArticleStackData>;
  firstStackRow: Array<ArticleStackData>;
  recData: Array<ArticleStackData>;//TODO
  articleStack2DataTop: Array<ArticleStackData>;//TODO
  articleStack2DataBatch: Array<ArticleStackData>;//TODO
  articleCallLimit:number = 23;
  videoCallLimit:number = 5;
  batchNum: number = 1;
  //Box Scores
  boxScoresData: any;
  currentBoxScores: any;
  dateParam: any;
  boxScoresTempVar: string = "nfl";
  boxScoresScroll: boolean= true;
  safeCounter: number = 0;

  routeSubscription:any;
  constructor(private _boxScoresService: BoxScoresService, private _deepDiveData: DeepDiveService){

  }
  getFirstArticleStackData(){
    this._deepDiveData.getDeepDiveBatchService(this.scope, this.articleCallLimit, this.batchNum, this.geoLocation)
        .subscribe(data => {
          let stackTop = [data[0]];
          this.firstStackTop = this._deepDiveData.transformToArticleStack(stackTop, this.scope);
          let stackRow = data.splice(1,8);
          this.firstStackRow  = this._deepDiveData.transformToArticleStack(stackRow, this.scope);
          let recInfo = data.splice(1, 6);//TODO
          this.recData = this._deepDiveData.transformToArticleStack(recInfo, this.scope);//TODO
          let articleStack2Top = [data[0]];//TODO
          this.articleStack2DataTop = this._deepDiveData.transformToArticleStack(articleStack2Top, this.scope);//TODO
          let articleStack2 = data.splice(1,4);//TODO
          this.articleStack2DataBatch = this._deepDiveData.transformToArticleStack(articleStack2, this.scope);//TODO
        },
        err => {
            console.log("Error getting first article stack data");
        });
  }

  getDeepDiveVideo(){
      this._deepDiveData.getDeepDiveVideoBatchService(this.scope, this.videoCallLimit, this.batchNum, this.geoLocation).subscribe(
        data => {
          if(data != null){
            this.videoDataBatch = this._deepDiveData.transformSportVideoBatchData(data, this.scope);//TODO
          }
        },
        err => {
          console.log("Error getting video batch data");
      });
  }

  //API for Box Scores
  private getBoxScores(dateParams?) {
    if(this.safeCounter < 10){
      // console.log('1. deep-dive-page, getBoxScores - dateParams - ',dateParams);
      if ( dateParams != null ) {
        this.dateParam = dateParams;
      }
      // console.log('this.dateParam',this.dateParam);
      this._boxScoresService.getBoxScores(this.boxScoresData, this.dateParam.scope, this.dateParam, (boxScoresData, currentBoxScores) => {
        this.boxScoresData = boxScoresData;
        this.currentBoxScores = currentBoxScores;
        this.safeCounter = 0;
        if(this.currentBoxScores == null && boxScoresData.transformedDate[dateParams.date] == null){
          if(boxScoresData.previousGameDate != null && boxScoresData.transformedDate[dateParams.date] == null){
            this.dateParam.date = boxScoresData.previousGameDate.event_date;
            this.boxScoresData = null;
            this.currentBoxScores = null;
            this.safeCounter++;
            this.getBoxScores(this.dateParam);
          }else{
            this.safeCounter = 0;
          }
          return;
        }
      });
    }else{
      this.dateParam = null;
      this.boxScoresData = null;
      this.currentBoxScores = null;
    }
  }

  callModules(){
    this.getDeepDiveVideo();
    this.getFirstArticleStackData();
    if(GlobalSettings.getTCXscope(this.scope).showBoxScores){
      this.getBoxScores(this.dateParam);
    }else{
      this.dateParam = null;
    }
  }

  ngOnChanges(event) {
    // console.log('ON CHANGES',event);
    if(event.scope != null){
      if(event.scope.currentValue != event.scope.previousValue){// if route has changed
        this.scope = event.scope.currentValue;
        this.boxScoresData = null;
        this.currentBoxScores = null;
        this.dateParam == null;
        // console.log('change scope', this.scope);
        // console.log('change boxScoresData', this.boxScoresData);
        this.getDateParams();
      }
    }
    if(this.dateParam == null){
      this.getDateParams();
    }
    this.callModules();
  }

  ngOnInit() {
    this.getDateParams();
    this.callModules();
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
