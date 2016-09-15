import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http} from '@angular/http';

import {GlobalSettings} from '../global/global-settings';
import {GlobalFunctions} from '../global/global-functions';
import {VerticalGlobalFunctions} from '../global/vertical-global-functions';
import {DirectoryProfileItem, DirectoryItems} from '../fe-core/modules/directory/directory.data';
declare var moment: any;

export enum DirectoryType {
  none,
  teams,
  players
}

export interface DirectorySearchParams {
  startsWith: string;
  newlyAdded: boolean;
  listingsLimit: number;
  page: number;
}

//Where <T> is either <MLBTeamDirectoryData> or <MLBPlayerDirectoryData>
interface DirectoryListData<T> {
  totalItems: number;
  currentPage: number;
  items: Array<T>
}

interface MLBTeamDirectoryData {
  teamId: string;
  pageHeaderParentProfileName: string;
  listItemsProfileName: string;
  listItemsAssociatedProfile: string;
  dataPointOne: string;
  dataValueOne: string;
  dataPointTwo: string;
  dataValueTwo: string;
  teamFirstName: string;
  teamLastName: string;
  teamCity: string;
  teamState: string;
  lastUpdated: string;
  resultCount: number;
  pageCount: number;
  dayOfWeek: string;
}

interface MLBPlayerDirectoryData {
  teamId: string;
  teamFirstName: string;
  teamLastName: string;
  listItemsAssociatedProfile: string;
  playerId: string;
  listItemsProfileName: string;
  firstName: string;
  lastName: string;
  position: Array<string>;
  city: string;
  area: string;
  dataPointOne: string;
  dataValueOne: string;
  dataPointTwo: string;
  dataValueTwo: string;
  lastUpdated: string;
  resultCount: number;
  pageCount: number;
  dayOfWeek: string;
  playerCity: string;
  playerState: string;

}

@Injectable()
export class DirectoryService {
  constructor(public http: Http, private _globalFunc: GlobalFunctions){}

  getData(scope: string, pageType: DirectoryType, searchParams: DirectorySearchParams): Observable<DirectoryItems> {
    switch ( pageType ) {
      case DirectoryType.players:
        return this.getPlayerData(scope, searchParams);

      case DirectoryType.teams:
        return this.getTeamData(scope, searchParams);
    }
    return null;
  }

  getPlayerData(scope, searchParams: DirectorySearchParams): Observable<DirectoryItems> {
    let url = GlobalSettings.getApiUrl() + '/directory/';
    if(scope !== null) {
      url += scope;
    } else {
      url += 'nfl';
    }
    url += '/player';
    if ( searchParams.startsWith ) {
      url += "/" + searchParams.startsWith;
    }
    url += "/" + searchParams.listingsLimit + "/" + searchParams.page;
    return this.http.get(url)
        .map(res => res.json())
        .map(data => {
          var items = data.data;
          var firstItem = items.length > 0 ? items[0] : null;
          return {
            totalItems: firstItem ? firstItem.resultCount : 0,
            items: items.map(value => this.convertPlayerDataToDirectory(value))
          }
        });
  }

  getTeamData(scope, searchParams: DirectorySearchParams): Observable<DirectoryItems> {
    let url = GlobalSettings.getApiUrl() +  '/directory/';
    if(scope !== null) {
      url += scope;
    } else {
      url += 'nfl';
    }
    url += '/team';
    if ( searchParams.startsWith ) {
      url += "/" + searchParams.startsWith;
    }
    url += "/" + searchParams.listingsLimit + "/" + searchParams.page;
    return this.http.get(url)
      .map(res => res.json())
      .map(data => {
        var items = data.data;
        var firstItem = items.length > 0 ? items[0] : null;
        return {
          totalItems: firstItem ? firstItem.resultCount : 0,
          items: data.data.map(value => this.convertTeamDataToDirectory(value))
        }
      });
  }

  convertTeamDataToDirectory(data: MLBTeamDirectoryData): DirectoryProfileItem {
    var date = moment(Number(data.lastUpdated) * 1000);
    var dayOfWeek = date.format('dddd, ');
    var lastUpdate = GlobalFunctions.formatAPMonth(date.month()) + date.format(' Do, YYYY') + ' | ' + date.format('hh:mm A') + ' ET';
    return {
      dayOfWeek: dayOfWeek,
      lastUpdated: lastUpdate,
      mainDescription: [
        {
          route: VerticalGlobalFunctions.formatTeamRoute(data.listItemsProfileName, data.teamId),
          text: data.listItemsProfileName
        },
        {
          text: this._globalFunc.capitalizeFirstLetter(data.dataPointOne) + " " + (data.dataValueOne ? data.dataValueOne : "N/A")
        },
        {
          text: data.listItemsAssociatedProfile ? this._globalFunc.capitalizeFirstLetter(data.listItemsAssociatedProfile) : "N/A"
        }
      ],
      subDescription: [
        data.teamCity && data.teamState ? data.teamCity + ", " + data.teamState : "N/A",
        this._globalFunc.capitalizeFirstLetter(data.dataPointTwo) + " " + (data.dataValueTwo ? data.dataValueTwo : "N/A")
      ]
    };
  }

  convertPlayerDataToDirectory(data: MLBPlayerDirectoryData): DirectoryProfileItem {
    var location = "N/A";
    if ( data.playerCity && data.playerState ) {
      location = data.playerCity + ", " + data.playerState;
    }
    var teamName = data.teamFirstName + " " + data.teamLastName;
    var date = moment(Number(data.lastUpdated) * 1000);
    var dayOfWeek = date.format('dddd, ');
    var lastUpdate = GlobalFunctions.formatAPMonth(date.month()) + date.format(' Do, YYYY') + ' | ' + date.format('hh:mm A') + ' ET';
    return {
      dayOfWeek: dayOfWeek,
      lastUpdated: lastUpdate,
      mainDescription: [
        {
          route: VerticalGlobalFunctions.formatPlayerRoute(teamName, data.listItemsProfileName, data.playerId),
          text: data.listItemsProfileName
        },
        {
          route: VerticalGlobalFunctions.formatTeamRoute(teamName, data.teamId),
          text: 'Team: ' + teamName
        },
        {
          text: this._globalFunc.capitalizeFirstLetter(data.dataPointOne) + " " + (data.dataValueOne ? data.dataValueOne : "N/A")
        }
      ],
      subDescription: [
        location,
        this._globalFunc.capitalizeFirstLetter(data.dataPointTwo) + " " + (data.dataValueTwo ? data.dataValueTwo : "N/A")
      ]
    };
  }
}
