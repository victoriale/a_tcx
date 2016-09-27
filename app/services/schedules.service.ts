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
          output.blocks.push(data.data[scope][n]);
        }
        return output;
      });
  }


  setupSlideScroll(topScope, data, scope, profile, eventStatus, limit, pageNum, callback: Function, year?, week?){
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

  }

  transformSlideScroll(scope,data){
    let self = this;
    var modifiedArray = [];
    var newData:scheduleBoxInput;
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
        awayImageConfig: self.imageData('image-44', 'border-1', GlobalSettings.getImageUrl(val.team2Logo), VerticalGlobalFunctions.formatTeamRoute(val.team2FullName, val.team2Id)),
        homeImageConfig: self.imageData('image-44', 'border-1', GlobalSettings.getImageUrl(val.team1Logo), VerticalGlobalFunctions.formatTeamRoute(val.team1FullName, val.team1Id)),
        awayTeamName: scope =='fbs' ? val.team2Abbreviation: team2FullName.replace(val.team2Market+" ",''),
        homeTeamName: scope =='fbs' ? val.team1Abbreviation: team1FullName.replace(val.team1Market+" ",''),
        awayLink: VerticalGlobalFunctions.formatTeamRoute(val.team2FullName, val.team2Id),
        homeLink: VerticalGlobalFunctions.formatTeamRoute(val.team1FullName, val.team1Id),
        reportDisplay: reportText,
        reportLink: reportUrl,
        isLive: val.eventStatus == 'inprogress' ? 'schedule-live' : '',
        inning: val.eventQuarter != null ? "Current: Quarter " + Number(val.eventQuarter) + "<sup>" + GlobalFunctions.Suffix(Number(val.eventQuarter)) + "</sup>": null
      }

      modifiedArray.push(newData);
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
