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

export class PartnerHeader {
  public protocolToUse: string = (location.protocol == "https:") ? "https" : "http";
  constructor(public http: Http) {}
  //API for listing profile
  getPartnerData(partner_id) {
    var partnerID = partner_id.split('-');

    //handles some cases where domain registries are different
    var combinedID = [];
    var domainRegisters = [];
    for(var i = 0; i < partnerID.length; i++){
       if(partnerID[i] == "com" || partnerID[i] == "gov" || partnerID[i] == "net" || partnerID[i] == "org" || partnerID[i] == "co"){
         combinedID.push(partnerID[i]);
       }else{
         domainRegisters.push(partnerID[i]);
       }
    }

    partner_id = domainRegisters.join('-')+ "." + combinedID.join('.');

    var fullUrl = GlobalSettings.getPartnerApiUrl(partner_id);
    // console.log(fullUrl);
    return this.http.get(fullUrl, {
    })
    .map(
      res => res.json()
    )
    .map(
      data => {
        return data;
      }
    )
  }
}

export interface geoLocate {
  state?:string;
  city?:string;
  zipcode?:string;
}

@Injectable()

export class GeoLocation {
  public location: Observable<geoLocate>;

  constructor(public http: Http) {
    this.getGeoLocation();
  }
  //api to get geo location
  getGeoLocation() {
    var getGeoLocation = GlobalSettings.getGeoLocation() + '/listhuv/?action=get_remote_addr2';
    return this.http.get(getGeoLocation, {})
    .map(res => res.json())
    .map(
      data => {
        //console.log("state "+data[0].state);
        data[0].state = data[0].state == null ? "us" : data[0].state;
        this.setLocation(data[0].state.toLowerCase(), data[0].city.replace(/ /g, "%20"), data[0].zipcode);
        return data;
      }
    )
  };

  setLocation(state, city, zipcode){
    let data = {
      state: state,
      city: city,
      zipcode: zipcode
    }
    return new Observable(observer =>{
        observer.next(data);
        observer.complete();
      });
  };

  getLocation(){
    return this.location;
  };
}
