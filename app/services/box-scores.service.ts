import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Headers, Http } from '@angular/http';
import { GlobalFunctions } from '../global/global-functions';
import 'rxjs/add/operator/map';

declare var moment;

export interface boxScoresInterface {
  currentScope: string; //league
  aiContent?: any;
  data: Array<{gameDayInfoInterface}>
} // end boxscores interface

export interface gameDayInfoInterface {
  // GAME
  eventId: number;
  eventDate: string; // date of event
  eventStartTime: number; // event start time
  liveStatus?: string;
  eventStatus: string; // pregame | live | postgame | delayed
  segmentType: string; // innings | quarter | halves | periods
  lastUpdated?: string; //
  // TEAMS
  dataPoint1Label: string; // data point 1 label - [DP2]
  dataPoint2Label: string; // data point 2 label - [DP3]
  dataPoint3Label: string; // data point 3 label - [DP4]
  //HOME TEAM
  idHome: string; // home team id
  fullNameHome: string; // home team full name
  firstNameHome: string; // home team market
  lastNameHome: string; // home team name without market - [Home Team]
  abbreviationHome: string; // home team name abbreviated
  nicknameHome: string; // home team nickname
  logoUrlHome: string; // home team profile image - [image placeholder]
  winsHome: string; // home team record - [Home Record]
  lossHome: string; // home team record - [Home Record]
  tiesHome: string; // home team record - [Home Record]
  dataPoint1ValueHome: string; // data point 1 value for team 1 - [DV2]
  dataPoint2ValueHome: string; // data point 2 value for team 1 - [DV3]
  dataPoint3ValueHome: string; // data point 3 value for team 1 - [DP4]
  //AWAY TEAM
  idAway: string; // away team id
  fullNameAway: string; // away team full name
  firstNameAway: string; // away team market
  lastNameAway: string; // away team name without market - [Away Team]
  abbreviationAway: string; // away team name abbreviated
  nicknameAway: string; // away team nickname
  logoUrlAway: string; // away team profile image - [image placeholder]
  winsAway: string; // home team record - [Home Record]
  lossAway: string; // home team record - [Home Record]
  tiesAway: string; // home team record - [Home Record]
  dataPoint1ValueAway: string; // data point 1 value for team 2 - [DV2]
  dataPoint2ValueAway: string; // data point 2 value for team 2 - [DV3]
  dataPoint3ValueAway: string; // data point 3 value for team 2 - [DV4]
  aiContent: any;
  // LIVE DATA
  liveDataPoints: { // - [Vert Content]
    nfl: {
      liveSegmentNumber: number; // [Current Period]
      timeLeft: string; // [Time Left]
      teamInPossesion: string;
      liveYardLine: string; // needs to return what yard line and on which team's half (TN - 50)
      overTime: boolean; // if live game is in overtime
    },
    ncaaf: {
      liveSegmentNumber: number; // [Current Period]
      timeLeft: string; // [Time Left]
      teamInPossesion: string;
      liveYardLine: string; // needs to return what yard line and which team's yard line (TN - 50)
      overTime: boolean; // if live game is in overtime
    },
    mlb: {
      liveSegmentNumber: number;
      liveSegmentPosition: string; // top or bottom
      liveCount: string; // live balls and strikes
      baseCount: string; // which bases currently container runners (1, 12, 13, 123, 2, 23, 3) - RETURN 3 BOOLEAN DATA POINTS
      outs: string; // live number of outs in inning
    },
    ncaab: {
      liveSegmentNumber: number; // [Current Period]
      timeLeft: string; // [Time Left]
      teamInPossesion: string;
      overTime: boolean; // if live game is in overtime
    },
    nba: {
      liveSegmentNumber: number; // [Current Period]
      timeLeft: string; // [Time Left]
      teamInPossesion: string;
      overTime: boolean; // if live game is in overtime
    }
  }
} //export interface gameDayInfo

@Injectable()
export class BoxScoresService {

  private _apiUrl: string = 'http://dev-touchdownloyal-api.synapsys.us/tcx/boxScores/league/nfl/2016-09-16/addAi';

  constructor(public http: Http){}

  //Function to set custom headers
  setToken(){
    var headers = new Headers();
    //headers.append(this.headerName, this.apiToken);
    return headers;
  }

  // call to get data
  getBoxScoresService(profile, date, teamId?){
    let chosenDate = date;

    var callURL = this._apiUrl;
    return this.http.get(callURL)
      .map(res => res.json())
      .map(data => {
        var transformedBoxScoresData = this.transformBoxScores(data);

        return {
          transformedBoxScoresData: transformedBoxScoresData,
          aiArticle: profile == 'league' && data.aiContent != null ? data.aiContent : null,
          date: chosenDate
        }
      })
  } //getBoxScoresService

  // function for BoxScoresService to use on profile pages
  getBoxScores(boxScoresData, profileName: string, dateParam, callback: Function) {
    let scopedDateParam = dateParam;

    if(boxScoresData == null) {
      boxScoresData = {};
      boxScoresData['transformedBoxScoresData'] = {};
    }

    if ( boxScoresData == null || boxScoresData.transformedBoxScoresData[scopedDateParam.date] == null ) {
      this.getBoxScoresService(scopedDateParam.profile, scopedDateParam.date, scopedDateParam.teamId)
        .subscribe(data => {
            let currentBoxScores = {
              moduleTitle: this.moduleHeader(data.date, profileName),
              gameInfo: this.formatGameInfo(data.transformedBoxScoresData[data.date], scopedDateParam.teamId, scopedDateParam.profile)
            }
        }) //subscribe
    }
  } // END getBoxScores

  // modifies data to get header data for modules
  aiHeadLine(data) {}

  // get data for mod header
  moduleHeader(date, team?){
    var moduleTitle;
    var month = moment(date,"YYYY-MM-DD").tz('America/New_York').format("MMMM");
    var day = moment(date,"YYYY-MM-DD").tz('America/New_York').format("D");
    var ordinal = moment(date,"YYYY-MM-DD").tz('America/New_York').format("D");
    ordinal = '<sup>' + GlobalFunctions.Suffix(ordinal) + '</sup>';
    var year = moment(date,"YYYY-MM-DD").tz('America/New_York').format("YYYY");
    var convertedDate = month + ' ' + day + ordinal + ', ' + year;

    moduleTitle = "Box Scores <span class='mod-info'> - " + team + ' : ' +convertedDate + '</span>';
    return {
      moduleTitle: moduleTitle,
      hasIcon: false,
      iconClass: '',
    };
  } // moduleHeader

  // get data for the week carousel
  weekCarousel(profile, date, teamId?) {}

  // get data for monthly calendar dropdown
  validateMonth(profile, date, teamId?) {}

  // form box scores data
  transformBoxScores(data){

    var transformedData: boxScoresInterface = {
      currentScope: 'nfl',
      aiContent: data.aiContent,
      data: data.data
    } // var transformedData: boxScoresInterface

    let boxScoresData = transformedData.data;

    var boxScoreObj = {};
    var newBoxScores = {};
    let currWeekGameDates = {};

    for ( var gameDate in boxScoresData ) {
      let gameDayInfo:gameDayInfoInterface = data.data[gameDate];

      let currGameDate = moment(Number(gameDate)).tz('America/New_York').format('YYYY-MM-DD');
      //let aiContent = boxScoresData.aiContent;

      // game info
      if (gameDayInfo) {
        boxScoreObj[gameDate] = {};

        gameDayInfo['gameInfo'] = {
          eventId: gameDayInfo.eventId,
          timeLeft: gameDayInfo.liveDataPoints.nfl.timeLeft,
          live: gameDayInfo.liveStatus == 'Y'?true:false,
          startDateTime: gameDayInfo.eventDate,
          startDateTimestamp: gameDayInfo.eventStartTime,
          dataPointCategories:[
            gameDayInfo.dataPoint1Label,
            gameDayInfo.dataPoint2Label,
            gameDayInfo.dataPoint3Label
          ]
        }

        // home team info
        // boxScoreObj[gameDate]['homeTeamInfo']= {
        //   name: boxScoresData[gameDate].fullNameHome,
        //   id: boxScoresData[gameDate].idHome,
        //   firstName: boxScoresData[gameDate].firstNameHome,
        //   lastName: boxScoresData[gameDate].nicknameHome,
        //   abbreviation: boxScoresData[gameDate].abbreviationHome,
        //   logo: boxScoresData[gameDate].logoUrlHome,
        //   dataP1:boxScoresData[gameDate].dataPoint1Home,
        //   dataP2:boxScoresData[gameDate].dataPoint2Home,
        //   dataP3:boxScoresData[gameDate].dataPoint3Home,
        //   //dataP2:boxScoresData[gameDate].team1Possession != ''? boxScoresData[gameDate].team1Possession:null,
        //   teamRecord: boxScoresData[gameDate].winsHome != null ? boxScoresData[gameDate].lossHome + '-' + boxScoresData[gameDate].tieHome: null,
        // }

        // away team info
        // boxScoreObj[gameDate]['awayTeamInfo']= {
        //   name: boxScoresData[gameDate].fullNameAway,
        //   id: boxScoresData[gameDate].idAway,
        //   firstName: boxScoresData[gameDate].firstNameAway,
        //   lastName: boxScoresData[gameDate].nicknameAway,
        //   abbreviation: boxScoresData[gameDate].abbreviationAway,
        //   logo: boxScoresData[gameDate].logoUrlAway,
        //   dataP1:boxScoresData[gameDate].dataPoint1Away,
        //   dataP2:boxScoresData[gameDate].dataPoint2Away,
        //   dataP3:boxScoresData[gameDate].dataPoint3Away,
        //   //dataP2:boxScoresData[gameDate].team1Possession != ''? boxScoresData[gameDate].team1Possession:null,
        //   teamRecord: boxScoresData[gameDate].winsAway != null ? boxScoresData[gameDate].lossAway + '-' + boxScoresData[gameDate].tieAway: null,
        // };

        // team in possession
        // if( boxScoresData[gameDate].eventPossession == 0 ){
        //   boxScoresData[gameDate]['gameInfo']['verticalContent'] = "Possession: " + boxScoresData[gameDate].team1Abbreviation;
        // } else{
        //   boxScoresData[gameDate]['gameInfo']['verticalContent'] = "Possession: " + boxScoresData[gameDate].team2Abbreviation;
        // }

        // put games on the same date into an array
        if(currWeekGameDates[currGameDate] == null){
          currWeekGameDates[currGameDate] = [];
          currWeekGameDates[currGameDate].push(gameDayInfo);
        } else{
          currWeekGameDates[currGameDate].push(gameDayInfo);
        }

      } //if (boxScoresData[gameDate])

      return newBoxScores;
    } // END for ( var gameDate in data.data )
  }

  formatSchedule(data, teamId?, profile?){}

  formatGameInfo(game, teamId?, profile?){
    var gameArray: Array<any> = [];
    let self = this;
    var twoBoxes = [];// used to put two games into boxes

    if(teamId == 'nfl' || teamId == 'fbs' || teamId == 'ncaaf'){
      teamId = null;
    }

  }

  formatGameInfoSmall(game, teamId?, profile?){}

  formatArticle(data){}

  formatScoreBoard(data){}

  imageData(imageClass, imageBorder, mainImg, mainImgRoute?){}

}
