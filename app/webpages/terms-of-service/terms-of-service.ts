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
}
