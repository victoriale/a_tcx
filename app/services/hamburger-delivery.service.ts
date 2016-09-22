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
        menuTitle: "Trending",
        url: [partnerUrl +'-home',params ,'Home-page']
      },
      {
        menuTitle: "Breaking",
        url: [partnerUrl +'-home',params ,'Home-page']
      },
      {
        menuTitle: "Sports",
        url: [partnerUrl +'-home',params ,'Home-page']
      },
      {
        menuTitle: "Business",
        url: [partnerUrl +'-home',params ,'Home-page']
      },
      {
        menuTitle: "Politics",
        url: [partnerUrl +'-home',params ,'Home-page']
      },
      {
        menuTitle: "Entertainment",
        url: [partnerUrl +'-home',params ,'Home-page']
      },
      {
        menuTitle: "Food",
        url: [partnerUrl +'-home',params ,'Home-page']
      },
      {
        menuTitle: "Health",
        url: [partnerUrl +'-home',params ,'Home-page']
      },
      {
        menuTitle: "Lifestyle",
        url: [partnerUrl +'-home',params ,'Home-page']
      },
      {
        menuTitle: "Real Estate",
        url: [partnerUrl +'-home',params ,'Home-page']
      },
      {
        menuTitle: "Travel",
        url: [partnerUrl +'-home',params ,'Home-page']
      },
      {
        menuTitle: "Weather",
        url: [partnerUrl +'-home',params ,'Home-page']
      }
    ];
    var menuInfo = [];

    return {menuData: menuData, menuInfo: menuInfo};
  }
}
