import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {VerticalGlobalFunctions} from '../global/vertical-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';
import {SliderCarousel, SliderCarouselInput} from '../fe-core/components/carousels/slider-carousel/slider-carousel.component';
import {CircleImageData} from '../fe-core/components/images/image-data';
import {ListPageService} from './list-page.service';
import {IProfileData} from './profile-header.service';
import {DetailListInput} from '../fe-core/components/detailed-list-item/detailed-list-item.component';
import {PaginationParameters} from '../fe-core/components/pagination-footer/pagination-footer.component';

export interface DraftHistoryTab {
  tabTitle: string;
  tabKey: string;
  isLoaded: boolean;
  detailedDataArray: Array<Array<DetailListInput>>;
  carouselDataArray: Array<Array<SliderCarouselInput>>;
  paginationDetails: PaginationParameters;
  errorMessage: string;
}

export interface DraftHistoryData {
  detailedDataArray: Array<Array<DetailListInput>>;
  carouselDataArray: Array<Array<SliderCarouselInput>>;
  paginationDetails: PaginationParameters;
}

export interface PlayerDraftData {
  playerId: string;
  playerFirstName: string;
  playerLastName: string;
  roleStatus: string;
  active: string;
  id: string;
  draftTeamName: string;
  entryReason: string;
  playerRound: string;
  playerOverallPick: string;
  startDate: string;
  playerCity: string;
  playerState: string;
  playerCountry: string;
  playerCollege: string;
  playerBackground: string;
  playerHeadshot: string;
  playerCollegeAbbreviation: string;
}

@Injectable()
export class DraftHistoryService {

  getDraftHistoryTabs(profileData: IProfileData): DraftHistoryTab[] {
    // console.log("interface - getDraftHistoryTabs")
    return [];
  }

  getDraftHistoryService(profileData: IProfileData, tab: DraftHistoryTab, currIndex: number, type: string, sortBy: string): Observable<DraftHistoryData> {
    // console.log("interface - getDraftHistoryService")
    return null;
  }

}

@Injectable()
export class MLBDraftHistoryService extends DraftHistoryService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  constructor(public http: Http){
    super();
  }

  getDraftHistoryTabs(profileData: IProfileData): DraftHistoryTab[] {
    // console.log("concrete - getDraftHistoryTabs")

    let errorMessage; // {0} is for the season name
    // if ( profileData.isLegit && year == currentYear ) {
      if ( profileData.profileType == "team" ) {
        //team names are plural, and should have a determative
        errorMessage = "Currently, there are no drafted players assigned to the " + GlobalFunctions.convertToPossessive(profileData.profileName) + " roster for the {0}.";
      }
      else {
        //otherwise it's MLB, which is singular and a proper name
        errorMessage = "Currently, there are no drafted players assigned to a team's roster for the {0}.";
      }
    // }
    // else {
    //   if ( profileData.profileType == "team" ) {
    //     //team names are plural, and should have a determative
    //     errorMessage = "Sorry, the " + profileData.profileName + " do not currently have any draft history data for the {0}.";
    //   }
    //   else {
    //     //otherwise it's MLB, which is singular and a proper name
    //     errorMessage = "Sorry, " + profileData.profileName + " does not currently have any draft history data for the {0}.";
    //   }
    // }

    //for MLB season starts and ends in the same year so return current season
    //get past 5 years for tabs
    var currentYear = new Date().getFullYear();
    var year = currentYear;
    var tabArray = [];
    for(var i = 0; i <5; i++) {
      var seasonName = year + " season";
      tabArray.push({
        tabTitle: i == 0 ? 'Current Season' : year.toString(),
        tabKey: year.toString(),
        isLoaded: false,
        errorMessage: errorMessage.replace("{0}", seasonName)
      });
      year--;
    }
    return tabArray;
  }

/**
 * @param {string} type - 'page' or 'module'
 */
  getDraftHistoryService(profileData: IProfileData, tab: DraftHistoryTab, currIndex: number, type: string, sortBy: string): Observable<DraftHistoryData> {
    // console.log("concrete - getDraftHistoryService");
    let year = tab.tabKey;
    let itemsOnPage = 10;

    var callURL;
    // if(year == null){
    //   year = new Date().getFullYear().toString();
    // }
    if ( profileData.profileType == "team" ) {
      callURL = this._apiUrl + '/draftHistory/team/'+year+ "/"+profileData.profileId+"/5/1";
      //callURL = this._apiUrl + '/draftHistory/team/'+year+ "/1/5/1";
    }
    else {
      callURL = this._apiUrl + '/draftHistory/'+profileData.profileType+'/'+year+ "/5/1";
      //callURL = this._apiUrl + '/draftHistory/team/'+year+ "/1/5/1";
    }

    return this.http.get(callURL)
    .map(res => res.json())
    .map(data => {
        if(type == 'module'){
          if(data.data.length > 1) {
            // the module should only have 2 data points displaying
            data.data = data.data.slice(0,2);
          }
        }
        var allCarouselItems = this.carDraftHistory(data.data, tab.errorMessage, type);
        var allDetailItems = this.detailedData(data.data, sortBy);
        var totalPages = allDetailItems ? Math.ceil(allDetailItems.length / itemsOnPage) : 0;
        var draftData = {
          carouselDataArray: [],
          detailedDataArray: null, //detailedDataArray and paginationDetails should be null in case there are no items to display
          paginationDetails: null  // otherwise, the no-data tab doesn't show up correctly.
        };
        if ( totalPages > 0 ) { //paginate carousel and detail data
          draftData.detailedDataArray = [];
          if ( type == 'page' ) { //only include pagination for pages
            draftData.paginationDetails = {
              index: currIndex + 1, //currIndex is 0-based, but pagination needs 1-based
              max: totalPages,
              paginationType: 'module' //even if it's a page type, we want to use 'module' type pagination
            };
          }
          for ( var page = 0; page < totalPages; page++ ) {
            var start = page * itemsOnPage;
            var end = start + itemsOnPage;
            if ( end >= allDetailItems.length ) {
              end = allDetailItems.length;
            }
            draftData.carouselDataArray.push(allCarouselItems.slice(start, end));
            draftData.detailedDataArray.push(allDetailItems.slice(start, end));
          }
        } else { //otherwise just add default carousel item to array
          if ( totalPages == 0 && allCarouselItems.length == 1 ) {
            draftData.carouselDataArray.push(allCarouselItems);
          }
        }
        return draftData;
      });
  }

  //BELOW ARE TRANSFORMING FUNCTIONS to allow the modules to match their corresponding components
  //FOR THE PAGE
  private carDraftHistory(data: Array<PlayerDraftData>, errorMessage: string, type){
    let self = this;
    var carouselArray = [];
    var dummyImg = "/app/public/no-image.svg";
    if(data.length == 0){//if no data is being returned then show proper Error Message in carousel
      carouselArray.push(SliderCarousel.convertToEmptyCarousel(errorMessage));
    }else{
      //if data is coming through then run through the transforming function for the module
      data.forEach(function(val, index){
        var playerFullName = val.playerFirstName + " " + val.playerLastName;

        var playerRoute = null;
        playerRoute = VerticalGlobalFunctions.formatPlayerRoute(val.draftTeamName, playerFullName, val.playerId);
        var playerLinkText = {
          route: playerRoute,
          text: playerFullName
        };

        var rank = (index+1).toString();
        var location;
        if (val.playerCity == null || val.playerState == null || val.playerCity == "" || val.playerState == "") {
          location = "N/A";
        }
        else {
        location = GlobalFunctions.toTitleCase(val.playerCity) + ', ' + GlobalFunctions.stateToAP(val.playerState);
        }
        var carouselItem = SliderCarousel.convertToCarouselItemType2(index, {
          isPageCarousel: false,
          backgroundImage: VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(val.playerBackground),
          copyrightInfo: GlobalSettings.getCopyrightInfo(),
          profileNameLink: playerLinkText,
          description: ['<i class="fa fa-map-marker"></i> <span class="hometown">Hometown: </span>', location, '&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;College: ', val.playerCollege],
          dataValue: val.playerOverallPick + " Overall",
          dataLabel: "Draft Round " + val.playerRound,
          circleImageUrl: GlobalSettings.getImageUrl(val.playerHeadshot),
          circleImageRoute: playerRoute,
          rank: rank
        });
        // if(type == 'page'){ //removed from spec
        //   carouselItem.footerInfo = {
        //     infoDesc:'Interested in discovering more about this player?',
        //     text:'View Profile',
        //     url:playerRoute,
        //   }
        // }
        carouselArray.push(carouselItem);
      });
    }
    // console.log('TRANSFORMED CAROUSEL', carouselArray);
    return carouselArray;
  }

  private detailedData(data: Array<PlayerDraftData>, sortBy){
    var listDataArray = data.map(function(val, index){
      var playerFullName = val.playerFirstName + " " + val.playerLastName;
      var playerFullNameUrl = val.playerFirstName + "-" + val.playerLastName;
      if (val.playerCity == null || val.playerState == null || val.playerCity == "" || val.playerState == ""){
        location = "N/A";
      }
      else {
      var location = GlobalFunctions.toTitleCase(val.playerCity) + ', ' + GlobalFunctions.stateToAP(val.playerState);
      }
      var rank = (index+1);

      var playerRoute = null;
      playerRoute = VerticalGlobalFunctions.formatPlayerRoute(val.draftTeamName, playerFullNameUrl, val.playerId);
      var teamRoute = VerticalGlobalFunctions.formatTeamRoute(val.draftTeamName, val.id);
      var college;
      if (val.playerCollegeAbbreviation != null && val.playerCollegeAbbreviation != "") {
        college = val.playerCollegeAbbreviation + " " + val.playerCollege;
      }
      else {
        college = val.playerCollege;
      }
      var listData = {
        dataPoints: ListPageService.detailsData(
          [//main left text
            { route: playerRoute, text: playerFullName, class: "dataBox-mainLink" }
          ],
          val.playerOverallPick+' Overall',
          [//sub left text
            {text:'<i class="fa fa-map-marker"></i><span class="hometown"> Hometown: </span>' + location + '<span class="list-college">&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;College: ' + college + '</span>'}
          ],
          'Draft Round '+val.playerRound),
        imageConfig: ListPageService.imageData("list", GlobalSettings.getImageUrl(val.playerHeadshot), playerRoute, rank),
        hasCTA:true,
        ctaDesc: playerRoute ? 'Want more info about this player?' : 'This player is currently not active.',
        ctaBtn:'',
        ctaText:'View Profile',
        ctaUrl: playerRoute
      };
      return listData;
    });
    // console.log('TRANSFORMED List Data', listDataArray);
    if (sortBy != "1") {
      return listDataArray.length > 0 ? listDataArray.reverse() : null;
    }
    else {
      return listDataArray.length > 0 ? listDataArray : null;
    }
  }//end of function
}
