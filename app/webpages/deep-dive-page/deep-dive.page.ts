import {Component, OnInit, Input, NgZone} from '@angular/core';
import {CarouselDiveModule} from '../../fe-core/modules/carousel-dive/carousel-dive.module';
import {DeepDiveService} from '../../services/deep-dive.service';
import {SidekickWrapper} from '../../fe-core/components/sidekick-wrapper/sidekick-wrapper.component';
import {SchedulesService} from '../../services/schedules.service';
import {PartnerHeader} from "../../global/global-service";
import {WidgetCarouselModule} from '../../fe-core/modules/widget/widget-carousel.module';
import {SideScrollSchedule} from '../../fe-core/modules/side-scroll-schedules/side-scroll-schedules.module';
import {GlobalSettings} from "../../global/global-settings";
import {GlobalFunctions} from "../../global/global-functions";
import {GeoLocation} from "../../global/global-service";
import {Router, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {ResponsiveWidget} from '../../fe-core/components/responsive-widget/responsive-widget.component';
import {PartnerHomePage} from '../partner-home-page/partner-home-page';

import {DeepDiveBlock1} from '../../fe-core/modules/deep-dive-blocks/deep-dive-block-1/deep-dive-block-1.module';
import {DeepDiveBlock2} from '../../fe-core/modules/deep-dive-blocks/deep-dive-block-2/deep-dive-block-2.module';
import {DeepDiveBlock3} from '../../fe-core/modules/deep-dive-blocks/deep-dive-block-3/deep-dive-block-3.module';
import {DeepDiveBlock4} from '../../fe-core/modules/deep-dive-blocks/deep-dive-block-4/deep-dive-block-4.module';

import {SideScroll} from '../../fe-core/components/side-scroll/side-scroll.component'
//window declarions of global functions from library scripts
declare var moment;
declare var jQuery: any;

@Component({
    selector: 'deep-dive-page',
    templateUrl: './app/webpages/deep-dive-page/deep-dive.page.html',

    directives: [
      PartnerHomePage,
      ROUTER_DIRECTIVES,
      SidekickWrapper,
      WidgetCarouselModule,
      SideScrollSchedule,
      CarouselDiveModule,
      ResponsiveWidget,
      DeepDiveBlock1,
      DeepDiveBlock2,
      DeepDiveBlock3,
      DeepDiveBlock4,
      SideScroll
    ],
    providers: [SchedulesService,DeepDiveService,GeoLocation,PartnerHeader],
})

export class DeepDivePage implements OnInit{
    public widgetPlace: string = "widgetForPage";

    //page variables
    scope: string;
    sidescrollScope:string;
    partnerID: string;
    partnerData:any;
    profileName:string;
    geoLocation:string;

    sideScrollData: any;
    scrollLength: number;
    ssMax:number = 9;
    callCount:number = 1;
    callLimit:number = 9;
    safeCall: boolean = true;
    //for carousel
    carouselData: any;
    videoData:any;
    blockIndex: number = 1;
    changeScopeVar: string = "";
​
    private isPartnerZone: boolean = false;

    constructor(
      private _router:Router,
      private _deepDiveData: DeepDiveService,
      private _schedulesService:SchedulesService,
      private _geoLocation:GeoLocation,
      private _partnerData: PartnerHeader,
      public ngZone:NgZone){
        // needs to get Geolocation first
      GlobalSettings.getParentParams(_router, parentParams => {
          this.partnerID = parentParams.partnerID;
          this.scope = parentParams.scope;
          this.changeScopeVar = this.scope;
          this.profileName = this.scope == 'fbs'? 'NCAAF':this.scope.toUpperCase();
          var partnerHome = GlobalSettings.getHomeInfo().isHome && GlobalSettings.getHomeInfo().isPartner;
          if (window.location.pathname == "/" + GlobalSettings.getHomeInfo().partnerName && GlobalSettings.getHomeInfo().isPartner) {
            let relPath = this.getRelativePath(_router);
              //_router.navigate([relPath+'Partner-home',{scope:'nfl',partnerId:GlobalSettings.getHomeInfo().partnerName}]);
              window.location.pathname = "/" + GlobalSettings.getHomeInfo().partnerName + "/nfl";
          }
          this.isPartnerZone = partnerHome;
          if(this.partnerID != null){
            this.getPartnerHeader();
          }else{
            this.getGeoLocation();
          }
      });
    }

    getRelativePath(router:Router){
      let counter = 0;
      let hasParent = true;
      let route = router;
      for (var i = 0; hasParent == true; i++){
        if(route.parent != null){
          counter++;
          route = route.parent;
        }else{
          hasParent = false;
          let relPath = '';
          for(var c = 1 ; c <= counter; c++){
            relPath += '../';
          }
          return relPath;
        }
      }
    }

    //api for Schedules
    private getSideScroll(){
      let self = this;
      if(this.safeCall){
        this.safeCall = false;
        let changeScope = this.changeScopeVar.toLowerCase() == 'ncaaf'?'fbs':this.changeScopeVar.toLowerCase();
        this._schedulesService.setupSlideScroll(this.sideScrollData, changeScope, 'league', 'pregame', this.callLimit, this.callCount, (sideScrollData) => {
          if(this.sideScrollData == null){
            this.sideScrollData = sideScrollData;
          }
          else{
            sideScrollData.forEach(function(val,i){
              self.sideScrollData.push(val);
            })
          }
          this.safeCall = true;
          this.callCount++;
          this.scrollLength = this.sideScrollData.length;
        }, null, null)
      }
    }
    changeScope($event) {
      var partnerHome = GlobalSettings.getHomeInfo().isHome && GlobalSettings.getHomeInfo().isPartner;
      let relPath = this.getRelativePath(this._router);
      if(partnerHome){
        this._router.navigate([relPath+'Partner-home',{scope:$event.toLowerCase(),partnerId:GlobalSettings.getHomeInfo().partnerName}]);
        window.location.pathname = "/" + GlobalSettings.getHomeInfo().partnerName + "/"+$event.toLowerCase();
      }else{
        this._router.navigate([relPath+'Default-home',{scope:$event.toLowerCase()}]);
        window.location.pathname = "/"+$event.toLowerCase();
      }

      // if($event == this.changeScopeVar){
      //   this.getSideScroll();
      // }else{
      //   this.changeScopeVar = $event;
      //   this.callCount = 1;
      //   this.sideScrollData = null;
      //   this.getSideScroll();
      // }
    }

    private scrollCheck(event){
      let maxScroll = this.sideScrollData.length;
      if(event >= (maxScroll - this.ssMax)){
       this.getSideScroll();
      }
    }

    private getDeepDiveVideoBatch(){
        this._deepDiveData.getDeepDiveVideoBatchService(this.scope, '1', '1', this.geoLocation).subscribe(
          data => {
            this.videoData = data.data;
          }
        )
      }

    private getDataCarousel() {
      this._deepDiveData.getCarouselData(this.scope, this.carouselData, '25', '1', this.geoLocation, (carData)=>{
        this.carouselData = carData;
      })
    }

    getPartnerHeader(){//Since it we are receiving
      if(this.partnerID != null){
        this._partnerData.getPartnerData(this.partnerID)
        .subscribe(
          partnerScript => {
            this.partnerData = partnerScript;
            //super long way from partner script to get location using geo location api
            var state = partnerScript['results']['location']['realestate']['location']['city'][0].state;
            state = state.toLowerCase();
            this.geoLocation = state;
            this.callModules();
          }
        );
      }else{
        this.getGeoLocation();
      }
    }

    //Subscribe to getGeoLocation in geo-location.service.ts. On Success call getNearByCities function.
    getGeoLocation() {
      var defaultState = 'ca';
        this._geoLocation.getGeoLocation()
            .subscribe(
                geoLocationData => {
                  this.geoLocation = geoLocationData[0].state;
                  this.geoLocation = this.geoLocation.toLowerCase();
                  this.callModules();

                },
                err => {
                  this.geoLocation = defaultState;
                  this.callModules();
                }
            );
    }

    callModules(){
      this.getDataCarousel();
      this.getDeepDiveVideoBatch();
     this.getSideScroll();
    }
    private onScroll(event) {
      if (jQuery(document).height() - window.innerHeight - jQuery("footer").height() <= jQuery(window).scrollTop()) {
        //fire when scrolled into footer
        this.blockIndex = this.blockIndex + 1;
      }
    }
    ngOnInit(){
      // var script = document.createElement("script");
      // script.src = 'http://content.synapsys.us/deepdive/rails/rails.js?selector=.web-container&adMarginTop=100';
      // document.head.appendChild(script);
      // jQuery("deep-dive-page").parent().addClass('deep-dive-container');
    }
}
