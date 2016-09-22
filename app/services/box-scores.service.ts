import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { GlobalFunctions } from '../global/global-functions';


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
  eventStatus: string; // pregame | live | postgame | delayed
  liveStatus?: string;
  segmentType: string; // innings | quarter | halves | periods
  leagueAbbreviation: string;
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
  dataPoint1Home: string; // data point 1 value for team 1 - [DV2]
  dataPoint2Home: string; // data point 2 value for team 1 - [DV3]
  dataPoint3Home: string; // data point 3 value for team 1 - [DP4]
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
  dataPoint1Away: string; // data point 1 value for team 2 - [DV2]
  dataPoint2Away: string; // data point 2 value for team 2 - [DV3]
  dataPoint3Away: string; // data point 3 value for team 2 - [DV4]
  aiContent: any;
  // LIVE DATA
  liveDataPoints: { // - [Vert Content]
    nfl: {
      liveSegmentNumber: number; // [Current Period]
      timeLeft: string; // [Time Left]
      teamInPossesion: any;
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

  private _apiUrl: string = 'http://dev-touchdownloyal-api.synapsys.us/tcx';

  constructor(public http: Http){}

  //Function to set custom headers
  setToken(){
    var headers = new Headers();
    //headers.append(this.headerName, this.apiToken);
    return headers;
  }

  // call to get data
  getBoxScoresService(scope, date, teamId?){
    let chosenDate = date;

    var callURL = this._apiUrl+'/boxScores/league/'+scope+'/'+date+'/addAi';
    return this.http.get(callURL)
      .map(res => res.json())
      .map(data => {
        console.log('1. box-scores.service - data(original call) - ', data);
        var transformedDate = this.transformBoxScores(data);

        return {
          transformedDate: transformedDate,
          aiArticle: '',
          //aiArticle: scope == 'league' && data.aiContent != null ? data.aiContent : null, //TODO
          date: chosenDate
        }
      })
  } //getBoxScoresService

  // function for BoxScoresService to use on profile pages
  getBoxScores(boxScoresData, profileName: string, dateParam, callback: Function) {
    let scopedDateParam = dateParam;

    if(boxScoresData == null) {
      boxScoresData = {};
      boxScoresData['transformedDate'] = {};
    }

    if ( boxScoresData == null || boxScoresData.transformedDate[scopedDateParam.date] == null ) {
      this.getBoxScoresService(scopedDateParam.scope, scopedDateParam.date)
        .subscribe(data => {

          if(data.transformedDate[data.date] != null && data.transformedDate[data.date][0] != null) {
            let currentBoxScores = {
              moduleTitle: this.moduleHeader(data.date, profileName),
              gameInfo: this.formatGameInfo(data.transformedDate[data.date],scopedDateParam.teamId, scopedDateParam.profile),
              gameInfoMobile: this.formatGameInfoMobile(data.transformedDate[data.date],scopedDateParam.teamId, scopedDateParam.profile),
              schedule: scopedDateParam.profile != 'league' && data.transformedDate[data.date] != null ? this.formatSchedule(data.transformedDate[data.date][0], scopedDateParam.scope, scopedDateParam.profile) : null,
            }
            currentBoxScores = currentBoxScores.gameInfo != null ? currentBoxScores :null;
            callback(data, currentBoxScores);
          }
        }) //subscribe
    }
    else {
      if( boxScoresData.transformedDate[dateParam.date] != null ){
        let currentBoxScores = {}
      }
    }
  } // END getBoxScores

  // modifies data to get header data for modules
  aiHeadLine(data) {}

  // get data for mod header
  moduleHeader(date, scope?){
    var moduleTitle;
    var month = moment(date,"YYYY-MM-DD").tz('America/New_York').format("MMMM");
    var day = moment(date,"YYYY-MM-DD").tz('America/New_York').format("D");
    var ordinal = moment(date,"YYYY-MM-DD").tz('America/New_York').format("D");
    ordinal = '<sup>' + GlobalFunctions.Suffix(ordinal) + '</sup>';
    var year = moment(date,"YYYY-MM-DD").tz('America/New_York').format("YYYY");
    var convertedDate = month + ' ' + day + ordinal + ', ' + year;

    moduleTitle = "Box Scores <span class='mod-info'> - " + scope.toUpperCase() + ' : ' +convertedDate + '</span>';
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

    // let aiContent = transformedData.aiContent; //TODO
    // if(aiContent != null){}

    for ( var gameDate in boxScoresData ) {
      let gameDayInfo:gameDayInfoInterface = data.data[gameDate];
      let currGameDate = moment(Number(gameDate)).tz('America/New_York').format('YYYY-MM-DD');
      // game info
      if (gameDayInfo) {
      //  boxScoreObj[gameDate] = {}; //TODO

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
        //console.log('box-scores.service - transformedData - gameDayInfo[gameInfo] - ',gameDayInfo['gameInfo']);

        // home team info
        gameDayInfo['homeTeamInfo'] = {
          name: gameDayInfo.fullNameHome,
          id: gameDayInfo.idHome,
          firstName: gameDayInfo.firstNameHome,
          lastName: gameDayInfo.nicknameHome,
          abbreviation: gameDayInfo.abbreviationHome,
          logo: gameDayInfo.logoUrlHome,
          dataP1: gameDayInfo.dataPoint1Home,
          dataP2: gameDayInfo.dataPoint2Home,
          dataP3: gameDayInfo.dataPoint3Home,
          //dataP2:boxScoresData[gameDate].team1Possession != ''? boxScoresData[gameDate].team1Possession:null,
          teamRecord: gameDayInfo.winsHome != null ? gameDayInfo.winsHome + '-' + gameDayInfo.lossHome + '-' + gameDayInfo.tiesHome: null
        }
        //console.log('box-scores.service - transformedData - gameDayInfo[homeTeamInfo] - ',gameDayInfo['homeTeamInfo']);

        // away team info
        gameDayInfo['awayTeamInfo'] = {
          name: gameDayInfo.fullNameAway,
          id: gameDayInfo.idAway,
          firstName: gameDayInfo.firstNameAway,
          lastName: gameDayInfo.nicknameAway,
          abbreviation: gameDayInfo.abbreviationAway,
          logo: gameDayInfo.logoUrlAway,
          dataP1: gameDayInfo.dataPoint1Away,
          dataP2: gameDayInfo.dataPoint2Away,
          dataP3: gameDayInfo.dataPoint3Away,
          //dataP2:boxScoresData[gameDate].team1Possession != ''? boxScoresData[gameDate].team1Possession:null,
          teamRecord: gameDayInfo.winsAway != null ? gameDayInfo.winsAway + '-' + gameDayInfo.lossAway + '-' + gameDayInfo.tiesAway: null,
        }
        //console.log('box-scores.service - transformedData - gameDayInfo[awayTeamInfo] - ',gameDayInfo['awayTeamInfo']);

        // team in possession
        if( gameDayInfo.liveDataPoints.nfl.teamInPossesion == 0 ){ // TODO nfl needs to be scope variable
          gameDayInfo['gameInfo']['verticalContent'] = "Possession: " + gameDayInfo.abbreviationHome;
        } else{
          gameDayInfo['gameInfo']['verticalContent'] = "Possession: " + gameDayInfo.abbreviationAway;
        }

        // organize games by date and put them into newBoxScores
        if(typeof newBoxScores[currGameDate] == 'undefined'){
          newBoxScores[currGameDate] = [];
          newBoxScores[currGameDate].push(gameDayInfo);
        } else{
          newBoxScores[currGameDate].push(gameDayInfo);
        }
      } //if (boxScoresData[gameDate])
    } // END for ( var gameDate in data.data )

    console.log('2. box-scores.service - transformedData - newBoxScores - ',newBoxScores);
    return newBoxScores;
  }

  formatSchedule(data, scope?, profile?) {
    let awayData = data.awayTeamInfo;
    let homeData = data.homeTeamInfo;
    var left, right;
    // var homeRoute = VerticalGlobalFunctions.formatTeamRoute(homeData.name, homeData.id); //TODO
    // var awayRoute = VerticalGlobalFunctions.formatTeamRoute(awayData.name, awayData.id); //TODO
    // if(profile == 'team'){
    //   if(teamId == homeData.id){
    //     homeRoute = null;
    //   }else{
    //     awayRoute = null;
    //   }
    // }
    // var homeLogo = this.imageData("image-70", "border-2", GlobalSettings.getImageUrl(homeData.logo), homeRoute);
    // var awayLogo = this.imageData("image-70", "border-2", GlobalSettings.getImageUrl(awayData.logo), awayRoute);

    right = {
      // homeHex:homeData.colors.split(', ')[0], //parse out comma + space to grab only hex colors
      homeID:homeData.id,
      homeLocation:homeData.firstName, // first name of team usually represents the location
      //homeLogo:homeLogo, // TODO
      //url:homeRoute, // TODO
      homeRecord:homeData.teamRecord
    };
    left = {
      // awayHex:awayData.colors.split(', ')[0],
      awayID:awayData.id,
      awayLocation:awayData.firstName,
      //awayLogo: awayLogo, // TODO
      //url:awayRoute, // TODO
      awayRecord: homeData.teamRecord
    };

    console.log('4. box-scores.service - formatSchedule - home:[right] -', [right]);
    console.log('4. box-scores.service - formatSchedule - away:[left] -', [left]);
    return {
      home:[right],
      away:[left]
    };
  }

  // Format the date for each gameBox
  formatGameInfo(game, scope?, profile?) {
    var gameArray: Array<any> = [];
    let self = this;
    var twoBoxes = [];// used to put two games into boxes

    if(scope == 'nfl' || scope == 'fbs' || scope == 'ncaaf'){ //TODO
      scope = null;
    }

    // Sort games by time
    let sortedGames = game.sort(function(a, b) {
      return Number(a.gameInfo.startDateTimestamp) - Number(b.gameInfo.startDateTimestamp);
    });
    sortedGames.forEach(function(data,i){
      console.log('sortedGames - ', game);
      //var info:GameInfoInput; //TODO
      var info;
      let awayData = data.awayTeamInfo;
      let homeData = data.homeTeamInfo;
      let gameInfo = data.gameInfo;
      let homeLink = ''; //TODO
      let awayLink = ''; //TODO
      //var aiContent = data.aiContent != null ? self.formatArticle(data):null; //TODO
      //var link1 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(homeData.logo), homeLink); //TODO
      //var link2 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(awayData.logo), awayLink); //TODO

      let gameDate = data.gameInfo;
      let homeRecord = data.homeTeamInfo.teamRecord;
      // let homeWin = homeData.winRecord != null ? homeData.winRecord : '#';
      // let homeLoss = homeData.lossRecord != null ? homeData.lossRecord : '#';

      let awayRecord = data.awayTeamInfo.teamRecord;
      // let awayWin = awayData.winRecord != null ? awayData.winRecord : '#';
      // let awayLoss = awayData.lossRecord != null ? awayData.lossRecord : '#';

      //determine if a game is live or not and display correct game time
      var currentTime = new Date().getTime();
      var inningTitle = '';
      var verticalContentLive;
      if(gameInfo.live){
        verticalContentLive = gameInfo.verticalContent;
        // let inningHalf = gameInfo.inningHalf != null ? GlobalFunctions.toTitleCase(gameInfo.inningHalf) : '';
        inningTitle = gameInfo.inningsPlayed != null ? gameInfo.inningsPlayed +  GlobalFunctions.Suffix(gameInfo.inningsPlayed) + " Quarter: " + "<span class='gameTime'>"+gameInfo.timeLeft+"</span>" : '';
      } else{
        verticalContentLive = "";
        if((currentTime < gameInfo.startDateTimestamp) && !gameInfo.live){
          inningTitle = moment(gameDate.startDateTimestamp).tz('America/New_York').format('h:mm A z');
        }else{
          inningTitle = 'Final';
        }
      }

      info = {
        gameHappened:gameInfo.inningsPlayed != null ?  true : false,
        //inning will display the Inning the game is on otherwise if returning null then display the date Time the game is going to be played
        inning:inningTitle,
        dataPointCategories:gameInfo.dataPointCategories,
        verticalContent:verticalContentLive,
        homeData:{
          homeTeamName: homeData.lastName,
          //homeImageConfig:link1,
          homeLink: homeLink,
          homeRecord: homeRecord,
          DP1:homeData.dataPoint1Home,
          DP2:homeData.dataPoint2Home,
          DP3:homeData.dataPoint3Home
        },
        awayData:{
          awayTeamName:awayData.lastName,
          //awayImageConfig:link2,
          awayLink: awayLink,
          awayRecord: awayRecord,
          DP1:awayData.dataPoint1Away,
          DP2:awayData.dataPoint2Away,
          DP3:awayData.dataPoint3Away
        }
      };  //info

      // push info into twoBoxes array for display
      twoBoxes.push({game:info});
      if(twoBoxes.length > 1 || (i+1) == game.length){// will push into main array once 2 pieces of info has been put into twoBoxes variable
        gameArray.push(twoBoxes);
        twoBoxes = [];
      }
      //incase it runs through entire loops and only 2 or less returns then push whatever is left
      if(game.length == (i+1)  && gameArray.length == 0){
        gameArray.push(twoBoxes);
      }
    })
    console.log('3. box-scores.service - formatGameInfo - gameArray - ',gameArray);
    return gameArray;
  }

  // Format the date for each gameBox - mobile only
  formatGameInfoMobile(game, scope?, profile?){
    var gameArray: Array<any> = [];
    let self = this;
    var twoBoxes = [];// used to put two games into boxes

    if(scope == 'nfl' || scope == 'fbs' || scope == 'ncaaf'){ //TODO
      scope = null;
    }

    // Sort games by time
    let sortedGames = game.sort(function(a, b) {
      return new Date(a.gameInfo.startDateTime).getTime() - new Date(b.gameInfo.startDateTime).getTime();
    });

    sortedGames.forEach(function(data,i){
      //var info:GameInfoInput; //TODO
      var info;
      let awayData = data.awayTeamInfo;
      let homeData = data.homeTeamInfo;
      let gameInfo = data.gameInfo;
      let homeLink = ''; //TODO
      let awayLink = ''; //TODO
      //var aiContent = data.aiContent != null ? self.formatArticle(data):null; //TODO

      var aiContent = data.aiContent != null ? self.formatArticle(data):null;
      //var link1 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(homeData.logo), homeLink) //TODO
      //var link2 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(awayData.logo), awayLink) //TODO

      let gameDate = data.gameInfo;
      let homeRecord = data.homeTeamInfo.teamRecord;
      // let homeWin = homeData.winRecord != null ? homeData.winRecord : '#';
      // let homeLoss = homeData.lossRecord != null ? homeData.lossRecord : '#';

      let awayRecord = data.awayTeamInfo.teamRecord;
      // let awayWin = awayData.winRecord != null ? awayData.winRecord : '#';
      // let awayLoss = awayData.lossRecord != null ? awayData.lossRecord : '#';

      //determine if a game is live or not and display correct game time
      var currentTime = new Date().getTime();
      var inningTitle = '';
      var verticalContentLive;
      if(gameInfo.live){
        verticalContentLive = gameInfo.verticalContent;
        // let inningHalf = gameInfo.inningHalf != null ? GlobalFunctions.toTitleCase(gameInfo.inningHalf) : '';
        inningTitle = gameInfo.inningsPlayed != null ? gameInfo.inningsPlayed +  GlobalFunctions.Suffix(gameInfo.inningsPlayed) + " Quarter: " + "<span class='gameTime'>"+gameInfo.timeLeft+"</span>" : '';
      } else{
        verticalContentLive = "";
        if((currentTime < gameInfo.startDateTimestamp) && !gameInfo.live){
          inningTitle = moment(gameDate.startDateTimestamp).tz('America/New_York').format('h:mm A z');
        } else{
          inningTitle = 'Final';
        }
      }
      info = {
        gameHappened:gameInfo.inningsPlayed != null ?  true : false,
        //inning will display the Inning the game is on otherwise if returning null then display the date Time the game is going to be played
        inning:inningTitle,
        dataPointCategories:gameInfo.dataPointCategories,
        verticalContent:verticalContentLive,
        homeData:{
          homeTeamName: homeData.lastName,
          //homeImageConfig:link1,
          homeLink: homeLink,
          homeRecord: homeRecord,
          DP1:homeData.dataPoint1Home,
          DP2:homeData.dataPoint2Home,
          DP3:homeData.dataPoint3Home
        },
        awayData:{
          awayTeamName:awayData.lastName,
          //awayImageConfig:link2,
          awayLink: awayLink,
          awayRecord: awayRecord,
          DP1:awayData.dataPoint1Away,
          DP2:awayData.dataPoint2Away,
          DP3:awayData.dataPoint3Away
        }
      };  //info

      // push info into twoBoxes array for display
      twoBoxes.push({game:info});
      if(twoBoxes.length > 1 || (i+1) == game.length){// will push into main array once 2 pieces of info has been put into twoBoxes variable
        gameArray.push(twoBoxes);
        twoBoxes = [];
      }
      //incase it runs through entire loops and only 2 or less returns then push whatever is left
      if(game.length == (i+1)  && gameArray.length == 0){
        gameArray.push(twoBoxes);
      }
      })
      console.log('3. box-scores.service - formatGameInfoMobile - gameArray - ',gameArray);
      return gameArray;

  }

  formatArticle(data){}

  formatScoreBoard(data){}

  imageData(imageClass, imageBorder, mainImg, mainImgRoute?){}

}
