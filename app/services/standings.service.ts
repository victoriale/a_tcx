import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http} from '@angular/http';
import {Conference, Division, SportPageParameters} from '../global/global-interface';
import {VerticalGlobalFunctions} from '../global/vertical-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {TeamStandingsData, TDLStandingsTabdata, VerticalStandingsTableModel, VerticalStandingsTableData} from './standings.data';
import {StandingsTableTabData} from '../fe-core/components/standings/standings.component';
import {GlobalSettings} from '../global/global-settings';

@Injectable()
export class StandingsService {
  constructor(public http: Http, private _mlbFunctions: VerticalGlobalFunctions){}

  private getLinkToPage(pageParams: SportPageParameters, teamName: string): Array<any> {
    var pageName = "Standings-page";
    var pageValues = {};

    if ( pageParams.teamId && teamName ) {
      pageValues["teamId"] = pageParams.teamId;
      pageValues["teamName"] = GlobalFunctions.toLowerKebab(teamName);
      pageValues["type"] = "team";
      pageName += "-team";
    }
    else if ( pageParams.conference != null ) {
      pageValues["type"] = Conference[pageParams.conference];
      pageName += "-league";
    }
    return [pageName, pageValues];
  }

  private getModuleTitle(pageParams: SportPageParameters, teamName: string): string {
    let moduletitle = "Standings";
    if ( teamName ) {
      moduletitle += " - " + teamName;
    }
    return moduletitle;
  }

  getPageTitle(pageParams: SportPageParameters, teamName: string): string {
    var scope = pageParams.scope == 'fbs' ? 'ncaaf' : 'nfl';
    let groupName = this.formatGroupName(pageParams.conference, pageParams.division);
    let pageTitle = scope.toUpperCase() + " Standings - " + scope.toUpperCase();
    if ( teamName ) {
      pageTitle = scope.toUpperCase() + " Standings - " + teamName;
    }
    return pageTitle;
  }

  loadAllTabsForModule(pageParams: SportPageParameters, scope?:string, currentTeamId?: string, currentTeamName?: string) {
    return {
        moduleTitle: this.getModuleTitle(pageParams, currentTeamName),
        pageRouterLink: this.getLinkToPage(pageParams, currentTeamName),
        tabs: this.initializeAllTabs(pageParams, currentTeamId ? currentTeamId : null)
    };
  }

  initializeAllTabs(pageParams: SportPageParameters, currentTeamId?: string): Array<TDLStandingsTabdata> {
    let tabs: Array<TDLStandingsTabdata> = [];
    if ( pageParams.conference === undefined || pageParams.conference === null ) {
      //Is an stangings page: show DIVISION, then CONFERENCE, then NFL/NCAAF
      //TDL: show division, then conference, then league standings
      /*console.log('league conference tabs',Conference, Division);*/
      tabs.push(this.createTab(true, currentTeamId, 'Division'));
      tabs.push(this.createTab(false, currentTeamId, 'Conference'));
      tabs.push(this.createTab(false, currentTeamId));
    }
    else if ( pageParams.division === undefined || pageParams.division === null ) {
      //Is a League page: show All Divisions, then American, then National
      /*console.log('league division tabs');*/
      tabs.push(this.createTab(false, currentTeamId));
      tabs.push(this.createTab(pageParams.conference === Conference.AFC, currentTeamId, Conference.AFC));
      tabs.push(this.createTab(pageParams.conference === Conference.NFC, currentTeamId, Conference.NFC));
    }
    else {
      //Is a Team page: show team's division, then team's league, then MLB
      /*console.log('team tabs');*/
      tabs.push(this.createTab(true, currentTeamId, pageParams.conference, pageParams.division));
      tabs.push(this.createTab(false, currentTeamId, pageParams.conference));
      tabs.push(this.createTab(false, currentTeamId));
    }

    return tabs;
  }

  getStandingsTabData(tabData: Array<any>, pageParams: SportPageParameters, onTabsLoaded: Function, maxRows?: number) {
    var newParams: any;
    var season: any = null;
    if (maxRows == null) {
      maxRows = 999999999999999;
    }
    if (tabData[2] && tabData[2] != null) {
      newParams = tabData[2];
      season = tabData[2].season;
    }
    if (season == null) {
      var date = new Date;
      var compareDate = new Date('09 08 ' + date.getFullYear());
      if (date.getMonth() == compareDate.getMonth() && date.getDate() >= compareDate.getDate()) {
        season = date.getFullYear();
      }
      else if (date.getMonth() > compareDate.getMonth()) {
        season = date.getFullYear();
      }
      else {
        season = (date.getFullYear() - 1);
      }
    }
    if ( !tabData || tabData.length < 2 ) {
      throw new Error("Invalid tabData for standings")
    }
    var standingsTab: TDLStandingsTabdata = tabData[0];
    var selectedKey = tabData[1];
    if ( selectedKey == null ) {
      selectedKey = pageParams.teamId;
    }

    //http://dev-touchdownloyal-api.synapsys.us/standings/league/nfl/2015
    if ( standingsTab && (!standingsTab.sections || standingsTab.sections.length == 0) ) {
      let url = GlobalSettings.getApiUrl() + "/standings";
      url += "/" + pageParams.scope + "/" + season;
      standingsTab.isLoaded = false;
      standingsTab.hasError = false;
      this.http.get(url)
        .map(res => res.json())
        .map(data => this.createData(standingsTab, pageParams.scope, data.data.standings, data.data.seasons, maxRows, newParams))
        .subscribe(data => {
          standingsTab.isLoaded = true;
          standingsTab.hasError = false;
          standingsTab.sections = data;
          standingsTab.season = season;
          if ( selectedKey ) {
            standingsTab.setSelectedKey(selectedKey);
          }
          onTabsLoaded(data);
        },
        err => {
          standingsTab.isLoaded = true;
          standingsTab.hasError = true;
          console.log("Error getting standings data");
        });
    }
    else if (standingsTab && newParams != null) {
      let url = GlobalSettings.getApiUrl() + "/standings";
      url += "/" + pageParams.scope + "/" + season;
      this.http.get(url)
        .map(res => res.json())
        .map(data => this.createData(standingsTab, pageParams.scope, data.data.standings, data.data.seasons, maxRows, newParams))
        .subscribe(data => {

          standingsTab.sections = data;
          standingsTab.season = season;
          if ( selectedKey ) {
            standingsTab.setSelectedKey(selectedKey);
          }
          onTabsLoaded(data);
        },
        err => {
          standingsTab.isLoaded = true;
          standingsTab.hasError = true;
          console.log("Error getting standings data");
        });
    }
  }
  createData(standingsTab, scope, standings, seasons, maxRows, params) {
    standingsTab.seasonsArray = seasons;
    standingsTab.conferences = standings;
    standingsTab.divisions = standings[standingsTab.conference];
    if (params != null) {
      standingsTab.divisions = standings[params.conference];
      standingsTab.conference = params.conference;
      standingsTab.division = params.division;
      return this.setupTabData(standingsTab, scope, standings, maxRows);
    }
    else {
      return this.setupTabData(standingsTab, scope, standings, maxRows);
    }
  }

  private createTab(selectTab: boolean, teamId: string, conference?, division?) {
    let title = this.formatGroupName(conference, division) + " Standings";
    if (conference == "Division") {
      division = "division";
    }
    return new TDLStandingsTabdata(title, conference, division, selectTab, teamId);
  }

  private setupTabData(standingsTab: TDLStandingsTabdata, scope, apiData: any, maxRows: number): Array<VerticalStandingsTableData> {
    var sections: Array<VerticalStandingsTableData> = [];
    var totalRows = 0;
    if ( standingsTab.conference !== null && standingsTab.conference !== undefined &&
      standingsTab.division !== null && standingsTab.division !== undefined ) {
      //get only the single division
      if (standingsTab.division.toString() == "division") {
        for ( var conferenceKey in apiData ) {
          for ( var divisionKey in apiData[conferenceKey] ) {
            var divData = conferenceKey && divisionKey ? apiData[conferenceKey][divisionKey] : [];
            var table = this.setupTableData(standingsTab.currentTeamId, scope, conferenceKey, divisionKey, divData, maxRows, true);
            totalRows += table.tableData.rows.length;
            if ( maxRows && totalRows > maxRows ) {
              break; //don't add more divisions
            }
            sections.push(table);
          }
          if ( maxRows && totalRows > maxRows ) {
            break; //don't add more conferences
          }
        }
        }
        else {
        var conferenceKey = standingsTab.conference.toString();
        var divisionKey = standingsTab.division.toString();
        var divData = conferenceKey && divisionKey ? apiData[conferenceKey][divisionKey] : null;
        sections.push(this.setupTableData(standingsTab.currentTeamId, scope, conferenceKey, divisionKey, divData, maxRows, false));
      }
    }
    else if ( standingsTab.conference !== null && standingsTab.conference !== undefined ) {
      //get only the single conference
        for ( var conferenceKey in apiData ) {
          if ((maxRows < 999 && conferenceKey == standingsTab.conference.toString()) || (maxRows > 999) ) {
          var divData: any = [];
          for ( var divisionKey in apiData[conferenceKey] ) {
            for (var i = 0; i < apiData[conferenceKey][divisionKey].length; i++) {
              divData.push(apiData[conferenceKey][divisionKey][i]);
            }
          }
          divData.sort(function(a,b) {return (a.teamWinPercent > b.teamWinPercent) ? 1 : ((b.teamWinPercent > a.teamWinPercent) ? -1 : 0);} );
          divData.reverse();
          var limitedDivData = [];;
          for (var num = 0; num < divData.length && num < maxRows; num++) {
            limitedDivData.push(divData[num]);
          }
          var table = this.setupTableData(standingsTab.currentTeamId, scope, conferenceKey, "Conference", limitedDivData, maxRows, true);
          sections.push(table);
          if ( maxRows && totalRows > maxRows ) {
            break; //don't add more conferences
          }
          }
        }
    }
    else {
      //other load all provided divisions
      var divData: any = [];
        for ( var conferenceKey in apiData ) {
          for ( var divisionKey in apiData[conferenceKey] ) {
            for (var i = 0; i < apiData[conferenceKey][divisionKey].length; i++) {
              divData.push(apiData[conferenceKey][divisionKey][i]);
            }
          }

          if ( maxRows && totalRows > maxRows ) {
            break; //don't add more conferences
          }
        }
        divData.sort(function(a,b) {return (a.teamWinPercent > b.teamWinPercent) ? 1 : ((b.teamWinPercent > a.teamWinPercent) ? -1 : 0);} );
        divData.reverse();
        var limitedDivData = [];;
        for (var num = 0; num < divData.length && num < maxRows; num++) {
          limitedDivData.push(divData[num]);
        }
        var table = this.setupTableData(standingsTab.currentTeamId, scope, "League", " ", limitedDivData, maxRows, true);
        sections.push(table);
    }
    return sections;
  }

  private setupTableData(teamId: string, scope, conference, division, rows: Array<TeamStandingsData>, maxRows: number, includeTableName: boolean): VerticalStandingsTableData {
    let groupName = this.formatGroupName(conference, division);

    //Limit to maxRows, if necessary
    if ( maxRows !== undefined ) {
      rows = rows.slice(0, maxRows);
    }

    //Set display values
    rows.forEach((value, index) => {
      value.groupName = groupName;
      value.displayDate = GlobalFunctions.formatUpdatedDate(value.lastUpdated, false);
      value.fullImageUrl = GlobalSettings.getImageUrl(value.imageUrl);
      value.fullBackgroundImageUrl = VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(value.backgroundImage);

      //Make sure numbers are numbers.
      value.totalWins = value.totalWins;
      value.totalLosses = value.totalLosses;
      value.teamWinPercent = value.teamWinPercent;
      value.teamDivisionRecord = value.teamDivisionRecord;
      value.conferenceRank = value.conferenceRank;
      value.teamPointsAllowed = value.teamPointsAllowed;
    });
    let tableName = this.formatGroupName(conference, division, true);
    var table = new VerticalStandingsTableModel(rows, scope, teamId);
    return new VerticalStandingsTableData(includeTableName ? tableName : "", conference, division, table);
  }

  /**
   * - Returns the group/league name based on the given conference and division values
   *
   * @example
   * // "American League"
   * formatGroupName(Conference.afc)
   *
   * @example
   * // "MLB"
   * formatGroupName()
   *
   * @example
   * // "American League East"
   * formatGroupName(Conference.afc, Division.east)
   *
   * @param {Conference} conference - (Optional)
   *                                - Expected if {division} is included.
   * @param {Division} division - (Optional)
   * @returns {string}
   *
   */
  private formatGroupName(conference, division, makeDivisionBold?: boolean): string {
    if ( conference !== undefined && conference !== null ) {
      let leagueName = conference;
      if ( division !== undefined && division !== null ) {
        return (makeDivisionBold ? "<span class='text-heavy'>" + division + "</span>" : division);
      }
      else {
        return leagueName;
      }
    }
    else {
      return "League";
    }
  }
}
