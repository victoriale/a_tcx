import {Component, OnInit, HostListener, Renderer} from '@angular/core';
import {GlobalSettings} from "../../global/global-settings";

@Component({
  selector: 'terms-of-service',
  templateUrl: 'app/webpages/terms-of-service/terms-of-service.html',
})

export class TermsOfService implements OnInit{
  aboutUsData: any;

  currentUrl: string = window.location.href;

  socialMedia:Array<any> = GlobalSettings.getSocialMedia(this.currentUrl);

  scrollTopPrev:number = 0;

  constructor(private _render:Renderer){
      window.scrollTo(0, 0);
  }
  goTo(location: string): void {
      window.location.hash = location;
  }
  ngOnInit(){
    this.aboutUsData = {
      title: "Terms of Service",
      lastUpdated: "Last Updated On: Wednesday, Nov. 02, 2016",
      paragraph: null

    }
  }
  @HostListener('window:scroll',['$event']) onScroll(e){
    var scrollWidget=e.target.body.getElementsByClassName('condition-page-container2b')[0];
    var header = e.target.body.getElementsByClassName('header')[0];
    var fixedHeader = e.target.body.getElementsByClassName('fixedHeader')[0] != null ? e.target.body.getElementsByClassName('fixedHeader')[0].offsetHeight : 0;
      var footer = e.target.body.getElementsByClassName('footer')[0];

      let widgetTop = 0;
    widgetTop = header != null ? widgetTop + header.offsetHeight : widgetTop;
    widgetTop = widgetTop - fixedHeader;
      let bottomCSS=0;
      bottomCSS = footer!=null? bottomCSS + footer.offsetHeight: bottomCSS;
    var scrollTop = e.srcElement.body.scrollTop;
    let scrollUp = scrollTop - this.scrollTopPrev>0?true:false;
      var scrollBottom = e.target.body.scrollHeight-e.target.body.scrollTop==e.target.body.clientHeight?true:false;

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
          if(scrollBottom && window.innerHeight - footer.offsetHeight <600){
              var newTopCSS =window.scrollY - widgetTop - bottomCSS - 30+ 'px';
              this._render.setElementStyle(scrollWidget,'top', newTopCSS);
          }


      }else{
        this._render.setElementStyle(scrollWidget, 'top', '0px');

      }
    }

  }
}