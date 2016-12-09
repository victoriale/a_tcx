import {Component, OnInit, OnDestroy, HostListener, Renderer} from '@angular/core';
import { SchedulesService } from '../../services/schedules.service';
import { DeepDiveService } from '../../services/deep-dive.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalSettings } from "../../global/global-settings";
import { GlobalFunctions } from "../../global/global-functions";
import { GeoLocation } from "../../global/global-service";

import { SectionNameData } from "../../fe-core/interfaces/deep-dive.data";
import { SeoService } from "../../global/seo.service";

declare var moment;
declare var jQuery: any;

@Component({
    selector: "deep-dive-page",
    templateUrl: 'app/webpages/deep-dive-page/deep-dive-page.html'
})

export class DeepDivePage implements OnInit {
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
    scrollTopPrev:number = 0;

    constructor(
        private _schedulesService:SchedulesService,
        private _deepDiveData: DeepDiveService,
        private _activatedRoute: ActivatedRoute,
        private _geoLocation: GeoLocation,
        private _seo:SeoService,
        private _router:Router,
        private _render:Renderer
    ) {}


    ngOnDestroy(){
      this.routeSubscription.unsubscribe();
    }
    //Subscribe to getGeoLocation in geo-location.service.ts. On Success call getNearByCities function.
    getGeoLocation() {
      //TODO replace once added router guard has been implemented where GeoLocation is required before route generates
      this._geoLocation.grabLocation().subscribe( res => {
        this.geoLocation = res.state;
        this.selectedLocation = res.city + "-" + res.state;
        this.getHourlyWeatherData(this.topScope);
        this.getSideScroll();
      });
    }

    private sectionFrontName(){
      var displayName = GlobalSettings.getTCXscope(this.scope).displayName;
      var secIcon = GlobalSettings.getTCXscope(this.scope).icon;
      return this.sectionName = {
         icon: secIcon ? secIcon : 'fa-news',
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

    private addMetaTags(){
        let metaDesc = GlobalSettings.getPageTitle('Dive into the most recent news about your favorite sports, movies and read the latest articles on politics, business, travel etc.', 'Deep Dive');
        let link = window.location.href;

        this._seo.setCanonicalLink(link);
        this.scope=="all"?this._seo.setOgTitle('TCX Deep Dive'): this._seo.setOgTitle(this.scope);
        this._seo.setOgDesc(metaDesc);
        this._seo.setOgType('Website');
        this._seo.setOgUrl(link);
        this._seo.setOgImage('/app/public/mainLogo.png');
        this._seo.setTitle(this.scope + ' Deep Dive | TCX');
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
        pageScope = 'breaking';
      }
      this._deepDiveData.getCarouselData(pageScope, this.carouselData, '15', '1', this.geoLocation, (carData)=>{
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
            this.carouselGraph = null;
            this.carouselVideo = null;
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
            this.addMetaTags();
          });
    }

    @HostListener('window:scroll',['$event']) onScroll(e){
        var scrollingWidget=e.target.body.getElementsByClassName('deep-dive-container2b')[0];
        var header = e.target.body.getElementsByClassName('header')[0];
        var carouselHeight = e.target.body.getElementsByClassName('deep-dive-container1')[0];
        var fixedHeader = e.target.body.getElementsByClassName('fixedHeader')[0] != null ? e.target.body.getElementsByClassName('fixedHeader')[0].offsetHeight : 0;
        var footer = e.target.body.getElementsByClassName('footer')[0];

        let topStyle = 0;
        topStyle = header != null ? topStyle + header.offsetHeight : topStyle;
        topStyle = carouselHeight != null? topStyle +carouselHeight.offsetHeight :topStyle;
        topStyle = topStyle - fixedHeader;
        let bottomCSS=0;
        bottomCSS = footer!=null? bottomCSS + footer.offsetHeight: bottomCSS;
        var scrollTop = e.srcElement.body.scrollTop;
        let scrollUp = scrollTop - this.scrollTopPrev>0?true:false;
        var scrollBottom = e.target.body.scrollHeight-e.target.body.scrollTop==e.target.body.clientHeight?true:false;

        this.scrollTopPrev=scrollTop;
        if(scrollingWidget){
            if(window.scrollY>topStyle){
                if(scrollUp) {
                    var widtop = window.scrollY - topStyle - 10 + 'px';
                    this._render.setElementStyle(scrollingWidget, 'top', widtop);
                }else{
                    var headerTop=e.target.body.getElementsByClassName('header-top')[0];
                    var partnerheadTop=document.getElementById('partner_header')?document.getElementById('partner_header').offsetHeight:0;
                    var widtop = headerTop.offsetHeight? window.scrollY - topStyle + headerTop.offsetHeight + partnerheadTop + 25 + 'px' :window.scrollY - topStyle + partnerheadTop + 'px';
                    this._render.setElementStyle(scrollingWidget, 'top', widtop);
                }
                if(scrollBottom && window.innerHeight - footer.offsetHeight <600){
                    var newTopCSS =window.scrollY - topStyle - bottomCSS - 20+ 'px';
                    this._render.setElementStyle(scrollingWidget,'top', newTopCSS);
                }


            }else{
                this._render.setElementStyle(scrollingWidget, 'top', '0px');

            }
        }

    }
  }
