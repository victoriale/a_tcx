import {Component} from '@angular/core';

@Component({
    selector:"deep-dive-page",
    templateUrl: 'app/webpages/deep-dive-page/deep-dive-page.html',

})

export class DeepDivePage{
    title="Everything that is deep dive will go in this page. Please Change according to your requirement";
    test: any = {
              imageClass: "image-150",
              mainImage: {
                imageUrl: '/app/public/profile_placeholder.png',
                urlRouteArray: ['/syndicated-article'],
                hoverText: "<p>View</p> Profile",
                imageClass: "border-large"
              },
              subImages: [
                {
                  imageUrl: '/app/public/profile_placeholder.png',
                  urlRouteArray: ['/syndicated-article'],
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
