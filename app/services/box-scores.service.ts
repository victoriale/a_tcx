import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/map';

// Globals
import { GlobalFunctions } from '../global/global-functions';
import {VerticalGlobalFunctions} from '../global/vertical-global-functions';
import {GlobalSettings} from '../global/global-settings';

import { CircleImageData } from "../fe-core/components/images/image-data";

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

    var headers = this.setToken();
    let chosenDate = date;
    // console.log('3. box-scores.service - getBoxScoresService - chosenDate ', chosenDate);

    var callURL = this._apiUrl+'/boxScores/league/'+scope+'/'+date+'/addAi';
    // console.log('getBoxScoresService - callURL - ',callURL);
    return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(data => {
        // console.log('3. box-scores.service - getBoxScoresService - data ', data);
        var transformedDate = this.transformBoxScores(data, scope);
        return {
          transformedDate: transformedDate,
          aiArticle: data.aiContent != null ? data.aiContent : null,
          date: chosenDate
        }
      })
  } //getBoxScoresService

  // function for BoxScoresService to use on profile pages
  getBoxScores(boxScoresData, profileName: string, dateParam, callback: Function) {
    // console.log('2. box-scores.service - getBoxScores - boxScoresData ', boxScoresData);

    let scopedDateParam = dateParam;
    if(boxScoresData == null) {
      boxScoresData = {};
      boxScoresData['transformedDate'] = {};
    }

    // check if curr or prev game exists in transformed boxscore
    // if(boxScoresData.transformedDate[dateParam] == null){
    //   scopedDateParam.date = boxScoresData.prevGameDate;
    // }else{
    //   scopedDateParam = dateParam;
    // }

    if ( boxScoresData == null || boxScoresData.transformedDate[scopedDateParam.date] == null ) {
      this.getBoxScoresService(scopedDateParam.scope, scopedDateParam.date)
        .subscribe(data => {
          if(data.transformedDate[data.date] != null && data.transformedDate[data.date][0] != null) {
            let currentBoxScores = {
              moduleTitle: this.moduleHeader(data.date, profileName),
              gameInfo: this.formatGameInfo(data.transformedDate[data.date],scopedDateParam.teamId, scopedDateParam.profile),
              gameInfoMobile: this.formatGameInfoMobile(data.transformedDate[data.date],scopedDateParam.teamId, scopedDateParam.profile),
              schedule: data.transformedDate[data.date] != null ? this.formatSchedule(data.transformedDate[data.date][0], scopedDateParam.scope, scopedDateParam.profile) : null,
              aiContent: this.aiHeadLine(data.aiArticle, scopedDateParam.scope) != null ? this.aiHeadLine(data.aiArticle, scopedDateParam.scope) : null //TODO
            };
            currentBoxScores = currentBoxScores.gameInfo != null ? currentBoxScores :null;
            callback(data, currentBoxScores);
          }
        }) //subscribe
    }
    else {
      if( boxScoresData.transformedDate[dateParam.date] != null ){
        let currentBoxScores = {
          moduleTitle: this.moduleHeader(dateParam.date, profileName),
          gameInfo: this.formatGameInfo(boxScoresData.transformedDate[dateParam.date],dateParam.teamId, dateParam.profile),
          gameInfoMobile: this.formatGameInfoMobile(boxScoresData.transformedDate[dateParam.date],dateParam.teamId, dateParam.profile),
          schedule: dateParam.profile != 'league' && boxScoresData.transformedDate[dateParam.date] != null? this.formatSchedule(boxScoresData.transformedDate[dateParam.date][0], dateParam.teamId, dateParam.profile) : null,
          aiContent: this.aiHeadLine(boxScoresData.aiArticle, scopedDateParam.scope) != null ? this.aiHeadLine(boxScoresData.aiArticle, scopedDateParam.scope) : null //TODO
        };

        currentBoxScores = currentBoxScores.gameInfo != null ? currentBoxScores :null;
        callback(boxScoresData, currentBoxScores);
      }
    }
  } // END getBoxScores

  // modifies data to get header data for modules
  aiHeadLine(data, scope?) {
    var boxArray = [];
    if (data[0].featuredReport['article'].status != "Error") {
      data.forEach(function(val, index){
        let aiContent = val.featuredReport['article']['data'][0];
        for(var p in aiContent['articleData']){
          var eventType = aiContent['articleData'][p];
          var eventId = aiContent.eventId;
          var title = aiContent.title;
          var teaser = aiContent.teaser;
          var date = moment(aiContent.lastUpdated, 'YYYY-MM-DD').format('MMMM D, YYYY');
          if(aiContent['articleData'][p]['images']['home_images'] != null){
            var homeImage = GlobalSettings.getImageUrl(aiContent['articleData'][p]['images']['home_images'][0].image_url);
          }else{
            var homeImage = VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(null);
          }
        }
        var Box = {
          eventType: eventType,
          eventId: p,
          keyword: p.replace('-', ' '),
          date: date,
          url: VerticalGlobalFunctions.formatAiArticleRoute(p, val.event),
          title: title,
          teaser: teaser,
          urlRouteArray: 'http://www.touchdownloyal.com/articles/'+scope+'/'+p+'/'+eventId,
          imageConfig:{
            imageClass: "image-320x180-sm",
            imageUrl: homeImage,
            hoverText: "View Article",
            urlRouteArray: VerticalGlobalFunctions.formatAiArticleRoute(p, val.event)
          }
        }
        boxArray.push(Box);
      });
      return boxArray;
    } else{
      return null;
    }
  } //aiHeadLine

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
  weekCarousel(scope, date, teamId?) {
    //Configure HTTP Headers
    var headers = this.setToken();

    //player profile are treated as teams
    // if(profile == 'player'){
    //   profile = 'team'
    // }

    var callURL = 'http://dev-touchdownloyal-api.synapsys.us/league/gameDatesWeekly/'+scope+'/'+date; //TODO when TCX API is sestup
    return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(data => {
        return data;
      })
  }

  // get data for monthly calendar dropdown
  validateMonth(scope, date, teamId?) {
    //console.log('box-scores.service - validateMonth - scope - ',scope);
    //console.log('box-scores.service - validateMonth - date - ',date);
    //Configure HTTP Headers
    var headers = this.setToken();

    //player profile are treated as teams
    // if(profile == 'player'){
    //   profile = 'team'
    // }

    var callURL = 'http://dev-touchdownloyal-api.synapsys.us/league/gameDates/'+scope+'/'+ date; //TODO when TCX API is sestup //localToEST needs tobe the date coming in AS UNIX
    return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(data => {
        return data;
      })
  }

  // form box scores data
  transformBoxScores(data, scope?){

    var transformedData: boxScoresInterface = {
      currentScope: scope,
      aiContent: data.aiContent,
      data: data.data
    }

    let boxScoresData = transformedData.data;
    var boxScoreObj = {};
    var newBoxScores = {};
    let currWeekGameDates = {};

    for ( var gameDate in boxScoresData ) {
      let gameDayInfo:gameDayInfoInterface = data.data[gameDate];
      let currGameDate = moment(Number(gameDate)).tz('America/New_York').format('YYYY-MM-DD');
      // game info
      if (gameDayInfo) {
        gameDayInfo['gameInfo'] = {
          eventId: gameDayInfo.eventId,
          timeLeft: gameDayInfo.liveDataPoints[scope].timeLeft,
          live: gameDayInfo.liveStatus == 'Y'?true:false,
          startDateTime: gameDayInfo.eventDate,
          startDateTimestamp: gameDayInfo.eventStartTime,
          dataPointCategories:[
            gameDayInfo.dataPoint3Label,
            gameDayInfo.dataPoint2Label,
            gameDayInfo.dataPoint1Label
          ]
        }

        // home team info
        gameDayInfo['homeTeamInfo'] = {
          name: gameDayInfo.fullNameHome,
          id: gameDayInfo.idHome,
          firstName: gameDayInfo.firstNameHome,
          lastName: gameDayInfo.nicknameHome,
          abbreviation: gameDayInfo.abbreviationHome,
          logo: gameDayInfo.logoUrlHome,
          dataPoint1Home: gameDayInfo.dataPoint1Home,
          dataPoint2Home: gameDayInfo.dataPoint2Home,
          dataPoint3Home: gameDayInfo.dataPoint3Home,
          //dataP2:boxScoresData[gameDate].team1Possession != ''? boxScoresData[gameDate].team1Possession:null,
          teamRecord: gameDayInfo.winsHome != null ? gameDayInfo.winsHome + '-' + gameDayInfo.lossHome + '-' + gameDayInfo.tiesHome: null
        }

        // away team info
        gameDayInfo['awayTeamInfo'] = {
          name: gameDayInfo.fullNameAway,
          id: gameDayInfo.idAway,
          firstName: gameDayInfo.firstNameAway,
          lastName: gameDayInfo.nicknameAway,
          abbreviation: gameDayInfo.abbreviationAway,
          logo: gameDayInfo.logoUrlAway,
          dataPoint1Away: gameDayInfo.dataPoint1Away,
          dataPoint2Away: gameDayInfo.dataPoint2Away,
          dataPoint3Away: gameDayInfo.dataPoint3Away,
          //dataP2:boxScoresData[gameDate].team1Possession != ''? boxScoresData[gameDate].team1Possession:null,
          teamRecord: gameDayInfo.winsAway != null ? gameDayInfo.winsAway + '-' + gameDayInfo.lossAway + '-' + gameDayInfo.tiesAway: null,
        }


        // LIVE DATA THAT NEEDS TO ADJUST BASED ON SPORT
        gameDayInfo['gameInfo']['verticalContent'] = {
          teamInPossesion:  "Possession: " + gameDayInfo.liveDataPoints[scope].teamInPossesion,
          liveSegmentNumber: gameDayInfo.liveDataPoints[scope].liveSegmentNumber,
          timeLeft: gameDayInfo.liveDataPoints[scope].timeLeft,
          liveYardLine: gameDayInfo.liveDataPoints[scope].liveYardLine,
          overTime: gameDayInfo.liveDataPoints[scope].liveYardLine
        }

        // organize games by date and put them into newVPWP' P PBoxScores
        if(typeof newBoxScores[currGameDate] == 'undefined'){
          newBoxScores[currGameDate] = [];
          newBoxScores[currGameDate].push(gameDayInfo);
        } else{
          newBoxScores[currGameDate].push(gameDayInfo);
        }

      } //if (boxScoresData[gameDate])
    } // END for ( var gameDate in data.data )
    //console.log('4. transformBoxScores - newBoxScores - ',newBoxScores);
    return newBoxScores;
  }

  formatSchedule(data, scope?, profile?) {
    let awayData = data.awayTeamInfo;
    let homeData = data.homeTeamInfo;
    var left, right;
    var homeRoute = VerticalGlobalFunctions.formatTeamRoute(homeData.name, homeData.id);
    var awayRoute = VerticalGlobalFunctions.formatTeamRoute(awayData.name, awayData.id);
    // if(profile == 'team'){
    //   if(teamId == homeData.id){
    //     homeRoute = null;
    //   }else{
    //     awayRoute = null;
    //   }
    // }
    var homeLogo = this.imageData("image-70", "border-2", GlobalSettings.getImageUrl(homeData.logo), homeRoute);
    var awayLogo = this.imageData("image-70", "border-2", GlobalSettings.getImageUrl(awayData.logo), awayRoute);

    right = {
      // homeHex:homeData.colors.split(', ')[0], //parse out comma + space to grab only hex colors
      homeID:homeData.id,
      homeLocation:homeData.firstName, // first name of team usually represents the location
      homeLogo:homeLogo,
      url:homeRoute,
      homeRecord:homeData.teamRecord
    };
    left = {
      // awayHex:awayData.colors.split(', ')[0],
      awayID:awayData.id,
      awayLocation:awayData.firstName,
      awayLogo: awayLogo,
      url:awayRoute,
      awayRecord: homeData.teamRecord
    };

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

    if(scope == 'nfl' || scope == 'fbs' || scope == 'nfl'){ //TODO
      scope = null;
    }

    // Sort games by time
    let sortedGames = game.sort(function(a, b) {
      return Number(a.gameInfo.startDateTimestamp) - Number(b.gameInfo.startDateTimestamp);
    });
    sortedGames.forEach(function(data,i){
      //var info:GameInfoInput; //TODO
      var info;
      let awayData = data.awayTeamInfo;
      let homeData = data.homeTeamInfo;
      let gameInfo = data.gameInfo;
      let homeLink = ''; //TODO
      let awayLink = ''; //TODO

      var aiContent = data.aiContent != null ? self.formatArticle(data):null; //TODO
      var link1 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(homeData.logo), homeLink); //TODO
      var link2 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(awayData.logo), awayLink); //TODO

      let gameDate = data.gameInfo;
      let homeRecord = data.homeTeamInfo.teamRecord;
      // let homeWin = homeData.winRecord != null ? homeData.winRecord : '#';
      // let homeLoss = homeData.lossRecord != null ? homeData.lossRecord : '#';

      let awayRecord = data.awayTeamInfo.teamRecord;
      // let awayWin = awayData.winRecord != null ? awayData.winRecord : '#';
      // let awayLoss = awayData.lossRecord != null ? awayData.lossRecord : '#';

      //determine if a game is live or not and display correct game time
      var currentTime = new Date().getTime();
      var segmentTitle = '';
      var liveStatus;
      var liveStat1;
      var liveStat2;
      var liveStat3;
      var liveStat4;
      // live stats display above game info in box scores
      var verticalContentLive;
      if(gameInfo.live){
        verticalContentLive = gameInfo.verticalContent;
        liveStatus = true,
        liveStat1 = gameInfo.verticalContent.liveSegmentNumber != null ? "Quarter: " + gameInfo.verticalContent.liveSegmentNumber : null;
        liveStat2 = gameInfo.verticalContent.timeLeft != null ? "Time Left: " + gameInfo.verticalContent.timeLeft : null;
        liveStat3 = gameInfo.verticalContent.teamInPossesion != null ? gameInfo.verticalContent.teamInPossesion : null,
        liveStat4 = gameInfo.verticalContent.liveYardLine != null ? "@ " + gameInfo.verticalContent.liveYardLine : "@ " + gameInfo.verticalContent.liveYardLine, //TODO
        segmentTitle = gameInfo.segmentsPlayed != null ? gameInfo.segmentsPlayed +  GlobalFunctions.Suffix(gameInfo.segmentsPlayed) + " Quarter: " + "<span class='gameTime'>"+gameInfo.timeLeft+"</span>" : '';
      }
      else{
        verticalContentLive = "";
        liveStatus = false
        if((currentTime < gameInfo.startDateTimestamp) && !gameInfo.live){
          segmentTitle = moment(gameDate.startDateTimestamp).tz('America/New_York').format('h:mm A z');
        }else{
          segmentTitle = 'Final';
        }
      }

      info = {
        gameHappened:gameInfo.segmentsPlayed != null ?  true : false,
        //segment will display the segment the game is on otherwise if returning null then display the date Time the game is going to be played
        segment:'Final',
        liveStatus: liveStatus,
        liveStat1: liveStat1,
        liveStat2: liveStat2,
        liveStat3: liveStat3,
        liveStat4: liveStat4,


        dataPointCategories:gameInfo.dataPointCategories,
        verticalContent:verticalContentLive,
        homeData:{
          homeTeamName: homeData.lastName,
          homeImageConfig:link1,
          homeLink: homeLink,
          homeRecord: homeRecord,
          dataPoint1:homeData.dataPoint1Home,
          dataPoint2:homeData.dataPoint2Home,
          dataPoint3:homeData.dataPoint3Home
        },
        awayData:{
          awayTeamName:awayData.lastName,
          awayImageConfig:link2,
          awayLink: awayLink,
          awayRecord: awayRecord,
          dataPoint1:awayData.dataPoint1Away,
          dataPoint2:awayData.dataPoint2Away,
          dataPoint3:awayData.dataPoint3Away
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
    return gameArray;
  }

  // Format the date for each gameBox - mobile only
  formatGameInfoMobile(game, scope?, profile?){
    var gameArray: Array<any> = [];
    let self = this;
    var twoBoxes = [];// used to put two games into boxes

    if(scope == 'nfl' || scope == 'fbs' || scope == 'nfl'){ //TODO
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
      var segmentTitle = '';
      var verticalContentLive;
      if(gameInfo.live){
        verticalContentLive = gameInfo.verticalContent;
        // let inningHalf = gameInfo.inningHalf != null ? GlobalFunctions.toTitleCase(gameInfo.inningHalf) : '';
        segmentTitle = gameInfo.segmentsPlayed != null ? gameInfo.segmentsPlayed +  GlobalFunctions.Suffix(gameInfo.segmentsPlayed) + " Quarter: " + "<span class='gameTime'>"+gameInfo.timeLeft+"</span>" : '';
      } else{
        verticalContentLive = "";
        if((currentTime < gameInfo.startDateTimestamp) && !gameInfo.live){
          segmentTitle = moment(gameDate.startDateTimestamp).tz('America/New_York').format('h:mm A z');
        } else{
          segmentTitle = 'Final';
        }
      }
      info = {
        gameHappened:gameInfo.segmentsPlayed != null ?  true : false,
        //segment will display the segment the game is on otherwise if returning null then display the date Time the game is going to be played
        segment:segmentTitle,
        dataPointCategories:gameInfo.dataPointCategories,
        verticalContent:verticalContentLive,
        homeData:{
          homeTeamName: homeData.lastName,
          //homeImageConfig:link1,
          homeLink: homeLink,
          homeRecord: homeRecord,
          dataPoint1:homeData.dataPoint1Home,
          dataPoint2:homeData.dataPoint2Home,
          dataPoint3:homeData.dataPoint3Home
        },
        awayData:{
          awayTeamName:awayData.lastName,
          //awayImageConfig:link2,
          awayLink: awayLink,
          awayRecord: awayRecord,
          dataPoint1:awayData.dataPoint1Away,
          dataPoint2:awayData.dataPoint2Away,
          dataPoint3:awayData.dataPoint3Away
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
      return gameArray;

  }

  formatArticle(data){}

  formatScoreBoard(data){}

  imageData(imageClass, imageBorder, mainImg, mainImgRoute?){
    if(typeof mainImg =='undefined' || mainImg == ''){
      mainImg = "/app/public/no-image.svg";
    }
    var image: CircleImageData = {//interface is found in image-data.ts
        imageClass: imageClass,
        mainImage: {
            imageUrl: mainImg,
            urlRouteArray: mainImgRoute,
            hoverText: "<i class='fa fa-mail-forward'></i>",
            imageClass: imageBorder,
        },
    };
    return image;
  } //imageData

}
