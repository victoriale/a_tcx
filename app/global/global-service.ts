/*
 GLOBAL SERVICE INDEX

 @LOCATIONPROFILE
 _@BATCH-1
 _@BATCH
 */
import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Observable} from "rxjs/Observable";
import { GlobalFunctions } from "../global/global-functions";
import { GlobalSettings } from "../global/global-settings";

@Injectable()
export class GeoLocation {
  constructor(public http: Http) {}
  //api to get geo location
  getGeoLocation() {
    var getGeoLocation = GlobalSettings.getGeoLocation() + '/listhuv/?action=get_remote_addr2';
    return this.http.get(getGeoLocation, {})
    .map(res => res.json())
    .map(
      data => {
        //console.log("state "+data[0].state);
        data[0].state = data[0].state == null ? "us" : data[0].state;
        return data;
      }
    )
  }
}
