import {Component, ApplicationRef} from '@angular/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';
import {Title} from '@angular/platform-browser';
import {Observable} from 'rxjs/Rx';
import {AppComponent} from "../app-webpage/app.webpage";
import {MyAppComponent} from "../app-webpage/app.mywebpage";
import {GlobalSettings} from "../global/global-settings";

declare var ga:any;

@Component({
    selector: 'app-domain',
    templateUrl: './app/app-domain/app.domain.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [Title]
})

@RouteConfig([
    {
        path: '/',
        redirectTo: ['Default-home', {scope:'nfl'}]
    },
    {
        path: '/:scope/...',
        name: 'Default-home',
        component: AppComponent,
        useAsDefault: true
    },
    {
        path: '/:partner_id/:scope/...',
        name: 'Partner-home',
        component: MyAppComponent,
    }
])

export class AppDomain {
  currentRoute: string = '';

  constructor(private _router: Router, private _ref: ApplicationRef) {
      if ( Object.prototype.toString.call(window['HTMLElement']).indexOf('Constructor') > 0 ) {
        //we appear to be using safari
        this._router.subscribe(route => {
          _ref.zone.run(() => _ref.tick());
        });
      }
      this._router.root.subscribe(route => {
          // var routeItems = url.split('/');
          //Only scroll to top if the page isn't the directory.
          // if ( routeItems[1] != "directory" ) {
          // }
          window.scrollTo(0, 0);
          try {
            window.dispatchEvent(new Event('load'));
          }catch(e){
            //to run reload event on IE
            var resizeEvent = document.createEvent('UIEvents');
            resizeEvent.initUIEvent('load', true, false, window, 0);
            window.dispatchEvent(resizeEvent);
          }
          if(GlobalSettings.isProd()) {
            var newRoute = route || '/';
            if (newRoute !== this.currentRoute) {
              try {
                ga('send', 'pageview', location.pathname);
              }
              catch (e) {
              }
              this.currentRoute = newRoute;
            }
          }
        }
      );
    }
}
