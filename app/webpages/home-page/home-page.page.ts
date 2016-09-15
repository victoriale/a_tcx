import {Component, Input} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {GlobalSettings} from "../../global/global-settings";
import {GlobalFunctions} from '../../global/global-functions';
import {SliderButton} from "../../fe-core/components/buttons/slider/slider.button";
import {CircleImage} from '../../fe-core/components/images/circle-image';
import {ImageData,CircleImageData} from '../../fe-core/components/images/image-data';
import {Search, SearchInput} from '../../fe-core/components/search/search.component';
import {RouteParams, Router, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {LandingPageService} from '../../services/landing-page';
import {PartnerHomePage} from '../partner-home-page/partner-home-page';

import {GeoLocation} from "../../global/global-service";
import {PartnerHeader} from "../../global/global-service";

import {VerticalGlobalFunctions} from '../../global/vertical-global-functions';

export interface homePageData {
  imageData: CircleImageData;
  location: string;
  divisionName: string;
  teamName: string;

  geoLocation:string;
}

export interface newsCarouselData {
  newsTitle: string;
  newsSubTitle: string;
  routerInfo: Array<any>;
}

@Component({
    selector: 'home-page',
    templateUrl: './app/webpages/home-page/home-page.page.html',
    directives: [CircleImage, ROUTER_DIRECTIVES, Search, SliderButton, PartnerHomePage],
    providers: [LandingPageService, Title, GeoLocation,PartnerHeader],
})

export class PickTeamPage{
    public teamData: Array<homePageData>;
    public listData: Array<newsCarouselData>;
    public displayData: Object;

    public _sportLeagueAbbrv: string = GlobalSettings.getSportLeagueAbbrv();
    public _sportLeagueSegments: string = GlobalSettings.getSportLeagueSegments();

    public _collegeDivisionAbbrv: string = GlobalSettings.getCollegeDivisionAbbrv();
    public _collegeDivisonFullAbbrv: string = GlobalSettings.getCollegeDivisionFullAbbrv();
    public _collegeDivisionSegments: string = GlobalSettings.getCollegeDivisionSegments();

    public activeDivision: string;
    public activeDivisionSegments: string;

    public imgHero1: string = "http://images.synapsys.us/TDL/stock_images/TDL_Stock-2.png";
    public imgIcon1: string = "/app/public/homePage_icon1.png";
    public imageTile1: string = "/app/public/iphone.png";
    public imageTile2: string = "/app/public/ipad.png";
    public imageTile3: string = "/app/public/MLB_Schedule_Image.jpg";
    public homeHeading1: string;
    public homeSubHeading1: string;
    public homeHeading2: string;
    public homeLocationHeading: string;
    public homeFeaturesTile1: string;
    public homeFeaturesTile3: string;
    public homeFeaturesTile4: string;
    public homeFeaturesButton1: string;
    public homeFeaturesButton3: string;
    public homeFeaturesButton4: string;
    public routerInfo1 = ['Standings-page'];
    public buttonFullList: string = "See The Full List";
    public teams: any;
    public counter: number = 0;
    public max:number = 3;
    public searchInput: SearchInput = {
         placeholderText: "Search for a player or team...",
         hasSuggestions: true
     };
    private isPartnerZone: boolean = false;
    public gridDivCol: string;
    public gridLMain: string;
    public gridFeaturesCol: string;
    public width: number;

    public partnerData: any;
    public partnerID: string;
    public geoLocationState:string;
    public geoLocationCity: string;

    public scope: string;

    constructor(
      private _router: Router,
      private _landingPageService: LandingPageService,
      private _title: Title,
      private _geoLocation:GeoLocation,
      private _partnerData: PartnerHeader
    ) {
      _title.setTitle(GlobalSettings.getPageTitle(""));

      this.getListData();

      GlobalSettings.getParentParams(_router, parentParams => {
        var partnerHome = GlobalSettings.getHomeInfo().isHome && GlobalSettings.getHomeInfo().isPartner;
        this.isPartnerZone = partnerHome;

        this.partnerID = parentParams.partnerID;
        this.scope = parentParams.scope;

        if(this.partnerID != null) {
           this.getPartnerHeader();
        }
        else {
          this.getGeoLocation(this.scope);
        }

        //set the active league variables based on scope
        if ( this.scope == this._collegeDivisionAbbrv.toLowerCase() ) {
          this.activeDivision = this._collegeDivisonFullAbbrv;
          this.activeDivisionSegments = this._collegeDivisionSegments;
        }
        else {
          this.activeDivision = this._sportLeagueAbbrv;
          this.activeDivisionSegments = this._sportLeagueSegments;
        }

        this.homeHeading1 = "Stay Loyal to Your Favorite " + this.activeDivision + " Team";
        this.homeSubHeading1 = "Find the sports information you need to show your loyalty";
        this.homeHeading2 = "PICK YOUR FAVORITE <span class='text-heavy'>" + this.activeDivision + " TEAM</span>";
        this.homeFeaturesTile1 = this.activeDivision + " Standings";
        this.homeFeaturesTile3 = this.activeDivision + " Scores";
        this.homeFeaturesTile4 = this.activeDivision + " Schedules";
        this.homeFeaturesButton1 = "View " + this.activeDivision + " Standings";
        this.homeFeaturesButton3 = "View " + this.activeDivision + " Scores";
        this.homeFeaturesButton4 = "View " + this.activeDivision + " Schedules";

      }); //GlobalSettings.getParentParams


    }

    getListData(){
      this.listData = [
        {
          newsTitle: "Pitchers with the Most Strikeouts Thrown",
          newsSubTitle: "See which MLB Pitchers are performing at the top of their game",
          routerInfo: ['List-page', {profile:'player', listname: 'pitcher-strikeouts', sort:'asc', conference: 'all', division: 'all', limit: '20', pageNum:'1'} ]
        },
        {
          newsTitle: "Batters With the Most Strikeouts in the MLB",
          newsSubTitle: "See which MLB Batters are performing at the top of their game",
          routerInfo: ['List-page', {profile:'player', listname: 'batter-strikeouts', sort:'asc', conference: 'all', division: 'all', limit: '20', pageNum:'1'} ]
        },
        {
          newsTitle: "Teams with the Most Runs Allowed in the MLB",
          newsSubTitle: "See which MLB Teams are performing at the top of their game",
          routerInfo: ['List-page', {profile:'team', listname: 'pitcher-runs-allowed', sort:'asc', conference: 'all', division: 'all', limit: '20', pageNum:'1'} ]
        },
        {
          newsTitle: "Teams with the Most RBIs in the MLB",
          newsSubTitle: "See which MLB Teams are performing at the top of their game",
          routerInfo: ['List-page', {profile:'team', listname: 'batter-runs-batted-in', sort:'asc', conference: 'all', division: 'all', limit: '20', pageNum:'1'} ]
        }
      ];
      this.changeMain(this.counter);
    }

    left(){
      var counter = this.counter;
      counter--;

      //make a check to see if the array is below 0 change the array to the top level
      if(counter < 0){
        this.counter = (this.max - 1);
      }else{
        this.counter = counter;
      }
      this.changeMain(this.counter);
    }

    right(){
      var counter = this.counter;
      counter++;
      //check to see if the end of the obj array of images has reached the end and will go on the the next obj with new set of array
      if(counter == this.max){
        this.counter = 0;
      }else{
        this.counter = counter;
      }
      this.changeMain(this.counter);
    }

    //this is where the angular2 decides what is the main image
    changeMain(num){
      if ( num < this.listData.length ) {
        this.displayData = this.listData[num];
      }
    }

    setLocationHeaderString(state) {
      //only set for NCAAF
      if ( this.scope == this._collegeDivisionAbbrv.toLowerCase() ) {
        this.homeLocationHeading = 'Showing '+this.activeDivision+ ' Football '+ this.activeDivisionSegments.toLowerCase() + '<span class="location-designation"> located around <i ng-reflect-class-name="fa fa-map-marker" class="fa fa-map-marker"></i> ' + '<span class="location-title">' + GlobalFunctions.fullstate(state) + '</span>';
      }
    }

    getPartnerHeader() {//Since it we are receiving
      if(this.partnerID != null){
        this._partnerData.getPartnerData(this.partnerID)
        .subscribe(
          partnerScript => {
            this.partnerData = partnerScript;
            //super long way from partner script to get location using geo location api
            var state = partnerScript['results']['location']['realestate']['location']['city'][0].state;
            this.setLocationHeaderString(state);

            if ( state != null ) {
              state = state.toLowerCase();
              this.geoLocationState = state;

              this.getData(this.scope, state);
            }
            else {
              this.getGeoLocation(this.scope);
            }
          }
        );
      }
    } //getPartnerData

    getGeoLocation(scope) {
      var defaultState = 'ca';
      this._geoLocation.getGeoLocation()
        .subscribe(
          geoLocationData => {
            this.geoLocationState = geoLocationData[0].state;
            this.geoLocationCity = geoLocationData[0].city;

            this.setLocationHeaderString(this.geoLocationState);

            this.getData(scope, this.geoLocationState);
          },
          err => {
            this.geoLocationState = defaultState;
          }
      );
    } //getGeoLocation

    getData(scope, geoLocation?){
      this._landingPageService.getLandingPageService(scope, geoLocation)
        .subscribe(data => {
          this.teams = data.league;
        })
      var sampleImage = "./app/public/placeholder-location.jpg";
    } //getData
}
