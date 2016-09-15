import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalFunctions} from '../global/global-functions';
import {VerticalGlobalFunctions}  from '../global/vertical-global-functions';
import {GlobalSettings}  from '../global/global-settings';
import {SliderCarousel, SliderCarouselInput} from '../fe-core/components/carousels/slider-carousel/slider-carousel.component';
import {Router, RouteParams} from '@angular/router-deprecated';

declare var moment: any;
@Injectable()
export class ListOfListsService {
  private _apiUrlTdl: string = GlobalSettings.getApiUrl();
  private _proto = window.location.protocol;


  // private _apiToken: string = 'BApA7KEfj';
  // private _headerName: string = 'X-SNT-TOKEN';

  constructor(public http: Http){
  }

  //Function to set custom headers
  setToken(){
    var headers = new Headers();
    //headers.append(this.headerName, this.apiToken);
    return headers;
  }

        //http://dev-homerunloyal-api.synapsys.us/listOfLists/league/5
  getListOfListsService(urlParams, profileType: string, pageType: string){
    // Configure HTTP Headers
    var headers = this.setToken();
    let targetbit = "&targetId=";
    let callURL = this._apiUrlTdl + '/listOfLists/';

    let id      = urlParams.targetId != null ? urlParams.targetId : "";
    var limit   = urlParams.perPageCount != null ? urlParams.perPageCount: 4;
    var pageNum = urlParams.pageNumber != null ? urlParams.pageNumber : 1;
    var target =  profileType;
    let scope = urlParams.scope;

    if (profileType == 'league' && pageType == 'module') {
      id = '';
      targetbit = '';

    }


    var url_api = "scope=" + scope + "&target=" + target + "&perPageCount=" + limit + "&pageNumber=" + pageNum + targetbit + id;
    callURL += url_api;
    return this.http.get( callURL, {
        headers: headers
      })
      .map(res => res.json())
      .map(
        data => {
          if ( !data || !data.data ) {
            return null;
          }
          var lastUpdated = "";
          if ( data && data.data && data.data.length > 0 && data.data != undefined) {
            lastUpdated = data.data[0].targetData;

          }
          return {
            carData: this.carDataPage(data.data,target),
            listData: this.detailedData(data.data, pageType,target),
            targetData: this.getTargetData(data.data),
            pagination: data.data[0].listInfo,
            lastUpdated: lastUpdated
          };
        }
      )
  }

  getTargetData(data) {
    return(data[0].targetData);
  }

  //BELOW ARE TRANSFORMING FUNCTIONS to allow the modules to match their corresponding components
  carDataPage(data, target): Array<SliderCarouselInput>{
    let self = this;
    var carouselArray = [];

    if(data.length == 0){
      carouselArray.push(SliderCarousel.convertToEmptyCarousel("Sorry, we currently do not have any data for this list."));
    }else{

      //if data is coming through then run through the transforming function for the module
      data.forEach(function(val, index){
        if( val.listData[0] == null) return;
        let itemInfo = val.listInfo;
        var itemTargetData;
        if (target != 'league') {  // if page is league, reformat data [API changes]
          itemTargetData = val.targetData[0];
        }
        else {
          itemTargetData = val.targetData;
        }

        let itemProfile       = null;
        let itemImgUrl        = null;
        let itemRoute         = null;
        let itemSubImg        = null;
        let itemSubRoute      = null;
      //  let itemHasHover      = version == "page";
      //  let ctaUrlArray       = itemInfo.url.split("/");
      //  let ctaUrlArray       = null;
        let itemStatName      = itemTargetData.statType.replace(/_/g,' '); //TODO
        // let updatedDate       = moment(itemTargetData.lastUpdated).format('dddd, MMMM Do, YYYY');
        let itemDescription   = [];
        let rankStr = itemTargetData.rank + GlobalFunctions.Suffix(Number(itemTargetData.rank));
        let profileLinkText;
        itemTargetData.playerName = itemTargetData.playerFirstName + ' ' + itemTargetData.playerLastName;
        if( itemTargetData.rankType == "player") {
          itemProfile       = itemTargetData.playerName;
          itemImgUrl        = GlobalSettings.getImageUrl(itemTargetData.playerHeadshotUrl);
          itemRoute         = VerticalGlobalFunctions.formatPlayerRoute(itemTargetData.teamName, itemTargetData.playerName, itemTargetData.playerId);
          itemSubImg        = VerticalGlobalFunctions.formatTeamLogo(itemTargetData.teamLogo);
          itemSubRoute      = VerticalGlobalFunctions.formatTeamRoute(itemTargetData.teamName, itemTargetData.teamId);
          profileLinkText   = {
            route: itemRoute,
            text: itemProfile,
            class: 'text-heavy'
          };
          itemDescription   = [profileLinkText, " is currently ranked <b>"+ rankStr +"</b> in the "+ itemTargetData.rankScope +" with the most <b>" + itemStatName + "</b>."];
        } else if ( itemTargetData.rankType == "team" ) {
          itemProfile       = itemTargetData.teamName;
          itemImgUrl        = GlobalSettings.getImageUrl(itemTargetData.teamLogo);
          itemRoute         = VerticalGlobalFunctions.formatTeamRoute(itemTargetData.teamName, itemTargetData.teamId);
          profileLinkText   = {
            route: itemRoute,
            text: itemProfile
          };
          itemDescription   = ["The ", profileLinkText, " are currently ranked <b>"+ rankStr +"</b> in the "+ itemTargetData.rankScope +" with the most <b>" + itemStatName + "</b>."];
        }
        if (itemTargetData.backgroundImage == null || itemTargetData.backgroundImage == undefined) {
          itemTargetData.backgroundImage = "/app/public/Image-Placeholder-2.jpg";
        }
        else {
          itemTargetData.backgroundImage = VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(itemTargetData.backgroundImage);
        }


        var carouselItem = SliderCarousel.convertToCarouselItemType1(index, {
    //      backgroundImage: itemTargetData.backgroundImage,
          copyrightInfo: GlobalSettings.getCopyrightInfo(),
          subheader: ["Related List - ", profileLinkText],
          profileNameLink: {text: itemInfo.listName},
          description: itemDescription,
          lastUpdatedDate: GlobalFunctions.formatUpdatedDate(itemTargetData.lastUpdated),
      //    lastUpdatedDate: 'last-updated',
          circleImageUrl: itemImgUrl,
          circleImageRoute: VerticalGlobalFunctions.formatTeamRoute(itemTargetData.teamName, itemTargetData.teamId), //replacement for
          rank: itemTargetData.rank,
          rankClass: "image-48-rank"
        });
        carouselArray.push(carouselItem);
      });
    }
    return carouselArray;

  }

  detailedData(data, version,target){
    let listDataArray     = [];
    let dummyUrl          = "/list/player/batter-home-runs/asc/National";
    let dummyName         = "Batters with the most home runs in the National League";
    let dummyStat         = "batter-home-runs";
    let dummyOrdering     = "asc";
    let dummyScope        = "conference";
    let dummyConference   = "National";
    let dummyDivision     = "all";
    let dummyListCount    = 1;
    let dummyPageCount    = 1;
    let dummyListRank     = 1;
    let dummyIcon         = "fa fa-mail-forward";


    var leagueimgclass;
    var leaguerank;

    if (target != 'league' || version == 'page') {
      leagueimgclass = 'image-38-rank image-round-upper-left image-round-sub-text'; // Show rank image of list of lists on page, but not module on league page.
    }
    else {
      leagueimgclass = '';
    }


    data.forEach(function(item, index){



      let itemInfo = item.listInfo;
      let itemListData = item.listData;
      var itemTarget;

      if (target != 'league') { // if page is league, reformat data
        itemTarget = item.targetData[0];
      }
      else {
        itemTarget = item.targetData;
        leaguerank == null;
      }
      if (leagueimgclass == 'image-38-rank image-round-upper-left image-round-sub-text') {
        leaguerank = '#'+itemTarget.rank;
      }





      if( itemListData.length<1 ) return;
      itemListData.unshift(item.targetData);
      itemListData = itemListData.slice(1, 7);

    //  let itemListInfo = item['listInfo'];
      //  let ctaUrlArray = itemListInfo.url.split("/");
      //let ctaUrlArray = 'test';

      //:target/:statName/:season/:ordering/:perPageCount/:pageNumber',
      /*
      let listRoute = ['List-page', {
        target      : kebabArr[0],
        statName    : kebabArr[1],
        ordering    : kebabArr[2],
        perPageCount: kebabArr[3],
        pageNumber  : kebabArr[4],

      }];*/
      let listype;
      if (itemTarget['rankType'] == "team") {
        listype = itemTarget['statType'].replace('team_','');
      }
      if (itemTarget['rankType'] == "player") {
        listype = itemTarget['statType'].replace('player_','');
      }



      let ctaUrlArr = [
        itemTarget['rankType'],
        listype,
        itemInfo.seasons,
        itemInfo.ordering,
        10,
        1
      ]


      // removes first empty item and second "list" item
      //  ctaUrlArray.splice(0,2);
      //  ctaUrlArray.push.apply(ctaUrlArray,["10","1"]);

      var profileTypePlural = "types";
      if ( itemTarget['rankType'] == "player" ) {
        profileTypePlural = "players";
      }
      else if ( itemTarget['rankType'] == "team" ) {
        profileTypePlural = "teams";
      }

      // let id;
      // switch(itemTarget[0]['rankType']) {
      //   case 'team':
      //     id = itemTarget[0]['teamId'];
      //     break;
      //   case 'player':
      //     id = itemTarget[0]['playerId'];
      //     break
      //   default:
      //     id = 'player';
      // }

      var listData = {
        name          : itemInfo.listName           != null  ? itemInfo.listName         : dummyName,
        target        : itemTarget.rankType,
        topname       : itemTarget.teamName        != null  ? itemTarget.teamName : itemTarget.playerFirstName + itemTarget.playerLastname,
        listCount     : itemInfo.resultCount       != null  ? itemInfo.resultCount    : dummyListCount,
        pageCount     : itemInfo.pageCount         != null  ? itemInfo.pageCount    : dummyPageCount,
        listRank      : itemListData.rank      != null  ? itemListData.rank     : dummyListRank,
        dataPoints    : [],
        ctaBtn        : '',
        ctaDesc       : 'Want to see the ' + profileTypePlural + ' in this list?',
        ctaText       : 'View The List',
        ctaUrl        : VerticalGlobalFunctions.formatListRoute(ctaUrlArr)  != null ? VerticalGlobalFunctions.formatListRoute(ctaUrlArr) : dummyUrl
      };



      itemListData.forEach(function(val, index) {

        let itemUrlRouteArray = itemTarget['rankType'] == "player"  ?


          VerticalGlobalFunctions.formatPlayerRoute(itemTarget.teamName, itemTarget.playerFirstName, itemTarget.playerId) :
          VerticalGlobalFunctions.formatTeamRoute(itemTarget.teamName, itemTarget.teamId);

           //let firstItemHover    = version == "page" ? "<p>View</p><p>Profile</p>" : null;
          let firstItemHover = "<p>View</p><p>Profile</p>";

          if (itemTarget.teamLogo == null) {
            itemTarget.teamLogo = itemTarget.playerHeadshotUrl;
          }
          if (itemTarget.playerHeadshotUrl == null) {
            itemTarget.playerHeadshotUrl = itemTarget.teamLogo;
          }

        listData.dataPoints.push(
          {
            imageClass : index > 0 ? "image-43" : "image-121",
            mainImage: {
              imageUrl        : GlobalSettings.getImageUrl(itemTarget.teamLogo) != null ? GlobalSettings.getImageUrl(itemTarget.playerHeadshotUrl) : GlobalSettings.getImageUrl(itemTarget.playerHeadshotUrl),
              urlRouteArray   : version == "page" || index > 0 ? itemUrlRouteArray : null,
              hoverText       : index > 0 ? "<i class='fa fa-mail-forward'></i>" : firstItemHover,
              imageClass      : index > 0 ? "border-1" : "border-2"
            },
            subImages         : index > 0 ? null : [
              // {
              //   imageUrl      : itemTarget[0].rankType == "player" ? VerticalGlobalFunctions.formatTeamLogo(itemTarget[0].teamName) : null,
              //   urlRouteArray : itemTarget[0].rankType == "player" ? VerticalGlobalFunctions.formatTeamRoute(itemTarget[0].teamName, itemTarget[0].teamId) : null,
              //   hoverText     : itemTarget[0].rankType == "player" ? "<i class='fa fa-mail-forward'></i>" : null,
              //   imageClass    : itemTarget[0].rankType == "player" ? "image-round-sub image-40-sub image-round-lower-right" : null
              // },
              {
              text: leaguerank,
              imageClass: leagueimgclass
            }]
          }
        )
      });

      listDataArray.push(listData);
    });
    return listDataArray;

  }

  imageData(imageClass, imageBorder, mainImg, mainImgRoute, subImgClass?, subImg?, subRoute?, rank?, hasHover?){
    if(typeof mainImg =='undefined' || mainImg == ''){
      mainImg = GlobalSettings.getImageUrl("/mlb/players/no-image.svg");
    }
    if(typeof subImg =='undefined' || subImg == ''){
      mainImg = GlobalSettings.getImageUrl("/mlb/players/no-image.svg");
    }
    if(typeof rank == 'undefined' || rank == 0){
      rank = 0;
    }
    var image = {//interface is found in image-data.ts
      imageClass: imageClass,
      mainImage: {
        imageUrl       : mainImg,
        urlRouteArray  : hasHover ? mainImgRoute : null,
        hoverText      : hasHover ? "<p>View</p><p>Profile</p>" : null,
        imageClass     : imageBorder
      },
      subImages: [
        {
          imageUrl: subImg,
          urlRouteArray: subRoute,
          hoverText: "<i class='fa fa-mail-forward'></i>",
          imageClass: subImgClass + " image-round-lower-right"
        },
        {
          text: "#"+rank,
          imageClass: "image-48-rank image-round-upper-left image-round-sub-text"
        }
      ],
    };
    return image;
  }
}
