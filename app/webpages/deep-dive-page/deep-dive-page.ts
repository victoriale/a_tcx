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
    // homePageBlocks = ["breaking", "video", "sports", "business", "politics", "entertainment", "food", "video", "health", "lifestyle", "realestate", "travel", "weather", "video", "automotive"];

    constructor(private _schedulesService:SchedulesService, private _deepDiveData: DeepDiveService, private _activatedRoute: ActivatedRoute, private _geoLocation: GeoLocation) {
      // var categoryBlocks;
      // if(GlobalSettings.getHomeInfo().isHome){
      //   categoryBlocks = this.homePageBlocks;
      // }
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
                  this.selectedLocation = geoLocationData[0].city.replace(/ /g, "%20") + "-" + geoLocationData[0].state;
                  console.log("Geo Location", geoLocationData[0].city + " " + geoLocationData[0].state);//keep this for now
                  this.getSideScroll();
                },
                err => {
                  console.log("Geo Location Error",err);
                  this.geoLocation = defaultState;
                  this.getSideScroll();
                }
            );
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
      if (this.topScope == "sports" || this.topScope == "entertainment") {
          this.scopeList = this.tcxVars.scopeList;
          this.sideScrollData = {scopeList: [], blocks: []};
          this.scrollLength = 0;
      }
      let self = this;
      if(this.safeCall && this.topScope != null && this.topScope != "sports" && this.topScope != "entertainment"){
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

    private getDataCarousel() {
      this._deepDiveData.getCarouselData('nfl', this.carouselData, '25', '1', 'CA', (carData)=>{
        this.carouselData = carData;
      })
    }

    ngOnInit(){
      this.routeSubscription = this._activatedRoute.params.subscribe(
          (param:any) => {
            this.category = param['category'] ? param['category'] : 'all';
            this.scope = param['articleCategory'] ? param['articleCategory'] : this.category;
            console.log('Partner:', GlobalSettings.getPartnerId());
            console.log('sectionFront parameters:',param);
            if (param['articleCategory']) {
              this.tcxVars = GlobalSettings.getTCXscope(param['articleCategory']);
            }
            else {
              this.tcxVars = GlobalSettings.getTCXscope(this.category);
            }
            this.topScope = this.tcxVars ? this.tcxVars.topScope : this.category;
            this.changeScopeVar = this.tcxVars.scope;
            this.deepDiveType = this.category != 'all' ? GlobalSettings.getTCXscope(this.scope).pageType : 'all';
            this.getGeoLocation();
            this.getDataCarousel();
            this.sectionFrontName();
          }
      );

    }
  }
