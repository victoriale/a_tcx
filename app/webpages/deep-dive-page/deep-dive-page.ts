
import {Component, OnInit} from '@angular/core';
import { BoxScoresService } from '../../services/box-scores.service';

declare var moment;
declare var jQuery: any;

@Component({
    selector: "deep-dive-page",
    templateUrl: 'app/webpages/deep-dive-page/deep-dive-page.html',
})

export class DeepDivePage implements OnInit {
    title="Everything that is deep dive will go in this page. Please Change according to your requirement";
    test: any = "testing";

    scope = 'nfl'; //TODO - get URL Param
    blockIndex: number = 1;

    //Box Scores
    boxScoresData:any;
    currentBoxScores:any;
    dateParam:any;
    displayTest:any = 'test';

    constructor( private _boxScoresService: BoxScoresService ) {
      //Box Scores
      var currentUnixDate = new Date().getTime();
      //convert currentDate(users local time) to Unix and push it into boxScoresAPI as YYYY-MM-DD in EST using moment timezone (America/New_York)
      this.dateParam ={
        scope: this.scope,//current profile page
        teamId: '',
        date: moment.tz( currentUnixDate , 'America/New_York' ).format('YYYY-MM-DD')
      }
    }

    private onScroll(event) {
      if (jQuery(document).height() - window.innerHeight - jQuery("footer").height() <= jQuery(window).scrollTop()) {
        //fire when scrolled into footer
        this.blockIndex = this.blockIndex + 1;
      }
    }

    ngOnInit() {
      this.getBoxScores(this.dateParam);;
    }

    //api for Box Scores
    private getBoxScores(dateParams?) {
      if ( dateParams != null ) {
        this.dateParam = dateParams;
      }
      this._boxScoresService.getBoxScores(this.boxScoresData, this.scope, this.dateParam, (boxScoresData, currentBoxScores) => {
          this.boxScoresData = boxScoresData;
          this.currentBoxScores = currentBoxScores;
      });
    }
  }
