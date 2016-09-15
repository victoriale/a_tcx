import {TableModel, TableColumn, CellData} from '../fe-core/components/custom-table/table-data.component';
import {CircleImageData} from '../fe-core/components/images/image-data';
import {TableTabData, TableComponentData} from '../fe-core/components/season-stats/season-stats.component';
import {SliderCarousel, SliderCarouselInput} from '../fe-core/components/carousels/slider-carousel/slider-carousel.component';
import {Season} from '../global/global-interface';
import {VerticalGlobalFunctions} from '../global/vertical-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';

export interface TeamInfo {
  teamName: string;
  teamId: string;
}
export interface PlayerInfo {
  playerName: string,
  playerFirstName: string,
  playerLastName: string,
  playerId: string;
  lastUpdate: string;
  teamName: string;
  teamId: string;
  backgroundUrl: string;
  playerHeadshot: string;
  teamLogo: string;
  position: string;
  statScope: string;
  teamMarket: string;
}

export interface TeamSeasonStatsData {
  teamInfo: TeamInfo;
  playerInfo: PlayerInfo;
  imageUrl: string,
  backgroundImage: string,
  conferenceName: string,
  divisionName: string,
  lastUpdated: string,
  rank: number,
  year: string,

  player_defense_assists: string,
  player_defense_sacks: string,
  player_defense_forced_fumbles: string,
  player_defense_total_tackles: string,
  player_defense_interceptions: string,
  player_defense_passes_defended: string,
  player_defense_passing_attempts: string,
  player_passing_attempts: string,
  player_passing_completions: string,

  player_passing_interceptions: string,
  player_passing_rating: string,
  player_passing_touchdowns: string,
  player_passing_yards: string,
  player_kicking_extra_points_made: string,
  player_kicking_field_goals_made: string,
  player_kicking_field_goal_attempts: string,
  player_kicking_field_goal_percentage_made: string,
  player_kicking_total_points_per_game: string,
  player_kicking_total_points_scored: string,
  player_punting_average: string,
  player_punting_gross_yards: string,
  player_punting_inside_twenty: string,
  player_punting_longest_punt: string,
  player_punting_net_average: string,
  player_punting_punts: string,
  player_rushing_yards_per_game: string,
  player_receiving_yards_per_game: string,

  seasonId: string,
  /**
   * - Formatted from league and year values that generated the associated table
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

export interface seasonStatsData {
  regularSeasonAverage: Array<TeamSeasonStatsData>;
  postSeasonAverage: Array<TeamSeasonStatsData>;
  regularSeasonTotal: Array<TeamSeasonStatsData>;
  postSeasonTotal: Array<TeamSeasonStatsData>;
}

export class MLBSeasonStatsTableData implements TableComponentData<TeamSeasonStatsData> {
  groupName: string;

  tableData: MLBSeasonStatsTableModel;

  season: any;

  year: number;

  constructor(title: string, season: Season, year: number, table: MLBSeasonStatsTableModel) {
    this.groupName = title;
    this.season = season;
    this.year = year;
    this.tableData = table;
  }

}

export class MLBSeasonStatsTabData implements TableTabData<TeamSeasonStatsData> {

  playerId: string;

  tabName: string;

  title: string;

  isActive: boolean;

  isLoaded: boolean;

  hasError: boolean;

  sections: Array<MLBSeasonStatsTableData>;

  season: Season;

  year: string;

  constructor(title: string, tabName: string, season: Season, year: string, isActive: boolean) {
    this.title = title;
    this.tabName = tabName;
    this.season = season;
    this.year = year;
    this.isActive = isActive;
  }

  getDescription(stats, position, playerRouteText, scope) {
    var description;
    switch(position) {
      case "QB":
      if (stats.player_passing_yards) {
          description = [playerRouteText, " has a total of ", Number(stats.player_passing_yards).toFixed(0) , " " , "Passing Yards" , " with " , Number(stats.player_passing_completions).toFixed(0)  , " " , "Completions" , " and " , Number(stats.player_passing_touchdowns).toFixed(0)  , " " , "Passing Touchdowns." ]
        }
        else {description = ["No Season Stats Data for this Season"]}
          break;
      case "CB":
      case "DB":
      case "DE":
      case "DL":
      case "DT":
      case "LB":
      case "S":
      if (stats.player_defense_assists) {
          description = [playerRouteText, " has a total of ", Number(stats.player_defense_assists).toFixed(0) , " " , "Assisted Tackles" , ", " , Number(stats.player_defense_total_tackles).toFixed(0)  , " " , "Total Tackles" , " and " , Number(stats.player_defense_sacks).toFixed(0)  , " " , "Total Sacks." ];
        }
        else {description = ["No Season Stats Data for this Season"]}
          break;
      case "C":
      case "G":
      case "LS":
      case "OL":
      case "OT":
      if (stats.player_passing_yards) {
          description = [playerRouteText, " has a total of ", Number(stats[0].stat).toFixed(0) , " " , "Games Played" , " with " , Number(stats[1].stat).toFixed(0)  , " " , "Games Started."];
        }
        else {description = ["No Season Stats Data for this Season"]}
          break;
      case "K":
      if (stats.player_kicking_field_goals_made) {
          description = [playerRouteText, " has a total of ", Number(stats.player_kicking_field_goals_made).toFixed(0) , " " , "Field Goals Made" , " with " , Number(stats.player_kicking_field_goal_attempts).toFixed(0)  , " " , "Attempts" , " and " , Number(stats.player_kicking_extra_points_made).toFixed(0)  , " " , "Extra Points Made." ];
        }
        else {description = ["No Season Stats Data for this Season"]}
          break;
      case "P":
      if (stats.player_punting_punts) {
          description = [playerRouteText, " has ", Number(stats.player_punting_punts).toFixed(0) , " " , "Total Punts" , " with " , Number(stats.player_punting_gross_yards).toFixed(0)  , " " , "Gross Punting Yards." , " His Longest Punt was " , Number(stats.player_punting_longest_punt).toFixed(0)  , " Yards. "];
        }
        else {description = ["No Season Stats Data for this Season"]}
          break;
      case "RB":
      if (stats.player_rushing_yards_per_game) {
          description = [playerRouteText, " has a total of ", Number(stats.player_rushing_yards_per_game).toFixed(0) , " " , "Rushing Yards" , " with " , Number(stats.player_rushing_yards_per_carry
).toFixed(0)  , " " , "Average Yards Per Carry" , " and " , Number(stats.player_rushing_attempts).toFixed(0)  , " " , "Attempts." ];
        }
        else {description = ["No Season Stats Data for this Season"]}
          break;
      case "RS":
      if (stats.player_passing_yards) {
          description = [playerRouteText, " has a total of ", Number(stats[0].stat).toFixed(0) , " " , stats[0].statType , " with " , Number(stats[1].stat).toFixed(0)  , " " , stats[1].statType , " and " , Number(stats[2].stat).toFixed(0)  , " " , stats[2].statType+"." ];
        }
        else {description = ["No Season Stats Data for this Season"]}
          break;
      case "TE":
      case "WR":
      if (stats.player_receiving_yards_per_game) {
          description = [playerRouteText, " has a total of ", Number(stats.player_receiving_yards_per_game).toFixed(0) , " " , "Recieving Yards", " with " , Number(stats[1].stat).toFixed(0)  , " " , "Average Yards Per Reception" , " and " , Number(stats[2].stat).toFixed(0)  , " " , "Receptions." ];
        }
        else {description = ["No Season Stats Data for this Season"]}
          break;
      default:
          description = [playerRouteText, " has a total of ", Number(stats[0].stat).toFixed(0) , " " , stats[0].statType , " with " , Number(stats[1].stat).toFixed(0)  , " " , stats[1].statType, " and " , Number(stats[2].stat).toFixed(0)  , " " , stats[2].statType+"." ];
      }
    return description;
  }

  convertToCarouselItem(item: TeamSeasonStatsData, index:number): SliderCarouselInput {
    var playerData = item.playerInfo != null ? item.playerInfo : null;
    var playerRoute = VerticalGlobalFunctions.formatPlayerRoute(playerData.teamName,playerData.playerName,playerData.playerId.toString());
    var playerRouteText = {
      route: playerRoute,
      text: playerData.playerFirstName + " " + playerData.playerLastName
    }
    var teamRoute = VerticalGlobalFunctions.formatTeamRoute(playerData.teamName, playerData.teamId);
    var teamRouteText = {
      route: teamRoute,
      text: playerData.teamName,
      class: 'text-heavy'
    }
    var description: any = ["No Information for this season"];
      description = this.getDescription(item, playerData.position, playerRouteText, playerData.statScope);

    return SliderCarousel.convertToCarouselItemType1(index, {
      backgroundImage: VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(playerData.backgroundUrl),
      copyrightInfo: GlobalSettings.getCopyrightInfo(),
      subheader: [item.seasonId + " Season Stats Report"],
      profileNameLink: playerRouteText,
      description: description,
      lastUpdatedDate: GlobalFunctions.formatUpdatedDate(playerData.lastUpdate),
      circleImageUrl: GlobalSettings.getImageUrl(playerData.playerHeadshot),
      circleImageRoute: playerRoute
      // subImageUrl: GlobalSettings.getImageUrl(playerData.teamLogo),
      // subImageRoute: teamRoute
    });
  }
}

export class MLBSeasonStatsTableModel implements TableModel<TeamSeasonStatsData> {
  columns: Array<TableColumn>;
  rows: Array<TeamSeasonStatsData>;
  selectedKey: string = "";
  isPitcher: boolean;

  constructor(rows: Array<TeamSeasonStatsData>, isPitcher: boolean){
    this.rows = rows;
    if ( this.rows === undefined || this.rows === null ) {
      this.rows = [];
    }
    else if ( rows.length > 0 ) {
      // this.selectedKey = rows[0].playerId;
    }
    switch(this.rows[0]['playerInfo'].position) {
      case "CB":
      case "DB":
      case "DE":
      case "DL":
      case "DT":
      case "LB":
      case "S":
    this.columns = [{
      headerValue: "Year",
      columnClass: "date-column",
      isNumericType: true,
      key: "year"
    },{
      headerValue: "Team",
      columnClass: "image-column",
      isNumericType: false,
      key: "team"
    },{
      headerValue: "AST",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_defense_assists"
    },{
      headerValue: "SACK",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_defense_sacks"
    },{
      headerValue: "FF",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_defense_forced_fumbles"
    },{
      headerValue: "TOTAL",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_defense_total_tackles"
    },{
      headerValue: "INT",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_defense_interceptions"
    },{
      headerValue: "PD",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_defense_passes_defended"
    }]
        break;
    case "K":
    this.columns = [{
      headerValue: "Year",
      columnClass: "date-column",
      isNumericType: true,
      key: "year"
    },{
      headerValue: "Team",
      columnClass: "image-column",
      isNumericType: false,
      key: "team"
    },{
      headerValue: "FGM",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_kicking_field_goals_made"
    },{
      headerValue: "FGA",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_kicking_field_goal_attempts"
    },{
      headerValue: "XPM",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_kicking_extra_points_made"
    },{
      headerValue: "FG%",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_kicking_field_goal_percentage_made"
    },{
      headerValue: "PTS",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_kicking_total_points_scored"
    },{
      headerValue: "PTS/G",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_kicking_total_points_per_game"
    }]
        break;
    case "P":
    this.columns = [{
      headerValue: "Year",
      columnClass: "date-column",
      isNumericType: true,
      key: "year"
    },{
      headerValue: "Team",
      columnClass: "image-column",
      isNumericType: false,
      key: "team"
    },{
      headerValue: "PUNTS",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_punting_punts"
    },{
      headerValue: "YDS",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_punting_gross_yards"
    },{
      headerValue: "LNG",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_punting_longest_punt"
    },{
      headerValue: "AVG",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_punting_average"
    },{
      headerValue: "NET",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_punting_net_average"
    },{
      headerValue: "IN20",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_punting_inside_twenty"
    }]
        break;
    case "RB":
    this.columns = [{
      headerValue: "Year",
      columnClass: "date-column",
      isNumericType: true,
      key: "year"
    },{
      headerValue: "Team",
      columnClass: "image-column",
      isNumericType: false,
      key: "team"
    },{
      headerValue: "YDS",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_rushing_yards_per_game"
    },{
      headerValue: "AVG",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_defense_sacks"
    },{
      headerValue: "ATT",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_defense_forced_fumbles"
    },{
      headerValue: "TD",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_defense_total_tackles"
    },{
      headerValue: "YDS/G",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_defense_interceptions"
    },{
      headerValue: "FUM",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_defense_passes_defended"
    }]
        break;
    case "QB":
    this.columns = [{
      headerValue: "Year",
      columnClass: "date-column",
      isNumericType: true,
      key: "year"
    },{
      headerValue: "Team",
      columnClass: "image-column",
      isNumericType: false,
      key: "team"
    },{
      headerValue: "YDS",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_passing_yards"
    },{
      headerValue: "COMP",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_passing_completions"
    },{
      headerValue: "ATT",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_passing_attempts"
    },{
      headerValue: "TD",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_passing_touchdowns"
    },{
      headerValue: "INT",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_passing_interceptions"
    },{
      headerValue: "RATE",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_passing_rating"
    }]
        break;
    case "TE":
    case "WR":
    this.columns = [{
      headerValue: "Year",
      columnClass: "date-column",
      isNumericType: true,
      key: "year"
    },{
      headerValue: "Team",
      columnClass: "image-column",
      isNumericType: false,
      key: "team"
    },{
      headerValue: "YDS",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_defense_assists"
    },{
      headerValue: "AVG",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_defense_sacks"
    },{
      headerValue: "REC",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_defense_forced_fumbles"
    },{
      headerValue: "TAR",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_defense_total_tackles"
    },{
      headerValue: "TD",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_defense_interceptions"
    },{
      headerValue: "YDS/G",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_receiving_yards_per_game"
    }]
        break;
    default:
    this.columns = [{
      headerValue: "Year",
      columnClass: "date-column",
      isNumericType: true,
      key: "year"
    },{
      headerValue: "Team",
      columnClass: "image-column",
      isNumericType: false,
      key: "team"
    },{
      headerValue: "AST",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_defense_assists"
    },{
      headerValue: "SACK",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_defense_sacks"
    },{
      headerValue: "FF",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_defense_forced_fumbles"
    },{
      headerValue: "TOTAL",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_defense_total_tackles"
    },{
      headerValue: "INT",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_defense_interceptions"
    },{
      headerValue: "PD",
      columnClass: "data-column",
      isNumericType: true,
      key: "player_defense_passes_defended"
    }]
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
      this.selectedKey = this.rows[rowIndex].playerInfo.playerId;
    }
    else {
      this.selectedKey = null;
    }
  }

  isRowSelected(item:TeamSeasonStatsData, rowIndex:number): boolean {
    return null;
  }

  getCellData(item:TeamSeasonStatsData, column:TableColumn):CellData {
    var display = "";
    var sort = null;
    var link = undefined;
    var isTotalColumn = item['sectionStat'] != null;

    switch (column.key) {
      case "year":
      if(item.seasonId != null && item.seasonId != "") {
        display = (Number(item.seasonId.slice(-2)) + 1).toString() + " / " + item.seasonId.slice(-2);
      }
      else {
        display = "N/A";
      }
        sort = item.seasonId;
        break;

      case "team":
        if ( isTotalColumn ) {
          display = (item['sectionStat'] == "Average" ? "Total Average" : "Total").toUpperCase() + ":";
        }
        else {
          display = item.playerInfo.teamMarket + " " + item.playerInfo.teamName;
          link = VerticalGlobalFunctions.formatTeamRoute(item.playerInfo.teamName,item.playerInfo.teamId);
        }
        sort = item.playerInfo.teamName;
        break;

      case "player_defense_assists":
        display = item.player_defense_assists != null ? Number(item.player_defense_assists).toFixed(0) : null;
        sort = Number(item.player_defense_assists);
        break;

      case "player_defense_sacks":
        display = item.player_defense_sacks != null ? Number(item.player_defense_sacks).toFixed(0) : null;
        sort = Number(item.player_defense_sacks);
        break;

      case "player_defense_forced_fumbles":
        display = item.player_defense_forced_fumbles != null ? Number(item.player_defense_forced_fumbles).toFixed(0) : null;
        sort = Number(item.player_defense_forced_fumbles);
        break;

      case "player_defense_total_tackles":
        display = item.player_defense_total_tackles != null ? Number(item.player_defense_total_tackles).toFixed(0) : null;
        sort = Number(item.player_defense_total_tackles);
        break;

      case "player_defense_interceptions":
        display = item.player_defense_interceptions != null ? Number(item.player_defense_interceptions).toFixed(0) : null;
        sort = Number(item.player_defense_interceptions);
        break;

      case "player_defense_passes_defended":
        display = item.player_defense_passes_defended != null ? Number(item.player_defense_passes_defended).toFixed(0) : null;
        sort = Number(item.player_defense_passes_defended);
        break;

      case "player_passing_attempts":
        display = item.player_passing_attempts != null ? Number(item.player_passing_attempts).toFixed(0) : null;
        sort = Number(item.player_passing_attempts);
        break;

      case "player_passing_completions":
        display = item.player_passing_completions != null ? Number(item.player_passing_completions).toFixed(0) : null;
        sort = Number(item.player_passing_completions);
      break;

      case "player_passing_interceptions":
        display = item.player_passing_interceptions != null ? Number(item.player_passing_interceptions).toFixed(0) : null;
        sort = Number(item.player_passing_interceptions);
        break;

      case "player_passing_rating":
        display = item.player_passing_rating != null ? Number(item.player_passing_rating).toFixed(0) : null;
        sort = Number(item.player_passing_rating);
        break;

      case "player_passing_touchdowns":
        display = item.player_passing_touchdowns != null ? Number(item.player_passing_touchdowns).toFixed(2) : null;
        sort = Number(item.player_passing_touchdowns);
        break;

      case "player_passing_yards":
        display = item.player_passing_yards != null ? Number(item.player_passing_yards).toFixed(0) : null;
        sort = Number(item.player_passing_yards);
        break;

      case "player_kicking_extra_points_made":
        display = item.player_kicking_extra_points_made != null ? Number(item.player_kicking_extra_points_made).toFixed(2) : null;
        sort = Number(item.player_kicking_extra_points_made);
        break;

      case "player_kicking_field_goals_made":
        display = item.player_kicking_field_goals_made != null ? Number(item.player_kicking_field_goals_made).toFixed(2) : null;
        sort = Number(item.player_kicking_field_goals_made);
        break;

      case "player_kicking_field_goal_attempts":
        display = item.player_kicking_field_goal_attempts != null ? Number(item.player_kicking_field_goal_attempts).toFixed(2) : null;
        sort = Number(item.player_kicking_field_goal_attempts);
        break;
      case "player_kicking_field_goal_percentage_made":
        display = item.player_kicking_field_goal_percentage_made != null ? Number(item.player_kicking_field_goal_percentage_made).toFixed(2) : null;
        sort = Number(item.player_kicking_field_goal_percentage_made);
        break;
      case "player_kicking_total_points_per_game":
        display = item.player_kicking_total_points_per_game != null ? Number(item.player_kicking_total_points_per_game).toFixed(2) : null;
        sort = Number(item.player_kicking_total_points_per_game);
        break;
      case "player_kicking_total_points_scored":
        display = item.player_kicking_total_points_scored != null ? Number(item.player_kicking_total_points_scored).toFixed(2) : null;
        sort = Number(item.player_kicking_total_points_scored);
        break;
      case "player_punting_average":
        display = item.player_punting_average != null ? Number(item.player_punting_average).toFixed(2) : null;
        sort = Number(item.player_punting_average);
        break;
      case "player_punting_gross_yards":
        display = item.player_punting_gross_yards != null ? Number(item.player_punting_gross_yards).toFixed(2) : null;
        sort = Number(item.player_punting_gross_yards);
        break;
      case "player_punting_inside_twenty":
        display = item.player_punting_inside_twenty != null ? Number(item.player_punting_inside_twenty).toFixed(2) : null;
        sort = Number(item.player_punting_inside_twenty);
        break;
      case "player_punting_longest_punt":
        display = item.player_punting_longest_punt != null ? Number(item.player_punting_longest_punt).toFixed(2) : null;
        sort = Number(item.player_punting_longest_punt);
        break;
      case "player_punting_net_average":
        display = item.player_punting_net_average != null ? Number(item.player_punting_net_average).toFixed(2) : null;
        sort = Number(item.player_punting_net_average);
        break;
      case "player_punting_punts":
        display = item.player_punting_punts != null ? Number(item.player_punting_punts).toFixed(2) : null;
        sort = Number(item.player_punting_punts);
        break;
      case "player_rushing_yards_per_game":
        display = item.player_rushing_yards_per_game != null ? Number(item.player_rushing_yards_per_game).toFixed(2) : null;
        sort = Number(item.player_rushing_yards_per_game);
        break;
      case "player_receiving_yards_per_game":
        display = item.player_receiving_yards_per_game != null ? Number(item.player_receiving_yards_per_game).toFixed(2) : null;
        sort = Number(item.player_receiving_yards_per_game);
        break;
    }
    display = display != null ? display : "N/A";
    if ( isTotalColumn ) {
      sort = null; // don't sort total column
    }
    return new CellData(display, sort, link);
  }
}
