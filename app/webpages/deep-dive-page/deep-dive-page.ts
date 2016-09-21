import { Component, OnInit } from '@angular/core';
import { BoxScoresService } from '../../services/box-scores.service';

declare var moment;

@Component({
    selector:"deep-dive-page",
    templateUrl: 'app/webpages/deep-dive-page/deep-dive-page.html'
})

export class DeepDivePage implements OnInit {
  title="Everything that is deep dive will go in this page. Please Change according to your requirement";

  scope = 'nfl';

  //Box Scores
  boxScoresData:any;
  currentBoxScores:any;
  dateParam:any;

  constructor(
    private _boxScoresService: BoxScoresService
  ) {

    //Box Scores
    var currentUnixDate = new Date().getTime();
    //convert currentDate(users local time) to Unix and push it into boxScoresAPI as YYYY-MM-DD in EST using moment timezone (America/New_York)
    this.dateParam ={
      profile:'league',//current profile page
      teamId: this.scope,
      date: moment.tz( currentUnixDate , 'America/New_York' ).format('YYYY-MM-DD')
    }

  }

    ngOnInit() {
      this.getBoxScores();
      console.log('1. deep-dive-page - ngOnInit - dateParam - ',this.dateParam);
    };

    //api for Box Scores
    private getBoxScores(dateParams?) {
      if ( dateParams != null ) {
        this.dateParam = dateParams;
      }
      this._boxScoresService.getBoxScores(this.boxScoresData, 'league', this.dateParam, (boxScoresData, currentBoxScores) => {
          this.boxScoresData = boxScoresData;
          this.currentBoxScores = currentBoxScores;
      });
    }
}
