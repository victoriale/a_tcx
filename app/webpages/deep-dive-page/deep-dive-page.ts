import {Component, OnInit} from '@angular/core';

@Component({
    selector: "deep-dive-page",
    templateUrl: 'app/webpages/deep-dive-page/deep-dive-page.html',

})

export class DeepDivePage implements OnInit {
    title="Everything that is deep dive will go in this page. Please Change according to your requirement";
    test: any;
    ngOnInit() {
      var testImage = "/app/public/profile_placeholder.png";
      this.test = {
                    imageClass: "image-150",
                    mainImage: {
                      imageUrl: testImage,
                      urlRouteArray: '/syndicated-article',
                      hoverText: "<p>Test</p> Profile",
                      imageClass: "border-large"
                  },
                  subImages: [
                    {
                      imageUrl: testImage,
                      urlRouteArray: '/syndicated-article',
                      hoverText: "<i class='fa fa-mail-forward'></i>",
                      imageClass: "image-50-sub image-round-lower-right"
                    },
                    {
                      text: "#1",
                      imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
                    }
                  ],
                }
    }
  }
