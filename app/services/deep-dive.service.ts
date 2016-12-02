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
  constructor(public http: Http){}

  //Function to set custom headers
  setToken(){
      var headers = new Headers();
      return headers;
  }

  getDeepDiveBatchService(category: string, limit: number, page: number, state?: string){
    var headers = this.setToken();
    var callURL = GlobalSettings.getTCXscope(category).tcxApi + "/articles";
    //http://dev-tcxmedia-api.synapsys.us/articles?help=1
    //http://dev-tcxmedia-api.synapsys.us/articles?&keyword[]=food&source[]=snt_ai&source[]=tca-curated&random=1&metaDataOnly=1&page=1&count=5
    if(limit !== null && page !== null){
      callURL += '?count=' + limit + '&page=' + page;
    }
    if(category == "breaking" || category == "trending"){
      callURL += '&category=' + category;
    } else {
      if(category == "real-estate"){
        callURL += '&keyword[]=' + category.replace(/-/g, " ");
      } else {
        callURL += '&keyword[]=' + category;
      }
    }
    if(category != "breaking"){
      callURL += "&source[]=snt_ai";
    }
    callURL += "&source[]=tca-curated&source[]=tca&random=1&metaDataOnly=1";
    return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(data => {
        return data.data;
    })
  }

  getCarouselData(scope, data, limit, batch, state, callback:Function) {
    //always returns the first batch of articles
       this.getDeepDiveBatchService(scope, limit, batch, state)
       .subscribe(data=>{
         var transformedData = this.carouselTransformData(data, scope);
         callback(transformedData);
       },
       err => {
         console.log("Error getting carousel batch data");
         return this.carouselDummyData();
       });
   }

  getDeepDiveVideoBatchService(category: string, limit: number, page: number, location?: string){
      var headers = this.setToken();
      var callURL = GlobalSettings.getTCXscope(category).tcxApi;
      if(limit === null || typeof limit == 'undefined'){
        limit = 5;
        page = 1;
      }
      callURL += '/tcx/videoBatch/' + category;
        //http://dev-homerunloyal-api.synapsys.us/tcx/videoBatch/league/5/1
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
      // console.log(callURL);
      return this.http.get(callURL, {headers: headers})
        .map(res => res.json())
        .map(data => {
          if(data.data.length > 0){
            return data.data;
          }else{
            return null;
          }
      })
  }// getDeepDiveVideoBatchService ENDS

    transformSportVideoBatchData(data: Array<VideoStackData>, scope?){
      if(data === null || typeof data == "undefined" || data.length == 0){
        return null;
      }
      var sampleImage = "/app/public/placeholder_XL.png";
      var videoBatchArray = [];
      scope = scope ? scope : "sports";
      data.forEach(function(val, index){
        if(val.time_stamp){
          var date =  moment(Number(val.time_stamp));
          date = '<span class="hide-320">' + date.format('dddd') + ', </span>' + date.format('MMM') + date.format('. DD, YYYY');
        }
        var keywords = val.keyword ? val.keyword : scope;
        var d = {
          id: val.id,
          keyword: keywords,
          title: val.title ? val.title : "No Title",
          time_stamp: date ? date : "",
          video_thumbnail: val.video_thumbnail ? val.video_thumbnail : sampleImage,
          embed_url: val.video_url != null ? val.video_url : null,
          video_url: VerticalGlobalFunctions.formatArticleRoute(keywords, val.id, "video"),
          keyUrl: VerticalGlobalFunctions.formatSectionFrontRoute(keywords),
          teaser: val.teaser
        }
        videoBatchArray.push(d);
      });
      return videoBatchArray;
    }// transformDeepDiveVideoBatchData ENDS

    // Article Batch Transformed Data
    transformToArticleStack(data: Array<ArticleStackData>, scope?){
      if(data == null){return null;}//TODO tell backend to return null when no data
      var sampleImage = "/app/public/placeholder_XL.png";
      var articleStackArray = [];
      data.forEach(function(val, index){
          if(val.article_id != null && typeof val.article_id != 'undefined'){
            if(val.last_updated){
              var date =  moment.unix(Number(val.last_updated));
              date = '<span class="hide-320">' + date.format('dddd') + ', </span>' + date.format('MMM') + date.format('. DD, YYYY');
            }
            var key = val.subcategory != "none" ? val.subcategory : (val.category ? val.category : "all");
            var routeLink;
            var extLink;
            var author = null;
            var publisher = null;
            var category = val.article_sub_type ? val.article_sub_type : val.article_type;
            if(val.source == "snt_ai"){
              routeLink = GlobalSettings.getOffsiteLink(val.scope, VerticalGlobalFunctions.formatExternalArticleRoute(val.scope, category, val.event_id));
              extLink = true;
            } else {
              routeLink = VerticalGlobalFunctions.formatArticleRoute(scope, val.article_id, "story");
              extLink = false;
              author = val.author ? val.author.replace(/by/gi, "") + ", ": null;
              publisher = author ? val.publisher : "Published by: " + val.publisher;
            }
            var articleStackData = {
              id: val.article_id,
              articleUrl: routeLink != "" ? routeLink : '/deep-dive',
              extUrl: extLink,
              keyword: key,
              timeStamp: date ? date : "",
              title: val.title ? val.title : "No title available",
              author: author,
              publisher: val.publisher && val.author ? "Written by: " + "<span class='text-master'>" + author + publisher + "</span>": null,
              teaser: val.teaser ? val.teaser : "No teaser available",
              imageConfig: {
                imageClass: "embed-responsive-16by9",
                imageUrl: val.image_url ? GlobalSettings.getImageUrl(val.image_url) : sampleImage,
                urlRouteArray: routeLink,
                extUrl: extLink
              },
              keyUrl: key != "all" ? VerticalGlobalFunctions.formatSectionFrontRoute(key) : ['/deep-dive']
            }
            articleStackArray.push(articleStackData);
          }
        });
        return articleStackArray;
    }// transformToArticleStack ENDS

    carouselTransformData(arrayData:Array<ArticleStackData>, scope){
      if(arrayData == null || typeof arrayData == 'undefined' || arrayData.length == 0 || arrayData === undefined){
        return null;
      }
      var transformData = [];
      arrayData.forEach(function(val,index){
        var curdate = new Date();
        var curmonthdate = curdate.getDate();
        var timeStamp = moment(Number(val.last_updated)).format("MMMM Do, YYYY h:mm:ss a");

        var routeLink;
        var extLink;
        var category = val.article_sub_type ? val.article_sub_type : val.article_type;
        if(val.source == "snt_ai"){
          routeLink = GlobalSettings.getOffsiteLink(val.scope, VerticalGlobalFunctions.formatExternalArticleRoute(val.scope, category, val.event_id));
          extLink = true;
        } else {
          routeLink = VerticalGlobalFunctions.formatArticleRoute(scope, val.article_id, "story");
          extLink = false;
        }

        let carData = {
          articlelink: routeLink != "" ? routeLink : '/deep-dive',
          extUrl: extLink,
          source: val.source,
          report_type: val.report_type,
          image_url: GlobalSettings.getImageUrl(val['image_url']),
          title:  "<span> Today's News: </span>",
          headline: val['title'],
          keywords: val['keywords'][0],
          teaser: val['teaser'].replace('_',': ').replace(/<p[^>]*>/g, ""),
          article_id:val['article_id'],
          article_url: val['article_url'],
          last_updated: val.last_updated,
        };
        if(carData['teaser'].length >= 200){
          carData['teaser'].substr(0,200) + '...';
        }
        transformData.push(carData);
      });
      return transformData;
    }

    carouselDummyData(){
      var sampleImage = "/app/public/placeholder_XL.png";
      var articleStackData = {
          article_id: 88,
          article_url: '/deep-dive',
          keywords: ['Deep Dive'],
          source: 'test',
          report_type: 'report type',
          image_url: sampleImage,
          last_updated: moment().format("MMMM Do, YYYY h:mm:ss a"),
          title: "No title available",
          author: "",
          publisher: "",
          teaser: "No teaser available",
          imageConfig: {
            imageClass: "embed-responsive-16by9",
            imageUrl: sampleImage,
            urlRouteArray: ['/deep-dive']
          },
        }
        return [articleStackData,articleStackData,articleStackData,articleStackData,articleStackData];
    }
}// DeepDiveService ENDS
