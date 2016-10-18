import {Injectable} from '@angular/core';
import {GlobalFunctions} from './global-functions';
import {Division, Conference} from './global-interface';
import {GlobalSettings} from "./global-settings";

@Injectable()

export class VerticalGlobalFunctions {
  private static _proto = window.location.protocol;

  constructor() {}
  /**
    * - Pass in datapoints to required parameters and formats
    * them into a single route that is in lowerCase Kebab.
    * - If parameters given do not fit the requirements them default to the error page.
    * - Otherwise takes teamName as a string
    *
    * @example
    * // teamName => 'Boston Red Sox'
    * formatTeamRoute('Boston Red Sox', 2124)
    *
    *
    * @param {teamName} teamName - team name given from data that will be converted to lower kebab case
    * @param {teamId} teamId - team ID the required field needed to successfully navigate to team profile
    * @returns the teamName => boston-red-sox,  teamId => ##, routeName => 'Team-page'
    */
   static createSearchLink(scope){
    return{
        nfl:{
            rel_link: scope + '/'+ 'search' +'/',
        },
        ncaaf:{
            rel_link: scope + '/'+ 'search' +'/',
        },
        nba:{
            rel_link: scope + '/'+ 'search' +'/r=',
        },
        ncaam:{
          rel_link: scope + '/'+ 'search' +'/r=',
        },
        mlb:{
            rel_link: 'search' +'/',
        },
        business:{
            rel_link: 'search'+ '/r=',
        },
        'real-estate':{
            rel_link: 'search' +'/',
        },
    }[scope].rel_link
  }
   static formatTeamRoute(teamName: string, teamId: string): Array<any> {
     var teamRoute: Array<any>;
     if (typeof teamName != 'undefined' && teamName != null) {
       teamName = GlobalFunctions.toLowerKebab(teamName);
       teamRoute = ['Team-page', {teamName: teamName, teamId: teamId}];//NOTE: if Team-page is on the same level as the rest of the route-outlets
     } else {
       teamRoute = null;
     }
     return teamRoute ? teamRoute : ['Error-page'];
   }

   /**
    * - Pass in datapoints to required parameters and formats
    * them into a single route.
    * - If parameters given do not fit the requirements them default to the error page.
    * - Otherwise takes articleId as a string
    *
    * @example
    * // articleId => '1234'
    * formatNewsRoute("1234")
    *
    *
    * @param {teamName} teamName - team name given from data that will be converted to lower kebab case
    * @param {teamId} teamId - team ID the required field needed to successfully navigate to team profile
    * @returns the teamName => boston-red-sox,  teamId => ##, routeName => 'Team-page'
    */

   /**
    * - Pass in datapoints to required parameters and formats
    * them into a single route that is in lowerCase Kebab.
    * - If parameters given do not fit the requirements them default to the error page.
    * - Otherwise takes teamName && playerName as a string
    *
    * @example
    * // teamName => 'Boston Red Sox'
    * // playerName => 'Babe Ruth'
    * formatTeamRoute('Boston Red Sox')
    *
    *
    * @param {teamName} teamName - team name given from data that will be converted to lower kebab case
    * @param {teamId} teamId - team ID the required field needed to successfully navigate to team profilege
    * @returns the teamName => 'boston-red-sox',  playerName => 'babe-ruth' playerId => ##, routeName => 'Player-page'
    */
   static formatPlayerRoute(teamName: string, playerFullName: string, playerId: string): Array<any> {
     var playerRoute: Array<any>;

     if (typeof teamName != 'undefined' && teamName != null && typeof playerFullName != 'undefined' && playerFullName != null) {
       teamName = GlobalFunctions.toLowerKebab(teamName);
       playerFullName = GlobalFunctions.toLowerKebab(playerFullName);
       playerRoute = ['Player-page', {teamName: teamName, fullName: playerFullName, playerId: playerId}];//NOTE: if Player-page is on the same level as the rest of the route-outlets
     } else {
       playerRoute = null;
     }
     return playerRoute ? playerRoute : ['Error-page'];
   }

  static formatSectionFrontRoute(category: string, articleCategory?: string): Array<any> {
    var sectionFrontRoute: Array<any>;
    if (typeof category != 'undefined' || category != null || category != 'all') {
      if(typeof articleCategory == 'undefined' || articleCategory === null){
        sectionFrontRoute = ['/deep-dive', category];
      } else {
        sectionFrontRoute = ['/deep-dive', category, articleCategory];
      }
    } else {
      sectionFrontRoute = ['/deep-dive'];
    }
    return sectionFrontRoute ? sectionFrontRoute : ['Error-page'];
  }

  static formatArticleRoute(category: string, articleID: string, articleType: string, articleCategory?: string): Array<any> {
    var articleRoute: Array<any>;
    if (typeof category != 'undefined' || category != null) {
      if(typeof articleCategory == 'undefined' || articleCategory === null){
        articleRoute = ['/deep-dive', category, 'article', articleType, articleID];
      } else {
        articleRoute = ['/deep-dive', category, articleCategory, 'article', articleType, articleID];
      }
    } else {
      articleRoute = null;
    }
    return articleRoute ? articleRoute : ['Error-page'];
  }

  static formatExternalArticleRoute(scope, articleType: string, articleID: string) {
    if (scope == "nfl" || scope == "ncaaf") {
      var output = scope + "/articles/"+ articleType + "/" + articleID;
    }
    else if (scope == "nba" || scope == "ncaam") {
      var output = scope + "/article/"+ articleType + "/" + articleID;
    }
    else {
      var output = "articles/" + articleType + "/" + articleID;
    }
    return output;
  }

  /**
   * - Formats the height string by removing the dashes and adding
   * tick marks for feet and inches.
   * - If heightStr is null or empty, "N/A" is returned.
   * - If no dash, the string is returned unchanged
   *
   * @example
   * // 6'8"
   * formatHeight('6-8')
   *
   * @param {string} heightStr - a height value from the API, which lists feet and inches separated by a dash (#-#)
   * @returns the height with ticks for feet and inches (#'#")
   */
  static formatHeight(heightStr: string) {
    return heightStr ? heightStr.replace(/(\d+)-(\d+)/, "$1'$2\"") : "N/A";
  }

  static formatHeightInches(heightStr: string) {
    var heightInFeet = (Number(heightStr) / 12) | 0;
    var inches = Number(heightStr) % 12;
    return heightInFeet + "-" + inches;
  }

  static formatHeightInchesWithTicks(heightStr: string) {
    var heightInFeet = (Number(heightStr) / 12) | 0;
    var inches = Number(heightStr) % 12;
    return heightInFeet + "'" + inches + '"';
  }

  static formatHeightInchesWithFoot(heightStr: string) {
    var heightInFeet = (Number(heightStr) / 12) | 0;
    var inches = Number(heightStr) % 12;
    if (inches == 0) {
      return heightInFeet + " foot";
    }
    return heightInFeet + "-foot-" + inches;
  }

  static formatHeightDigits(height) {
    var feet = height.slice(0, 1) + "'";
    var inches = height.slice(1, 2) + '"';
    return feet + inches;
  }

  /**
   * - Formats the height string by replacing the dash with '-foot-'
   * - If heightStr is null or empty, "N/A" is returned.
   * - If no dash, the string is returned unchanged
   *
   * @example
   * // 6-8
   * formatHeight('6-foot-8')
   *
   * @param {string} heightStr - a height value from the API, which lists feet and inches separated by a dash (#-#)
   * @returns #-foot-#
   */
  static formatHeightWithFoot(heightStr: string) {
    if (heightStr) {
      var insert = "-foot-";
      var formattedHeight = [heightStr.slice(0, 1), insert, heightStr.slice(1)].join('');
      return heightStr ? formattedHeight : "N/A";
    }
    else {
      return "N/A";
    }
  }


  /**
   * - Outputs a valid image url of a team logo given a valid team name input
   *
   * @example
   * TODO-JVW
   *
   * @returns a url string that points to the inputted team's logo
   */

  static formatTeamLogo(inputTeamName: string): string {
    if (inputTeamName != null) {
      let teamName = inputTeamName.replace(" ", "_");
      teamName = teamName.replace(".", "");
      let teamLogo = GlobalSettings.getImageUrl("/mlb/logos/team/MLB_" + teamName + "_Logo.jpg");
      return teamLogo;
    } else {
      return "";
    }
  }

  static getWeekDropdown(scope) {
    let weekDropdown = []
    if (scope == 'nfl') {
      weekDropdown = [
        {key: '1', value: 'Week1'},
        {key: '2', value: 'Week2'},
        {key: '3', value: 'Week3'},
        {key: '4', value: 'Week4'},
        {key: '5', value: 'Week5'},
        {key: '6', value: 'Week6'},
        {key: '7', value: 'Week7'},
        {key: '8', value: 'Week8'},
        {key: '9', value: 'Week9'},
        {key: '10', value: 'Week10'},
        {key: '11', value: 'Week11'},
        {key: '12', value: 'Week12'},
        {key: '13', value: 'Week13'},
        {key: '14', value: 'Week14'},
        {key: '15', value: 'Week15'},
        {key: '16', value: 'Week16'},
        {key: '17', value: 'Week17'},
        {key: '18', value: 'Wild Card'},
        {key: '19', value: 'Divisional Round'},
        {key: '20', value: 'Pro Bowl'},
        {key: '21', value: 'Super Bowl'},
      ];
    } else if (scope == 'ncaaf') {
      weekDropdown = [
        {key: '1', value: 'Week1'},
        {key: '2', value: 'Week2'},
        {key: '3', value: 'Week3'},
        {key: '4', value: 'Week4'},
        {key: '5', value: 'Week5'},
        {key: '6', value: 'Week6'},
        {key: '7', value: 'Week7'},
        {key: '8', value: 'Week8'},
        {key: '9', value: 'Week9'},
        {key: '10', value: 'Week10'},
        {key: '11', value: 'Week11'},
        {key: '12', value: 'Week12'},
        {key: '13', value: 'Week13'},
        {key: '14', value: 'Week14'},
        {key: '15', value: 'Week15'},
        {key: '16', value: 'Bowls'}
      ];
    }
    return weekDropdown;
  }


  /**
   * TODO-JVW
   * @param urlArr
   * @returns {any}
   */
  //path: '/list/:target/:statName/:ordering/:perPageCount/:pageNumber',
  static formatListRoute(urlArr: Array<any>): Array<any> {
    for (var arg in urlArr) {
      if (arg == null) return ['Error-page'];
    }
    // let kebabArr = urlArr.map( item => GlobalFunctions.toLowerKebab(item) );

    let listRoute = ['List-page', {
      target: urlArr[0],
      statName: urlArr[1],
      season: urlArr[2],
      ordering: urlArr[3],
      perPageCount: urlArr[4],
      pageNumber: urlArr[5]

    }];
    return listRoute;
  }

  static formatModuleListRoute(modUrlArr: Array<any>): Array<any> {
    for (var arg in modUrlArr) {
      if (arg == null) return ['Error-page'];
    }
    // let kebabArr = urlArr.map( item => GlobalFunctions.toLowerKebab(item) );

    let listModuleRoute = ['List-of-lists', {
      target: modUrlArr[0],
      id: modUrlArr[1],
      perPageCount: modUrlArr[2],
      pageNumber: modUrlArr[3]

    }];
    return listModuleRoute;
  }


  /**
   * Function will return string, reformatted from AI Content API Response as of July 21, 2016
   */
  static convertAiDate(date) {
    date = date.split(' ');
    var month = date[0];
    var day = date[1];
    day = day.split(',')[0].replace(/([A-Za-z])\w+/g, '');
    var year = date[2];

    var _string = month + ' ' + day + ', ' + year;
    return _string;
  }

  /**
   * Returns the abbreviation for American or National leagues
   *
   * @param {string} confName - 'American' or 'National' (case insensitive)
   * @param {string} divName - (Optional) If included, is appended to end of string in title case
   *
   * @returns abbreviation or confName if it cannot be mapped to an abbreviation
   */
  static formatShortNameDivison(confName: string, divName?: string): string {
    if (!confName) return confName;

    let abbr = confName;
    switch (confName.toLowerCase()) {
      case 'american':
        abbr = "AL";
        break;
      case 'national':
        abbr = "NL";
        break;
      default:
        break;
    }

    return divName ? abbr + " " + GlobalFunctions.toTitleCase(divName) : abbr;
  }


  static formatStatName(stat: string) {
    //coming from backend as a stat in the list info
    switch (stat) {
        //CB, DE. DB, DL, DT, S, LB
      case 'defense_total_tackles':
        return "Total Tackles";
      case 'defense_sacks':
        return "Total Sacks";
      case 'defense_interceptions':
        return "Interceptions";
      case 'defense_forced_fumbles':
        return "Forced Fumbles";
      case 'defense_passes_defended':
        return "Passes Defended";

        // K
      case 'kicking_field_goals_made':
        return "Field Goals Made";
      case 'kicking_field_goal_percentage_made':
        return "Field Goal Percentage Made";
      case 'kicking_extra_points_made':
        return "Extra Points Made";
      case 'kicking_total_points_scored':
        return "Total Points";
      case 'kicking_total_points_per_game':
        return "Average Points Per Game";

        // P
      case 'punting_gross_yards':
        return "Gross Punting Yards";
      case 'punting_punts':
        return "Total Punts";
      case 'punting_average':
        return "Average Distance Punt";
      case 'punting_inside_twenty':
        return "Punt % Within 20";
      case 'punting_longest_punt':
        return "Longest Punt";

        // QB
      case 'passing_rating':
        return "Passer Rating";
      case 'passing_yards':
        return "Passing Yards";
      case 'passing_touchdowns':
        return "Touchdowns";
      case 'passing_interceptions':
        return "Interceptions";
      case 'passing_completions':
        return "Completions";

        // RB
      case 'rushing_yards':
        return "Rushing Yards";
      case 'rushing_attempts':
        return "Ruhing Attempts";
      case 'rushing_yards_per_carry':
        return "Yards Per Carry";
      case 'rushing_touchdowns':
        return "Touchdowns";
      case 'rushing_yards_per_carry':
        return "Yards Per Game";

        // RS
      case 'returning_yards':
        return "Rushing Yards";
      case 'rushing_attempts':
        return "Ruhing Attempts";
      case 'rushing_yards_per_carry':
        return "Yards Per Carry";
      case 'rushing_touchdowns':
        return "Touchdowns";
      case 'rushing_yards_per_carry':
        return "Yards Per Game";

        // WR, TE
      case 'receiving_yards':
        return "Receiving Yards";
      case 'receiving_receptions':
        return "Receptions";
      case 'receiving_average_per_reception':
        return "Average Yards Per Reception";
      case 'receiving_touchdowns':
        return "Touchdowns";
      case 'returning_touchdowns':
        return "Yards Per Game";

      default:
        return GlobalFunctions.toTitleCase(stat.replace(/_/g, ' '));
    }
  }

  static convertPositionAbbrv(position) {
    switch (position) {
      case 'cb' :
        return 'Cornerback';

      case 'db' :
        return 'Defensive Back';

      case 'de' :
        return 'Defensive End';

      case 'dl' :
        return 'Defensive Lineman';

      case 'dt' :
        return 'Defensive Tackle';

      case 'saf' :
        return 'Safety';

      case 'lb' :
        return 'Linebacker';

      case 'k' :
        return 'Kicker';

      case 'p' :
        return 'Punter';

      case 'qb' :
        return 'Quarterback';

      case 'rb' :
        return 'Runningback';

      case 'rs' :
        return 'Return specialist';

      case 'wr' :
        return 'Wide Receiver';

      case 'te' :
        return 'Tight End';

      default :
        return null;
    }
  }

  static convertPositionAbbrvToPlural(position) {
    switch (position) {
      case 'cb' :
        return 'Cornerbacks';

      case 'db' :
        return 'Defensive Backs';

      case 'de' :
        return 'Defensive Ends';

      case 'dl' :
        return 'Defensive Linemen';

      case 'dt' :
        return 'Defensive Tackles';

      case 'saf' :
        return 'Safeties';

      case 'lb' :
        return 'Linebackers';

      case 'k' :
        return 'Kickers';

      case 'p' :
        return 'Punters';

      case 'qb' :
        return 'Quarterbacks';

      case 'rb' :
        return 'Runningbacks';

      case 'rs' :
        return 'Return specialists';

      case 'wr' :
        return 'Wide Receivers';

      case 'te' :
        return 'Tight Ends';

      default :
        return null;
    }
  }

  static formatSynRoute(articleType: string, eventID: string): Array<any> {
    var synRoute: Array<any>;
    if (typeof eventID != 'undefined' && eventID != null) {
      synRoute = ['Syndicated-article-page', {articleType: articleType, eventID: eventID}];
    } else {
      synRoute = null;
    }
    return synRoute ? synRoute : ['Error-page'];
  }

  static formatAiArticleRoute(eventType: string, eventID: string): Array<any> {
    var aiArticleRoute: Array<any>;
    if (typeof eventID != 'undefined' && eventID != null) {
      aiArticleRoute = ['Article-pages', {eventType: eventType, eventID: eventID}];
    } else {
      aiArticleRoute = null;
    }
    return aiArticleRoute ? aiArticleRoute : ['Error-page'];
  }

  //Some positions don't provided stats that have a league ranking
  static nonRankedDataPoints(position: Array<string>, statDesc: string) {
    //set array of positions that don't provide 4 player stats that also have a league ranking
    var positionsArray: Array<string> = ['C', 'G', 'LS', 'OL', 'OT'];

    //compare set array^ to array of position provided from data
    var result = positionsArray.some(function (v) {
      return position.indexOf(v) >= 0;
    });

    //if result matches return the desired description
    if (result == true) {
      return null;
    }
    else {
      return statDesc;
    }
  } //static nonRankedDataPoints

  //function to select a random stock photo


  static getBackroundImageUrlWithStockFallback(relativePath) {
    let stockPhotoArray = ["/TDL/stock_images/TDL_Stock-1.png", "/TDL/stock_images/TDL_Stock-2.png", "/TDL/stock_images/TDL_Stock-3.png", "/TDL/stock_images/TDL_Stock-4.png", "/TDL/stock_images/TDL_Stock-5.png", "/TDL/stock_images/TDL_Stock-6.png"];
    let randomStockPhotoSelection = stockPhotoArray[Math.floor(Math.random() * stockPhotoArray.length)];
    var relPath = relativePath != null ? this._proto + "//" + GlobalSettings._imageUrl + relativePath : this._proto + "//" + GlobalSettings._imageUrl + randomStockPhotoSelection;
    return relPath;
  }

  static formatNewsRoute(articleId: string): Array<any> {
   var articleRoute: Array<any>;
   if(articleId != null) {
   articleRoute = ['/news','story', articleId];

   } else{
   articleRoute = null;
   }
   return articleRoute ? articleRoute : ['Error-page'];

   }
}
