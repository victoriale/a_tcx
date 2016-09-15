import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalFunctions} from '../global/global-functions';
import {Conference, Division, SportPageParameters} from '../global/global-interface';
import {GlobalSettings} from '../global/global-settings';
declare var moment: any;
@Injectable()
export class NewsService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  constructor(public http: Http){}

  setToken(){
    var headers = new Headers();
    return headers;
  }

  getNewsService(scope, urlParams, profileType: string, pageType: string){
    var headers = this.setToken();
    var fullUrl = this._apiUrl;
    let type;
    if (profileType == "team" || profileType == "player" ) {
      type = "articleBatchTeam";
    }
    else {
      type = "articleBatch";
    }


    let targetId = '/' + urlParams.id;
    if (urlParams.id == null || urlParams.id == '') {
      targetId = '';
    }

    fullUrl += '/'+type+'/'+scope+'/'+urlParams.limit+'/'+urlParams.pageNum+targetId;

    return this.http.get(fullUrl, {
      headers: headers
    })
    .map(
      res => res.json()
    )
    .map(
      data => {
        return {
          news: this.newsData(data.data)
        };
    })
  }//getNewsService ends

  newsData(data){
    var self = this;
    var newsArray = [];
    var dummyImg = "/app/public/no-image.svg";
    var _getHostName = GlobalFunctions.getHostName;
    var windowWidth = window.innerWidth;
    data.forEach(function(val, index){
      var News = {
        title: val.title,
        description: val.teaser.replace(/<\/?[^>]+(>|$)/g, ""),
        newsUrl: val.articleUrl,
        author: _getHostName(val.articleUrl) != null ? _getHostName(val.articleUrl) : 'Anonymous',
        published: moment(+val.publishedDate).format("dddd MMMM do, YYYY"),
        backgroundImage: GlobalSettings.getImageUrl('/TDL/stock_images/TDL_Stock-3.png'),
        footerData: {
          infoDesc: 'Want to check out the full story?',
          text: 'READ THE ARTICLE',
          url: val.articleUrl,
          hrefUrl: true,
          smalltext: 'READ STORY'
        }
      };

      newsArray.push(News);
    });
    return newsArray;
  }//newsData ends
}
