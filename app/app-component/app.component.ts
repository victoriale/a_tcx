import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalSettings } from "../global/global-settings";

@Component({
  selector: 'my-app',
  templateUrl: 'app/app-component/app.component.html'
})
export class AppComponent {
  constructor(private _activatedRoute:ActivatedRoute){
    this._activatedRoute.params.subscribe(
        (params:any) => {
            console.log(params);
            GlobalSettings.storePartnerId(params.partner_id);
        }
    );
  }
}
