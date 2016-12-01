import { VerticalGlobalFunctions } from "../global/vertical-global-functions";
import { Http, Headers, HttpModule } from "@angular/http";
import { GlobalSettings } from "../global/global-settings";
import { Injectable } from "@angular/core";

declare var moment;

@Injectable()
export class SyndicateArticleService {
  private _syndicateUrl: string = GlobalSettings.getSyndicateUrl();

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
    return this._http.get(callURL)
      .map(res => res.json())
      .map(data => {
        return data;
      })
  }
  getSyndicateVideoService(subcategory,articleID) {
    //Configure HTTP Headers
    /*var headers = this.setToken();*/
    var callURL = GlobalSettings.getApiUrl() + '/tcx/videoSingle/' +subcategory +'/'+ articleID;
    return this._http.get(callURL)
      .map(res => res.json())
      .map(data => {

        return data;
      })
  }
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
      });
  }

  transformToRecArticles(data, scope, articleType) {
    data = data.data;
    articleType = "story";
    var sampleImage = "/app/public/placeholder_XL.png";
    var articleStackArray = [];
    var articles = [];
    var eventID = null;

    data.forEach(function(val, index) {
      var info = val.info;
      var date = moment.unix(Number(val.last_updated));
      date = '<span class="hide-320">' + date.format('dddd') + ', </span>' + date.format('MMM') + date.format('. DD, YYYY');
      var s = {
          extUrl:false,
        imageConfig: {
            imageClass:"embed-responsive-16by9",
            imageUrl:val.image_url != null ? GlobalSettings.getImageUrl(val.image_url) : sampleImage,
            urlRouteArray:[],
            imageDesc:"",
        },
        keyword: val.keywords[0].toUpperCase(),
        timeStamp: date,
        title: val.title,
      }
      articleStackArray.push(s);
    });
    return articleStackArray;
  }
  //http://dev-tcxmedia-api.synapsys.us/articles?source=tca&count=10&category=entertainment&subCategory=television
  getTrendingArticles(category, count, subcategory?) {

    var headers = this.setToken();
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


  transformTrending(data, scope, articleType, currentArticleId) {
    articleType = "story";
    var placeholder = "/app/public/placeholder_XL.png"

    data.forEach(function(val, index) {


      if (val.article_id != currentArticleId && val.title && val.teaser) {
          val['articleCount']=data.length;
        var date =  moment.unix(Number(val.last_updated));
        val["date"] = '<span class="hide-320">' + date.format('dddd') + ', </span>' + date.format('MMM') + date.format('. DD, YYYY');
        val["image"] = val.image_url != null ? GlobalSettings.getImageUrl(val.image_url) : placeholder;
        val["content"]=val.teaser;
        val['extUrl']=val.source!="snt_ai"?false:true;
        val["url"] = val.source!="snt_ai"?VerticalGlobalFunctions.formatArticleRoute(scope, val.article_id, articleType):GlobalSettings.getOffsiteLink(val.scope, VerticalGlobalFunctions.formatExternalArticleRoute(val.scope, articleType, val.event_id));
        //console.log(VerticalGlobalFunctions.formatNewsRoute(val.id,this.articleType),"News Route");
          var artwriter='';
          if(val.author){

              let authorArray = val.author.split(' ');

              if(authorArray[0] =='By'){
                  for(var i=1;i<authorArray.length;i++) {
                      artwriter += authorArray[i] + ' ';
                  }
              }else{
                  for(var i=0;i<authorArray.length;i++) {
                      artwriter += authorArray[i] + ' ';
                  }
              }

          }
          val['author']=artwriter;
      }
    })
    return data;
  }

}
