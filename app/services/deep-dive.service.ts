import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';
declare var moment;

@Injectable()
export class DeepDiveService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  private _articleUrl: string = GlobalSettings.getArticleUrl();

  constructor(
    public http: Http,
  ){}

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

}
