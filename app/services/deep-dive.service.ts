import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Headers } from '@angular/http';

import { VideoStackData, ArticleStackData } from "../fe-core/interfaces/deep-dive.data";
import { GlobalFunctions } from "../global/global-functions";
import { GlobalSettings } from "../global/global-settings";

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

  getDeepDiveArticleService(articleID){
  //Configure HTTP Headers
  var headers = this.setToken();
  var callURL = this._footballAPI + '/article/' + articleID;
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
    callURL += scope;
  } else {
    callURL += 'nfl';
  }
  if(state == null){
    state = 'CA';
  }
  callURL += '/' + limit + '/' + startNum + '/' + state;
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

   carouselTransformData(arrayData){
        var transformData = [];
        arrayData.forEach(function(val,index){
          var curdate = new Date();
          var curmonthdate = curdate.getDate();
          var date = moment(Number(val.publishedDate));
          date = GlobalFunctions.formatAPMonth(date.month()) + date.format(' Do, YYYY') + date.format('hh:mm A') + ' ET';
          let carData = {
            image_url: GlobalSettings.getImageUrl(val['imagePath']),
            title:  "<span> Today's News </span>" + val['title'],
            keyword: val['keyword'],
            teaser: val['teaser'].substr(0,200).replace('_',': ').replace(/<p[^>]*>/g, ""),
            id:val['id'],
            articlelink: ['/'],
            date: date,
          };
          transformData.push(carData);
        });

        return transformData;
    }

    getDeepDiveVideoBatchService(category: string, limit: number, page: number, location?: string){//TODO
      var headers = this.setToken();

      if(category === null || typeof category == 'undefined'){
        category = 'fbs';
      }
      if(limit === null || typeof limit == 'undefined'){
        limit = 5;
        page = 1;
      }
      var callURL = this._footballAPI + 'videoBatch/' + category + '/' + limit + '/' + page;
      return this.http.get(callURL, {headers: headers})
        .map(res => res.json())
        .map(data => {
          return data;
      })
    }// getDeepDiveVideoBatchService ENDS

    transformDeepDiveVideoBatchData(data: Array<VideoStackData>){
      var sampleImage = "/app/public/placeholder_XL.png";
      var videoBatchArray = [];
      data.forEach(function(val, index){
        var date =  moment(Number(val.timeStamp));
        date = GlobalFunctions.formatAPMonth(date.month()) + date.format(' Do, YYYY');
        var d = {
          id: val.id,
          keyword: val.keyword ? val.keyword : "", //TODO maybe return the page category when available
          title: val.title ? val.title : "No Title",
          timeStamp: date,
          videoThumbnail: val.videoThumbnail ? val.videoThumbnail : sampleImage,
          videoUrl: ['/deep-dive']
        }
        videoBatchArray.push(d);
      });
      return videoBatchArray;
    }// transformDeepDiveVideoBatchData ENDS

    // Top Article of Article Stacks
    transformToArticleStack(data: Array<ArticleStackData>){
      var sampleImage = "/app/public/placeholder_XL.png";
      // var topData = data.data[0];
      var articleStackArray = [];
      data.forEach(function(val, index){
        var articleStackData = {
            id: "1",
            articleUrl: '/deep-dive',
            keyword: "Keyword",
            timeStamp: "Sept. 28th 2016",
            title: "Title here",
            author: "Author",
            publisher: ", Publisher",
            teaser: "Teaser here",
            imageConfig: {
              imageClass: "embed-responsive-16by9",
              imageUrl: sampleImage,
              urlRouteArray: '/deep-dive'
            }
          }
          articleStackArray.push(articleStackData);
        });
      return articleStackArray;
    }// transformToArticleStack ENDS

}// DeepDiveService ENDS
