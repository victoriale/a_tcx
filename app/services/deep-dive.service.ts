import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Headers } from '@angular/http';

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

}// DeepDiveService ENDS
