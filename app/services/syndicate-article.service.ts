import { VerticalGlobalFunctions } from "../global/vertical-global-functions";
import { Http, Headers, HttpModule } from "@angular/http";
import { GlobalSettings } from "../global/global-settings";
import { Injectable } from "@angular/core";
import {GlobalFunctions} from "../global/global-functions";

declare var moment;

@Injectable()
export class SyndicateArticleService {
  private _syndicateUrl: string = GlobalSettings.getArticleBatchUrl();

  constructor(public _http: Http) { }

  setToken() {
    var headers = new Headers({ 'content-type': 'application/json' });
    //headers.append(this.headerName, this.apiToken);
    return headers;
  }
  getSyndicateArticleService(articleID) {
    //Configure HTTP Headers
    /*
            var headers = this.setToken();
    */
    var callURL = this._syndicateUrl + '?articleID=' + articleID;
    return this._http.get(callURL).retry(2)
      .map(res => res.json())
      .map(data => data)
  }

  transformMainArticle(data,sc,ai,et){
      var imageData=[];
      var imageTitle=[];
      var copyright=[];
      var artwriter='';
      data = data[0];
      var mainArticleData:any={
          'url':'',
          'title':'',
          'author':'',
          'publisher':'',
          'imageData':[],
          'imageTitle':[],
          'copyright':[],
          'publishedDate':'',
          'article':[],
      };
      if(data.author){
          let authorArray = data.author.split(' ');
          if(authorArray[0] =='By'){
              for(var i=1;i<authorArray.length;i++){artwriter += authorArray[i] + ' ';}
          }else{
              for(var i=0;i<authorArray.length;i++){artwriter += authorArray[i] + ' ';}
          }
      }
      if(data.is_stock_photo && data.is_stock_photo==true){
          mainArticleData['is_stock']=true;
      }else{
          mainArticleData['is_stock']=false;
      }
      mainArticleData['url'] = VerticalGlobalFunctions.formatArticleRoute(sc, ai, et);
      mainArticleData['title'] = data.title.replace(/\'/g, "'");
      mainArticleData['author'] = artwriter;
      mainArticleData['publisher'] = data.publisher;
      mainArticleData['publishedDate'] = GlobalFunctions.sntGlobalDateFormatting(data.publication_date, 'timeZone');

          if (data.article_data.images === null || typeof data.article_data.images == 'undefined' || data.article_data.images.length == 0) {
              if(data.image_url!=null ||data.image_url!= undefined){
                  imageData[0]=GlobalSettings.getImageUrl(data.image_url, GlobalSettings._imgLgScreen);
              }else{
                  mainArticleData['is_stock']=true;
              }
          } else {
              var imageLength = data.article_data.images.length;
              for (var i = 0; i < imageLength; i++) {
                  imageData[imageData.length] = GlobalSettings.getImageUrl(data.article_data.images[i].image_url, GlobalSettings._imgLgScreen);
                  copyright[copyright.length] = data.article_data.images[i].image_copyright;
                  imageTitle[imageTitle.length] = data.article_data.images[i].image_title;
              }
          }
      mainArticleData['imageData'] = imageData;
      mainArticleData['imageTitle'] = imageTitle;
      mainArticleData['copyright'] = copyright;
      if(data.article_data.article){
        mainArticleData['article'] = data.article_data.article;
      }else{
        mainArticleData['article'] = "This article is currently being written... Please try again shortly.";
      }
      return mainArticleData;
  }
  getSyndicateVideoService(subcategory, articleID){
    //Configure HTTP Headers
    /*var headers = this.setToken();*/
    var callURL = GlobalSettings.getApiUrl() + '/tcx/videoSingle/' +subcategory +'/'+ articleID;
    return this._http.get(callURL)
      .map(res => res.json())
      .map(data => {
        return data;
      })
  }
//http://dev-tcxmedia-api.synapsys.us/articles?source=tca&count=3&category=entertainment&subCategory=television
  getRecArticleData(category, count, subcategory?) {
    /* var headers = this.setToken();*/
    var callURL
    if (subcategory!=category) {
      callURL = this._syndicateUrl + '?source[]=tca-curated&source[]=snt_ai&count=' + count + "&category=" + category + "&subCategory=" + subcategory + "&random=1";

    } else {
        category = category == 'real-estate'? 'real+estate':category;
      callURL = this._syndicateUrl + '?source[]=tca-curated&source[]=snt_ai&count=' + count + "&category=" + category + "&random=1";
    }
    return this._http.get(callURL)
      .map(res => res.json())
      .map(data => {
        return data;
      })
  }

  transformToRecArticles(data, scope, articleType, currentArticleId) {
    if(!data){
      return null;
    }

      articleType = "story";
      var sampleImage = "/app/public/placeholder_XL.png";
      var articleStackArray = [];
      data.forEach(function(val, index) {
          if (val.article_id != currentArticleId){
              var category = val.article_sub_type ? val.article_sub_type : val.article_type;
              var date = GlobalFunctions.sntGlobalDateFormatting(val.publication_date, 'dayOfWeek');
              var s = {
                  imageConfig: {
                      imageClass: "embed-responsive-16by9",
                      imageUrl: val.image_url != null ? GlobalSettings.getImageUrl(val.image_url, GlobalSettings._imgFullScreen) : sampleImage,
                      extUrl: val.source != "snt_ai" ? false : true,
                      urlRouteArray: val.source != "snt_ai" ? VerticalGlobalFunctions.formatArticleRoute(scope, val.article_id, articleType) : GlobalSettings.getOffsiteLink(val.scope, "article", VerticalGlobalFunctions.formatExternalArticleRoute(val.scope, category, val.event_id)),
                      imageDesc: "",
                  },
                  keyword: val.keywords.length>0? val.keywords[0].toUpperCase():scope,
                  timeStamp: date,
                  title: val.title? val.title.replace(/\'/g, "'"): "",
                  extUrl:val.source != "snt_ai" ? false : true,
                  keyUrl: val['keywords'][0] ? VerticalGlobalFunctions.formatSectionFrontRoute(val['keywords'][0]) : ["/news-feed"],
                  articleUrl: val.source != "snt_ai" ? VerticalGlobalFunctions.formatArticleRoute(scope, val.article_id, articleType) : GlobalSettings.getOffsiteLink(val.scope, "article", VerticalGlobalFunctions.formatExternalArticleRoute(val.scope, articleType, val.event_id)),

              }
              articleStackArray.push(s);
          }
      });
       if(articleStackArray.length==3){ return articleStackArray;}
       else if(articleStackArray.length>3){return articleStackArray.slice(1)}

  }
  //http://dev-tcxmedia-api.synapsys.us/articles?source=tca&count=10&category=entertainment&subCategory=television
  getTrendingArticles(category, count, subcategory?) {
    var headers = this.setToken();
    var callURL
    if (subcategory!=category) {
      callURL = this._syndicateUrl + '?source[]=tca-curated&source[]=snt_ai&count=' + count + "&category=" + category + "&subCategory=" + subcategory;
    } else {
      category = category == 'real-estate'? 'real+estate':category;
      callURL = this._syndicateUrl + '?source[]=tca-curated&source[]=snt_ai&count=' + count + "&category=" + category;
    }
    var trendingArticles;
    var startElement;
    return this._http.get(callURL)
      .map(res => res.json())
      .map(data => {
        trendingArticles=data.data;
        if(!trendingArticles){return null;}
        if(count>10){
            startElement = count - 10;
            trendingArticles=trendingArticles.slice(startElement);
            return trendingArticles;
        }
        return trendingArticles;
      })
  }


  transformTrending(data, scope, articleType, currentArticleId) {
    articleType = "story";
    var placeholder = "/app/public/placeholder_XL.png";
    data.forEach(function(val, index) {
        var category = val.article_sub_type ? val.article_sub_type : val.article_type;
        val["date"] = GlobalFunctions.sntGlobalDateFormatting(val.publication_date, 'timeZone');
        val["image"] = val.image_url != null ? GlobalSettings.getImageUrl(val.image_url, GlobalSettings._imgFullScreen) : GlobalSettings.getImageUrl(placeholder);
        val["content"]=val.teaser;
        val['extUrl']=val.source!="snt_ai"?false:true;
        val["url"] = val.source!="snt_ai"?VerticalGlobalFunctions.formatArticleRoute(scope, val.article_id, articleType):GlobalSettings.getOffsiteLink(val.scope,"article", VerticalGlobalFunctions.formatExternalArticleRoute(val.scope, category, val.event_id));
        val['teaser']=val.teaser?val.teaser:val.article_data.article[0];
          var articleWriter='';
          if(val.author){
              let authorArray = val.author.split(' ');
              if(authorArray[0] =='By'){
                  for(var i=1;i<authorArray.length;i++) {
                      articleWriter += authorArray[i] + ' ';
                  }
              }else{
                  for(var i=0;i<authorArray.length;i++) {
                      articleWriter += authorArray[i] + ' ';
                  }
              }
          }
          val['author']=articleWriter;
          val['title']= val.title? val.title.replace(/\'/g, "'"): "";
    })
    return data;
  }
}
