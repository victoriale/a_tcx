import {Injectable} from '@angular/core';
import {Router} from '@angular/router-deprecated';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';
import {VerticalGlobalFunctions} from '../global/vertical-global-functions';

@Injectable()
export class LandingPageService {
  private _apiUrl: string = GlobalSettings.getApiUrl();

  public partnerID: string;

  constructor(
    public http: Http,
    private _router:Router
  ){

  }

  setToken(){
    var headers = new Headers();
    return headers;
  }

  getLandingPageService(scope, geoLocation?){
    var headers = this.setToken();
    var fullUrl = this._apiUrl;

    if (geoLocation) {
      var newFullUrl = this._apiUrl+'/landingPage/'+scope+'/'+geoLocation; //TODO
    }
    else {
      var newFullUrl = this._apiUrl+'/landingPage/'+scope //TODO
    }

    return this.http.get(newFullUrl, {
      headers: headers
    })
    .map(
      res => res.json()
    )
    .map(
      data => {
        return {
            league: this.landingData(data)
        };
      }
    )
  }// getLandingPageservice ends

  landingData(data){
    var self = this;
    var leagueArray = [];
    var teamArray = [];
    for(var league in data){//get each of the league given by data
      var divisionArray = [];
      for(var division in data[league]){//get each division within league data
        var div = data[league][division];
        div.forEach(function(val, index){//start converting team info
          val.name = val.name.toUpperCase();
          val.nickname = val.nickname.replace("Diamondbacks","D-backs");
          var teamName = val.name + ' ' + val.nickname;
          val.teamRoute = VerticalGlobalFunctions.formatTeamRoute(teamName, val.id.toString());
          val.imageData= {
            imageClass: "image-100",
            mainImage: {
              imageUrl:  GlobalSettings.getImageUrl(val.logo_url),
              urlRouteArray: VerticalGlobalFunctions.formatTeamRoute(teamName, val.id.toString()),
              hoverText: "<i class='fa fa-mail-forward home-team-image-fa'></i>",// style='font-size:30px;'
              imageClass: "border-3"
            }
          }
        })//finish converting each team
        divisionArray.push({//once team conversion is finished push into each division
          displayName: division.toUpperCase(),
          dataArray: div
        });
      }
      leagueArray.push({//once all divisions are done push the league info into final array
        displayName:"<span class='text-heavy'>" + league.toUpperCase() + "</span> TEAMS<span class='text-heavy'>:</span>",
        dataArray:divisionArray
      });
    }
    return leagueArray;
  } //landingData

}// LandingPageService ends
