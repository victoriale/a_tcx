import { Component, OnInit } from '@angular/core';
import {GlobalSettings} from "../../global/global-settings";

@Component({
  selector: 'about-us-page',
  templateUrl: 'app/webpages/aboutus/aboutus.html',
})

export class AboutUsPage implements OnInit{
  aboutUsData: any;

  currentUrl: string = window.location.href;

  socialMedia:Array<any> = GlobalSettings.getSocialMedia(this.currentUrl);

  ngOnInit(){
    this.aboutUsData = {
      title: "Want to learn more about TCX?",
      lastUpdated: "Last Updated On: Wednesday, Oct. 19, 2016",
      paragraph: [{
          subHeader: "What is TCX?",
          info: ['We created the Wichita, Kan.-based TCX in October, 2016 to combine personal and insightful human-generated articles with dynamic data-driven AI content.', 'Here at TCX, we have an appetite for digesting down big data to produce and organize content from across the world of journalism. We provide a unique range of content that keeps readers engaged and ready to dive deep into every corner of the newsroom. In addition to up-to-date articles written by humans, our AI-generated articles add to an infinitely-growing content library.']
      }]
    }
  }
}
