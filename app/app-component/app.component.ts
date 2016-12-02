import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalSettings } from "../global/global-settings";
import { PartnerHeader } from "../global/global-service";
import { GeoLocation } from "../global/global-service";

@Component({
  selector: 'my-app',
  templateUrl: 'app/app-component/app.component.html'
})
export class AppComponent {
  public partnerID:string;
  public partnerScript: string;
  private isLoading:boolean = true;

  constructor(private _activatedRoute:ActivatedRoute, private _partnerData: PartnerHeader, private _geoLocation: GeoLocation){
    this._activatedRoute.params.subscribe(
        (params:any) => {
            console.log('Partner:',params);
            GlobalSettings.storePartnerId(params.partner_id);
            this.partnerID = params.partner_id;
            if(this.partnerID){
              this.getPartnerHeader();
            }
        }
    );
  }

  getPartnerHeader(){//Since it we are receiving
    if(this.partnerID != null && this.partnerID != 'football'){
      this._partnerData.getPartnerData(this.partnerID)
        .subscribe(
          partnerScript => {
            console.log(partnerScript);
            if(partnerScript['results'] != null){
              this.partnerScript = partnerScript['results'].header.script;

              let partnerLocation = partnerScript['results']['location']['realestate']['location_id'];

              if(partnerLocation.state && partnerLocation.city){
                this._geoLocation.setLocation(partnerLocation.state.toLowerCase(), partnerLocation.city.toLowerCase().replace(/ /g, "%20"), null);
              }else{
                this.getLocation();
              }
            }
          }
        );
    }else{
      this.getLocation();
    }
  }

  getLocation(){
    this._geoLocation.getGeoLocation()
        .subscribe(
            geoLocationData => {
              let state = geoLocationData[0].state.toLowerCase();
              let city = geoLocationData[0].city.replace(/ /g, "%20");
              let zipcode = geoLocationData[0].zipcode;
              this._geoLocation.setLocation(state, city, zipcode);
            },
            err => {
              console.log("Geo Location Error:", err);
              let state = 'ca';
              let city = 'san-francisco';
              let zipcode = null;
              this._geoLocation.setLocation(state, city, zipcode);
            }
        );
  }
}
