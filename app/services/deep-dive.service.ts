import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Headers } from '@angular/http';

import { VideoStackData } from "../fe-core/interfaces/deep-dive.data";
import {GlobalFunctions} from "../global/global-functions";
import {GlobalSettings} from "../global/global-settings";

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

  getDeepDiveAiBatchService(scope, key?, page?, count?, state?){
    //Configure HTTP Headers
    var callURL = 'http://dev-touchdownloyal-ai.synapsys.us/';
    var headers = this.setToken();
    if(scope == null){
      scope = 'nfl';
    }
    if(key == null){
      key == "postgame-report";
    }
    callURL += 'articles?articleType=' + key + '&affiliation=' + scope;
    if(page == null || count == null){
      page = 1;
      count = 1;
    }
    if(state == null){
      state = 'CA';
    }
    callURL += '&page=' + page + '&count=' + count + '&state=' + state + '&isUnix=1';
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
  transformToArticleStack(data){
    var sampleImage = "/app/public/placeholder_XL.png";
    var topData = data.data[0];
    var date = topData.publishedDate != null ? GlobalFunctions.formatDate(topData.publishedDate) : null;
    var teaser = topData.teaser.substring(0, 360);//provided by design to limit characters
    var pub;
    if(topData.author){
      pub = topData.author ? topData.author : "";
      pub += topData.publisher ? ", " : "";
    }
    if(topData.publisher){
      pub += topData.publisher ? topData.publisher : "";
    }
    if(topData.author == null && topData.publisher == null){
      pub = "N/A";
    }
    var articleStackData = {
        id: "1",
        articleUrl: ['/deep-dive'],
        keyword: topData.keyword.replace('-', ' '),
        timeStamp: date != null ? date.month + " " + date.day + ", " + date.year: "",
        title: topData.title,
        author: "Author",
        publisher: "Publisher",
        teaser: teaser,
        imageConfig: {
          imageClass: "embed-responsive-16by9",
          imageUrl: topData.imagePath != null ? GlobalSettings.getImageUrl(topData.imagePath) : sampleImage,
          urlRouteArray: ['/deep-dive']
        }
    };
    return articleStackData;
  }

  transformToAiArticleRow(data, key){
    data = data.data;
    var sampleImage = "/app/public/placeholder_XL.png";
    var articleStackArray = [];
    data.forEach(function(val, index){
      for(var p in val.article_data){
        var dataLists = val.article_data[p];
      }
      var date = moment(Number(val.last_updated) * 1000);
      date = GlobalFunctions.formatAPMonth(date.month()) + date.format(' Do, YYYY');
      var s = {
          id: "1",
          articleUrl: ['/deep-dive'],//TODO
          keyword: key.replace('-', ' ').toUpperCase(),
          timeStamp: date,
          author: '',
          publisher: '',
          teaser: dataLists.displayHeadline,
          imageConfig: {
            imageClass: "embed-responsive-16by9",
            /*hoverText: "View",*/
            imageUrl: val.image_url != null ? GlobalSettings.getImageUrl(val.image_url) : sampleImage,
            urlRouteArray: ['/deep-dive']
          }
      }
      articleStackArray.push(s);
    });
    return articleStackArray;
  }// transformToAiArticleRow ENDS


}// DeepDiveService ENDS
