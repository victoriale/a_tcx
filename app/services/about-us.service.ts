import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http} from '@angular/http';

import {TitleInputData} from "../fe-core/components/title/title.component";
import {GlobalFunctions} from "../global/global-functions";
import {GlobalSettings} from "../global/global-settings";
import {VerticalGlobalFunctions} from "../global/vertical-global-functions";
import {AuBlockData, AboutUsModel} from "../webpages/about-us-page/about-us.page";

export interface AboutUsInterface {
    numTeams: number;
    divisionScope: string;
    numPlayers: number;
    numDivisions: number;
    championshipYear: number;
    championshipTeamId: string;
    championshipTeamMarket: string;
    championshipTeamName: string;
    imageUrl: string;
    championshipTeamLink: string;
    lastUpdated: string;
}

declare var moment;
@Injectable()
export class AboutUsService {

  public siteName: any = GlobalSettings.getBaseTitle();

  public sportLeagueAbbrv: string = GlobalSettings.getSportLeagueAbbrv();
  public sportLeagueChampionship: string = GlobalSettings.getSportLeagueChampionship();
  public sportLeagueSegments: string = GlobalSettings.getSportLeagueSegments();

  public collegeDivisionAbbrv: string = GlobalSettings.getCollegeDivisionAbbrv();
  public collegeDivisionFullAbbrv: string = GlobalSettings.getCollegeDivisionFullAbbrv();
  public collegeDivisionChampionship: string = GlobalSettings.getCollegeDivisionChampionship();
  public collegeDivisionSegments: string = GlobalSettings.getCollegeDivisionSegments();

  constructor(public http: Http){}

  getData(partnerID: string, scope: string): Observable<AboutUsModel> {
    let url = GlobalSettings.getApiUrl() + "/aboutUs/" + scope.toLowerCase();

    return this.http.get(url)
      .map( res => res.json() )
      .map( data => this.formatData(data.data, partnerID, scope) )
  }

  formatDate(date) {
    var newDate = moment(Number(date)*1000).tz('America/New_York').format("MMMM D YYYY");
    return newDate;
  }

  private formatData(data: AboutUsInterface, partnerID: string, scope?: string): AboutUsModel {

    let pageName = (partnerID == null)
            ? GlobalSettings.getBaseTitle()
            : GlobalSettings.getBasePartnerTitle();
    let numTeams = GlobalFunctions.commaSeparateNumber(data[0].numTeams);
    let divisionScope = data[0].scope.toUpperCase();
    let numPlayers = GlobalFunctions.commaSeparateNumber(data[0].numPlayers);
    let numDivisions = data[0].numDivisions;
    let championshipYear = data[0].championshipYear;
    let championshipTeamId = data[0].championshipTeamId;
    let championshipTeamMarket = data[0].championshipTeamMarket;
    let championshipTeamName = data[0].championshipTeamName;
    let imageUrl = data[0].imageUrl;
    let championshipTeamLink = VerticalGlobalFunctions.formatTeamRoute(championshipTeamName, championshipTeamId);
    let lastUpdated = this.formatDate(data[0].unixTimestamp);

    // Set auBlocks vars based on divisionScope
    let activeDivision;
    let activeDivisionSegments;
    let activeDivisionChampionship;

    if (divisionScope == this.collegeDivisionAbbrv) {
      activeDivision = this.collegeDivisionFullAbbrv.toUpperCase();
      activeDivisionSegments = this.collegeDivisionSegments;
      activeDivisionChampionship = "National";
    }
    else {
      activeDivision = this.sportLeagueAbbrv.toUpperCase();
      activeDivisionSegments = this.sportLeagueSegments;
      activeDivisionChampionship = this.sportLeagueChampionship;
    }

    let model: AboutUsModel = {
      headerTitle: "What is " + pageName + "?",
      titleData: {
          imageURL : GlobalSettings.getSiteLogoUrl(),
          text1: 'Last Updated: '+ lastUpdated, //+ GlobalFunctions.formatUpdatedDate(data.lastUpdated), todo
          text2: 'United States',
          text3: "Want to learn more about " + pageName + "?",
          text4: '',
          icon: 'fa fa-map-marker'
      },
      blocks: [
        {
          iconClass: 'fa fa-tdl-profiles',
          titleText: activeDivision+' Team Profiles',
          dataText: numTeams
        },
        {
          iconClass: 'fa fa-tdl-helmet',
          titleText: activeDivision+' Player Profiles',
          dataText: numPlayers
        },
        {
          iconClass: 'fa fa-tdl-football',
          titleText: activeDivision+" "+activeDivisionSegments,
          dataText: GlobalFunctions.commaSeparateNumber(numDivisions)
        },
        {
          link: {
            route: championshipTeamLink,
            imageConfig: {
              imageClass: "image-50",
              mainImage: {
                imageUrl: GlobalSettings.getImageUrl(imageUrl),
                imageClass: "border-1",
                urlRouteArray: championshipTeamLink,
                hoverText: "<i class=\"fa fa-mail-forward\"></i>"
              }
            },
          },
          titleText: championshipYear + ' ' + activeDivisionChampionship + ' Champions',
          dataText: championshipTeamName
        }
      ],
      //TODO-CJP: Update [July, 2016] to reflect actual creation date!
      content: [
        "We created " + pageName + " -based in Wichita, Kan. in August, 2016 to connect football fans with insightful, well-informed and up-to-date content.",

        "Here at " + pageName + ", we have an appetite for digesting down big data in the world of football." +
        " We create unique content so you can learn everything about your favorite team or player." +
        " From rookie players and underachieving teams to veteran stars and perennial favorites, " +
        pageName + " produces content and statistical information for " + numTeams + " NFL teams and over " + numPlayers + " player profiles."
      ]
    };

    return model;
  }
}
