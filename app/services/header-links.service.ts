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
        url: '/deep-dive'
      },
      {
        menuTitle: "ENTERTAINMENT",
        url: '/deep-dive'
      },
      {
        menuTitle: "BUSINESS",
        url: '/deep-dive'
      },
      {
        menuTitle: "REAL ESTATE",
        url: '/deep-dive'
      },
      {
        menuTitle: "WEATHER",
        url: '/deep-dive'
      }
    ];

    return menuData;
  }
}
