import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {Http, Headers, URLSearchParams, RequestOptions} from '@angular/http';

import { VideoStackData, ArticleStackData } from "../fe-core/interfaces/deep-dive.data";
import { GlobalFunctions } from "../global/global-functions";
import { GlobalSettings } from "../global/global-settings";
import { VerticalGlobalFunctions } from "../global/vertical-global-functions";


declare var moment;

@Injectable()
export class DeepDiveService {
  private options = new RequestOptions({headers:new Headers()});
  constructor(public http: Http){}

  //Function to set custom headers
  setToken(){
    var headers = new Headers();
    return headers;
  }

  getDeepDiveBatchService(category: string, limit: number, page: number, state?: string){
  
    category = category.replace(/--/g," ");
    let params:URLSearchParams=new URLSearchParams();
    var checkCategory= GlobalSettings.getTCXscope(category).topScope;
    if(checkCategory == 'basketball' || checkCategory == 'football'|| checkCategory == 'baseball'){
      params.set("category", "sports");
      params.set("subCategory",category);
    }else if(checkCategory != null ){
      params.set("category", category)
    }else{
      params.set("keyword[]",category)
    };
    params.set("count", limit.toString());
    params.set("page",page.toString());
    params.set("random","1");
    params.set("metaDataOnly","1");
    this.options.search=params;
    let callURL = GlobalSettings.getArticleBatchUrl()+"?&source[]=snt_ai&source[]=tca-curated&source[]=tronc";

    return this.http.get(callURL, this.options)
        .map(res => res.json())
        .map(data => {
          return data.data;
        })


  }
  getCarouselData(scope, data, limit, batch, state, callback:Function) {
    scope = scope.replace(/--/g," ");
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

  getDeepDiveVideoBatchService(category: string, limit?: number, page?: number, location?: string){
      category = category.replace(/--/g," ");
      var headers = this.setToken();
      var callURL;
      if(limit === null || typeof limit == 'undefined'){
        limit = 5;
        page = 1;
      }
      if(category.toLowerCase() == "ncaaf"){category = "fbs";}
      if(GlobalSettings.getTCXscope(category).topScope == "football" || GlobalSettings.getTCXscope(category).topScope == "baseball"){
        callURL = GlobalSettings.getTCXscope(category).verticalApi + '/tcx';
      } else {
        callURL = GlobalSettings.getHeadlineUrl();
      }
      callURL += '/videoBatch/' + category;
      //http://dev-article-library.synapsys.us/tcx/videoBatch/sports/10/1
      //http://qa-homerunloyal-api.synapsys.us/tcx/videoBatch/mlb/5/1
      //http://qa-touchdownloyal-api.synapsys.us/tcx/videoBatch/nfl/5/1
      //http://qa-touchdownloyal-api.synapsys.us/tcx/videoBatch/fbs/5/1
      if(GlobalSettings.getTCXscope(category).topScope == "basketball"){
        callURL += '/' + page + '/' + limit;
      } else {
        callURL += '/' + limit + '/' + page;
        if(GlobalSettings.getTCXscope(category).topScope == "nfl" && location !== null){
          callURL += '/' + location;
      }
    }
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
    if(data == null || typeof data == "undefined" || data.length == 0){
      return null;
    }
    var sampleImage = "/app/public/placeholder_XL.png";
    var videoBatchArray = [];
    scope = scope ? scope : "sports";
    data.forEach(function(val, index){
      if(val.time_stamp){
        var date =  moment(Number(val.time_stamp));
        date = date.format('dddd') + ', ' + date.format('MMM') + date.format('. DD, YYYY');
      }
      var keywords = val.keyword ? val.keyword : scope;
      var keyHyphen=keywords.replace(/ /g,"--")
      var d = {
        id: val.id,
        keyword: keywords,
        title: val.title ? val.title : "No Title",
        time_stamp: date ? date : "",
        video_thumbnail: val.video_thumbnail ? val.video_thumbnail : sampleImage,
        embed_url: val.video_url != null ? val.video_url : null,
        video_url: VerticalGlobalFunctions.formatArticleRoute(scope, keyHyphen, val.id, "video"),
        keyUrl: VerticalGlobalFunctions.formatSectionFrontRoute(keyHyphen),
        teaser: val.teaser ? val.teaser : ""
      }
      videoBatchArray.push(d);
    });
    return videoBatchArray;
  }// transformDeepDiveVideoBatchData ENDS

  // Article Batch Transformed Data
  transformToArticleStack(data: Array<ArticleStackData>, topcategory?, imageSize?){
    if(data == null){return null;}
    var sampleImage = "/app/public/placeholder_XL.png";
    var articleStackArray = [];
    let route = VerticalGlobalFunctions.getWhiteLabel();
    imageSize = imageSize ? imageSize : GlobalSettings._imgFullScreen;
    data.forEach(function(val, index){
      if(val.article_id != null && typeof val.article_id != 'undefined'){
        if(val.publication_date || val.last_updated){
          let d =  val.publication_date ? val.publication_date : val.last_updated;
          var date = moment.unix(Number(d));
          date = '<span class="hide-320">' + date.format('dddd') + ', </span>' + date.format('MMM') + date.format('. DD, YYYY');
        }
        var key;
        var routeLink;
        var extLink;
        var author = null;
        var publisher = null;
        var category = val.article_sub_type ? val.article_sub_type : val.article_type;
        //keywords note: For articles, get the second keyword if possible, second keyword should be the subcategory for curated articles.
        if(val.keywords.length > 0 && val.keywords[0] != "none" && val.keywords[0]){
          if(val.keywords.length > 1 && val.keywords[1] != "none" && val.keywords[1] && val.source != "snt_ai"){
            key = val.keywords[1];
          } else {
            key = val.keywords[0];
          }
        } else {
          if(val.subcategory){
            key = val.subcategory;
          } else {
            key = val.category;
          }
        }
          var keyhyphen=key.replace(/ /g,"--");
        if(val.source == "snt_ai"){// If AI article then redirect to the corresponding vertical
          routeLink = GlobalSettings.getOffsiteLink(val.scope, "article", VerticalGlobalFunctions.formatExternalArticleRoute(val.scope, category, val.event_id));
          extLink = true;
        } else {
         if(val.keywords.length>0){
             if(topcategory!=val.keywords[0] && val.keywords[0]){
                 topcategory=val.keywords[0].replace(/ /g,"--");
             }  else{
                 topcategory=topcategory;
             }
         }
          routeLink = topcategory ? VerticalGlobalFunctions.formatArticleRoute(topcategory, keyhyphen.toLowerCase(), val.article_id, "story") : null;
          extLink = false;
          author = val.author ? val.author.replace(/by/gi, "") + ", ": null;
          publisher = author ? val.publisher : "Published by: " + val.publisher;
        }
        if(val.teaser){
          var limitDesc = val.teaser.substr(0, 360);// limit teaser character to 360 count
          limitDesc = limitDesc.substr(0, Math.min(limitDesc.length, limitDesc.lastIndexOf(" ")));// and not cutting the word
          if(val.teaser.length > 360 || limitDesc.length < val.teaser.length){
            limitDesc += "...";
          }
        }
        if(val.title){
          var limitTitle = val.title.substr(0, 200);//// limit title character to 200 count
          if(val.title.length > 200 || limitTitle.length < val.title.length){
            limitTitle += "...";
          }
        }
        var articleStackData = {
          id: val.article_id,
          articleUrl: routeLink != "" ? routeLink : route,
          extUrl: extLink,
          keyword: key,
          timeStamp: date ? date : "",
          title: val.title ? limitTitle : "No title available",
          author: author,
          publisher: val.publisher && val.author ? "Written By: " + "<b class='text-master'>" + author + publisher + "</b>": null,
          teaser: val.teaser ? limitDesc : "No teaser available",
          imageConfig: {
            imageClass: "embed-responsive-16by9",
            imageUrl: val.image_url ? GlobalSettings.getImageUrl(val.image_url, imageSize) : sampleImage,
            urlRouteArray: routeLink,
            extUrl: extLink
          },
          image_source: val.image_source ? val.image_source : null,
          citationInfo: {
            url: val.image_origin_url ? val.image_origin_url : "/",
            info: (val.image_title ? val.image_title : "") + (val.image_title && val.image_owner ? "/" : "") + (val.image_owner ? val.image_owner : "")
          },
          keyUrl: key != "all" && key && typeof key != "underfined" ? VerticalGlobalFunctions.formatSectionFrontRoute(keyhyphen.toLowerCase()) : [route]
        }
        articleStackArray.push(articleStackData);
      }
    });
    return articleStackArray;
  }// transformToArticleStack ENDS

  carouselTransformData(arrayData:Array<ArticleStackData>, scope){

    let route = VerticalGlobalFunctions.getWhiteLabel();

    if(arrayData == null || typeof arrayData == 'undefined' || arrayData.length == 0 || arrayData === undefined){
      return null;
    }
    var transformData = [];
    arrayData.forEach(function(val,index){
      var curdate = new Date();
      var curmonthdate = curdate.getDate();
      let d = val.publication_date ? val.publication_date : val.last_updated;
      if(d){
        var timeStamp = moment(Number(d)).format("MMMM Do, YYYY h:mm:ss a");
      }

      var routeLink;
      var extLink;
      var category = val.article_sub_type ? val.article_sub_type : val.article_type;
      var key;
      if(val.keywords.length > 0 && val.keywords[0] != "none" && val.keywords[0]){
        if(val.keywords.length > 1 && val.keywords[1] != "none" && val.keywords[1] && val.source != "snt_ai"){
          key = val.keywords[1];
        } else {
          key = val.keywords[0];
        }
      } else {
        if(val.subcategory){
          key = val.subcategory;
        } else {
          key = val.category;
        }
      }
      var keyhyphen=key.replace(/ /g,"--");

      if(val.source == "snt_ai"){
        routeLink = GlobalSettings.getOffsiteLink(val.scope, "article", VerticalGlobalFunctions.formatExternalArticleRoute(val.scope, category, val.event_id));
        extLink = true;
      } else {
          if(val.keywords.length>0){
              if(scope!=val.keywords[0] && val.keywords[0]){
                  scope=val.keywords[0].replace(/ /g,"--");
              }  else{
                  scope=scope;
              }
          }
        routeLink = VerticalGlobalFunctions.formatArticleRoute(scope, keyhyphen.toLowerCase(),val.article_id, "story");
        extLink = false;
      }


      let carData = {
        articlelink: routeLink != "" ? routeLink : route,
        extUrl: extLink,
        source: val.source,
        report_type: val.report_type,
        image_url: GlobalSettings.getImageUrl(val['image_url'], GlobalSettings._imgWideScreen),
        title:  "<span> Today's News: </span>",
        headline: val['title'],
        keywords: key ? key : "NEWS",
        keyUrl: val['keywords'][0] ? VerticalGlobalFunctions.formatSectionFrontRoute(keyhyphen.toLowerCase()) : ["/news-feed"],
        teaser: val['teaser'] ? val['teaser'].replace('_',': ').replace(/<p[^>]*>/g, "") : "",
        article_id:val['article_id'],
        article_url: val['article_url'],
        last_updated: val.publication_date,
        image_source: val.image_source ? val.image_source : null,
        citationInfo: {
          url: val.image_origin_url ? val.image_origin_url : "/",
          info: (val.image_title ? val.image_title : "") + (val.image_title && val.image_owner ? "/" : "") + (val.image_owner ? val.image_owner : "")
        }
      };
      if(carData['teaser'].length >= 200){
        carData['teaser'].substr(0,200) + '...';
      }
      transformData.push(carData);
    });
    return transformData;
  }

  carouselDummyData(){
    let route = VerticalGlobalFunctions.getWhiteLabel();
    var sampleImage = "/app/public/placeholder_XL.png";
    var articleStackData = {
      article_id: 88,
      article_url: route,
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
        urlRouteArray: [route]
      },
    }
    return [articleStackData];
  }
}// DeepDiveService ENDS
