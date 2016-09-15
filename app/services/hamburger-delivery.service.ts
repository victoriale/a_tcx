import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalFunctions} from '../global/global-functions';
import {VerticalGlobalFunctions} from '../global/vertical-global-functions';
import {GlobalSettings} from '../global/global-settings';

@Injectable()
export class HamburgerDeliveryService {
  static createMenu(division, partner?){
    var params;
    var partnerUrl;
    var divisionUrl;
    if (division != null) {
      divisionUrl = division.toLowerCase();
    }
    if (partner == null || partner == false){
      partnerUrl = "Default";
      params = {scope: divisionUrl};
    }
    else {
      partnerUrl = "Partner";
      params = {scope: divisionUrl, partner_id: partner};
    }
    var menuData = [{
        menuTitle: "Home",
        url: [partnerUrl +'-home',params ,'Home-page']
      },
      {
        menuTitle: division + " Teams",
        url: [partnerUrl +'-home',params ,'Pick-team-page']//todo
      },
      {
        menuTitle: division + " Players",
        url: [partnerUrl +'-home',params ,'Directory-page-starts-with', {type: "players", startsWith: "a", page: "1"}]//todo
      },
      {
        menuTitle: division + " League",
        url: [partnerUrl +'-home',params ,'League-page']//todo
      },
      {
        menuTitle: division + " Schedule",
        url: [partnerUrl +'-home',params ,'Schedules-page-league', {pageNum:1, year: null}]//todo
      },
      {
        menuTitle: division + " Standings",
        url: [partnerUrl +'-home',params ,'Standings-page-league', {type: division}]
    }];
    var menuInfo = [{
        menuTitle: "About Us",
        url: ['About-us-page']
      },
      {
        menuTitle: "Contact Us",
        url: ['Contact-us-page']
      },
      {
        menuTitle: "Disclaimer",
        url: ['Disclaimer-page']
    }];

    return {menuData: menuData, menuInfo: menuInfo};
  }
}
