import {Component, OnInit, OnDestroy, HostListener, Renderer, ElementRef} from '@angular/core';
import { SchedulesService } from '../../services/schedules.service';
import { DeepDiveService } from '../../services/deep-dive.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalSettings } from "../../global/global-settings";
import { GlobalFunctions } from "../../global/global-functions";
import { VerticalGlobalFunctions } from "../../global/vertical-global-functions";
import { GeoLocation } from "../../global/global-service";

import { SectionNameData } from "../../fe-core/interfaces/deep-dive.data";
import { SeoService } from "../../global/seo.service";
import {error} from "util";
import {Location} from "@angular/common";

declare var moment;
declare var jQuery: any;

@Component({
    selector: "deep-dive-page",
    templateUrl: 'app/webpages/deep-dive-page/deep-dive-page.html'
})

export class DeepDivePage implements OnInit{
    scope: string;
    //side scroller
    sideScrollData: any;
    scrollLength: number = 0;
    selectedLocation: string = "san%20francisco-ca"; // default city for weather if geolocation returns nothin
    tcxVars: any;
    topScope: string;
    changeScopeVar: string;
    safeCall: boolean = true;
    ssMax: number;
    callCount: number = 1;
    callLimit: number = 50;
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
    scrollTopPrev:number = 0;
    errorPage: boolean = false;
    partnerID: string = GlobalSettings.storedPartnerId();
    scrollingWidget;

    constructor(
        private _schedulesService:SchedulesService,
        private _deepDiveData: DeepDiveService,
        private _activatedRoute: ActivatedRoute,
        private _geoLocation: GeoLocation,
        private _seo:SeoService,
        private _router:Router,
        private _render:Renderer,
        private _eleref:ElementRef,
        private _location:Location
    ) {
    }

    ngOnDestroy(){
      this.routeSubscription.unsubscribe();
    }
    //Subscribe to getGeoLocation in geo-location.service.ts. On Success call getNearByCities function.
    getGeoLocation() {
      //TODO replace once added router guard has been implemented where GeoLocation is required before route generates
      this._geoLocation.grabLocation().subscribe( res => {
          try{
              if(res){
                  this.geoLocation = res.state;
                  this.selectedLocation = res.city + "-" + res.state;
                  // this.getHourlyWeatherData(this.topScope);
                  this.getSideScroll();
              }else throw new Error("Geo Location data unavailable!")
          }catch(e){
              console.error(e.message);
          }

      });
    }

    private sectionFrontName(str:string){
      var displayName = GlobalSettings.getTCXscope(str).displayName;
      var secIcon = GlobalSettings.getTCXscope(str).icon;
      return this.sectionName = {
         icon: secIcon ? secIcon : 'fa-news',
         title: displayName ? displayName : GlobalFunctions.toTitleCase(str.replace(/--/g," "))
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

    private addMetaTags(){
        this._seo.removeMetaTags();
        let metaDesc = GlobalSettings.getPageTitle('Dive into the most recent news about your favorite sports, movies and read the latest articles on politics, business, travel etc.', 'Deep Dive');
        let link = window.location.href;
        let title = this.scope != "all" ? GlobalSettings.getTCXscope(this.scope).displayName : "Home";
        title += " Deep Dive";
        this._seo.setCanonicalLink(this._activatedRoute.params,this._router);
        this.scope=="all"?this._seo.setOgTitle('TCX Deep Dive'): this._seo.setOgTitle(this.scope);
        this._seo.setOgDesc(metaDesc);
        this._seo.setOgType('Website');
        this._seo.setOgUrl(link);
        this._seo.setOgImage('/app/public/mainLogo.png');
        this._seo.setTitle(title);
        this._seo.setMetaDescription(metaDesc);
        this._seo.setMetaRobots('INDEX, FOLLOW');
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
        pageScope = 'trending';
      }
      this._deepDiveData.getCarouselData(pageScope, this.carouselData, '15', '1', this.geoLocation, (carData)=>{
        try{
          if(carData && carData.length > 0){
            this.carouselData = carData;
          } else throw new Error('No carousel article data available');
        }catch(e){
          console.log(e.message);
          this.errorPage = true;
          var self=this;
          var partner = this.partnerID;
          setTimeout(function () {
              //removes error page from browser history
              self._location.replaceState('/');
              if(partner){
                self._router.navigateByUrl('/' + partner, 'news');
              } else {
                self._router.navigateByUrl('/news-feed');
              }
          }, 5000);
        }
      })
    }

    getDeepDiveVideo(){
      this._deepDiveData.getDeepDiveVideoBatchService(this.scope, 5, 1).subscribe(
        data => {
          try{
              if(data){
                  this.carouselVideo = this._deepDiveData.transformSportVideoBatchData([data[0]], this.scope);
                  this.getDataCarousel();
              }else throw new Error("Video batch data is not available for" + " " + this.scope)
          }catch(e){
              this.carouselVideo = null;
              this.getDataCarousel();
              console.log(e.message);
          }
        });
    }

    // getHourlyWeatherData(scope){//only if its weather scope that has graph
    //   if( scope == 'weather'){//weather requires {city-state} as a parameter
    //     this._schedulesService.getWeatherCarousel('hourly', this.selectedLocation).subscribe(
    //       data => {
    //         this.carouselGraph = data;
    //         this.getDataCarousel();
    //       },
    //       err => {
    //         this.carouselGraph = this._schedulesService.getDummyGraphResult();
    //         this.getDataCarousel();
    //         console.log("Error getting graph batch data:", err);
    //       });
    //   }
    // }

    ngOnInit(){
      this.initializePage();
    }

    ngOnChanges(){
      this.initializePage();
    }

    initializePage(){
      this.routeSubscription = this._activatedRoute.params.subscribe(
          (param:any) => {
            this.carouselGraph = null;
            this.carouselVideo = null;
            this.category = param['category'] ? param['category'] : 'all';
            this.category = this.category.replace(/--/g," ");
            this.scope = param['subCategory'] ? param['subCategory'] : this.category;
            this.scope = this.scope.replace(/--/g," ");
            if(param['subCategory']) {
              this.tcxVars = GlobalSettings.getTCXscope(param['subCategory']);
            } else {
              this.tcxVars = GlobalSettings.getTCXscope(this.category);
            }
            this.topScope = this.tcxVars ? this.tcxVars.topScope : this.category;
            this.changeScopeVar = this.tcxVars.scope=='news-feed'?this.tcxVars.weatherscope?this.tcxVars.weatherscope:this.tcxVars.scope:this.tcxVars.scope;
            this.deepDiveType = GlobalSettings.getTCXscope(this.scope).pageType ? GlobalSettings.getTCXscope(this.scope).pageType : 3;
            this.getGeoLocation();
            this.getDeepDiveVideo();
            this.sectionFrontName(this.scope);
            this.addMetaTags();
          });
    }
  }
