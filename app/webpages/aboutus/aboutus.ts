import {Component, OnInit, HostListener, Renderer} from '@angular/core';
import {GlobalSettings} from "../../global/global-settings";

@Component({
  selector: 'about-us-page',
  templateUrl: 'app/webpages/aboutus/aboutus.html',
})

export class AboutUsPage implements OnInit{
  aboutUsData: any;

  currentUrl: string = window.location.href;

  socialMedia:Array<any> = GlobalSettings.getSocialMedia(this.currentUrl);

    scrollTopPrev:number = 0;
    constructor(private _render:Renderer){
        window.scrollTo(0, 0);
    }

  ngOnInit(){
    this.aboutUsData = {
      title: "Want to learn more about TCX?",
      lastUpdated: "Last Updated On: Wednesday, Nov. 02, 2016",
      paragraph: [{
          subHeader: "What is TCX?",
          info: ['We created the Wichita, Kan.-based TCX in November, 2016 to combine personal and insightful human-generated articles with dynamic data-driven AI content.', 'Here at TCX, we have an appetite for digesting down big data to produce and organize content from across the world of journalism. We provide a unique range of content that keeps readers engaged and ready to dive deep into every corner of the newsroom. In addition to up-to-date articles written by humans, our AI-generated articles add to an infinitely-growing content library.']
      }]
    }
  }
  @HostListener('window:scroll',['$event']) onScroll(e){
    var scrollWidget=e.target.body.getElementsByClassName('condition-page-container2b')[0];
      var header = e.target.body.getElementsByClassName('header')[0];
      var fixedHeader = e.target.body.getElementsByClassName('fixedHeader')[0] != null ? e.target.body.getElementsByClassName('fixedHeader')[0].offsetHeight : 0;
      let widgetTop = 0;
      widgetTop = header != null ? widgetTop + header.offsetHeight : widgetTop;
      widgetTop = widgetTop - fixedHeader;
      var scrollTop = e.srcElement.body.scrollTop;
      let scrollUp = scrollTop - this.scrollTopPrev>0?true:false;
      this.scrollTopPrev=scrollTop;
      if(scrollWidget){
          if(window.scrollY>widgetTop){
              if(scrollUp) {
                  var topstyle = window.scrollY - widgetTop + 'px';
                  this._render.setElementStyle(scrollWidget, 'top', topstyle);
              }else{
                  var headerTop=e.target.body.getElementsByClassName('header-top')[0];
                  var partnerheadTop=document.getElementById('partner_header')?document.getElementById('partner_header').offsetHeight:0;
                  var topstyle = headerTop.offsetHeight? window.scrollY - widgetTop + headerTop.offsetHeight + partnerheadTop + 35 + 'px' :window.scrollY - widgetTop + partnerheadTop + 'px';
                  this._render.setElementStyle(scrollWidget, 'top', topstyle);
              }


          }else{
              this._render.setElementStyle(scrollWidget, 'top', '0px');

          }
      }

  }
}
