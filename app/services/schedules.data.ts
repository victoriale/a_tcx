import {TableModel, TableColumn, CellData} from '../fe-core/components/custom-table/table-data.component';
import {CircleImageData} from '../fe-core/components/images/image-data';
import {TableTabData, TableComponentData} from '../fe-core/components/schedules/schedules.component';
import {SchedulesCarouselInput} from '../fe-core/components/carousels/schedules-carousel/schedules-carousel.component';
import {Conference, Division} from '../global/global-interface';
import {VerticalGlobalFunctions} from '../global/vertical-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';
import {Gradient} from '../global/global-gradient';

declare var moment: any;

export interface SchedulesData {
  //TEAM1 => HOME
  //TEAM2 => AWAY
  index:any;
  backgroundImage: string,
  eventTimestamp: number,
  id: string,//id from API
  eventStatus: string,
  leagueAbbreviation: string,
  team1Id: string,
  team2Id: string,
  team1Score: string,
  team2Score: string,
  team1Outcome: string,
  team2Outcome: string,
  seasonId: string,
  team1Logo: string,
  team1ColorHex: string,
  team1City: string,
  team1State: string,
  team1Stadium: string,
  team1Market: string, //first name
  team1Name: string, //last name
  team1Abbreviation: string,
  team1Record:string;
  team1Wins: string,
  team1Losses: string,
  team2Logo: string,
  team2ColorHex: string,
  team2City: string,
  team2State: string,
  team2Stadium: string,
  team2Market: string, //first name
  team2Name: string, //last name
  team2Abbreviation: string,
  team2Record:string;
  team2Wins: string,
  team2Losses: string,
  aiUrlMod: string, //TODO missing
  results:string, //TODO missing
  targetTeam: string; //TODO missing
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

  /**
   * Formatted home record
   */
  homeRecord?: string;

  /**
   * Formatted away record
   */
  awayRecord?: string;
}

export class ScheduleTabData implements TableTabData<SchedulesData> {

  title: string;

  display:string;

  dataType: string;

  season: string;

  isActive: boolean;

  sections: Array<SchedulesTableData>;

  errorData: any = {
      data: "Sorry, we do not currently have any data for Schedule",
      icon: "fa fa-remove"
  };

  constructor(title: string, isActive: boolean) {
    this.title = title;
    this.isActive = isActive;
    this.sections = [];
  }
}

export class SchedulesTableData implements TableComponentData<SchedulesData> {
  groupName: string;

  tableData: any;

  currentTeamProfile: string;

  constructor(title: string, table: any, currentTeamProfile: string) {
    this.groupName = title;
    this.tableData = table;
    this.currentTeamProfile = currentTeamProfile;
  }

  updateCarouselData(item: SchedulesData, index:number){//ANY CHANGES HERE CHECK setupTableData in schedules.service.ts
    var displayNext = '';
    if(item.eventStatus == 'pregame'){
      var displayNext = 'Next Game:';
    }else{
      var displayNext = 'Previous Game:';
    }
    let homeFullTeamName = item.team1Market + ' ' + item.team1Name;
    let awayFullTeamName = item.team2Market + ' ' + item.team2Name;
    var teamRouteAway = this.currentTeamProfile == item.team2Id ? null : VerticalGlobalFunctions.formatTeamRoute(awayFullTeamName, item.team2Id);
    var teamRouteHome = this.currentTeamProfile == item.team1Id ? null : VerticalGlobalFunctions.formatTeamRoute(homeFullTeamName, item.team1Id);
    //TEST colors
    item.team1ColorHex = item.team1ColorHex != null ? item.team1ColorHex:'#a1a1a1';
    item.team2ColorHex = item.team2ColorHex != null ? item.team2ColorHex:'#d2d2d2';
    var colors = Gradient.getColorPair(item.team2ColorHex.split(','), item.team1ColorHex.split(','));

    return {//placeholder data
      index:index,
      displayNext: displayNext,
      backgroundGradient: Gradient.getGradientStyles(colors),
      displayTime: moment(Number(item.eventTimestamp)*1000).tz('America/New_York').format('dddd MMMM Do, YYYY | h:mm A z'), //hard coded TIMEZOME since it is coming back from api this way
      detail1Data:'Home Stadium:',
      detail1Value:item.team1Stadium,
      detail2Value:item.team1City + ', ' + item.team1State,
      imageConfig1:{//AWAY
        imageClass: "image-125",
        mainImage: {
          imageUrl: GlobalSettings.getImageUrl(item.team2Logo),
          urlRouteArray: teamRouteAway,
          hoverText: "<p>View</p><p>Profile</p>",
          imageClass: "border-5"
        }
      },
      imageConfig2:{//HOME
        imageClass: "image-125",
        mainImage: {
          imageUrl: GlobalSettings.getImageUrl(item.team1Logo),
          urlRouteArray: teamRouteHome,
          hoverText: "<p>View</p><p>Profile</p>",
          imageClass: "border-5"
        }
      },
      teamUrl1: teamRouteAway,
      teamUrl2: teamRouteHome,
      teamName1: awayFullTeamName,
      teamName2: homeFullTeamName,
      teamLocation1:item.team2City + ', ' + item.team2State,
      teamLocation2:item.team1City + ', ' + item.team1State,
      teamRecord1:item.awayRecord,
      teamRecord2:item.homeRecord,
    };
  }
}

export class SchedulesTableModel implements TableModel<SchedulesData> {
  columns: Array<TableColumn>;

  rows: Array<SchedulesData>;

  selectedKey:string = "";

  private curTeam:string;//grab the current teams object name being returned to determine where the current team stands (away / home)

  private isTeamProfilePage: boolean;

  constructor(rows: Array<any>, eventStatus, teamId, isTeamProfilePage: boolean) {
    //find if current team is home or away and set the name to the current objects name
    this.curTeam = teamId ? teamId.toString() : null;
    this.isTeamProfilePage = isTeamProfilePage;
    if(eventStatus === 'pregame'){
      this.columns = [{
         headerValue: "DATE",
         columnClass: "date-column",
         sortDirection: 1, //desc
         isNumericType: true,
         key: "date"
       },{
         headerValue: "TIME",
         columnClass: "date-column",
         ignoreSort: true,
         key: "t"
       },{
         headerValue: "AWAY",
         columnClass: "image-column location-column",
         key: "away"
       },{
         headerValue: "HOME",
         columnClass: "image-column location-column",
         key: "home"
       },{
         headerValue: "GAME SUMMARY",
         columnClass: "summary-column",
         ignoreSort: true,
         key: "gs"
       }];
    }else{
      if(typeof teamId == 'undefined' || teamId == null){//for league table model there should not be a teamId coming from page parameters for post game reports
        this.columns = [
        {
           headerValue: "AWAY",
           columnClass: "image-column location-column2",
           isNumericType: false,
           key: "away"
         },{
          headerValue: "HOME",
          columnClass: "image-column location-column2",
          isNumericType: false,
          key: "home"
        },{
           headerValue: "RESULTS",
           columnClass: "data-column results-column",
           isNumericType: false,
           ignoreSort: true,
           key: "r"
         },{
           headerValue: "GAME SUMMARY",
           columnClass: "summary-column",
           ignoreSort: true,
           key: "gs"
         }];
      }else{ // for team page post game report table model
        this.columns = [{
           headerValue: "DATE",
           columnClass: "date-column",
           sortDirection: -1, //asc
           isNumericType: true,
           key: "date"
         },{
           headerValue: "TIME",
           columnClass: "date-column",
           ignoreSort: true,
           key: "t"
         },{
           headerValue: "OPPOSING TEAM",
           columnClass: "image-column location-column2",
           isNumericType: false,
           key: 'opp'
         },{
           headerValue: "RESULT", //changed name for clarity to match espn
           columnClass: "data-column wl-column",
           isNumericType: false,
           key: "wl"
           },{
           headerValue: "W/L", //changed name for clarity to match espn
           columnClass: "data-column record-column",
           isNumericType: true,
           key: "rec"
         },{
           headerValue: "GAME SUMMARY",
           columnClass: "summary-column",
           ignoreSort: true,
           key: "gs"
         }];
      }

    }

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
      this.selectedKey = this.rows[rowIndex].id;
    }
    else {
      this.selectedKey = null;
    }
  }

  isRowSelected(item:SchedulesData, rowIndex:number): boolean {
    return this.selectedKey == item.id;
  }

  getCellData(item:SchedulesData, column:TableColumn):CellData {
    var display = "";
    var sort: any = null;
    var link: Array<any> = null;
    var imageUrl: string = null;
    var isLocation = false;

    var hdrColumnKey = column.key;
    if ( column.key == "opp" ) {
        hdrColumnKey = this.curTeam == item.team1Id ? "away" : "home";
    }

    switch (hdrColumnKey) {
      case "date":
      let date320 = moment(Number(item.eventTimestamp)*1000).tz('America/New_York').format("MM/DD");
      let date640 = GlobalFunctions.formatDateWithAPMonth(Number(item.eventTimestamp)*1000, "", "D");
        display = "<span class='schedule-date-320'>" + date320 + "</span>" + "<span class='schedule-date-640'>" + date640 + "</span>";
        sort = Number(item.eventTimestamp)*1000;
        break;

      case "t":
        if(item.eventStatus != 'cancelled'){
          display = moment(Number(item.eventTimestamp)*1000).tz('America/New_York').format('h:mm') + " "+moment(Number(item.eventTimestamp)*1000).tz('America/New_York').format('A');
        }else{
          display = "Cancelled";
        }
        sort = Number(item.eventTimestamp)*1000;
        break;

      case "away":
        if(item.team2Name == null){
          item.team2Name = 'N/A';
        }
        if(item.team2Abbreviation == null){
          item.team2Abbreviation = 'N/A';
        }
        isLocation = true;
        display = item.team2Name.length > 10 && item.team2Name != null? item.team2Abbreviation : item.team2Name;
        sort = item.team2Name;
        imageUrl = GlobalSettings.getImageUrl(item.team2Logo);
        let awayFullTeamName = item.team2Market + ' ' + item.team2Name;
        if ( !this.isTeamProfilePage || this.curTeam != item.team2Id) {
          if(item.team2Id != null){
            link = VerticalGlobalFunctions.formatTeamRoute(awayFullTeamName, item.team2Id);
          }
        }
        break;
      case "home":
        if(item.team1Name == null){
          item.team1Market = 'N/A';
        }
        if(item.team1Abbreviation == null){
          item.team1Abbreviation = 'N/A';
        }
        isLocation = true;
        display = item.team1Name.length > 10 && item.team1Name != null ? item.team1Abbreviation : item.team1Name;
        sort = item.team1Name;
        imageUrl = GlobalSettings.getImageUrl(item.team1Logo);
        let homeFullTeamName = item.team1Market + ' ' + item.team1Name;
        if ( !this.isTeamProfilePage || this.curTeam != item.team1Id ) {
          if(item.team1Id != null){
            link = VerticalGlobalFunctions.formatTeamRoute(homeFullTeamName, item.team1Id);
          }
        }
        break;

      case "gs":
      var partnerCheck = GlobalSettings.getHomeInfo();
        if (item.eventStatus != 'cancelled' && item.team1Id != null && item.team2Id != null){
          var status = item.eventStatus === 'pregame' ? "Pregame" : (item.eventStatus === 'postgame' ? "Postgame" : null);
          if ( status ) {
            if(partnerCheck.isPartner){
              display = "<a href='" + '/' + partnerCheck.partnerName + item.aiUrlMod + "'>" + status + " Report <i class='fa fa-angle-right'><i></a>";
            }else{
              display = "<a href='" + item.aiUrlMod + "'>" + status + " Report <i class='fa fa-angle-right'><i></a>";
            }
          }
        }
        sort = item.eventStatus;
        break;

      case "r":
        if( !item.team1Abbreviation ) {
          item.team1Abbreviation = "N/A";
        }
        if( !item.team2Abbreviation ) {
          item.team2Abbreviation = "N/A";
        }
        item.team1Score = item.team1Score != null ? item.team1Score: 'N/A';
        item.team2Score = item.team2Score != null ? item.team2Score: 'N/A';
        //whomever wins the game then their text gets bolded as winner
        var home = item.team1Abbreviation + " " + item.team1Score;
        var away = item.team2Abbreviation + " " + item.team2Score;
        if(item.team1Outcome == 'W'){
          home = "<span class='text-heavy'>" + home + "</span>";
          sort = Number(item.team1Score) / Number(item.team2Score);
        } else if(item.team2Outcome == 'W'){
          away = "<span class='text-heavy'>" + away + "</span>";
          sort = (Number(item.team2Score) % Number(item.team1Score));
        }
        else {
          sort = (Number(item.team2Score) % Number(item.team1Score));
        }
        display = home + " - " + away;
        break;

      case "wl":
        //shows the current teams w/l of the current game
        var scoreHome = Number(item.team1Score);
        var scoreAway = Number(item.team2Score);

        item.team1Outcome = item.team1Outcome != null ? item.team1Outcome: '';
        display = item.team1Outcome + " " + scoreHome + " - " + scoreAway;
        sort = (scoreHome/(scoreAway));

        break;

      case "rec":
        //shows the record of the current teams game at that time
        if(item.targetTeam == item.team1Id){
          var currentWins = item.team1Record.split('-')[0];
          var currentLosses = item.team1Record.split('-')[1];
        }else{
          var currentWins = item.team2Record.split('-')[0];
          var currentLosses = item.team2Record.split('-')[1];
        }
        display = currentWins + " - " + currentLosses;
        sort = Number(currentWins)/Number(currentLosses);

        break;
    }
    if ( isLocation ) {
      display = "<span class='location-wrap'>"+display+"</span>";
    }
    else if ( display == null ) {
      display = "N/A";
    }

    return new CellData(display, sort, link, imageUrl);
  }
}
