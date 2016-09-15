import {TableModel, TableColumn, CellData} from '../fe-core/components/custom-table/table-data.component';
import {CircleImageData} from '../fe-core/components/images/image-data';
import {StandingsTableTabData, TableComponentData} from '../fe-core/components/standings/standings.component';
import {SliderCarousel, SliderCarouselInput} from '../fe-core/components/carousels/slider-carousel/slider-carousel.component';
import {Conference, Division} from '../global/global-interface';
import {VerticalGlobalFunctions} from '../global/vertical-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';

export interface TeamStandingsData {
  teamName: string;
  imageUrl: string;
  backgroundImage: string;
  backgroundUrl: string;
  teamLogo: string;
  teamId: string;
  teamMarket: string;
  conferenceName: string;
  divisionName: string;
  lastUpdated: string;
  divisionRank: string;
  conferenceRank: string;
  leagueRank: string;
  streak: string;
  teamConferenceRecord: string;
  teamWinPercent: string;
  teamDivisionRecord: string;
  teamPointsAllowed: string;
  teamOverallRecord: string;
  seasonBase: string;
  totalLosses: string;
  totalWins: string;
  teamPointsFor: string;
  leagueAbbreviation: string;
  roadRecord: string;
  homeRecord: string;
  /**
   * - Formatted from league and division values that generated the associated table
   */
  groupName?: string;

  /**
   * - Formatted from the lastUpdatedDate
   */
  displayDate?: string;

  /**
   * Formatted full path to image
   */
  fullImageUrl?: string;

  /**
   * Formatted full path to image
   */
  fullBackgroundImageUrl?: string;
}

export class VerticalStandingsTableData implements TableComponentData<TeamStandingsData> {
  groupName: string;

  tableData: VerticalStandingsTableModel;

  conference: Conference;

  division: Division;

  constructor(title: string, conference: Conference, division: Division, table: VerticalStandingsTableModel) {
    this.groupName = title;
    this.conference = conference;
    this.division = division;
    this.tableData = table;
  }

}

export class TDLStandingsTabdata implements StandingsTableTabData<TeamStandingsData> {

  title: string;

  isActive: boolean;

  isLoaded: boolean;

  hasError: boolean;

  sections: Array<VerticalStandingsTableData>;

  conference: Conference;

  division: Division;

  season: any;

  selectedKey: string;

  currentTeamId: string;

  conferences: Array<any>;

  divisions: Array<any>;

  seasons: Array<any>;

  constructor(title: string, conference: Conference, division: Division, isActive: boolean, teamId: string) {
    this.title = title;
    this.conference = conference;
    this.division = division;
    this.isActive = isActive;
    this.currentTeamId = teamId;
  }

  getSelectedKey(): string {
    if ( !this.sections ) return "";

    var key = "";
    this.sections.forEach(section => {
      var table = section.tableData;
      if ( table.selectedKey != null && table.selectedKey != "") {
        key = table.selectedKey;
      }
    });
    return key;
  }

  setSelectedKey(key:string) {
    this.selectedKey = key;
    if ( !this.sections ) return;

    this.sections.forEach(section => {
      var table = section.tableData;
      if ( table.rows.filter(row => row.teamId == key).length > 0 ) {
        table.selectedKey = key;
      }
      else {
        table.selectedKey = "";
      }
    });
  }

  convertToCarouselItem(item: TeamStandingsData, index:number): SliderCarouselInput {
    var yearEnd = Number(item.seasonBase)+1;
    var teamFullName = item.teamMarket + ' ' + item.teamName;
    var teamRoute = VerticalGlobalFunctions.formatTeamRoute(teamFullName, item.teamId);
    var teamNameLink = {
        route: teamRoute,
        text: teamFullName
    };
    var rank = null;
    var rankPoint = null;
    var division = item.divisionName;
    if(item.leagueAbbreviation.toLowerCase() == 'fbs'){
      var division = item.conferenceName + ": " + GlobalFunctions.toTitleCase(item.divisionName.replace(item.conferenceName, '').toLowerCase());
    }//fbs divison sends back all uppercase and needs to be camel case
    if(this.conference !== undefined && this.division !== undefined){
      rank = item.divisionRank != null ? Number(item.divisionRank) : 'N/A';
      rankPoint =  item.divisionName;
      if(item.leagueAbbreviation.toLowerCase() == 'fbs'){
        rankPoint = item.conferenceName + ": " + GlobalFunctions.toTitleCase(item.divisionName.replace(item.conferenceName, '').toLowerCase());
      }
    } else if(this.conference !== undefined && this.division === undefined){
      rank = item.conferenceRank != null ? Number(item.conferenceRank) : 'N/A';
      rankPoint = item.conferenceName;
    } else {
      rank = item.leagueRank != null ? Number(item.leagueRank) : 'N/A';
      rankPoint = item.leagueAbbreviation.toUpperCase();
    }
    var overallRecord = item.teamOverallRecord ? item.teamOverallRecord : 'N/A';
    return SliderCarousel.convertToCarouselItemType1(index, {
      backgroundImage: item.backgroundUrl != null ? GlobalSettings.getImageUrl(item.backgroundUrl) : VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(item.backgroundUrl),
      copyrightInfo: GlobalSettings.getCopyrightInfo(),
      subheader: [item.seasonBase + "-" + yearEnd + " Season " + rankPoint + " Standings"],
      profileNameLink: teamNameLink,
      description:[
          "The ", teamNameLink,
          " are currently <span class='text-heavy'>ranked #" + rank + "</span>" + " in the <span class='text-heavy'>" + rankPoint + "</span>, with a record of " + "<span class='text-heavy'>" + overallRecord + "</span>."
      ],
      lastUpdatedDate: item.displayDate,
      circleImageUrl: GlobalSettings.getImageUrl(item.teamLogo),
      circleImageRoute: teamRoute
    });
  }
}

export class VerticalStandingsTableModel implements TableModel<TeamStandingsData> {
  columns: Array<TableColumn>;
  rows: Array<TeamStandingsData>;

  selectedKey: string = "";
  scope: string;
  /**
   * The team id of the profile page displaying the Standings module. (Optional)
   */
  currentTeamId: string;
  constructor(rows: Array<TeamStandingsData>, scope:string, teamId: string) {
    this.rows = rows;
    if ( this.rows === undefined || this.rows === null ) {
      this.rows = [];
    }
    this.currentTeamId = teamId;
    this.scope = scope;
    this.setColumnDP();
  }
  setColumnDP() : Array<TableColumn> {
    if(this.scope == 'fbs'){
      this.columns = [{
          headerValue: "Team Name",
          columnClass: "image-column",
          key: "name"
        },{
          headerValue: "W/L/T",
          columnClass: "data-column",
          key: "wlt"
        },{
          headerValue: "CONF",
          columnClass: "data-column",
          sortDirection: -1, //descending
          key: "conf"
        },{
          headerValue: "STRK",
          columnClass: "data-column",
          key: "strk"
        },{
          headerValue: "HM",
          columnClass: "data-column",
          key: "hm"
        },{
          headerValue: "RD",
          columnClass: "data-column",
          key: "rd"
        },{
          headerValue: "PF",
          columnClass: "data-column",
          key: "pf"
        },{
          headerValue: "PA",
          columnClass: "data-column",
          key: "pa"
        }];
      } else {
        this.columns = [{
            headerValue: "Team Name",
            columnClass: "image-column",
            key: "name"
          },{
            headerValue: "W/L/T",
            columnClass: "data-column",
            key: "wlt"
          },{
            headerValue: "PCT",
            columnClass: "data-column",
            sortDirection: -1, //descending
            key: "pct"
          },{
            headerValue: "DIV",
            columnClass: "data-column",
            key: "div"
          },{
            headerValue: "CONF",
            columnClass: "data-column",
            key: "conf"
          },{
            headerValue: "STRK",
            columnClass: "data-column",
            key: "strk"
          },{
            headerValue: "PF",
            columnClass: "data-column",
            key: "pf"
          },{
            headerValue: "PA",
            columnClass: "data-column",
            key: "pa"
          }];
      }
      return this.columns;
  }
  setSelectedKey(key: string) {
    this.selectedKey = key ? key : null;
  }

  getSelectedKey(): string {
    return this.selectedKey;
  }

  setRowSelected(rowIndex:number) {
    if ( rowIndex >= 0 && rowIndex < this.rows.length ) {
      this.selectedKey = this.rows[rowIndex].teamId;
    }
    else {
      this.selectedKey = null;
    }
  }

  isRowSelected(item:TeamStandingsData, rowIndex:number): boolean {
    return this.selectedKey == item.teamId;
  }

  calcWLT(str: string){
    let win = Number(str.split("-")[0]);
    let lose = Number(str.split("-")[1]);
    let tight = Number(str.split("-")[2]);
    let wlt = Math.pow(win, 2) - lose + tight;
    return wlt;
  }

  getCellData(item:TeamStandingsData, column:TableColumn):CellData {
    var display = null;
    var sort: any = null;
    var link: Array<any> = null;
    var imageUrl: string = null;
    var teamFullName = item.teamMarket + ' ' + item.teamName;
    switch (column.key) {
      case "name":
        display = item.teamName;
        sort = item.teamName;
        if ( item.teamId != this.currentTeamId ) {
          link = VerticalGlobalFunctions.formatTeamRoute(teamFullName,item.teamId);
        }
        imageUrl = item.teamLogo ? GlobalSettings.getImageUrl(item.teamLogo) : null;
        break;

      case "wlt":
        display = item.teamOverallRecord != null ? item.teamOverallRecord : 'N/A';
        sort = item.teamOverallRecord ? this.calcWLT(item.teamOverallRecord) : null;
        break;

      case "conf":
        display = item.teamConferenceRecord != null ? item.teamConferenceRecord : 'N/A';
        sort = item.teamConferenceRecord ? this.calcWLT(item.teamConferenceRecord) : null;
        break;

      case "strk":
        display = item.streak != null ? item.streak : 'N/A';
        if(item.streak){
          var compareValue = Number(item.streak.slice(1, item.streak.length));
          if(item.streak.charAt(0) == "L"){
            compareValue *= -1;
          }
        }
        sort = compareValue;
        break;

      case "hm":
        display = item.homeRecord != null ? item.homeRecord : 'N/A';
        sort = item.homeRecord ? this.calcWLT(item.homeRecord) : null;
        break;

      case "rd":
        display = item.roadRecord != null ? item.roadRecord : 'N/A';
        sort = item.roadRecord ? this.calcWLT(item.roadRecord) : null;
        break;

      case "pa":
        display = item.teamPointsAllowed != null ? item.teamPointsAllowed : 'N/A';
        sort = item.teamPointsAllowed ? Number(item.teamPointsAllowed) : null;
        break;

      case "pct":
        display = item.teamWinPercent != null ? item.teamWinPercent : 'N/A';
        sort = item.teamWinPercent ? Number(item.teamWinPercent) : null;
        break;

      case "div":
        display = item.teamDivisionRecord != null ? item.teamDivisionRecord : 'N/A';
        sort = item.teamDivisionRecord ? this.calcWLT(item.teamDivisionRecord) : null;
        break;

      case "pf":
        display = item.teamPointsFor != null ? item.teamPointsFor : null;
        sort = item.teamPointsFor ? item.teamPointsFor : null;
        break;
    }
    if ( display == null ) {
      display = "N/A";
    }
    return new CellData(display, sort, link, imageUrl);
  }
}
