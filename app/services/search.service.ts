import {Injectable} from '@angular/core';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {Http} from '@angular/http';
import {SearchComponentResult, SearchComponentData} from '../fe-core/components/search/search.component';
// import {SearchPageInput} from '../fe-core/modules/search-page/search-page.module';
import {GlobalFunctions} from '../global/global-functions';
import {VerticalGlobalFunctions}  from '../global/vertical-global-functions';
import {GlobalSettings} from '../global/global-settings';
declare let Fuse: any;

@Injectable()
export class SearchService{
    public pageMax: number = 10;
    public searchJSON: any;

    public searchAPI: string = "http://dev-touchdownloyal-api.synapsys.us" + '/landingPage/search';
    constructor(private http: Http, private _router:Router){

        //Get initial search JSON data
        this.getSearchJSON()
    }

    //Function get search JSON object
    getSearchJSON(){

      //this.newSearchAPI = this.newSearchAPI+scope;
        return this.http.get(this.searchAPI, {
            })
            .map(
                res => res.json()
            ).subscribe(
                data => {
                    this.searchJSON = data;
                },
                err => {
                  console.log('ERROR search results');
                    this.searchJSON = null
                }
            )
    }
    //Function get search JSON object
    getSearch(){
        return this.http.get(this.searchAPI, {

            })
            .map(
                res => res.json()
            ).map(
                data => {
                    return data;
                },
                err => {
                  console.log('ERROR search results');
                }
            )
    }

    /*
     *  Functions for search component
     */

    //Function used by search input to get suggestions dropdown
    getSearchDropdownData(router:Router, term: string){
        //TODO: Wrap in async
        let data = this.searchJSON;
        let dataSearch = {
          players: [],
          teams: []
        };
        for(var s in data){
          data[s]['players'].forEach(function(item){
            item['scope'] = s == 'fbs'? 'ncaaf': 'nfl';
            dataSearch.players.push(item);
          })
          data[s]['teams'].forEach(function(item){
            item['scope'] = s == 'fbs'? 'ncaaf': 'nfl';
            dataSearch.teams.push(item);
          })
        }

        //Search for players and teams
        let playerResults = this.searchPlayers(term, null, dataSearch.players);
        let teamResults = this.searchTeams(term, null, dataSearch.teams);
        //Transform data to useable format
        let searchResults = this.resultsToDropdown(router, playerResults, teamResults);
        //Build output to send to search component
        let searchOutput: SearchComponentData = {
            term: term,
            searchResults: searchResults
        };
        return Observable.of(searchOutput);
    }

    //Convert players and teams to needed dropdown array format
    resultsToDropdown(router, playerResults, teamResults){
        let searchArray: Array<SearchComponentResult> = [];
        let partnerScope = GlobalSettings.getHomeInfo();
        let count = 0, max = 4;
        for(let i = 0, length = teamResults.length; i < length; i++){
            //Exit loop if max dropdown count
            if(count >= max){
                break;
            }
            let item = teamResults[i];
            let teamName = item.teamName;

            //generate route for team
            let route = VerticalGlobalFunctions.formatTeamRoute(teamName, item.teamId);
            // if(partnerScope.isPartner && item.scope != null){
            //   route.unshift(this.getRelativePath(router)+'Partner-home',{scope:item.scope,partnerId:partnerScope.partnerName});
            // }else{
            //   route.unshift(this.getRelativePath(router)+'Default-home',{scope:item.scope});
            // }

            count++;
            searchArray.push({
                title: teamName,
                value: teamName,
                imageUrl: {
                    imageClass: "image-43",
                    mainImage: {
                      imageUrl: GlobalSettings.getImageUrl(item.teamLogo),
                      hoverText: "<i class='fa fa-mail-forward search-text'></i>",
                      imageClass: "border-1",
                      urlRouteArray: route,
                    }
                },
                routerLink: route
              })
        }

        for(let i = 0, length = playerResults.length; i < length; i++){
            //Exit loop if max dropdown count
            if(count >= max){
                break;
            }
            count++;
            let item = playerResults[i];
            let playerName = item.playerName;
            let route = VerticalGlobalFunctions.formatPlayerRoute(item.teamName, playerName, item.playerId);
            // if(partnerScope.isPartner && item.scope != null){
            //   route.unshift(this.getRelativePath(router)+'Partner-home',{scope:item.scope,partnerId:partnerScope.partnerName});
            // }else{
            //   route.unshift(this.getRelativePath(router)+'Default-home',{scope:item.scope});
            // }
            searchArray.push({
                title: '<span class="text-heavy">' + playerName + '</span> - ' + item.teamName,
                value: playerName,
                imageUrl: {
                    imageClass: "image-43",
                    mainImage: {
                      imageUrl: GlobalSettings.getImageUrl(item.imageUrl),
                      urlRouteArray: route,
                      hoverText: "<i class='fa fa-mail-forward search-text'></i>",
                      imageClass: "border-1"
                    }
                },
                routerLink: route
            })
        }
        return searchArray;
    }

    //Function to build search route
    getSearchRoute(term: string){
        let searchRoute: Array<any>;
        //Build search Route
        if ( term ) {
            searchRoute = ['search', 'articles',{query: term}];
        }else{
            searchRoute = null;
        }
        return searchRoute !== null ? searchRoute : ['Error-page'];
    }

    /*
     * Functions for search page
     */

    getSearchPageData(router: Router, partnerId: string, query: string, scope, data){
        let dataSearch = {
          players: [],
          teams: []
        };
        //coming from router as possibly ncaaf and will need to change it to fbs for api then swap it back to ncaaf for display
        scope = scope == 'ncaaf'?'fbs':scope;

        if(scope !== null){
          data[scope]['players'].forEach(function(item){
            item['scope'] = scope == 'fbs' ? 'ncaaf': 'nfl';
            dataSearch.players.push(item);
          });
          data[scope]['teams'].forEach(function(item){
            item['scope'] = scope == 'fbs' ? 'ncaaf': 'nfl';
            dataSearch.teams.push(item);
          })
        }else{
          for(var s in data){
            data[s]['players'].forEach(function(item){
              item['scope'] = s == 'fbs'? 'ncaaf': 'nfl';
              dataSearch.players.push(item);
            })
            data[s]['teams'].forEach(function(item){
              item['scope'] = s == 'fbs'? 'ncaaf': 'nfl';
              dataSearch.teams.push(item);
            })
          }
        }

        //converts to usable scope for api calls null is default value for all
        // scope = scope != null ? GlobalSettings.getScope(scope):null;
        //Search for players and teams
        let playerResults = this.searchPlayers(query, scope, dataSearch.players);
        let teamResults = this.searchTeams(query, scope, dataSearch.teams);

        let searchResults = this.resultsToTabs(router, partnerId, query, playerResults, teamResults);

        return {
          results: searchResults,
          filters: this.filterDropdown()
        };
    }

    filterDropdown(){
      var dropdownFilter = [{
        key: null,
        value: 'ALL',
      },{
        key: 'nfl',
        value: 'NFL',
      },{
        key: 'ncaaf',
        value: 'NCAAF',
      }];
      return dropdownFilter;
    }

    //Convert players and teams to tabs format
    resultsToTabs(router: Router, partnerId: string, query, playerResults, teamResults){
      let self = this;
      let partnerScope = GlobalSettings.getHomeInfo();

        let searchPageInput = {
            searchComponent : {
                placeholderText: 'Search for a player or team...',
                hasSuggestions: true,
                initialText: query
            },
            heroImage: '/app/public/homePage_hero1.png',
            headerText: 'Discover The Latest In Football',
            subHeaderText: 'Find the Players and Teams you love.',
            query: query,
            tabData: [
                {
                    tabName: 'Player (' + playerResults.length + ')',
                    isTabDefault: playerResults.length >= teamResults.length ? true : false,
                    results: [],
                    error:{
                      message:"Sorry we can't find a <span class='text-heavy'>Player Profile</span> matching your search term(s) ''<span class='query-blue'>"+query+"</span>'', please try your search again.",
                      icon:'fa-search-icon-01'
                    },
                    pageMax:this.pageMax,
                    totalResults:playerResults.length,
                    paginationParameters: {
                        index: 1,
                        max: 10,//default value will get changed in next function
                        paginationType: 'module'
                    }
                },
                {
                    tabName: 'Team (' + teamResults.length + ')',
                    isTabDefault: teamResults.length > playerResults.length ? true : false,
                    results: [],
                    error:{
                      message:"Sorry we can't find a <span class='text-heavy'>Team Profile</span> matching your search term(s) '<span class='query-blue'>"+query+"</span>', please try your search again.",
                      icon:'fa-search-icon-01'
                    },
                    pageMax:this.pageMax,
                    totalResults:teamResults.length,
                    paginationParameters: {
                        index: 1,
                        max: 10,//default value will get changed in next function
                        paginationType: 'module'
                    }
                }
            ]
        };

        let setTabDefault = searchPageInput.tabData
        var objCounter = 0;
        var objData1 = [];

        playerResults.forEach(function(item){
            let playerName = item.playerName;
            let title = GlobalFunctions.convertToPossessive(playerName) + " Player Profile";
            //TODO: use router functions to get URL
            // let urlText = 'http://www.homerunloyal.com/';
            // urlText += '<span class="text-heavy">player/' + GlobalFunctions.toLowerKebab(item.teamName) + '/' + GlobalFunctions.toLowerKebab(playerName) + '/' + item.playerId + '</span>';
            let route = VerticalGlobalFunctions.formatPlayerRoute(item.teamName, playerName, item.playerId);
            // if(partnerScope.isPartner && item.scope != null){
            //   route.unshift(self.getRelativePath(router)+'Partner-home',{scope:item.scope,partnerId:partnerScope.partnerName});
            // }else{
            //   route.unshift(self.getRelativePath(router)+'Default-home',{scope:item.scope});
            // }
            // let relativePath = router.generate(route).toUrlPath();
            // if ( relativePath.length > 0 && relativePath.charAt(0) == '/' ) {
            //     relativePath = item.scope+ '/' + relativePath.substr(1);
            // }
            let urlText = '<p>' + GlobalSettings.getHomePage(partnerId, false) + '/<b>' + "relativePath" + '</b></p>';
            let regExp = new RegExp(playerName, 'g');
            let description = item.playerDescription.replace(regExp, ('<span class="text-heavy">' + playerName + '</span>'));

            if(typeof objData1[objCounter] == 'undefined' || objData1[objCounter] === null){//create paginated objData.  if objData array does not exist then create new obj array
              objData1[objCounter] = [];
              objData1[objCounter].push({
                  title: title,
                  urlText: urlText,
                  url: route,
                  description: description
              })
            }else{// otherwise push in data
              objData1[objCounter].push({
                  title: title,
                  urlText: urlText,
                  url: route,
                  description: description
              })
              if(objData1[objCounter].length >= self.pageMax){// increment the objCounter to go to next array
                objCounter++;
              }
            }
        });
        searchPageInput.tabData[0].results = objData1;
        searchPageInput.tabData[0].paginationParameters.max = searchPageInput.tabData[0].results.length;

        var objCounter = 0;
        var objData2 = [];

        teamResults.forEach(function(item){
            let teamName = item.teamName;
            let title = GlobalFunctions.convertToPossessive(teamName) + " Team Profile";
            //TODO: use router functions to get URL
            // let urlText = 'http://www.homerunloyal.com/';
            // urlText += '<span class="text-heavy">team/' + GlobalFunctions.toLowerKebab(teamName) + '/' + item.teamId;
            let route = VerticalGlobalFunctions.formatTeamRoute(teamName, item.teamId);
            // if(partnerScope.isPartner && item.scope != null){
            //   route.unshift(self.getRelativePath(router)+'Partner-home',{scope:item.scope,partnerId:partnerScope.partnerName});
            // }else{
            //   route.unshift(self.getRelativePath(router)+'Default-home',{scope:item.scope});
            // }
            // let relativePath = router.generate(route).toUrlPath();
            // if ( relativePath.length > 0 && relativePath.charAt(0) == '/' ) {
            //     relativePath = item.scope + '/' + relativePath.substr(1);
            // }
            let urlText = GlobalSettings.getHomePage(partnerId, false) + '/<span class="text-heavy">' + "relativePath" + '</span>';
            let regExp = new RegExp(teamName, 'g');
            let description = item.teamDescription.replace(regExp, ('<span class="text-heavy">' + teamName + '</span>'));

            if(typeof objData2[objCounter] == 'undefined' || objData2[objCounter] === null){//create paginated objData.  if objData array does not exist then create new obj array
              objData2[objCounter] = [];
              objData2[objCounter].push({
                  title: title,
                  urlText: urlText,
                  url: route,
                  description: description
              })
            }else{// otherwise push in data
              objData2[objCounter].push({
                  title: title,
                  urlText: urlText,
                  url: route,
                  description: description
              })
              if(objData2[objCounter].length >= self.pageMax){// increment the objCounter to go to next array
                objCounter++;
              }
            }
        });

        searchPageInput.tabData[1].results = objData2;
        searchPageInput.tabData[1].paginationParameters.max = searchPageInput.tabData[1].results.length;
        return searchPageInput;
    }

    /*
     *  Search Functions used by both component and page
     */
     static _orderByComparatorPlayer(a:any, b:any):number{
       if ((a.score - b.score) == 0){
         if (a.item.playerName.toLowerCase() > b.item.playerName.toLowerCase()){return 1;} else {return -1;}
       }
       else {
         return a.score - b.score;
       }
     }
     static _orderByComparatorTeam(a:any, b:any):number{
       if ((a.score - b.score) == 0){
         if (a.item.teamName.toLowerCase() > b.item.teamName.toLowerCase()){return 1;} else {return -1;}
       }
       else {
         return a.score - b.score;
       }
     }
    //Function to search through players. Outputs array of players that match criteria
    searchPlayers(term, scope, data){
      let fuse = new Fuse(data, {
          //Fields the search is based on
          keys: [{
            name: 'playerFirstName',
            weight: 0.5
          }, {
            name: 'playerLastName',
            weight: 0.3
          }, {
              name: 'playerName',
              weight: 0.2
          }],
          //At what point does the match algorithm give up. A threshold of 0.0 requires a perfect match (of both letters and location),
          // a threshold of 1.0 would match anything.
          threshold: 0.1,
          distance: 10,
          tokenize: false,
          sortFn: SearchService._orderByComparatorPlayer
      });
      return fuse.search(term);
    }

    //Function to search through teams. Outputs array of teams that match criteria
    searchTeams(term, scope, data){
      let fuse = new Fuse(data, {
          //Fields the search is based on
          keys: ['teamName'],
          //At what point does the match algorithm give up. A threshold of 0.0 requires a perfect match (of both letters and location), a threshold of 1.0 would match anything.
          threshold: 0.2,
          shouldSort: true,
          sortFn: SearchService._orderByComparatorTeam
      });
      return fuse.search(term);
    }

    // getRelativePath(router:Router){
    //   let counter = 0;
    //   let hasParent = true;
    //   let route = router;
    //   for (var i = 0; hasParent == true; i++){
    //     if(route.parent != null){
    //       counter++;
    //       route = route.parent;
    //     }else{
    //       hasParent = false;
    //       let relPath = '';
    //       for(var c = 1 ; c <= counter; c++){
    //         relPath += '../';
    //       }
    //       return relPath;
    //     }
    //   }
    // }

}
