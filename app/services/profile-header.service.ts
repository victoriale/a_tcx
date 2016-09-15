import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http} from '@angular/http';

import {Router, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {GlobalSettings} from '../global/global-settings';
import {GlobalFunctions} from '../global/global-functions';
import {VerticalGlobalFunctions} from '../global/vertical-global-functions';
import {DataItem, ProfileHeaderData} from '../fe-core/modules/profile-header/profile-header.module';
import {TitleInputData} from '../fe-core/components/title/title.component';
import {Division, Conference, SportPageParameters} from '../global/global-interface';

declare var moment: any;

export interface IProfileData {
  profileName: string;
  profileId: string;
  profileType: string; // for MLB, this is 'team', 'player', or 'league'
}

interface PlayerProfileData extends IProfileData {
  pageParams: SportPageParameters;
  fullProfileImageUrl: string;
  fullBackgroundImageUrl: string;
  headerData: PlayerProfileHeaderData
}

interface PlayerProfileHeaderData {
  // Basic Info
    id: string;
    playerId: number;
    playerFirstName: string;
    playerLastName: string;
    playerFullName: string;
    playerBirthCity: string;
    playerBirthState: string;
    playerBirthCountry: string;
    teamId: number;
    teamMarket: string;
    teamName: string;
    teamFullName: string;
    jerseyNumber: number;
    position: Array<string>;
    gamesPlayed: number;
    gamesStarted: number;
    experience: number;
    entryDate?: string;
    age: number;
    dob: string;
    height: string;
    weight: number;
    playerHeadshotUrl?: string;
    backgroundUrl?: string;
    profileHeaderUrl?: string;
    seasonId: string;
    lastUpdated: string;
    description: string;

    //NCAA specific
    class?: string;
    draftYear?: string;
    draftTeam?: string;

  //Stats
    stat1: any;
    stat1Type: string;
    stat1Desc: string;
    stat2: any;
    stat2Type: string;
    stat2Desc: string;
    stat3: any;
    stat3Type: string;
    stat3Desc: string;
    stat4: any;
    stat4Type: string;
    stat4Desc: string;
}

interface TeamProfileData extends IProfileData {
  pageParams: SportPageParameters;
  fullProfileImageUrl: string;
  fullBackgroundImageUrl: string;
  headerData: TeamProfileHeaderData;
  /**
   * @deprecated use profileName instead
   */
  teamName: string; //same as profileName
}

interface TeamProfileHeaderData {
    id: number;
    teamId: number;
    teamMarket: string;
    teamName: string;
    teamCity: string;
    teamState: string;
    divisionName: Division;
    conferenceName: Conference;
    venueName: string;
    rank: number;
    divWins?: number;
    divLosses?: number;
    divRecord: string;
    totalWins?: number;
    totalLosses?: number;
    leagueRecord: string;
    pointsPerGame: number;
    pointsPerGameRank: number;
    passingYardsPerGame: number;
    passingYardsPerGameRank: number;
    rushingYardsPerGame: number;
    rushingYardsPerGameRank: number;
    backgroundUrl?: string;
    profileHeaderUrl?: string;
    teamLogo: string;
    profileImage: string; //todo - missing
    seasonId: string;
    lastUpdated: string;
}

interface LeagueProfileData extends IProfileData {
  headerData: LeagueProfileHeaderData;
}

interface LeagueProfileHeaderData {
  id: string;
  leagueFullName: string;
  leagueAbbreviatedName?: string; //todo - null
  leagueCity: string;
  leagueState: string;
  leagueFounded: string;
  totalTeams: number;
  totalPlayers: number;
  totalDivisions: number;
  totalConferences: number;
  backgroundUrl: string;
  profileHeaderUrl?: string;
  leagueLogo: string;
  aiDescriptionId: string;
  seasonId: string;
  lastUpdated: string;
}

@Injectable()
export class ProfileHeaderService {

  public sportLeagueAbbrv: string = GlobalSettings.getSportLeagueAbbrv();
  public collegeDivisionAbbrv: string = GlobalSettings.getCollegeDivisionAbbrv();
  public scope: string;

  constructor(public http: Http, private _router:Router){
    GlobalSettings.getParentParams(_router, parentParams =>
      this.scope = parentParams.scope
    );
  }

  getPlayerProfile(playerId: number): Observable<PlayerProfileData> {
    let url = GlobalSettings.getApiUrl();
    url = url + '/profileHeader/player/' + playerId;

    return this.http.get(url)
        .map(res => res.json())
        .map(data => {
          var headerData: PlayerProfileHeaderData = data.data[0];

          if (!headerData) {
            return null;
          }

          return {
            pageParams: {
              teamId: headerData.teamId,
              teamName: headerData.teamFullName,
              playerId: headerData.playerId,
              playerName: headerData.playerFullName
            },
            fullBackgroundImageUrl: VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(headerData.profileHeaderUrl),
            fullProfileImageUrl: GlobalSettings.getImageUrl(headerData.playerHeadshotUrl),
            headerData: headerData,
            profileName: headerData.playerFullName,
            profileId: headerData.playerId.toString(),
            profileType: "player"
          };
        });
  } //getPlayerProfile

  getTeamProfile(teamId: number): Observable<TeamProfileData> {
    let url = GlobalSettings.getApiUrl();
    url = url + '/profileHeader/team/' + teamId;

    return this.http.get(url)
        .map(res => res.json())
        .map(data => {
          var headerData: TeamProfileHeaderData = data.data[0];

          return {
            pageParams: {
              teamId: headerData.teamId,
              teamName: headerData.teamName,
              division: headerData.divisionName,
              conference: headerData.conferenceName,
            },
            fullBackgroundImageUrl: VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(headerData.profileHeaderUrl),
            fullProfileImageUrl: GlobalSettings.getImageUrl(headerData.teamLogo),
            headerData: headerData,
            teamName: headerData.teamName,
            profileName: headerData.teamName,
            profileId: headerData.teamId.toString(),
            profileType: "team"
          };
        });
  } //getTeamProfile

  getLeagueProfile(scope?): Observable<LeagueProfileData> {
    let url = GlobalSettings.getApiUrl();
    url = url + '/profileHeader/league/' + scope;

    return this.http.get(url)
        .map(res => res.json())
        .map(data => {
          var headerData: LeagueProfileHeaderData = data.data[0];

          return {
            headerData: headerData,
            profileName: headerData.leagueFullName, //todo - should be short name
            profileId: null,
            profileType: "league"
          };
        });
  } //getLeagueProfile

  convertTeamPageHeader(data: TeamProfileData, pageName:string): TitleInputData {
    if(typeof pageName == 'undefined'){
      pageName = '';
    }

    var teamId = data.pageParams.teamId ? data.pageParams.teamId : null;
    return {
      imageURL: '', //TODO
      imageRoute: VerticalGlobalFunctions.formatTeamRoute(data.teamName, teamId.toString() ),
      text1: 'Last Updated:' + GlobalFunctions.formatUpdatedDate(data.headerData.lastUpdated),
      text2: 'United States',
      text3: pageName,
      icon: 'fa fa-map-marker'
    };
  } //convertTeamPageHeader

  convertLeagueHeader(data: LeagueProfileHeaderData, pageName:string): TitleInputData {
    return {
      imageURL: GlobalSettings.getImageUrl(data.leagueLogo), //TODO
      imageRoute: ["League-page"],
      text1: 'Last Updated:' + GlobalFunctions.formatUpdatedDate(data.lastUpdated),
      text2: 'United States',
      text3: pageName,
      icon: 'fa fa-map-marker'
    };
  } //convertLeagueHeader

  convertToPlayerProfileHeader(data: PlayerProfileData): ProfileHeaderData {
    if (!data.headerData) {
      return null;
    }
    var headerData = data.headerData;

    var fullTeamName = headerData.teamMarket+' '+headerData.teamName;

    var formattedYearsInLeague = headerData.experience ? headerData.experience.toString() : "N/A";
    var firstSentence = "";
    var yearPluralStr = "years";

    var formattedAge = headerData.age ? headerData.age.toString() : "N/A";
    var formattedHeight = headerData.height ? VerticalGlobalFunctions.formatHeightInchesWithFoot(headerData.height) : "N/A"; //[6-foot-11]
    var formattedWeight = headerData.weight ? headerData.weight.toString() : "N/A";
    var formattedBirthDate = "N/A"; //[October] [3], [1991]
    if ( headerData.dob ) {
      var date = moment(headerData.dob);
      formattedBirthDate = GlobalFunctions.formatAPMonth(date.month()) + date.format(" D, YYYY");
    }
    var formattedBirthlocation = "N/A"; //[Wichita], [Kan.]
    if ( headerData.playerBirthCity && headerData.playerBirthState ) {
      formattedBirthlocation = headerData.playerBirthCity + ", " + headerData.playerBirthState;
    }

    var formattedExperience = "N/A";
    if ( headerData.experience == 1 ) {
      formattedExperience = headerData.experience + " year"
    }
    else {
      formattedExperience = headerData.experience + " years"
    }

    var description;
    //NCAA - specific data points for NCAA
    if ( this.scope != this.sportLeagueAbbrv.toLowerCase() ) {
      description = headerData.playerFullName + " a " +
                    headerData.class + " " +
                    headerData.position + " for the " +
                    fullTeamName + " is No. " +
                    headerData.jerseyNumber;

                    if (formattedHeight != "N/A") {
                        description = description + " and stands at " +
                        formattedHeight + " ";
                    }
                    if ( formattedWeight != "N/A" ) {
                      description = description + " and weighs in at " + formattedWeight + " pounds";
                    }
                    description = description + ".";

      var header: ProfileHeaderData = {
        profileName: headerData.playerFullName,
        profileImageUrl: GlobalSettings.getImageUrl(headerData.playerHeadshotUrl),
        backgroundImageUrl: VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(headerData.profileHeaderUrl),
        profileTitleFirstPart: headerData.playerFullName, // not seperated by first and last so entire name is bold,
        profileTitleLastPart: '',
        lastUpdatedDate: headerData.lastUpdated,
        description: description,
        topDataPoints: [
          {
            label: "Team",
            value: headerData.teamFullName,
            routerLink: VerticalGlobalFunctions.formatTeamRoute(headerData.teamFullName, headerData.teamId.toString())
          },
          {
            label: "Jersey Number",
            value: headerData.jerseyNumber ? '#'+headerData.jerseyNumber.toString() : null
          },
          {
            label: "Position",
            value: headerData.position ? headerData.position.toString() : null //todo
          }
        ],
        bottomDataPoints: [
          {
            label: headerData.stat1Type,
            labelCont: headerData.stat1Desc,
            value: headerData.stat1 ? GlobalFunctions.commaSeparateNumber( GlobalFunctions.roundToDecimal(headerData.stat1) ) : null
          },
          {
            label: headerData.stat2Type,
            labelCont: headerData.stat2Desc,
            value: headerData.stat2 ? GlobalFunctions.commaSeparateNumber( GlobalFunctions.roundToDecimal(headerData.stat2) ) : null
          },
          {
            label: headerData.stat3Type,
            labelCont: VerticalGlobalFunctions.nonRankedDataPoints(headerData.position, headerData.stat3Desc),
            value: headerData.stat3 ? VerticalGlobalFunctions.formatHeightInchesWithTicks(headerData.stat3).toString() : null
          },
          {
            label: headerData.stat4Type,
            labelCont: VerticalGlobalFunctions.nonRankedDataPoints(headerData.position, headerData.stat4Desc),
            value: headerData.stat4 ? GlobalFunctions.commaSeparateNumber(headerData.stat4).toString() : null
          }
        ]
      } //var header: ProfileHeaderData = {
    }
    //PRO
    else {
      description = headerData.playerFullName + " started his " +
                    this.sportLeagueAbbrv + " careers on " +
                    headerData.entryDate + " for the " +
                    fullTeamName + " accumulating " +
                    formattedExperience + " in the " +
                    this.sportLeagueAbbrv + ". " +
                    headerData.playerFirstName + " was born in " +
                    formattedBirthlocation + " on " +
                    formattedBirthDate + " and is " +
                    formattedAge;

                    if (formattedHeight != "N/A") {
                      description = description + ", with a height of " + formattedHeight;
                    }
                    if ( formattedWeight != "N/A" ) {
                      description = description + " and weighing in at " + formattedWeight + " pounds";
                    }
                    description = description + ".";

      var header: ProfileHeaderData = {
        profileName: headerData.playerFullName,
        profileImageUrl: GlobalSettings.getImageUrl(headerData.playerHeadshotUrl),
        backgroundImageUrl: VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(headerData.profileHeaderUrl),
        profileTitleFirstPart: headerData.playerFullName, // not seperated by first and last so entire name is bold,
        profileTitleLastPart: '',
        lastUpdatedDate: headerData.lastUpdated,
        description: description,
        topDataPoints: [
          {
            label: "Team",
            value: headerData.teamFullName,
            routerLink: VerticalGlobalFunctions.formatTeamRoute(headerData.teamFullName, headerData.teamId.toString())
          },
          {
            label: "Jersey Number",
            value: headerData.jerseyNumber ? '#'+headerData.jerseyNumber.toString() : null
          },
          {
            label: "Position",
            value: headerData.position ? headerData.position.toString() : null //todo
          }
        ],
        bottomDataPoints: [
          {
            label: headerData.stat1Type,
            labelCont: headerData.stat1Desc,
            value: headerData.stat1 ? GlobalFunctions.commaSeparateNumber( GlobalFunctions.roundToDecimal(headerData.stat1) ) : null
          },
          {
            label: headerData.stat2Type,
            labelCont: headerData.stat2Desc,
            value: headerData.stat2 ?  GlobalFunctions.commaSeparateNumber( GlobalFunctions.roundToDecimal(headerData.stat2) ) : null
          },
          {
            label: headerData.stat3Type,
            labelCont: VerticalGlobalFunctions.nonRankedDataPoints(headerData.position, headerData.stat3Desc),
            value: headerData.stat3 ? GlobalFunctions.commaSeparateNumber(headerData.stat3).toString() : null
          },
          {
            label: headerData.stat4Type,
            labelCont: VerticalGlobalFunctions.nonRankedDataPoints(headerData.position, headerData.stat4Desc),
            value: headerData.stat4 ? GlobalFunctions.commaSeparateNumber(headerData.stat4).toString() : null
          }
        ]
      } //var header: ProfileHeaderData = {
    }

    return header;
  } //convertToPlayerProfileHeader

  convertToTeamProfileHeader(data: TeamProfileData): ProfileHeaderData {
    var headerData = data.headerData;

    var fullTeamName = headerData.teamMarket+' '+headerData.teamName;

    //The [Atlanta Braves] play in [Turner Field] located in [Atlanta, GA]. The [Atlanta Braves] are part of the [NL East].
    var location = "N/A";
    if ( headerData.teamCity && headerData.teamState ) {
      location = headerData.teamCity + ", " + headerData.teamState;
    }
    var venueForDescription = headerData.venueName ? " play in " + headerData.venueName : ' ';

    var description = "The " + fullTeamName + ", " +
                      venueForDescription +
                      " located in " + location + ", " +
                      " are part of the " + headerData.divisionName +
                       ".";

    var header: ProfileHeaderData = {
      profileName: fullTeamName,
      profileImageUrl: GlobalSettings.getImageUrl(headerData.teamLogo),
      backgroundImageUrl: VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(headerData.profileHeaderUrl),
      profileTitleFirstPart: headerData.teamMarket,
      profileTitleLastPart: headerData.teamName,
      lastUpdatedDate: headerData.lastUpdated,
      description: description,
      topDataPoints: [
        {
          label: "Division",
          value: headerData.divisionName ? headerData.divisionName.toString() : null
        },
        {
          label: "Rank",
          value: headerData.rank ? headerData.rank.toString() : null
        }
      ],
      bottomDataPoints: [
        {
          label: "Wins/losses",
          labelCont: "for the current season",
          value: headerData.leagueRecord
        },
        {
          label: "Average Points Per Game",
          labelCont: "Ranked "+headerData.pointsPerGameRank+GlobalFunctions.Suffix(headerData.pointsPerGameRank),
          value: headerData.pointsPerGame ? GlobalFunctions.commaSeparateNumber(headerData.pointsPerGame).toString() : null
        },
        {
          label: "Passing Yards Per Game",
          labelCont: "Ranked "+headerData.passingYardsPerGameRank+GlobalFunctions.Suffix(headerData.passingYardsPerGameRank),
          value: headerData.passingYardsPerGame ? GlobalFunctions.commaSeparateNumber(headerData.passingYardsPerGame).toString() : null
        },
        {
          label: "Rushing Yards per Game",
          labelCont: "Ranked "+headerData.rushingYardsPerGameRank+GlobalFunctions.Suffix(headerData.rushingYardsPerGameRank),
          value: headerData.rushingYardsPerGame ? GlobalFunctions.commaSeparateNumber(headerData.rushingYardsPerGame).toString() : null
        }
      ]
    }
    return header;
  } //convertToTeamProfileHeader

  convertToLeagueProfileHeader(data: LeagueProfileHeaderData): ProfileHeaderData {
    //remove when abbreviated league name is in the data
    let leagueAbbreviatedName;
    if ( data.leagueFullName == 'National Football League' ) {
        leagueAbbreviatedName = 'NFL';
    }
    else if ( data.leagueFullName == 'NCAA Football Bowl Subdivision' ) {
      leagueAbbreviatedName = 'NCAAF';
    }

    //The MLB consists of [30] teams and [####] players. These teams and players are divided across [two] leagues and [six] divisions.
    var location = "N/A";
    if ( data.leagueCity && data.leagueState ) {
      location = data.leagueCity + ", " + data.leagueState;
    }

    var description = "The "+leagueAbbreviatedName+" consists of " + GlobalFunctions.formatNumber(data.totalTeams) +
                      " teams and " + GlobalFunctions.commaSeparateNumber(data.totalPlayers) + " players. " +
                      "These teams and players are divided across " + GlobalFunctions.formatNumber(data.totalConferences) +
                      " conferences and " + GlobalFunctions.formatNumber(data.totalDivisions) + " divisions.";

    var header: ProfileHeaderData = {
      profileName: leagueAbbreviatedName,
      profileImageUrl: GlobalSettings.getImageUrl(data.leagueLogo),
      backgroundImageUrl: VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(data.profileHeaderUrl),
      profileTitleFirstPart: "",
      //profileTitleLastPart: data.leagueAbbreviatedName, //todo when correct API is set
      profileTitleLastPart: data.leagueFullName,
      lastUpdatedDate: data.lastUpdated,
      description: description,
      topDataPoints: [
        {
          label: "League Headquarters",
          value: location
        },
        {
          label: "Founded In",
          value: data.leagueFounded
        }
      ],
      bottomDataPoints: [
        {
          label: "Total Teams:",
          value: data.totalTeams != null ? data.totalTeams.toString() : null
        },
        {
          label: "Total Players:",
          value: data.totalPlayers != null ? GlobalFunctions.commaSeparateNumber(data.totalPlayers).toString() : null
        },
        {
          label: "Total Divisions:",
          value: data.totalDivisions != null ? data.totalDivisions.toString() : null
        },
        {
          label: "Total Conferences:",
          value: data.totalConferences != null ? data.totalConferences.toString() : null
        }
      ]
    }
    return header;
  } //convertToLeagueProfileHeader
}
