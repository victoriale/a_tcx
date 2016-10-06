import {Component, OnInit, OnDestroy} from '@angular/core';
import { SchedulesService } from '../../services/schedules.service';
import { DeepDiveService } from '../../services/deep-dive.service';
import { ActivatedRoute } from '@angular/router';
import { GlobalSettings } from "../../global/global-settings";

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
    topScope: string = "sports";
    changeScopeVar: string = "nfl";
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

    constructor(private _schedulesService:SchedulesService, private _deepDiveData: DeepDiveService, private _activatedRoute: ActivatedRoute) {}

    ngOnInit(){
      this.routeSubscription = this._activatedRoute.params.subscribe(
          (param:any) => {
            this.category = param['category'];
            this.scope = param['articleCategory'] ? param['articleCategory'] : param['category'];
            console.log('Partner:',GlobalSettings.getPartnerId());
            console.log('sectionFront parameters:',param);
          }
      );
      this.getSideScroll();
      this.getDataCarousel();
      this.deepDiveType = this.getDeepDiveType(this.category);
    }

    ngOnDestroy(){
      this.routeSubscription.unsubscribe();
    }

    private getDeepDiveType(category:string): string{
      var _typeValue;
      switch(category.toLowerCase()){
        case 'sports':
          _typeValue = "deep-dive-type1";
          break;
        case 'business':
        case 'finance':
        case 'real estate':
        case 'weather':
          _typeValue = "deep-dive-type2";
          break;
        case 'automotive':
        case 'breaking news':
        case 'entertainment':
        case 'food':
        case 'IPO':
        case 'lifestyle':
        case 'politics':
        case 'travel':
          _typeValue = "deep-dive-type3";
          break;
        default:
          break;
      }
      return _typeValue;
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
        this._schedulesService.setupSlideScroll(this.topScope, this.sideScrollData, changeScope, 'league', 'pregame', this.callLimit, this.callCount, (sideScrollData) => {
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
            this.scopeList = ["NCAAF", "NFL"];
            this.sideScrollData = sideScrollData;
            this.scrollLength = this.sideScrollData.blocks.length;
          }
          else if (this.topScope == "basketball") {
            if(this.sideScrollData == null){
              this.scopeList = sideScrollData.scopeList.reverse();
              this.sideScrollData = sideScrollData;
              this.scrollLength = this.sideScrollData.blocks.length;
            }
            else{
              sideScrollData.forEach(function(val,i){
                self.sideScrollData.push(val);
              })
            }
          }
          else if (this.topScope == "baseball") {
            if(this.sideScrollData == null){
              this.scopeList = [];
              this.sideScrollData = sideScrollData;
              this.scrollLength = this.sideScrollData.blocks.length;
            }
            else{
              sideScrollData.forEach(function(val,i){
                self.sideScrollData.push(val);
              })
            }
          }
          else if (this.topScope == "sports") {
            if(this.sideScrollData == null){
              this.scopeList = ["ALL"];
              this.sideScrollData = sideScrollData;
              this.scrollLength = this.sideScrollData.blocks.length;
            }
            else{
              sideScrollData.forEach(function(val,i){
                self.sideScrollData.push(val);
              })
            }
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


    private getDataCarousel() {
      this._deepDiveData.getCarouselData('nfl', this.carouselData, '25', '1', 'CA', (carData)=>{
        this.carouselData = carData;
      })
    }
  }
