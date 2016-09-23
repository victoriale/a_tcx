
import {Component, OnInit} from '@angular/core';
import { BoxScoresService } from '../../services/box-scores.service';
import { SchedulesService } from '../../services/schedules.service';

declare var moment;
declare var jQuery: any;

@Component({
    selector: "deep-dive-page",
    templateUrl: 'app/webpages/deep-dive-page/deep-dive-page.html',
})

export class DeepDivePage implements OnInit {
    title="Everything that is deep dive will go in this page. Please Change according to your requirement";
    test: any = "testing";

    //side scroller
    sideScrollData: any;
    scrollLength: number;
    changeScopeVar: string = "nfl";
    safeCall: boolean = true;
    ssMax: number;
    callCount: number = 1;
    callLimit:number = 25;

    scope = 'nfl'; //TODO - get URL Param
    blockIndex: number = 1;

    //Box Scores
    boxScoresData:any;
    currentBoxScores:any;
    dateParam:any;

    constructor( private _boxScoresService: BoxScoresService, private _schedulesService:SchedulesService) {
      //Box Scores
      var currentUnixDate = new Date().getTime();
      //convert currentDate(users local time) to Unix and push it into boxScoresAPI as YYYY-MM-DD in EST using moment timezone (America/New_York)
      this.dateParam ={
        scope: this.scope,//current profile page
        teamId: '',
        //date: '2016-09-22'
        date: moment.tz( currentUnixDate , 'America/New_York' ).format('YYYY-MM-DD')
      }
    }

    private onScroll(event) {
      if (jQuery(document).height() - window.innerHeight - jQuery("footer").height() <= jQuery(window).scrollTop()) {
        //fire when scrolled into footer
        this.blockIndex = this.blockIndex + 1;
      }
    }

    //api for Schedules
    private getSideScroll(){
      let self = this;
      if(this.safeCall){
        this.safeCall = false;
        let changeScope = this.changeScopeVar.toLowerCase() == 'ncaaf'?'fbs':this.changeScopeVar.toLowerCase();
        this._schedulesService.setupSlideScroll(this.sideScrollData, changeScope, 'league', 'pregame', this.callLimit, this.callCount, (sideScrollData) => {
          if(this.sideScrollData == null){
            this.sideScrollData = sideScrollData;
          }
          else{
            sideScrollData.forEach(function(val,i){
              self.sideScrollData.push(val);
            })
          }
          this.safeCall = true;
          this.callCount++;
          this.scrollLength = this.sideScrollData.length;
        }, null, null)
      }
    }

    private scrollCheck(event){
      let maxScroll = this.sideScrollData.length;
      if(event >= (maxScroll - this.ssMax)){
       this.getSideScroll();
      }
    }

    ngOnInit() {
      this.getBoxScores(this.dateParam);
      this.getSideScroll();
    }

    //api for Box Scores
    private getBoxScores(dateParams?) {
      // console.log('1. deep-dive-page, getBoxScores - dateParams - ',dateParams);
      if ( dateParams != null ) {
        this.dateParam = dateParams;
      }
      this._boxScoresService.getBoxScores(this.boxScoresData, this.scope, this.dateParam, (boxScoresData, currentBoxScores) => {
          this.boxScoresData = boxScoresData;
          this.currentBoxScores = currentBoxScores;
      });
    }
  }
