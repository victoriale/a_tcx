import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalSettings } from "../global/global-settings";
import { GeoLocation } from "../global/global-service";

@Component({
  selector: 'my-app',
  templateUrl: 'app/app-component/app.component.html'
})
export class AppComponent {
  public partnerID:string;
  public partnerScript: string;
  private isLoading:boolean = true;

  constructor(private _activatedRoute:ActivatedRoute, private _geoLocation: GeoLocation){
    this._activatedRoute.params.subscribe(
        (params:any) => {
            //function that grabs the designated location needed for the client and if a partnerID is sent through then it will also set the partnerID and partnerScript for their Header
            GlobalSettings.storedPartnerId(params.partner_id);
            this.partnerID = params.partner_id;
            this._geoLocation.grabLocation(params.partner_id).subscribe(res => {
              if(res.partner_id){
                GlobalSettings.storedPartnerId(res.partner_id);
                this.partnerID = res.partner_id;
              }
              if(res.partner_script){
                this.partnerScript = res.partner_script;
              }
            })
        }
    );
  }

  //Grabs partner Header information and sets the partner script and geolocation
  //will default to a geo location if none was provided
  getPartnerHeader(){//Since it we are receiving
    if(this.partnerID != null){
      this._geoLocation.getPartnerData(this.partnerID)
        .subscribe(
          partnerScript => {
            if(partnerScript['results'] != null){
              this.partnerScript = partnerScript['results'].header.script;

              let partnerLocation = partnerScript['results']['location']['realestate']['location_id'];

              if(partnerLocation.state && partnerLocation.city){
                // this._geoLocation.setLocation(partnerLocation.state.toLowerCase(), partnerLocation.city.toLowerCase().replace(/ /g, "%20"), null);
              }else{
                this.getGeoLocation();
              }
            }
          }
        );
    }else{
      this.getGeoLocation();
    }
  }

  //will grab geolocation call from the users ip address
  getGeoLocation(){
    this._geoLocation.getGeoLocation()
        .subscribe(
            geoLocationData => {
              let state = geoLocationData[0].state.toLowerCase();
              let city = geoLocationData[0].city.replace(/ /g, "%20");
              let zipcode = geoLocationData[0].zipcode;
              // this._geoLocation.setLocation(state, city, zipcode);
            },
            err => {
              console.log("Geo Location Error:", err);
              let state = 'ca';
              let city = 'san-francisco';
              let zipcode = null;
              // this._geoLocation.setLocation(state, city, zipcode);
            }
        );
  }
}
