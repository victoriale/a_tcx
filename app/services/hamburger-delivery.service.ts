import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class HamburgerDeliveryService {
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
        menuTitle: "Home",
        url: '/deep-dive'
      },
      {
        menuTitle: "Trending",
        url: '/deep-dive'
      },
      {
        menuTitle: "Breaking",
        url: '/deep-dive'
      },
      {
        menuTitle: "Sports",
        url: '/deep-dive',
        nesterChildren: [
          {
            menuTitle: "NFL",
            url: '/deep-dive'
          },
          {
            menuTitle: "NCAAF",
            url: '/deep-dive'
          },
          {
            menuTitle: "NBA",
            url: '/deep-dive'
          },
          {
            menuTitle: "NCAAM",
            url: '/deep-dive'
          },
          {
            menuTitle: "MLB",
            url: '/deep-dive'
          },
          {
            menuTitle: "NHL",
            url: '/deep-dive'
          }
        ]
      },
      {
        menuTitle: "Business",
        url: '/deep-dive'
      },
      {
        menuTitle: "Politics",
        url: '/deep-dive'
      },
      {
        menuTitle: "Entertainment",
        url: '/deep-dive',
        nesterChildren: [
          {
            menuTitle: "TVs",
            url: '/deep-dive'
          },
          {
            menuTitle: "Movies",
            url: '/deep-dive'
          },
          {
            menuTitle: "Music",
            url: '/deep-dive'
          },
          {
            menuTitle: "Celebrities",
            url: '/deep-dive'
          }
        ]
      },
      {
        menuTitle: "Food",
        url: '/deep-dive'
      },
      {
        menuTitle: "Health",
        url: '/deep-dive'
      },
      {
        menuTitle: "Lifestyle",
        url: '/deep-dive'
      },
      {
        menuTitle: "Real Estate",
        url: '/deep-dive'
      },
      {
        menuTitle: "Travel",
        url: '/deep-dive'
      },
      {
        menuTitle: "Weather",
        url: '/deep-dive'
      }
    ];
    var menuInfo = [];

    return {menuData: menuData, menuInfo: menuInfo};
  }
}
