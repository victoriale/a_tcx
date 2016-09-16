import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalFunctions} from '../global/global-functions';
import {VerticalGlobalFunctions} from '../global/vertical-global-functions';
import {GlobalSettings} from '../global/global-settings';
import {DomSanitizationService} from '@angular/platform-browser';
declare var moment;

@Injectable()
export class DeepDiveService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  private _articleUrl: string = GlobalSettings.getArticleUrl();

  constructor(
    public http: Http,
    private _sanitizer: DomSanitizationService){}

  //Function to set custom headers
  setToken(){
      var headers = new Headers();
      //headers.append(this.headerName, this.apiToken);
      return headers;
  }

  getDeepDiveArticleService(articleID){
  //Configure HTTP Headers
  var headers = this.setToken();
  var callURL = this._apiUrl + '/article/' + articleID;
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      return data;
    })
  }
  getDeepDiveVideoService(articleID){
        //Configure HTTP Headers
        var headers = this.setToken();
        var callURL = this._apiUrl + '/videoSingle/' + articleID;
        return this.http.get(callURL, {headers: headers})
            .map(res => res.json())
            .map(data => {
                return data;
            })
    }

  // Top Article of Article Stacks
  getDeepDiveBatchService(scope, limit, startNum, state?){
  //Configure HTTP Headers
  var headers = this.setToken();

  if(startNum == null){
    startNum = 1;
  }

  // http://dev-touchdownloyal-api.synapsys.us/articleBatch/nfl/5/1
  var callURL = this._apiUrl + '/articleBatch/';
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
        articleStackRoute: VerticalGlobalFunctions.formatSynRoute('story', topData.id),
        keyword: topData.keyword.replace('-', ' '),
        date: date != null ? date.month + " " + date.day + ", " + date.year: "",
        headline: topData.title,
        provider1: "<span class='text-light'>Written By: </span><span class='text-master'>" + pub + "</span>",
        provider2: "",
        description: teaser,
        imageConfig: {
          imageClass: "sixteen-nine",
          imageUrl: topData.imagePath != null ? GlobalSettings.getImageUrl(topData.imagePath) : sampleImage,
          urlRouteArray: VerticalGlobalFunctions.formatSynRoute('story', topData.id)
        }
    };
    return articleStackData;
  }

  getDeepDiveVideoBatchService(scope, limit, startNum, state?){
  //Configure HTTP Headers
  var headers = this.setToken();
  if(startNum == null){
    startNum = 1;
  }
  if(state == null){//make sure it comes back as a string of null if nothing is returned or sent to parameter
    state = 'null';
  }
  var callURL = this._apiUrl + '/videoBatch/';
  if(scope != null){
    callURL += scope;
  } else {
    callURL += 'nfl';
  }
  callURL += '/' + limit + '/' + startNum;
  if(state != null){//make sure it comes back as a string of null if nothing is returned or sent to parameter
    callURL += '/' + state;
  }
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      return data;
    })
  }

  getDeepDiveAiBatchService(scope, key?, page?, count?, state?){
    //Configure HTTP Headers
    var headers = this.setToken();
    if(scope == null){
      scope = 'nfl';
    }
    if(key == null){
      key == "postgame-report";
    }
    var callURL = this._articleUrl+'articles?articleType='+key+'&affiliation='+scope;
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

  getDeepDiveAiHeavyBatchService(scope, key?, page?, count?, state?){//TODO update api call
    //Configure HTTP Headers
    var headers = this.setToken();
    if(scope == null){
      scope = 'nfl';
    }
    if(key == null){
      key == "player-comparisons";
    }
    var callURL = this._articleUrl+'articles?articleType='+key+'&affiliation='+scope;
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

  getAiArticleData(state){
    var headers = this.setToken();
    //this is the sidkeick url
    var callURL = this._articleUrl + "sidekick-regional/"+ state +"/1/1";
    return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(data => {
        return data;
      });
  }

  getRecArticleData(scope, state, batch, limit){
    var headers = this.setToken();
    if(scope == null){
      scope = 'NFL';
    }
    if(state == null){
      state = 'CA';
    }
    if(batch == null || limit == null){
      batch = 1;
      limit = 1;
    }
    //this is the sidkeick url
    var callURL = this._articleUrl + "sidekick-regional/" + scope + "/" + state + "/" + batch + "/" + limit;//TODO won't need uppercase after ai fixes
      //console.log("url and data",callURL);
      return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(data => {

        return data;
      });
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
          articlelink: VerticalGlobalFunctions.formatSynRoute('story', val.id),
          date: date,
        };
        transformData.push(carData);
      });

      return transformData;
  }

  transformToArticleRow(data){
    var sampleImage = "/app/public/placeholder_XL.png";
    var articleStackArray = [];
    data = data.data.slice(1,9);
    data.forEach(function(val, index){
      var date = GlobalFunctions.formatDate(val.publishedDate);
      var s = {
          stackRowsRoute: VerticalGlobalFunctions.formatSynRoute('story', val.id),
          keyword: val.keyword.replace('-', ' '),
          publishedDate: date.month + " " + date.day + ", " + date.year,
          provider1: val.author != null ? val.author : "",
          provider2: val.publisher != null ? "Published By: " + val.publisher : "",
          description: val.title,
          images:  val.imagePath != null ? GlobalSettings.getImageUrl(val.imagePath) : sampleImage,
          imageConfig: {
            imageClass: "sixteen-nine",
            imageUrl: val.imagePath != null ? GlobalSettings.getImageUrl(val.imagePath) : sampleImage,
            /*hoverText: "View",*/
            urlRouteArray: VerticalGlobalFunctions.formatSynRoute('story', val.id)
          }
      }
      articleStackArray.push(s);
    });
    return articleStackArray;
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
          stackRowsRoute: VerticalGlobalFunctions.formatAiArticleRoute(key, val.event_id),//TODO
          keyword: key.replace('-', ' ').toUpperCase(),
          publishedDate: date,
          provider1: '',
          provider2: '',
          description: dataLists.displayHeadline,
          imageConfig: {
          imageClass: "sixteen-nine",
          /*hoverText: "View",*/
          imageUrl: val.image_url != null ? GlobalSettings.getImageUrl(val.image_url) : sampleImage,
          urlRouteArray: VerticalGlobalFunctions.formatAiArticleRoute(key, val.event_id)
          }
      }
      articleStackArray.push(s);
    });

    return articleStackArray;
  }

  transformToAiHeavyArticleRow(data, key){
    data = data.data;
    var sampleImage = "/app/public/placeholder_XL.png";
    var articleStackArray = [];
    data.forEach(function(val, index){
      for(var p in val.article_data){
        var eventType = val.article_data[p];
      }
      var date = moment(Number(val.last_updated) * 1000);
      date = GlobalFunctions.formatAPMonth(date.month()) + date.format(' Do, YYYY');
      var s = {
          stackRowsRoute: VerticalGlobalFunctions.formatAiArticleRoute(p, val.event_id),
          keyword: key.replace('-',' ').toUpperCase(),
          publishedDate: date,
          provider1: '',
          provider2: '',
          description: eventType.metaHeadline,
          imageConfig: {
            imageClass: "sixteen-nine",
            /*hoverText: "View",*/
            imageUrl: val.image_url != null ? GlobalSettings.getImageUrl(val.image_url) : sampleImage,//TODO
            urlRouteArray: VerticalGlobalFunctions.formatAiArticleRoute(key, val.event_id)
          }
      }
      articleStackArray.push(s);
    });
    return articleStackArray;
  }

  transformToRecArticles(data){
    data = data.data;
    var sampleImage = "/app/public/placeholder_XL.png";
    var articleStackArray = [];
    var articles = [];
    var eventID = null;
    for(var obj in data){
      if(obj != "meta-data" && obj != "timestamp"){
        var a = {
          keyword: obj,
          info: data[obj]
        }
        articles.push(a);
      } else {
        var eventID = data['meta-data']['current']['eventID'];
      }
    }
    articles.forEach(function(val, index){
      var info = val.info;
      var date = moment(Number(info.dateline)*1000);
      date = GlobalFunctions.formatAPMonth(date.month()) + date.format(' Do, YYYY');
      var s = {
          urlRouteArray: VerticalGlobalFunctions.formatAiArticleRoute(val.keyword, eventID),
          bg_image_var: info.image != null ? GlobalSettings.getImageUrl(info.image) : sampleImage,//TODO
          keyword: val.keyword.replace('-', ' ').toUpperCase(),
          new_date: date,
          displayHeadline: info.displayHeadline,
        }
      articleStackArray.push(s);
    });
    return articleStackArray;
  }

  transformTrending (data, currentArticleId) {
    data.forEach(function(val,index){
      //if (val.id != currentArticleId) {
      val["date"] = val.dateline;
      val["imagePath"] = GlobalSettings.getImageUrl(val.imagePath);
      val["newsRoute"] = VerticalGlobalFunctions.formatNewsRoute(val.id);
        //console.log(VerticalGlobalFunctions.formatNewsRoute(val.id),"News Route");
      //}
    })
    return data;
  }
  transformTileStack(data, scope) {
    data = data.data;
    if(scope == null){
      scope = 'NFL';
    }
    var lines = ['Find Your <br> Favorite Player', 'Find Your <br> Favorite Team', 'Check Out The Latest <br> With the ' + scope.toUpperCase()];
    let pickATeam = ['Disclaimer-page'];
    let leaguePage = ['Disclaimer-page'];
    var tileLink = [pickATeam, pickATeam, leaguePage];
    var dataStack = [];
    // create array of imagePaths
    var imagePaths = [];
    for (var i=0; i<data.length; i++) {
      imagePaths.push(data[i].imagePath);
    }
    // remove duplicates from array
    var imagePaths = imagePaths.filter( function(item, index, inputArray) {
      return inputArray.indexOf(item) == index;
    });

    for(var i = 0; i < 3; i++){
      var k = imagePaths[Math.floor(Math.random() * imagePaths.length)];
      var indexOfK = imagePaths.indexOf(k);
      dataStack[i] = data[i];
      dataStack[i]['lines'] = lines[i];
      dataStack[i]['tileLink'] = tileLink[i];
      dataStack[i]['image_url'] = GlobalSettings.getImageUrl(k) != null ? GlobalSettings.getImageUrl(k) : "/app/public/placeholder_XL.png";
      // remove appended image string from array
      imagePaths.splice(indexOfK,1);
    }
    return dataStack;
  }
}
