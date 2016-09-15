import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http} from '@angular/http';

import {GlobalFunctions} from "../global/global-functions";
import {GlobalSettings} from "../global/global-settings";
import {VerticalGlobalFunctions} from "../global/vertical-global-functions";

export interface DailyUpdateData {
  hasError: boolean;
  type: string;
  wrapperStyle: any;
  lastUpdateDate: string;
  chart: DailyUpdateChart;
  fullBackgroundImageUrl: string;
  seasonStats: Array<{name: string, value: string, icon: string}>;
  postGameArticle?: PostGameArticleData;
}

export interface DailyUpdateChart {
  categories: Array<string>;
  dataSeries: Array<{name: string, values: Array<any>}>;
}

interface DataSeries {
  name: string;
  key: string;
}

interface APIDailyUpdateData {
  lastUpdated: string;
  backgroundImage: string;
  pitcher: boolean;
  seasonStats: Array<any>;
  recentGames: APIGameData;
}

interface APIGameData {
  pointsFor?: string;
  opponentTeamName?: string;
  pointsAgainst?: string;
  eventId?: string;
  teamId?: string;
  gameStat1?: string;
  gameStat2?: string;
}

interface PostGameArticleData {
  eventId: string;
  teamId: string;
  url?: Object;
  pubDate: string;
  headline: string;
  text: Array<any>;
  img: string;
}

declare var moment: any;

@Injectable()
export class DailyUpdateService {
  postGameArticleData: PostGameArticleData;

  constructor(public http: Http){}

  getErrorData(): DailyUpdateData {
    return {
      hasError: true,
      type: "",
      wrapperStyle: {},
      lastUpdateDate: "",
      chart: null,
      fullBackgroundImageUrl: "",
      seasonStats: []
    };
  }

  getTeamDailyUpdate(teamId: number): Observable<DailyUpdateData> {
    //http://dev-homerunloyal-api.synapsys.us/team/dailyUpdate/2800
    // let url = GlobalSettings.getApiUrl() + '/team/dailyUpdate/' + teamId;
  //  let url = "http://dev-homerunloyal-api.synapsys.us/team/dailyUpdate/2800"; //place holder data for QA review
    let url = GlobalSettings.getApiUrl() + '/dailyUpdate/team/' + teamId;
    return this.http.get(url)
        .map(res => res.json())
        .map(data => this.formatTeamData(data.data, teamId));
  }

  private formatTeamData(data: APIDailyUpdateData, teamId: number): DailyUpdateData {
    if ( !data ) {
      throw new Error("Error! Data is null from Team Daily Update API");
    }

    //Setting up season stats
    var stats = [];
    if ( data.recentGames['wins'] != null ) {
      var apiSeasonStats = {
        totalWins: data.recentGames["wins"] ? data.recentGames["wins"] : "N/A",
        totalLosses: data.recentGames["losses"] ? data.recentGames["losses"] : "N/A",
        lastUpdated: data.recentGames["lastUpdated"] ? GlobalFunctions.formatUpdatedDate(data.recentGames["lastUpdated"]) : "N/A",
        pointsPerGame: data.recentGames["pointsPerGame"] ? data.recentGames["pointsPerGame"] : "N/A",
        passingYardsPerGame: data.recentGames["passingYardsPerGame"] ? data.recentGames["passingYardsPerGame"] : "N/A",
        rushingYardsPerGame: data.recentGames["rushingYardsPerGame"] ? data.recentGames["rushingYardsPerGame"] : "N/A",
      }
      var record = "N/A";
      if ( data.recentGames["wins"] != null && data.recentGames["losses"] != null ) {
        record = data.recentGames["wins"] + "-" + data.recentGames["losses"];
      }
      stats = [
        {
          name: "Win Loss Record",
          value: record,
          icon: "fa-trophy"
        },
        {
          name: "Average Points Per Game",

          value: data.recentGames["pointsPerGame"] != null ? data.recentGames["pointsPerGame"] : "N/A",
          icon: "fa-tdpoints"
        },
        {
          name: "Passing Yards Per Game",
          value: data.recentGames["passingYardsPerGame"] != null ? data.recentGames["passingYardsPerGame"] : "N/A",
          icon: "fa-tdball"
        },
        {
          name: "Rushing Yards Per Game",
          value: data.recentGames["rushingYardsPerGame"] != null ? data.recentGames["rushingYardsPerGame"] : "N/A",
          icon: "fa-tdrushing"
        }
      ]
    }

    //Setting up chart info
    var seriesOne = {
        name: "Points For",
        key: "pointsFor"
    };
    var seriesTwo = {
        name: "Points Against",
        key: "pointsAgainst"
    };
    data['recentGamesChartData'] =[
      {
        pointsFor: data.recentGames["game1Stat1"] != null ? data.recentGames["game1Stat1"] : "N/A",
        pointsAgainst: data.recentGames["game1Stat2"] != null ? data.recentGames["game1Stat2"] : "N/A",
        opponentTeamName: data.recentGames["game1AgainstNick"] != null ? data.recentGames["game1AgainstNick"] : "N/A"
      },
      {
        pointsFor: data.recentGames["game2Stat1"] != null ? data.recentGames["game2Stat1"] : "N/A",
        pointsAgainst: data.recentGames["game2Stat2"] != null ? data.recentGames["game2Stat2"] : "N/A",
        opponentTeamName: data.recentGames["game2AgainstNick"] != null ? data.recentGames["game2AgainstNick"] : "N/A"
      },
      {
        pointsFor: data.recentGames["game3Stat1"] != null ? data.recentGames["game3Stat1"] : "N/A",
        pointsAgainst: data.recentGames["game3Stat2"] != null ? data.recentGames["game3Stat2"] : "N/A",
        opponentTeamName: data.recentGames["game3AgainstNick"] != null ? data.recentGames["game3AgainstNick"] : "N/A"
      },
      {
        pointsFor: data.recentGames["game4Stat1"] != null ? data.recentGames["game4Stat1"] : "N/A",
        pointsAgainst: data.recentGames["game4Stat2"] != null ? data.recentGames["game4Stat2"] : "N/A",
        opponentTeamName: data.recentGames["game4AgainstNick"] != null ? data.recentGames["game4AgainstNick"] : "N/A"
      }
    ]
    var chart:DailyUpdateChart = this.getChart(data, seriesOne, seriesTwo);
    this.getPostGameArticle(data);
    if ( chart ) {
        return {
          hasError: false,
          lastUpdateDate: GlobalFunctions.formatUpdatedDate(apiSeasonStats.lastUpdated, false, ""),
          fullBackgroundImageUrl: data['postgame-report'].image != null ? VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(data['postgame-report'].image.imageUrl) :  VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(null),
          type: "Team",
          wrapperStyle: {},
          seasonStats: stats,
          chart: chart,
          postGameArticle: this.postGameArticleData
        };
    }
    else {
      return null;
    }
  }

  getPlayerDailyUpdate(playerId: number): Observable<DailyUpdateData> {

    let url = GlobalSettings.getApiUrl() + '/dailyUpdate/player/' + playerId;

    return this.http.get(url)
        .map(res => res.json())
        .map(data => this.formatPlayerData(data.data, playerId));
  }

  private formatPlayerData(data: APIDailyUpdateData, playerId: number): DailyUpdateData {
    if ( !data ) {
      throw new Error("Error! Data is null from Player Daily Update API");
    }
    //Setting up season stats
    var stats = [];
    if ( data.recentGames["id"] != null ) {
      stats = [
        {
          name: data.recentGames["stat1Type"] != null ? data.recentGames["stat1Type"] : "N/A",
          value: data.recentGames["stat1"] != null ? data.recentGames["stat1"] : "N/A",
          icon: getStatIcon( data.recentGames["stat1Type"] != null ? data.recentGames["stat1Type"] : "N/A"),
        },
        {
          name: data.recentGames["stat2Type"] != null ? data.recentGames["stat2Type"] : "N/A",
          value: data.recentGames["stat2"] != null ? data.recentGames["stat2"] : "N/A",
          icon: getStatIcon( data.recentGames["stat2Type"] != null ? data.recentGames["stat2Type"] : "N/A"),
        },
        {
          name: data.recentGames["stat3Type"] != null ? data.recentGames["stat3Type"] : "N/A",
          value: data.recentGames["stat3"] != null ? data.recentGames["stat3"] : "N/A",
          icon: getStatIcon( data.recentGames["stat3Type"] != null ? data.recentGames["stat3Type"] : "N/A"),
        },
        {
          name: data.recentGames["stat4Type"] != null ? data.recentGames["stat4Type"] : "N/A",
          value: data.recentGames["stat4"] != null ? data.recentGames["stat4"] : "N/A",
          icon: getStatIcon( data.recentGames["stat4Type"] != null ? data.recentGames["stat4Type"] : "N/A"),
        }
      ]
    }
    // Add cases for different positions
    function getStatIcon(statName){
      switch(statName){
        case "Total Tackles":
          return "fa-total-tackles";
        case "Total Sacks":
          return "fa-total-sacks";
        case "Interceptions":
          return "fa-interceptions";
        case "Forced Fumbles":
          return "fa-games-started";
        case "Receptions":
          return "fa-receptions";
        case "Receiving Yards":
          return "fa-tdrecyards";
        case "Average Yards Per Reception":
          return "fa-tdrushing";
        case "Touchdowns":
          return "fa-tdpoints";
        case "Games Played":
          return "fa-total-tackles";
        case "Games Started":
          return "fa-games-started";
        case "Years Experience":
          return "fa-years-experience";
        case "Age":
          return "fa-age";
        case "Passer Rating":
          return "fa-passer-rating";
        case "Passing Yards":
          return "fa-tdball";
        case "Rushing Attempts":
          return "fa-rushing-attempts";
        case "Rushing Yards":
          return "fa-tdrecyards";
        case "Yards Per Carry":
          return "fa-tdrushing";
        case "Field Goals Made":
          return "fa-field-goals-made";
        case "Field Goal Percentage Made":
          return "fa-field-goal-pct-made";
        case "Extra Points Made":
          return "fa-tdrushing";
        case "Total Points":
          return "fa-tdpoints";
        case "Total Punts":
          return "fa-rushing-attempts";
        case "Punts Within 20 YDL %":
          return "fa-field-goal-pct-made";
        case "Gross Punting Yards":
          return "fa-gross-punting-yds";
        case "Average Punt Distance":
          return "fa-tdball";
        case "Height":
          return "fa-age";
        case "Class":
          return "fa-years-experience";
        default :
          return "fa-trophy";
      }
    }

    var apiSeasonStats = {
      lastUpdated: data.recentGames["lastUpdated"] ? GlobalFunctions.formatUpdatedDate(data.recentGames["lastUpdated"]) : "N/A",
    }

    //Setting up chart info
    // TODO add cases for other positions
    var seriesOne = {
      name: data.recentGames["gameStat1Type"] != null ? data.recentGames["gameStat1Type"] : "N/A",
      key: "gameStat1"
    };
    var seriesTwo = {
      name: data.recentGames["gameStat2Type"] != null ? data.recentGames["gameStat2Type"] : "N/A",
      key: "gameStat2"
    };
    data['recentGamesChartData'] =[
      {
        gameStat1: data.recentGames["game1Stat1"] != null ? data.recentGames["game1Stat1"] : "N/A",
        gameStat2: data.recentGames["game1Stat2"] != null ? data.recentGames["game1Stat2"] : "N/A",
        opponentTeamName: data.recentGames["game1AgainstNick"] != null ? data.recentGames["game1AgainstNick"] : "N/A"
      },
      {
        gameStat1: data.recentGames["game2Stat1"] != null ? data.recentGames["game2Stat1"] : "N/A",
        gameStat2: data.recentGames["game2Stat2"] != null ? data.recentGames["game2Stat2"] : "N/A",
        opponentTeamName: data.recentGames["game2AgainstNick"] != null ? data.recentGames["game2AgainstNick"] : "N/A"
      },
      {
        gameStat1: data.recentGames["game3Stat1"] != null ? data.recentGames["game3Stat1"] : "N/A",
        gameStat2: data.recentGames["game3Stat2"] != null ? data.recentGames["game3Stat2"] : "N/A",
        opponentTeamName: data.recentGames["game3AgainstNick"] != null ? data.recentGames["game3AgainstNick"] : "N/A"
      },
      {
        gameStat1: data.recentGames["game4Stat1"] != null ? data.recentGames["game4Stat1"] : "N/A",
        gameStat2: data.recentGames["game4Stat2"] != null ? data.recentGames["game4Stat2"] : "N/A",
        opponentTeamName: data.recentGames["game4AgainstNick"] != null ? data.recentGames["game4AgainstNick"] : "N/A"
      }
    ];

    var chart:DailyUpdateChart = this.getChart(data, seriesOne, seriesTwo);
    this.getPostGameArticle(data);

    let tempText = "";
    if(this.postGameArticleData.text && this.postGameArticleData.text.length>0 && typeof(this.postGameArticleData.text) == "object") {
      tempText = this.postGameArticleData.text.join(" ");
    }else{
      tempText = <any>this.postGameArticleData.text;
    }
    this.postGameArticleData.text = [tempText];

    if ( chart ) {
      return {
        hasError: false,
        lastUpdateDate: GlobalFunctions.formatUpdatedDate(apiSeasonStats.lastUpdated, false, ""),
        fullBackgroundImageUrl: data['postgame-report'].image != null ? VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(data['postgame-report'].image.imageUrl) :  VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(null),
        type: "Player",
        wrapperStyle: {},
        seasonStats: stats,
        chart: chart,
        postGameArticle: this.postGameArticleData
      };
    }
    else {
      return null;
    }
  }

  private getPitcherStats(apiSeasonStats) {
    var record = "N/A";
    if ( apiSeasonStats.pitchWins != null && apiSeasonStats.pitchLosses != null ) {
      record = apiSeasonStats.pitchWins + "-" + apiSeasonStats.pitchLosses;
    }

    return [
        {
          name: "Win Loss Record",
          value: record,
          icon: "fa-tdrushat"
        },
        {
          name: "Innings Pitched",
          value: apiSeasonStats.pitchInningsPitched != null ? apiSeasonStats.pitchInningsPitched : "N/A",
          icon: "fa-tdrecyards" //TODO: get 'baseball field' icon
        },
        {
          name: "Strike Outs",
          value: apiSeasonStats.pitchStrikeouts != null ? apiSeasonStats.pitchStrikeouts : "N/A",
          icon: "fa-tdrushing" //TODO: get '2 baseball bats' icon
        },
        {
          name: "Earned Runs Average",
          value: apiSeasonStats.pitchEra != null ? Number(apiSeasonStats.pitchEra).toFixed(2) : "N/A",
          icon: "fa-tdpoints" //TODO: use 'batter swinging' icon
        }
      ]
  }

  private getBatterStats(apiSeasonStats) {
    var batOnBasePercentage = "N/A";
    if ( apiSeasonStats.batOnBasePercentage != null ) {
      var value = Number(apiSeasonStats.batOnBasePercentage) * 100;
      batOnBasePercentage = value.toFixed(0) + "%";
    }

    var batAverage = "N/A";
    if ( apiSeasonStats.batOnBasePercentage != null ) {
      var value = Number(apiSeasonStats.batAverage) * 100;
      batAverage = value.toFixed(0) + "%";
    }

    return [
        {
          name: "Home Runs",
          value: apiSeasonStats.batHomeRuns != null ? apiSeasonStats.batHomeRuns : "N/A",
          icon: "fa-base-lg" //TODO: get 'homeplate' icon
        },
        {
          name: "Batting Average",
          value: batAverage,
          icon: "fa-batt-and-ball" //TODO: get 'baseball and bat' icon
        },
        {
          name: "Runs Batted In",
          value: apiSeasonStats.batRbi != null ? apiSeasonStats.batRbi : "N/A",
          icon: "fa-batter-alt" //TODO: get 'batter standing' icon
        },
        {
          name: "On Base Percentage",
          value: batOnBasePercentage,
          icon: "fa-percentage-alt"
        }
      ]
  }
  private getPostGameArticle(data: APIDailyUpdateData) {
    let articleData = {};
    let aiData;
    for( var game in data){
      if(game != 'recentGames' && game != 'recentGamesChartData'){
        aiData = data[game];
      }
    }
    articleData['eventId'] = aiData.article.status != 'Error' || aiData.article != null ? aiData.article.data[0].eventId : null;
    articleData['teamId'] = data.recentGames.teamId != null ? data.recentGames.teamId : null;
    articleData['playerId'] = data.recentGames["playerId"] != null ? data.recentGames["playerId"] : null;
    articleData['playerPosition'] = data.recentGames["playerPosition"] != null ? data.recentGames["playerPosition"] : null;
    articleData['url'] = articleData['eventId'] != null ? ['Article-pages', {eventType: 'postgame-report', eventID: articleData['eventId']}] : null;
    articleData['pubDate'] = data['postgame-report'].article.data[0].lastUpdated != null ? GlobalFunctions.formatUpdatedDate(data['postgame-report'].article.data[0].lastUpdated, true, " " + moment().tz('America/New_York').format('z')) : null;
    articleData['headline'] = data['postgame-report'].article.data[0].title != null ? data['postgame-report'].article.data[0].title : null;
    articleData['text'] = data['postgame-report'].article.data[0].teaser != null && data['postgame-report'].article.data[0].teaser.length > 0 ? [data['postgame-report'].article.data[0].teaser] : null;
    articleData['img'] = data['postgame-report'].article.data.length && data['postgame-report'].article.data[0].imageUrl != null && data['postgame-report'].article.data[0].imageUrl.length > 0 ? VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(data['postgame-report'].article.data[0].imageUrl): null;

    this.postGameArticleData = <PostGameArticleData>articleData;
  }

  private getChart(data: APIDailyUpdateData, seriesOne: DataSeries, seriesTwo: DataSeries) {
    if ( data['recentGamesChartData'] && data['recentGamesChartData'].length > 0 ) { //there should be at least one game in order to show the module
      var chart:DailyUpdateChart = {
          categories: [],
          dataSeries: [{
            name: seriesOne.name,
            values: []
          },
          {
            name: seriesTwo.name,
            values: []
          }]
      };

      data['recentGamesChartData'].forEach((item, index) => {
        chart.categories.unshift("vs " + item.opponentTeamName); //TODO: Should this link to the team?

        chart.dataSeries[0].values.unshift(item[seriesOne.key] != null ? Number(item[seriesOne.key]) : null);
        chart.dataSeries[1].values.unshift(item[seriesTwo.key] != null ? Number(item[seriesTwo.key]) : null);
      });

      return chart;
    }
    else {
      return null;
    }
  }
}
