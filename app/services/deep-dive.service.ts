import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Headers } from '@angular/http';
import { GlobalFunctions} from "../global/global-functions";

import { VideoStackData } from "../fe-core/interfaces/deep-dive.data";

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

}// DeepDiveService ENDS
