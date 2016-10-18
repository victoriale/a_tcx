import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Headers } from '@angular/http';

import { VideoStackData, ArticleStackData } from "../fe-core/interfaces/deep-dive.data";
import { GlobalFunctions } from "../global/global-functions";
import { GlobalSettings } from "../global/global-settings";
import { VerticalGlobalFunctions } from "../global/vertical-global-functions";

declare var moment;

@Injectable()
export class DeepDiveService {
  private _baseballAPI: string = "http://dev-homerunloyal-api.synapsys.us/tcx/";
  private _footballAPI: string = "http://dev-touchdownloyal-api.synapsys.us/tcx/";
  constructor(public http: Http){}

  //Function to set custom headers
  setToken(){
      var headers = new Headers();
      return headers;
  }

  setSectionFrontAPI(category){
    switch(category){
      case 'nfl':
      break;
      case 'ncaaf':
      break;
      case 'mlb':
      break;
      case 'nba':
      break;
      case 'ncaam':
      break;
      case 'finance':
      break;
      case 'realestate':
      break;
      case 'weather':
      break;
    }
  }

  getDeepDiveArticleService(articleID){
  //Configure HTTP Headers
  var headers = this.setToken();
  var callURL = this._footballAPI + '/article/' + articleID;//TODO
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      return data;
    })
  }

  getDeepDiveBatchService(scope, limit, startNum, state?){
  //Configure HTTP Headers
  var headers = this.setToken();

  if(startNum == null){
    startNum = 1;
  }

  // http://dev-touchdownloyal-api.synapsys.us/articleBatch/nfl/5/1
  var callURL = 'http://dev-touchdownloyal-api.synapsys.us' + '/articleBatch/';
  if(scope != null){
    // callURL += scope; TODO
    callURL += 'nfl';
  } else {
    callURL += 'nfl';
  }
  if(state == null){
    state = 'CA';
  }
  callURL += '/' + limit + '/' + startNum + '/' + state;
  // console.log(callURL);
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      return data;
    })
  }

  getCarouselData(scope, data, limit, batch, state, callback:Function) {
    //always returns the first batch of articles
       this.getDeepDiveBatchService(scope, limit, batch, state)
       .subscribe(data=>{
         var transformedData = this.carouselTransformData(data.data);
         callback(transformedData);
       })
   }

    getDeepDiveVideoBatchService(category: string, limit: number, page: number, location?: string){
      var headers = this.setToken();
      var callURL = GlobalSettings.getTCXscope(category).verticalApi;
      if(limit === null || typeof limit == 'undefined'){
        limit = 5;
        page = 1;
      }
      callURL += '/videoBatch/';
      if(GlobalSettings.getTCXscope(category).topScope == "baseball"){
        //http://dev-homerunloyal-api.synapsys.us/tcx/videoBatch/league/5/1
        callURL += 'league';
      } else {
        callURL += category;
      }
      if(GlobalSettings.getTCXscope(category).topScope == "basketball"){
        //http://dev-tcxmedia-api.synapsys.us/tcx/videoBatch/nba/1/5
        callURL += '/' + page + '/' + limit;
      } else {
        //http://dev-touchdownloyal-api.synapsys.us/tcx/videoBatch/fbs/5/2
        //http://dev-touchdownloyal-api.synapsys.us/tcx/videoBatch/nfl/5/2/ks
        //http://dev-tcxmedia-api.synapsys.us/videoBatch/sports/10/1
        callURL += '/' + limit + '/' + page;
        if(GlobalSettings.getTCXscope(category).topScope == "nfl" && location !== null){
          callURL += '/' + location;
        }
      }
      return this.http.get(callURL, {headers: headers})
        .map(res => res.json())
        .map(data => {
          return data;
      })
    }// getDeepDiveVideoBatchService ENDS

    transformSportVideoBatchData(data: Array<VideoStackData>, scope?){
      var sampleImage = "/app/public/placeholder_XL.png";
      var videoBatchArray = [];
      scope = scope ? scope : "sports";
      data.forEach(function(val, index){
        if(val.time_stamp){
          var date =  moment(Number(val.time_stamp));
          date = '<span class="hide-320">' + date.format('dddd') + ' </span>' + date.format('MMM') + date.format('. DD, YYYY');
        }
        var d = {
          id: val.id,
          keyword: val.keyword ? val.keyword : scope,
          title: val.title ? val.title : "No Title",
          time_stamp: date ? date : "",
          video_thumbnail: val.video_thumbnail ? val.video_thumbnail : sampleImage,
          video_url: VerticalGlobalFunctions.formatArticleRoute(scope, val.id, "video", scope),
          // keyUrl: null
        }
        videoBatchArray.push(d);
      });
      return videoBatchArray;
    }// transformDeepDiveVideoBatchData ENDS

    // Top Article of Article Stacks
    transformToArticleStack(data: Array<ArticleStackData>, scope?){
      var sampleImage = "/app/public/placeholder_XL.png";
      // var topData = data.data[0];
      var articleStackArray = [];
      data.forEach(function(val, index){
        var articleStackData = {
            id: "1",
            articleUrl: '/deep-dive',
            keyUrl: '/deep-dive',
            keyword: scope.toUpperCase(),
            timeStamp: '<span class="hide-320">Thursday </span>' + "Sept. 28, 2016",
            title: "Title here",
            author: "Author",
            publisher: ", Publisher",
            teaser: "Teaser here",
            imageConfig: {
              imageClass: "embed-responsive-16by9",
              imageUrl: sampleImage,
              urlRouteArray: ['/deep-dive']
            }
          }
          articleStackArray.push(articleStackData);
        });
      return articleStackArray;
    }// transformToArticleStack ENDS

    carouselTransformData(arrayData:Array<ArticleStackData>){
        var transformData = [];
        arrayData.forEach(function(val,index){
          var curdate = new Date();
          var curmonthdate = curdate.getDate();
          var timeStamp = moment(Number(val.time_stamp)).format("MMMM Do, YYYY h:mm:ss a");
          let carData = {
            image_url: GlobalSettings.getImageUrl(val['imagePath']),
            title:  "<span> Today's News: </span>",
            headline: val['title'],
            keyword: val['keyword'],
            teaser: val['teaser'].replace('_',': ').replace(/<p[^>]*>/g, ""),
            id:val['id'],
            articlelink: ['/'],
            timeStamp: timeStamp,
          };
          if(carData['teaser'].length >= 200){
            carData['teaser'].substr(0,200) + '...';
          }
          transformData.push(carData);
        });
        return transformData;
    }
}// DeepDiveService ENDS
