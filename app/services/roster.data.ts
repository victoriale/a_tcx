import {TableModel, TableColumn, CellData} from '../fe-core/components/custom-table/table-data.component';
import {CircleImageData} from '../fe-core/components/images/image-data';
import {RosterTabData} from '../fe-core/components/roster/roster.component';
import {SliderCarousel,SliderCarouselInput} from '../fe-core/components/carousels/slider-carousel/slider-carousel.component';
import {Conference, Division} from '../global/global-interface';
import {GlobalFunctions} from '../global/global-functions';
import {VerticalGlobalFunctions} from '../global/vertical-global-functions';
import {GlobalSettings} from '../global/global-settings';
import {RosterService} from './roster.service';

export interface TeamRosterData {
  playerHeadshotUrl: string,
  teamId: string,
  teamName: string,
  playerName: string,
  playerFirstName:string,
  playerLastName: string,
  playerId: string,
  roleStatus: string,
  active: string,
  playerJerseyNumber: string,
  backgroundUrl: string;
  teamLogo: string,
  playerPosition:string,
  depth: string,
  playerWeight: string,
  playerHeight: string,
  birthDate: string,
  city: string,
  area: string,
  country: string,
  heightInInches: string,
  playerAge: string,
  playerSalary: number,
  lastUpdated: string,
  /**
   * - Formatted from league and division values that generated the associated table
   */
  groupName?: string
  /**
   * - Formatted from the lastUpdatedDate
   */
  displayDate?: string;
}

export class NFLRosterTabData implements RosterTabData<TeamRosterData> {
  type: string;
  teamId: string;
  maxRows: number;
  title: string;
  isLoaded: boolean = false;
  hasError: boolean = false;
  errorMessage: string;
  tableData: RosterTableModel;
  isTeamProfilePage: boolean;

  constructor(private _service: RosterService, teamId: string, type: string, conference: Conference, maxRows: number, isTeamProfilePage: boolean) {
    this.type = type;
    this.teamId = teamId;
    this.maxRows = maxRows;
    this.errorMessage = "Sorry, there is no roster data available.";
    this.isTeamProfilePage = isTeamProfilePage;

    // if ( this.type == "hitters" && conference == Conference.national ) {
    //   this.hasError = true;
    //   this.errorMessage = "This team is a National League team and has no designated hitters.";
    // }

    switch ( type ) {
      case "full":      this.title = "Full Roster"; break;
      case "offense":  this.title = "Offense";    break;
      case "defense":  this.title = "Defense";    break;
      case "special":  this.title = "Special Teams";    break;
    }
  }

  loadData() {
    if ( !this.tableData ) {
      if ( !this._service.fullRoster ) {
        this._service.getRosterTabData(this).subscribe(data => {
          //Limit to maxRows, if necessary
          var rows = this.filterRows(data);

          this.tableData = new RosterTableModel(rows);
          this.isLoaded = true;
          this.hasError = false;
        },
        err => {
          this.isLoaded = true;
          this.hasError = true;
          console.log("Error getting roster data", err);
        });
      }
      else {
        var rows = this.filterRows(this._service.fullRoster);
        this.tableData = new RosterTableModel(rows);
        this.isLoaded = true;
        this.hasError = false;
      }
    }
  }

  filterRows(data: any): Array<TeamRosterData> {
    var rows: Array<TeamRosterData>;
    if ( this.type != "full" ) {
      rows = data[this.type];
    }
    else {
      rows = [];
      for ( var type in data ) {
        data[type].forEach(player => {
          if ( rows.filter(row => row.playerId == player.playerId).length == 0 ) {
            rows.push(player);
          }
        });
      }
    }


    rows = rows.sort((a, b) => {
      return Number(b.playerSalary) - Number(a.playerSalary);
    });
    if ( this.maxRows !== undefined ) {
      rows = rows.slice(0, this.maxRows);
    }
    return rows;
  }

  convertToCarouselItem(val:TeamRosterData, index:number):SliderCarouselInput {
    var playerRoute = VerticalGlobalFunctions.formatPlayerRoute(val.teamName,val.playerFirstName + " " + val.playerLastName,val.playerId);
    var teamRoute = this.isTeamProfilePage ? null : VerticalGlobalFunctions.formatTeamRoute(val.teamName,val.teamId);
    var curYear = new Date().getFullYear();

    // var formattedHeight = VerticalGlobalFunctions.formatHeightWithFoot(val.height);
    var formattedSalary = "N/A";
    if ( val.playerSalary != null ) {
      formattedSalary = "$" + GlobalFunctions.nFormatter(Number(val.playerSalary));
    }

    var playerNum = val.playerJerseyNumber != null ? "<span class='text-heavy'>No. " + val.playerJerseyNumber + "</span>," : "";
    var playerHeight = val.playerHeight != null ? "<span class='text-heavy'>" + VerticalGlobalFunctions.formatHeightInches(val.playerHeight) + "</span>, " : "";
    var playerWeight = val.playerWeight != null ? "<span class='text-heavy'>" + val.playerWeight + "</span> " : "N/A";
    var playerSalary = "<span class='text-heavy'>" + formattedSalary + "</span> per year.";

    var playerLinkText = {
      route: playerRoute,
      text: val.playerFirstName + " " + val.playerLastName,
      class: 'text-heavy'
    }
    var teamLinkText = {
      route: teamRoute,
      text: val.teamName,
      class: 'text-heavy'
    }
    return SliderCarousel.convertToCarouselItemType1(index, {
      backgroundImage: VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(val.backgroundUrl),
      copyrightInfo: GlobalSettings.getCopyrightInfo(),
      subheader: [curYear + ' TEAM ROSTER'],
      profileNameLink: playerLinkText,
      description: [
          playerLinkText,
          ", ", "<span class='text-heavy'>" + val.playerPosition, "</span>",'for the ',
          teamLinkText,
          'is <span class="text-heavy">'+ playerNum + '</span> and stands at ' + playerHeight + "tall, weighing " + playerWeight +"<span class='nfl-only'> and making a salary of "+ playerSalary + "</span>"
      ],
      lastUpdatedDate: GlobalFunctions.formatUpdatedDate(val.lastUpdated),
      circleImageUrl: GlobalSettings.getImageUrl(val.playerHeadshotUrl),
      circleImageRoute: playerRoute,
      // subImageUrl: GlobalSettings.getImageUrl(val.teamLogo),
      // subImageRoute: teamRoute,
      //rank: val.uniformNumber
    });
  }
}

export class RosterTableModel implements TableModel<TeamRosterData> {
  columns: Array<TableColumn> = [{
      headerValue: "Player",
      columnClass: "image-column",
      key: "name",
      sortDirection: 1 //ascending
    },{
      headerValue: "Pos.",
      columnClass: "data-column",
      isNumericType: false,
      key: "pos"
    },{
      headerValue: "Height",
      columnClass: "data-column",
      isNumericType: true,
      key: "ht"
    },{
      headerValue: "Weight",
      columnClass: "data-column",
      isNumericType: true,
      key: "wt"
    },{
      headerValue: "Age",
      columnClass: "data-column age",
      isNumericType: true,
      key: "age"
    },{
      headerValue: "Salary",
      columnClass: "data-column salary",
      isNumericType: true,
      key: "sal"
    }
  ];

  rows: Array<TeamRosterData>;

  selectedKey: string = "";

  constructor(rows: Array<TeamRosterData>) {
    this.rows = rows;
    if ( this.rows === undefined || this.rows === null ) {
      this.rows = [];
    }
  }

  setSelectedKey(key: string) {
    this.selectedKey = key;
  }

  getSelectedKey(): string {
    return this.selectedKey;
  }

  setRowSelected(rowIndex:number) {
    if ( rowIndex >= 0 && rowIndex < this.rows.length ) {
      this.selectedKey = this.rows[rowIndex].playerId;
    }
    else {
      this.selectedKey = null;
    }
  }

  isRowSelected(item:TeamRosterData, rowIndex:number): boolean {
    return this.selectedKey == item.playerId;
  }

  getCellData(item:TeamRosterData, column:TableColumn): CellData {
    var display = null;
    var sort = null;
    var link: Array<any> = null;
    var imageUrl: string = null;
    var displayAsRawText = false;
    switch (column.key) {
      case "name":
        display = item.playerFirstName + " " + item.playerLastName;
        sort = item.playerLastName + ', ' + item.playerFirstName;
        link = VerticalGlobalFunctions.formatPlayerRoute(item.teamName, item.playerFirstName + " " + item.playerLastName, item.playerId);
        imageUrl = GlobalSettings.getImageUrl(item.playerHeadshotUrl);
        break;

      case "pos":
        display = typeof item.playerPosition[0] != null ? item.playerPosition : null;
        sort = item.playerPosition != null ? item.playerPosition.toString() : null;
        break;

      case "ht":
        display = item.playerHeight != null ? VerticalGlobalFunctions.formatHeight(VerticalGlobalFunctions.formatHeightInches(item.playerHeight)) : null;
        displayAsRawText = true;
        sort = item.playerHeight != null ? Number(item.playerHeight) : null;
        break;

      case "wt":
        display = item.playerWeight != null ? item.playerWeight + " lbs." : null;
        sort = item.playerWeight != null ? Number(item.playerWeight) : null;
        break;

      case "age":
        display = item.playerAge != null ? item.playerAge.toString() : null;
        sort = item.playerAge != null ? Number(item.playerAge) : null;
        break;

      case "sal":
        display = item.playerSalary != null ? "$" + GlobalFunctions.nFormatter(Number(item.playerSalary)) : null;
        sort = item.playerSalary != null ? Number(item.playerSalary) : null;
        break;
    }
    if ( display == null ) {
      display = "N/A";
    }
    return new CellData(display, sort, link, imageUrl, displayAsRawText);
  }
}
