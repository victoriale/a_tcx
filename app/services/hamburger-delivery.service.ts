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
        url: '/deep-dive/trending'
      },
      {
        menuTitle: "Breaking",
        url: '/deep-dive/breaking'
      },
      {
        menuTitle: "Sports",
        url: '/deep-dive/sports',
        nesterChildren: [
          {
            menuTitle: "NFL",
            url: '/deep-dive/sports/nfl'
          },
          {
            menuTitle: "NCAAF",
            url: '/deep-dive/sports/ncaaf'
          },
          {
            menuTitle: "NBA",
            url: '/deep-dive/sports/nba'
          },
          {
            menuTitle: "NCAAM",
            url: '/deep-dive/sports/ncaam'
          },
          {
            menuTitle: "MLB",
            url: '/deep-dive/sports/mlb'
          },
          {
            menuTitle: "NHL",
            url: '/deep-dive/sports/nhl'
          }
        ]
      },
      {
        menuTitle: "Business",
        url: '/deep-dive/business'
      },
      {
        menuTitle: "Politics",
        url: '/deep-dive/politics'
      },
      {
        menuTitle: "Entertainment",
        url: '/deep-dive/entertainment',
        nesterChildren: [
          {
            menuTitle: "TVs",
            url: '/deep-dive/entertainment/tvs'
          },
          {
            menuTitle: "Movies",
            url: '/deep-dive/entertainment/movies'
          },
          {
            menuTitle: "Music",
            url: '/deep-dive/entertainment/music'
          },
          {
            menuTitle: "Celebrities",
            url: '/deep-dive/entertainment/celebrities'
          }
        ]
      },
      {
        menuTitle: "Food",
        url: '/deep-dive/food'
      },
      {
        menuTitle: "Health",
        url: '/deep-dive/health'
      },
      {
        menuTitle: "Lifestyle",
        url: '/deep-dive/lifestyle'
      },
      {
        menuTitle: "Real Estate",
        url: '/deep-dive/real-estate'
      },
      {
        menuTitle: "Travel",
        url: '/deep-dive/travel'
      },
      {
        menuTitle: "Weather",
        url: '/deep-dive/weather'
      },
      {
        menuTitle: "Automotive",
        url: '/deep-dive/Automotive'
      }
    ];
    var menuInfo = [];

    return {menuData: menuData, menuInfo: menuInfo};
  }
}
