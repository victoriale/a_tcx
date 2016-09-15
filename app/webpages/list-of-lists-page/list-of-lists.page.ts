import {Component, OnInit} from '@angular/core';
import {RouteParams, Router} from '@angular/router-deprecated';
import {Title} from '@angular/platform-browser';

import {DetailedListItem, DetailListInput} from '../../fe-core/components/detailed-list-item/detailed-list-item.component';
import {ModuleFooter} from '../../fe-core/components/module-footer/module-footer.component';
import {SliderCarousel, SliderCarouselInput} from '../../fe-core/components/carousels/slider-carousel/slider-carousel.component';
import {TitleComponent, TitleInputData} from '../../fe-core/components/title/title.component';
import {BackTabComponent} from '../../fe-core/components/backtab/backtab.component';
import {NoDataBox} from '../../fe-core/components/error/data-box/data-box.component';
import {ListOfListsItem, IListOfListsItem} from "../../fe-core/components/list-of-lists-item/list-of-lists-item.component";
import {ListOfListsService} from "../../services/list-of-lists.service";
import {LoadingComponent} from "../../fe-core/components/loading/loading.component";
import {ErrorComponent} from "../../fe-core/components/error/error.component";
import {PaginationFooter, PaginationParameters} from "../../fe-core/components/pagination-footer/pagination-footer.component";
import {GlobalSettings} from "../../global/global-settings";
import {GlobalFunctions} from "../../global/global-functions";
import {VerticalGlobalFunctions} from "../../global/vertical-global-functions";
import {SidekickWrapper} from "../../fe-core/components/sidekick-wrapper/sidekick-wrapper.component";
import {ProfileHeaderService} from '../../services/profile-header.service';
import {ResponsiveWidget} from '../../fe-core/components/responsive-widget/responsive-widget.component';

declare var moment:any;

@Component({
    selector: 'list-of-lists-page',
    templateUrl: './app/webpages/list-of-lists-page/list-of-lists.page.html',
    directives: [SidekickWrapper, NoDataBox, BackTabComponent, TitleComponent, SliderCarousel, ListOfListsItem, ModuleFooter, LoadingComponent, ErrorComponent, PaginationFooter, ResponsiveWidget],
    providers: [ListOfListsService, Title, ProfileHeaderService],
    inputs:[]
})

export class ListOfListsPage implements OnInit{
    errorData             : string;
    detailedDataArray     : Array<IListOfListsItem>; //variable that is just a list of the detailed DataArray
    carouselDataArray     : Array<SliderCarouselInput>;
    profileName           : string;
    isError               : boolean = false;
    pageType              : string; // [player,team]
    id                    : string; // [playerId, teamId]
    limit                 : string; // pagination limit
    pageNum               : string; // page of pages to show

    paginationSize        : number = 10;
    index                 : number = 0;
    paginationParameters  : PaginationParameters;
    titleData             : TitleInputData;

    constructor(private listService:ListOfListsService,
        private _profileService: ProfileHeaderService,
        private _params: RouteParams,
        private _title: Title, private _router:Router) {
          GlobalSettings.getParentParams(this._router, parentParams => {
              _title.setTitle(GlobalSettings.getPageTitle("List of Lists"));
              this._params.params['scope'] = parentParams.scope;
              this.pageType = this._params.get("target");
              if ( this.pageType == null ) {
                  this.pageType = "league";
                  this._profileService.getLeagueProfile()
                  .subscribe(data => {
                      this.getListOfListsPage(this._params.params, GlobalSettings.getImageUrl(data.headerData.leagueLogo));
                  }, err => {
                      console.log("Error loading MLB profile");
                  });
              }else{
                this.getListOfListsPage(this._params.params);
              }

          });

    }



    getListOfListsPage(urlParams, logoUrl?: string) {
        this.listService.getListOfListsService(urlParams, this.pageType, "page")
          .subscribe(
            list => {
                if(list.listData.length == 0){//makes sure it only runs once
                    this.detailedDataArray = null;
                }else{
                    this.detailedDataArray = list.listData;
                }
                this.setPaginationParams(list.pagination);
                this.carouselDataArray = list.carData;


                var profileName = "League";
                var profileRoute = ["League-page"];
                var profileImage = logoUrl ? logoUrl : GlobalSettings.getSiteLogoUrl();


                var listTargetData;

                if (this.pageType != 'league') {
                  listTargetData = list.targetData[0];
                }
                else {
                  listTargetData = list.targetData;
                }


                switch ( urlParams.target ) {
                    case "player":
                        profileName = listTargetData.playerFirstName + " " + listTargetData.playerLastName;
                        profileRoute = VerticalGlobalFunctions.formatPlayerRoute(listTargetData.teamName, profileName, listTargetData.playerId);
                        profileImage = GlobalSettings.getImageUrl(listTargetData.imageUrl);
                        break;

                    case "team":
                        profileName = listTargetData.teamName;
                        profileRoute = VerticalGlobalFunctions.formatTeamRoute(listTargetData.teamName, listTargetData.teamId);
                        profileImage = GlobalSettings.getImageUrl(listTargetData.teamLogo);

                        break;

                    default: break;
                }


                this.profileName = profileName

                this._title.setTitle(GlobalSettings.getPageTitle("List of Lists", this.profileName));
                this.titleData = {
                    imageURL : profileImage,
                    imageRoute: profileRoute,
                    text1 : 'Last Updated: ' + GlobalFunctions.formatUpdatedDate(list.lastUpdated['lastUpdated']),
                    text2 : ' United States',
                    text3 : 'Top lists - ' + this.profileName,
                    icon: 'fa fa-map-marker'
                };

            },
            err => {
                this.isError= true;
                console.log('Error: ListOfLists API: ', err);
            }
          );
    }

    //PAGINATION
    //sets the total pages for particular lists to allow client to move from page to page without losing the sorting of the list
    setPaginationParams(input) {
        var params = this._params.params;




        var navigationParams = {
            perPageCount     : params['perPageCount'],
            pageNumber    : params['pageNumber'],

        };

        if(params['targetId'] != null) {
           navigationParams['targetId'] = params['targetId'];
        }
        else {
          navigationParams['targetId'] = 'null';
        }

        navigationParams['target'] = this.pageType;



        var navigationPage = 'List-of-lists-page-scoped';
        if ( !this.detailedDataArray ) {
            navigationPage = "Error-page";
        }
        else if ( navigationParams['scope'] ) {
            navigationPage = 'List-of-lists-page-scoped';
        }
        this.paginationParameters = {
            index: params['pageNumber'] != null ? Number(params['pageNumber']) : null,
            max: Number(input.listPageCount),
            paginationType: 'page',
            navigationPage: navigationPage,
            navigationParams: navigationParams,
            indexKey: 'pageNumber'
        };

    }

    ngOnInit(){

    }
}
