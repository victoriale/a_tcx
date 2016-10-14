import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {GlobalSettings} from '../global/global-settings';

@Injectable()
export class HeaderLinksService {
  static createMenu(){
    var topRoute = "";
    var partner = GlobalSettings.getPartnerId();
    if (partner == null || partner == ""){
      topRoute = "/deep-dive";
    }
    else {
      topRoute = partner +  "/news";
    }
    var menuData = [{
        menuTitle: "SPORTS",
        url: topRoute + '/sports'
      },
      {
        menuTitle: "ENTERTAINMENT",
        url: topRoute + '/entertainment'
      },
      {
        menuTitle: "BUSINESS",
        url: topRoute + '/business'
      },
      {
        menuTitle: "REAL ESTATE",
        url: topRoute + '/real-esate'
      },
      {
        menuTitle: "WEATHER",
        url: topRoute + '/weather'
      }
    ];

    return menuData;
  }
}
