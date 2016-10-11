import { Component, OnInit, OnDestroy } from '@angular/core';
import { SchedulesService } from '../../services/schedules.service';
import { DeepDiveService } from '../../services/deep-dive.service';
import { ActivatedRoute } from '@angular/router';
import { GlobalSettings } from "../../global/global-settings";
import { GlobalFunctions } from "../../global/global-functions";
import { GeoLocation } from "../../global/global-service";

import { SectionNameData } from "../../fe-core/interfaces/deep-dive.data";

declare var moment;
declare var jQuery: any;

@Component({
    selector: "deep-dive-page",
    templateUrl: 'app/webpages/deep-dive-page/deep-dive-page.html',
})

export class DeepDivePage implements OnInit {
    scope: string;
    carouselData: any;
    //side scroller
    sideScrollData: any;
    scrollLength: number = 0;

    selectedLocation: string = "wichita-ks"; //todo: need geolocation
    boxScoresTempVar: string = "nfl";

    topScope: string;
    changeScopeVar: string;

    safeCall: boolean = true;
    ssMax: number;
    callCount: number = 1;
    callLimit: number = 25;
    scopeList: Array<string>;
    currentCategory:string;
    blockIndex: number = 1;
    deepDiveType: string;
    category: string;
    //Used for route subscription and unsubscribing when view is destroyed (double check since angular2 does it for you)
    routeSubscription:any;
    sectionName: SectionNameData;
    sectionNameIcon: string;
    sectionNameTitle: string = this.category;
    geoLocation:string;

    constructor(private _schedulesService:SchedulesService, private _deepDiveData: DeepDiveService, private _activatedRoute: ActivatedRoute, private _geoLocation: GeoLocation,) {
      this.getGeoLocation();
    }

    ngOnDestroy(){
      this.routeSubscription.unsubscribe();
    }
    //Subscribe to getGeoLocation in geo-location.service.ts. On Success call getNearByCities function.
    getGeoLocation() {
      var defaultState = 'ca';
        this._geoLocation.getGeoLocation()
            .subscribe(
                geoLocationData => {
                  this.geoLocation = geoLocationData[0].state;
                  this.geoLocation = this.geoLocation.toLowerCase();
                  // this.callModules();
                  console.log("Geo Location", this.geoLocation);//keep this for now
                },
                err => {
                  this.geoLocation = defaultState;
                  // this.callModules();
                }
            );
    }

    private getDeepDiveType(category:string): string{
      var _typeValue;
      // if(category !== null || typeof category !== 'undefined'){
      //   category = category.toLowerCase();
      // }
      switch(category){
        case 'sports':
          _typeValue = "deep-dive-type1";
          if(this.scope == 'nfl' || this.scope == 'ncaaf') {
            this.sectionNameTitle = "football";
            this.sectionNameIcon = "fa-tdl-football";
          } else if(this.scope == 'nba' || this.scope == 'ncaab') {
            this.sectionNameTitle = "basketball";
            this.sectionNameIcon = "fa-dribble";
          } else if(this.scope == "mlb") {
            this.sectionNameTitle = "baseball";
            this.sectionNameIcon = "fa-strikeouts-01";
          } else {
            this.sectionNameTitle = "sports";
            this.sectionNameIcon = "fa-futbol-o";
          }
          break;
        case 'business':
        case 'finance':
          _typeValue = "deep-dive-type2";
          break;
        case 'weather':
          _typeValue = "deep-dive-type2";
          this.sectionNameTitle = "weather";
          break;
        case 'realestate':
          _typeValue = "deep-dive-type2";
          this.sectionNameTitle = "real estate";
          break;
        case 'automotive':
        case 'entertainment':
        case 'food':
        case 'IPO':
        case 'lifestyle':
        case 'politics':
        case 'travel':
        case 'banking':
        case 'health':
          _typeValue = "deep-dive-type3";
          break;
        case 'breakingnews':
          _typeValue = "deep-dive-type3";
          this.sectionNameTitle = "breaking news";
          break;
        default:
          _typeValue = "deep-dive-type-main";
          break;
      }
      return _typeValue;
    }

    private sectionFrontName(){
      return this.sectionName = {
         icon: this.sectionNameIcon,
         title: GlobalFunctions.toTitleCase(this.sectionNameTitle)
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
      if(this.safeCall && this.topScope != null){
        this.safeCall = false;
        let changeScope = this.changeScopeVar.toLowerCase() == 'ncaaf'?'fbs':this.changeScopeVar.toLowerCase();
        this._schedulesService.setupSlideScroll(this.topScope, this.sideScrollData, changeScope, 'league', 'pregame', this.callLimit, this.callCount, this.selectedLocation, (sideScrollData) => {
          if (this.topScope == "finance") {
            this.scopeList = sideScrollData.scopeList.reverse();
              this.sideScrollData = sideScrollData;
              this.scrollLength = this.sideScrollData.blocks.length;
          }
          else if (this.topScope == "weather") {
            this.scopeList = ["10 Day", "5 Day", "Hourly"];
            this.sideScrollData = sideScrollData;
            this.scrollLength = this.sideScrollData.blocks.length;
          }
          else if (this.topScope == "football") {
            this.scopeList = ["MLB", "NCAAB", "NBA", "NCAAF", "NFL"];
            this.sideScrollData = sideScrollData;
            this.scrollLength = this.sideScrollData.blocks.length;
          }
          else if (this.topScope == "basketball") {
              this.scopeList = ["MLB", "NCAAB", "NBA", "NCAAF", "NFL"];
              this.sideScrollData = sideScrollData;
              this.scrollLength = this.sideScrollData.blocks.length;
          }
          else if (this.topScope == "baseball") {
              this.scopeList = ["MLB", "NCAAB", "NBA", "NCAAF", "NFL"];
              this.sideScrollData = sideScrollData;
              this.scrollLength = this.sideScrollData.blocks.length;
          }
          this.safeCall = true;
          this.callCount++;

        }, null, null)
      }
    }

    private scrollCheck(event){
      let maxScroll = this.sideScrollData.length;
      if(event >= (maxScroll - this.ssMax)){
       this.getSideScroll();
      }
    }

    changeScope($event) {
      this.changeScopeVar = $event;
      this.getSideScroll();
    }

    changeLocation($event) {
      this.selectedLocation = $event;
      this.getSideScroll();
    }

    private getDataCarousel() {
      this._deepDiveData.getCarouselData('nfl', this.carouselData, '25', '1', 'CA', (carData)=>{
        this.carouselData = carData;
      })
    }

    ngOnInit(){
      this.routeSubscription = this._activatedRoute.params.subscribe(
          (param:any) => {
            this.category = param['category'] ? param['category'] : 'all';
            this.scope = param['articleCategory'] ? param['articleCategory'] : param['category'];
            console.log('Partner:', GlobalSettings.getPartnerId());
            console.log('sectionFront parameters:',param);

            //for side scroller
            switch(param['category']) {
              case "sports":
                switch(param['articleCategory']) {
                  case "nfl":
                    this.topScope = "football";
                    this.changeScopeVar = param['articleCategory'];
                    break;

                  case "nba":
                  case "ncaam":
                    this.topScope = "basketball";
                    this.changeScopeVar = param['articleCategory'];
                    break;

                  case "mlb":
                    this.topScope = "baseball";
                    this.changeScopeVar = param['articleCategory'];
                    break;

                  default:
                    this.topScope = null;
                    this.changeScopeVar = null;
                }
                break;

              case "weather":
                this.topScope = "weather";
                this.changeScopeVar = "hourly";
                break;

              case "business":
                this.topScope = "finance";
                this.changeScopeVar = "all";
                break;

              default:
                this.topScope = null;
                this.changeScopeVar = null;
            }

            this.getSideScroll();
            this.getDataCarousel();
            this.deepDiveType = this.getDeepDiveType(this.category.toLowerCase());
            this.sectionFrontName();
          }
      );

    }
  }
