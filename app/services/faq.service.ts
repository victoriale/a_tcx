import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalSettings} from '../global/global-settings';

@Injectable()
export class FaqService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  constructor(public http: Http){}

  setToken(){
    var headers = new Headers();
    return headers;
  }

  getFaqService(profile, id?){
    var headers = this.setToken();
    var fullUrl = this._apiUrl;
    fullUrl += "/faq/" + profile;

    if(id !== undefined){
      fullUrl += "/" + id;
    }
    return this.http.get( fullUrl, {
        headers: headers
      })
      .map(
        res => res.json()
      )
      .map(
        data => {
          return this.faqData(data.data);
        },
        err => {
          console.log('INVALID DATA');
        }
      )
  }//getFaqService ends

  faqData(data){
    var self = this;
    var faqArray = [];
    data.forEach(function(val, index){
      if(index == 0){
        val.active = true;
      }else{
        val.active = false;
      }
      var FAQ = {
        answer: val.answer,
        question: val.question,
        active: val.active
      }
      faqArray.push(FAQ);
    });
    return faqArray;
  }
}
