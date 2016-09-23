
import {Component, OnInit} from '@angular/core';
import { BoxScoresService } from '../../services/box-scores.service';

declare var moment;

@Component({
    selector: "deep-dive-page",
    templateUrl: 'app/webpages/deep-dive-page/deep-dive-page.html',

})

export class DeepDivePage implements OnInit {
    title="Everything that is deep dive will go in this page. Please Change according to your requirement";
    test: any = "testing";

    scope = 'nfl';

    //Box Scores
    boxScoresData:any;
    currentBoxScores:any;
    dateParam:any;

    constructor( private _boxScoresService: BoxScoresService ) {
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
      var testImage = "/app/public/profile_placeholder.png";
      this.test = {
        imageClass: "image-150",
        mainImage: {
          imageUrl: testImage,
          urlRouteArray: '/syndicated-article',
          hoverText: "<p>Test</p> Image",
          imageClass: "border-large"
        },
        subImages: [
          {
            imageUrl: testImage,
            urlRouteArray: '/syndicated-article',
            hoverText: "<i class='fa fa-mail-forward'></i>",
            imageClass: "image-50-sub image-round-lower-right"
          },
          {
            text: "#1",
          imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
          }
        ],
      }

      this.getBoxScores();
    }

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

    private getDataCarousel() {
      this._deepDiveData.getCarouselData(this.scope, this.carouselData, '25', '1', this.geoLocation, (carData)=>{
        this.carouselData = carData;
      })
    }
  }
