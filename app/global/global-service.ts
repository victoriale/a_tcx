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

export interface geoLocate {
    partner_id?: string;
    partner_script?: string;
    state?: string;
    city?: string;
    zipcode?: string;
}

@Injectable()

export class GeoLocation{
    geoData: geoLocate;

    geoObservable: Observable<any>

    constructor(public http: Http) { }


    getPartnerData(partner_id) {
        var partnerID = partner_id.split('-');

        //handles some cases where domain registries are different
        var combinedID = [];
        var domainRegisters = [];
        for (var i = 0; i < partnerID.length; i++) {
            if (partnerID[i] == "com" || partnerID[i] == "gov" || partnerID[i] == "net" || partnerID[i] == "org" || partnerID[i] == "co") {
                combinedID.push(partnerID[i]);
            } else {
                domainRegisters.push(partnerID[i]);
            }
        }

        partner_id = domainRegisters.join('-') + "." + combinedID.join('.');

        var fullUrl = GlobalSettings.getPartnerApiUrl(partner_id);
        // console.log(fullUrl);
        return this.http.get(fullUrl, {
        })
            .map(
            res => res.json()
            )
            .flatMap(
            data => {
                if (data['results'] != null) {
                    let partnerScript = data['results'].header.script;
                    let partnerLocation = data['results']['location']['realestate']['location_id'];
                    if (!this.geoData) {
                        this.geoData = {};
                    }
                    this.geoData['partner_id'] = partner_id;
                    this.geoData['partner_script'] = partnerScript;
                    if (partnerLocation.state && partnerLocation.city) {
                        this.geoData['state'] = partnerLocation.state;
                        this.geoData['city'] = partnerLocation.city;
                        return new Observable(observer => {
                            observer.next(this.geoData);
                            observer.complete();
                        });
                    } else {
                        return this.getGeoLocation();
                    }
                }
                // return data;
            }
            )
            .share();
    }

    //api to get geo location
    getGeoLocation() {
        var getGeoLocation = GlobalSettings.getGeoLocation() + '/listhuv/?action=get_remote_addr2';
        return this.http.get(getGeoLocation, {})
            .map(res => res.json())
            .map(
            data => {
                data[0].state = data[0].state == null ? "us" : data[0].state;
                let state = data[0].state.toLowerCase();
                let city = data[0].city.replace(/ /g, "%20");
                let zipcode = data[0].zipcode;
                if (!this.geoData) {
                    this.geoData = {};
                }
                this.geoData['state'] = state;
                this.geoData['city'] = city;
                this.geoData['zipcode'] = zipcode;

                return this.geoData;
            })
            .share();
    };

    grabLocation(partnerID?: string) {
        if (this.geoData) {
            return new Observable(observer => {
                observer.next(this.geoData);
                observer.complete();
            });
        } else if (this.geoObservable) {
            return this.geoObservable;
        } else {
            if (partnerID) {
                this.geoObservable = this.getPartnerData(partnerID);
            } else {
                this.geoObservable = this.getGeoLocation();
            }
            return this.geoObservable;
        }
    };
}
