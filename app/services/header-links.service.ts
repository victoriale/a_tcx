import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class HeaderLinksService {
  static createMenu(){
    // var params;
    // var partnerUrl;
    // var divisionUrl;
    // if (division != null) {
    //   divisionUrl = division.toLowerCase();
    // }
    // if (partner == null || partner == false){
    //   partnerUrl = "Default";
    //   params = {scope: divisionUrl};
    // }
    // else {
    //   partnerUrl = "Partner";
    //   params = {scope: divisionUrl, partner_id: partner};
    // }
    var menuData = [{
        menuTitle: "SPORTS",
        url: '/deep-dive/sports'
      },
      {
        menuTitle: "ENTERTAINMENT",
        url: '/deep-dive/entertainment'
      },
      {
        menuTitle: "BUSINESS",
        url: '/deep-dive/business'
      },
      {
        menuTitle: "REAL ESTATE",
        url: '/deep-dive/real-esate'
      },
      {
        menuTitle: "WEATHER",
        url: '/deep-dive/weather'
      }
    ];

    return menuData;
  }
}
