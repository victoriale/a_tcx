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
    //side scroller
    sideScrollData: any;
    scrollLength: number = 0;

    selectedLocation: string = "san%20francisco-ca"; // default city for weather if geolocation returns nothin
    boxScoresTempVar: string = "nfl";

    tcxVars: any;

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

    carouselGraph:any;
    carouselVideo:any;
    carouselData: any;

    constructor(private _schedulesService:SchedulesService, private _deepDiveData: DeepDiveService, private _activatedRoute: ActivatedRoute, private _geoLocation: GeoLocation) {}

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
                  this.selectedLocation = geoLocationData[0].city.replace(/ /g, "%20") + "-" + geoLocationData[0].state;
                  this.getHourlyWeatherData(this.topScope);
                  this.getSideScroll();
                },
                err => {
                  console.log("Geo Location Error:", err);
                  this.geoLocation = defaultState;
                  this.selectedLocation = 'wichita-ks';
                  this.getHourlyWeatherData(this.topScope);
                  this.getSideScroll();
                }
            );
    }

    private sectionFrontName(){
      var displayName = GlobalSettings.getTCXscope(this.scope).displayName;
      return this.sectionName = {
         icon: GlobalSettings.getTCXscope(this.scope).icon,
         title: displayName ? displayName : GlobalFunctions.toTitleCase(this.scope)
       }
    }

    //api for Schedules
    private getSideScroll(){
      if (this.tcxVars.showEventSlider != true) {
        this.sideScrollData = {scopeList: [], blocks: [], current: {}};
      }
      if (this.tcxVars.showSFTopNav == true) {
          this.scopeList = this.tcxVars.scopeList;
          this.sideScrollData = {scopeList: [], blocks: [], current: {}};
          this.scrollLength = 0;
      }
      let self = this;
      if(this.safeCall && this.topScope != null && this.tcxVars.showEventSlider == true){
        this.safeCall = false;
        let changeScope = this.changeScopeVar.toLowerCase() == 'ncaaf'?'fbs':this.changeScopeVar.toLowerCase();
        this._schedulesService.setupSlideScroll(this.topScope, this.sideScrollData, changeScope, 'league', 'pregame', this.callLimit, this.callCount, this.selectedLocation, (sideScrollData) => {
          this.scopeList = this.tcxVars.scopeList;
          if (this.tcxVars.showEventSlider) {
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

    getDataCarousel() {
      let pageScope = this.scope;
      if(this.scope == 'all'){
        pageScope = 'breaking';
      }
      this._deepDiveData.getCarouselData(pageScope, this.carouselData, '25', '1', this.geoLocation, (carData)=>{
        this.carouselData = carData;
      })
    }

    getDeepDiveVideo(){
      this._deepDiveData.getDeepDiveVideoBatchService(this.scope, 5, 1).subscribe(
        data => {
          if(data != null){
            this.carouselVideo = this._deepDiveData.transformSportVideoBatchData([data[0]]);
          }
          this.getDataCarousel();
        },
        err => {
          console.log("Error getting video batch data:", err);
          this.carouselVideo = null;
          this.getDataCarousel();
        });
    }

    getHourlyWeatherData(scope){//only if its weather scope that has graph
      if( scope == 'weather'){//weather requires {city-state} as a parameter
        this._schedulesService.getWeatherCarousel('hourly', this.selectedLocation).subscribe(
          data => {
            this.carouselGraph = data;
            this.getDataCarousel();
          },
          err => {
            this.carouselGraph = this._schedulesService.getDummyGraphResult();
            this.getDataCarousel();
            console.log("Error getting graph batch data:", err);
          });
      }
    }

    ngOnInit(){
      this.initializePage();
    }

    ngOnChanges(){
      this.initializePage();
    }

    initializePage(){
      this.routeSubscription = this._activatedRoute.params.subscribe(
          (param:any) => {
            this.category = param['category'] ? param['category'] : 'all';
            this.scope = param['subCategory'] ? param['subCategory'] : this.category;
            if (param['subCategory']) {
              this.tcxVars = GlobalSettings.getTCXscope(param['subCategory']);
            } else {
              this.tcxVars = GlobalSettings.getTCXscope(this.category);
            }
            this.topScope = this.tcxVars ? this.tcxVars.topScope : this.category;
            this.changeScopeVar = this.tcxVars.scope;
            this.deepDiveType = GlobalSettings.getTCXscope(this.scope).pageType ? GlobalSettings.getTCXscope(this.scope).pageType : 3;
            this.getGeoLocation();
            this.getDeepDiveVideo();
            this.sectionFrontName();
          });
    }
  }
