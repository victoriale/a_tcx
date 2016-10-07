import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalFunctions} from '../global/global-functions';
import {CircleImageData} from '../fe-core/components/images/image-data';
import {VerticalGlobalFunctions} from '../global/vertical-global-functions';
import {GlobalSettings} from '../global/global-settings';
import {Conference, Division, SportPageParameters} from '../global/global-interface';
// import {SchedulesCarouselInput} from '../fe-core/components/schedules-carousel/schedules-carousel.component';
// import {SchedulesData, SchedulesTableModel, SchedulesTableData, ScheduleTabData} from './schedules.data';
// import {Gradient} from '../global/global-gradient';
import {scheduleBoxInput} from '../fe-core/components/schedule-box/schedule-box.component';

declare var moment: any;

@Injectable()
export class SchedulesService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  // private _apiToken: string = 'BApA7KEfj';
  // private _headerName: string = 'X-SNT-TOKEN';

  constructor(public http: Http){

  }


  //Function to set custom headers
  setToken(){
      var headers = new Headers();
      //headers.append(this.headerName, this.apiToken);
      return headers;
  }

  //possibly simpler version of getting schedules api call
  getSchedule(scope, profile, eventStatus, limit, pageNum, id?, year?, week?){
    //Configure HTTP Headers
    var headers = this.setToken();

    var callURL = this._apiUrl+'/schedule/'+profile;
    if(typeof year == 'undefined'){
      year = null;
    }

    if(profile == 'league'){//if league call then add scope
      callURL += '/'+ scope;
    }

    if(typeof id != 'undefined' && profile != 'league'){//if team id is being sent through
      callURL += '/'+id;
    }
    if(year == 'all'){
      year = null;
    }
    callURL += '/'+eventStatus+'/'+year+'/'+limit+'/'+ pageNum;  //default pagination limit: 5; page: 1
    //optional week parameters
    if( week != null){
      callURL += '/'+week;
    }
    return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(data => {
        return data;
      });
  }

  //Call made for slider carousel using BoxScore scheduler
  getBoxSchedule(scope, profile, eventStatus, limit, pageNum, id?){
    //Configure HTTP Headers
    var headers = this.setToken();

    var callURL = this._apiUrl+'/boxScores/schedule/'+profile;
    if(profile == 'league'){//if league call then add scope
      callURL += '/'+ scope;
    }

    if(typeof id != 'undefined' && profile != 'league'){//if team id is being sent through
      callURL += '/'+id;
    }

    callURL += '/'+limit+'/'+ pageNum;  //default pagination limit: 5; page: 1
    //optional week parameters
    return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(data => {
        return data;
      });
  }

  //Call made for slider carousel using BoxScore scheduler
  getFinanceData(scope, profile, eventStatus, limit, pageNum, id?){
    if (scope != "all") {
      scope = scope.toUpperCase();
    }
    //Configure HTTP Headers
    var headers = this.setToken();

    var callURL = "http://dev-finance-api.synapsys.us/call_controller.php?action=tcx&option=tcx_side_scroll";
    //optional week parameters
    return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(data => {
        var output = {scopeList: [], blocks: []}
        for (var i =0; i< data.data.scopeList.length; i++) {
          output.scopeList.push(data.data.scopeList[i]);
        }
        for (var n =0; n< data.data[scope].length; n++) {
          data.data[scope][n].currentStockValue = Number(data.data[scope][n].currentStockValue).toFixed(2);
          data.data[scope][n].stockChangeAmount = Number(data.data[scope][n].stockChangeAmount).toFixed(2);
          data.data[scope][n].stockChangePercent = Number(data.data[scope][n].stockChangePercent).toFixed(2);
          data.data[scope][n].profileUrl = "http://www.investkit.com/" + data.data[scope][n].companySymbol + "/" + data.data[scope][n].fullCompanyName.replace(/ /g, "-") + "/company/" + data.data[scope][n].companyId;
          if (data.data[scope][n].logoUrl == "" || data.data[scope][n].logoUrl == null) {
            data.data[scope][n].logoUrl = "http://www.investkit.com/public/no_image.png";
          }
          else {
            data.data[scope][n].logoUrl = "http://images.investkit.com/images/" + data.data[scope][n].logoUrl;
          }
          data.data[scope][n].imageConfig = {
            imageClass: "image-70",
            mainImage: {
              url: data.data[scope][n].profileUrl,
              imageUrl: data.data[scope][n].logoUrl,
              imageClass: "border-1",
              hoverText: "<p>View</p> Profile"
          }
          };
          output.blocks.push(data.data[scope][n]);
        }
        return output;
      });
  }

  getWeatherData(scope, selectedLocation){
    //Configure HTTP Headers
    var headers = this.setToken();

    var callURL = "http://dev-tcxmedia-api.synapsys.us/sidescroll/weather/" + selectedLocation + "/" + scope.toLowerCase();
    //optional week parameters
    return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(data => {
        var output = {scopeList: [], blocks: [], current: {}}
        output.current['city'] = data.city;
        output.current['currentCondition'] = data.currentCondition;
        output.current['currentIcon'] = data.currentIcon;
        output.current['currentScope'] = data.currentScope;
        output.current['currentTemperature'] = ((data.currentTemperature * (9/5)) - 459.67).toFixed(0);
        output.current['state'] = data.state;
        output.current['zipcode'] = data.zipcode;
        for (var i =0; i< data.scopeList.length; i++) {
          output.scopeList.push(data.scopeList[i]);
        }
        for (var n =0; n< data.data.length; n++) {
          // if (data.data[scope][n].logoUrl == "" || data.data[scope][n].logoUrl == null) {
          //   data.data[scope][n].logoUrl = "http://www.investkit.com/public/no_image.png";
          // }
          // else {
          //   data.data[scope][n].logoUrl = "http://images.investkit.com/images/" + data.data[scope][n].logoUrl;
          // }

          //convert from kelvin to farenheight
          if (scope.toLowerCase() == "hourly") {
            data.data[n].unixTimestamp = moment.unix(data.data[n].unixTimestamp).format("h:mm a");
            data.data[n].temperature  = ((data.data[n].temperature * (9/5)) - 459.67).toFixed(0) + "&deg;";

          }
          else {
            data.data[n].unixTimestamp = moment.unix(data.data[n].unixTimestamp).format("MMM Do YYYY");
            data.data[n].temperature  = ((data.data[n].temperatureHigh * (9/5)) - 459.67).toFixed(0) + "&deg; <span class='small-temp'>/ " + ((data.data[n].temperatureLow * (9/5)) - 459.67).toFixed(0) + "&deg;</span>";
          }
          output.blocks.push(data.data[n]);
        }
        return output;
      });
  }

  //Call made for slider carousel using BoxScore scheduler
  getBasketballSchedule(scope, profile, eventStatus, limit, pageNum, id?){
    if (scope != "all") {
      scope = scope.toUpperCase();
    }
    //Configure HTTP Headers
    var headers = this.setToken();

    var callURL = "http://dev-sports-api.synapsys.us/NBAHoops/call_controller.php?scope=" + scope.toLowerCase() + "&action=tcx&option=tcx_side_scroll&perPage=50&pageNum=1";
    //optional week parameters
    return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(data => {
        var output = {scopeList: [], blocks: []}
        for (var i =0; i < data.data.scopeList.length; i++) {
          output.scopeList.push(data.data.scopeList[i].toUpperCase());
        }
        for (var n = 0; n < data.data.data.length; n++) {
          switch(data.data.data[n].eventStatus) {
              case "pre-event":
                  data.data.data[n].reportDisplay = "PRE GAME REPORT";
                  break;
              case "post-event":
                  data.data.data[n].reportDisplay = "POST GAME REPORT";
                  break;
              case "cancelled":
                  data.data.data[n].reportDisplay = "GAME IS CANCELED";
                  break;
              case "postponed":
                  data.data.data[n].reportDisplay = "PRE GAME REPORT";
                  break;
              default:
                  data.data.data[n].reportDisplay = "Game Report";
          }
          let date = moment(Number(data.data.data[n].startTime)).tz('America/New_York').format('MMMM D, YYYY');
          let time = moment(Number(data.data.data[n].startTime)).tz('America/New_York').format('h:mm A z');
          data.data.data[n].date = date + " &bull; " + time;
          data.data.data[n].reportLink = "http://www.hoopsloyal.com/";
          data.data.data[n].homeTeamName = data.data.data[n].lastNameHome;
          data.data.data[n].awayTeamName = data.data.data[n].lastNameAway;
          data.data.data[n].awayProfileUrl = "http://www.hoopsloyal.com/" + data.data.currentScope + "/team/" + data.data.data[n].fullNameAway.replace(/ /g, "-") + "/" + data.data.data[n].idAway;
          data.data.data[n].homeProfileUrl = "http://www.hoopsloyal.com/" + data.data.currentScope + "/team/" + data.data.data[n].fullNameHome.replace(/ /g, "-") + "/" + data.data.data[n].idHome;
          if (data.data.data[n].logoUrlAway == "" || data.data.data[n].logoUrlAway == null) {
            data.data.data[n].logoUrlAway = "http://www.investkit.com/public/no_image.png";
          }
          else {
            data.data.data[n].logoUrlAway = "http://prod-sports-images.synapsys.us/" + data.data.data[n].logoUrlAway;
          }
          if (data.data.data[n].logoUrlHome == "" || data.data.data[n].logoUrlHome == null) {
            data.data.data[n].logoUrlHome = "http://www.investkit.com/public/no_image.png";
          }
          else {
            data.data.data[n].logoUrlHome = "http://prod-sports-images.synapsys.us/" + data.data.data[n].logoUrlHome;
          }
          data.data.data[n].awayImageConfig = {
            imageClass: "image-70",
            mainImage: {
              url: data.data.data[n].awayProfileUrl,
              imageUrl: data.data.data[n].logoUrlAway,
              imageClass: "border-1",
              hoverText: "<p>View</p> Profile"
          }
          };
          data.data.data[n].homeImageConfig = {
            imageClass: "image-70",
            mainImage: {
              url: data.data.data[n].homeProfileUrl,
              imageUrl: data.data.data[n].logoUrlHome,
              imageClass: "border-1",
              hoverText: "<p>View</p> Profile"
          }
          };
          output.blocks.push(data.data.data[n]);
        }
        return output;
      });
  }

  //Call made for slider carousel using BoxScore scheduler
  getBaseballSchedule(scope, profile, eventStatus, limit, pageNum, id?){
    if (scope != "all") {
      scope = scope.toUpperCase();
    }
    //Configure HTTP Headers
    var headers = this.setToken();

    var callURL = "http://dev-homerunloyal-api.synapsys.us/tcx/league/schedule/pre-event/50/1";
    //optional week parameters
    return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(data => {
        var output = {scopeList: [], blocks: []}
        output.scopeList.push("mlb");
        for (var n = 0; n < data.data.length; n++) {
          switch(data.data[n].eventStatus) {
              case "pre-event":
                  data.data[n].reportDisplay = "PRE GAME REPORT";
                  break;
              case "post-event":
                  data.data[n].reportDisplay = "POST GAME REPORT";
                  break;
              case "cancelled":
                  data.data[n].reportDisplay = "GAME IS CANCELED";
                  break;
              case "postponed":
                  data.data[n].reportDisplay = "PRE GAME REPORT";
                  break;
              default:
                  data.data[n].reportDisplay = "GAME REPORT";
          }
          let date = moment.unix(Number(data.data[n].eventDate)).tz('America/New_York').format('MMMM D, YYYY');
          let time = moment.unix(Number(data.data[n].eventDate)).tz('America/New_York').format('h:mm A z');
          data.data[n].date = date + " &bull; " + time;
          data.data[n].reportLink = "http://www.homerunloyal.com/";
          data.data[n].homeTeamName = data.data[n].abbreviationHome;
          data.data[n].awayTeamName = data.data[n].abbreviationAway;
          data.data[n].awayProfileUrl = "http://www.homerunloyal.com/team/" + data.data[n].fullNameAway.replace(/ /g, "-") + "/" + data.data[n].idAway;
          data.data[n].homeProfileUrl = "http://www.homerunloyal.com/team/" + data.data[n].fullNameHome.replace(/ /g, "-") + "/" + data.data[n].idHome;
          if (data.data[n].logoUrlAway == "" || data.data[n].logoUrlAway == null) {
            data.data[n].logoUrlAway = "http://www.investkit.com/public/no_image.png";
          }
          else {
            data.data[n].logoUrlAway = "http://prod-sports-images.synapsys.us/" + data.data[n].logoUrlAway;
          }
          if (data.data[n].logoUrlHome == "" || data.data[n].logoUrlHome == null) {
            data.data[n].logoUrlHome = "http://www.investkit.com/public/no_image.png";
          }
          else {
            data.data[n].logoUrlHome = "http://prod-sports-images.synapsys.us/" + data.data[n].logoUrlHome;
          }
          data.data[n].awayImageConfig = {
            imageClass: "image-70",
            mainImage: {
              url: data.data[n].awayProfileUrl,
              imageUrl: data.data[n].logoUrlAway,
              imageClass: "border-1",
              hoverText: "<p>View</p> Profile"
          }
          };
          data.data[n].homeImageConfig = {
            imageClass: "image-70",
            mainImage: {
              url: data.data[n].homeProfileUrl,
              imageUrl: data.data[n].logoUrlHome,
              imageClass: "border-1",
              hoverText: "<p>View</p> Profile"
          }
          };
          output.blocks.push(data.data[n]);
        }
        return output;
      });
  }


  setupSlideScroll(topScope, data, scope, profile, eventStatus, limit, pageNum, selectedLocation, callback: Function, year?, week?){
    if (topScope == "finance") {
      //(scope, profile, eventStatus, limit, pageNum, id?)
      this.getFinanceData(scope, 'league', eventStatus, limit, pageNum)
      .subscribe( data => {
        callback(data);
      })
    }
    else if (topScope == "football") {
      //(scope, profile, eventStatus, limit, pageNum, id?)
      this.getBoxSchedule(scope, 'league', eventStatus, limit, pageNum)
      .subscribe( data => {
        var formattedData = this.transformSlideScroll(scope, data.data);
        callback(formattedData);
      })
    }
    else if (topScope == "basketball") {
      //(scope, profile, eventStatus, limit, pageNum, id?)
      this.getBasketballSchedule(scope, 'league', eventStatus, limit, pageNum)
      .subscribe( data => {
        callback(data);
      })
    }
    else if (topScope == "baseball") {
      //(scope, profile, eventStatus, limit, pageNum, id?)
      this.getBaseballSchedule(scope, 'league', eventStatus, limit, pageNum)
      .subscribe( data => {
        callback(data);
      })
    }
    else if (topScope == "weather") {
      //(scope, profile, eventStatus, limit, pageNum, id?)
      this.getWeatherData(scope, selectedLocation)
      .subscribe( data => {
        callback(data);
      })
    }

  }

  getLocationAutocomplete(query, callback: Function){
    this.callLocationAutocomplete(query)
    .subscribe( data => {
      callback(data);
    })
  }

  callLocationAutocomplete(query){
    //Configure HTTP Headers
    var headers = this.setToken();

    var callURL = "http://dev-tcxmedia-api.synapsys.us/sidescroll/weather/availableLocations/" + query;
    //optional week parameters
    return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(data => {
        return data;
      });
  }

  transformSlideScroll(scope,data){
    let self = this;
    var modifiedArray = {blocks: []};
    var newData;
    //run through and convert data to what is needed for the component
    data.forEach(function(val,index){
      let reportText = 'GAME REPORT';
      let partner = GlobalSettings.getHomeInfo();
      var reportLink;
      let reportUrl;
      if(val.eventStatus == 'inprogress'){
        if(Number(val.eventQuarter) > 1){// so that ai gets a chance to generate an article and no one really needs an article created for first quarter
          reportUrl = VerticalGlobalFunctions.formatArticleRoute('in-game-report',val.eventId);
          reportText = 'LIVE GAME REPORT';
        }else{// link if game is inprogress and still 1st quarter
          reportUrl = VerticalGlobalFunctions.formatArticleRoute('pregame-report',val.eventId);
          reportText = 'PRE GAME REPORT'
        }
      }else{
        if(val.eventStatus = 'pregame'){
          reportUrl = VerticalGlobalFunctions.formatArticleRoute('pregame-report',val.eventId);
          reportText = 'PRE GAME REPORT'
        }else if (val.eventStatus == 'postgame'){
          reportUrl = VerticalGlobalFunctions.formatArticleRoute('postgame-report',val.eventId);
          reportText = 'POST GAME REPORT';
        }else{
          reportUrl = VerticalGlobalFunctions.formatArticleRoute('postgame-report',val.eventId);
          reportText = 'POST GAME REPORT';
        }
      }

      let date = moment(Number(val.eventStartTime)).tz('America/New_York').format('MMMM D, YYYY');
      let time = moment(Number(val.eventStartTime)).tz('America/New_York').format('h:mm A z');
      let team1FullName = val.team1FullName;
      let team2FullName = val.team2FullName;

      newData = {
        date: date + " &bull; " + time,
        awayImageConfig: {
          imageClass: "image-70",
          mainImage: {
            url: "http://touchdownloyal.com/" + scope + "/team/" + val.team1FullName + "/" + val.team1Id,
            imageUrl: GlobalSettings.getImageUrl(val.team1Logo),
            imageClass: "border-1",
            hoverText: "<p>View</p> Profile"
          }
        },
        homeImageConfig: {
          imageClass: "image-70",
          mainImage: {
            url: "http://touchdownloyal.com/" + scope + "/team/" + val.team2FullName + "/" + val.team2Id,
            imageUrl: GlobalSettings.getImageUrl(val.team2Logo),
            imageClass: "border-1",
            hoverText: "<p>View</p> Profile"
          }
        },
        awayTeamName: scope =='fbs' ? val.team2Abbreviation: team2FullName.replace(val.team2Market+" ",''),
        homeTeamName: scope =='fbs' ? val.team1Abbreviation: team1FullName.replace(val.team1Market+" ",''),
        awayLink: "http://touchdownloyal.com/" + scope + "/team/" + val.team2FullName + "/" + val.team2Id,
        homeLink: "http://touchdownloyal.com/" + scope + "/team/" + val.team1FullName + "/" + val.team1Id,
        reportDisplay: reportText,
        reportLink: reportUrl,
        isLive: val.eventStatus == 'inprogress' ? 'schedule-live' : '',
        inning: val.eventQuarter != null ? "Current: Quarter " + Number(val.eventQuarter) + "<sup>" + GlobalFunctions.Suffix(Number(val.eventQuarter)) + "</sup>": null
      }

      modifiedArray.blocks.push(newData);
    });
    return modifiedArray;
  }



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
  }
}
