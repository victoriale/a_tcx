import {Injectable, Input, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http} from '@angular/http';
import {SportPageParameters} from '../global/global-interface';
import {VerticalGlobalFunctions} from '../global/vertical-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';
import {PlayerStatsData, MLBPlayerStatsTableData, MLBPlayerStatsTableModel} from './player-stats.data';




@Injectable()
export class PlayerStatsService implements OnDestroy{

    tabName:string;
    seasonId:string= new Date().getFullYear().toString();
    public GlossaryData;
    private _apiUrl = GlobalSettings.getApiUrl();
    private _allTabs=[ "Passing", "Rushing", "Receiving", "Defense", "Special" ];
    public allStatistics: Array<PlayerStatsData>;

    constructor(public http: Http){}

    private getLinkToPage(teamId: number, teamName: string): Array<any> {
        return ["Player-stats-page", {
            teamId: teamId,
            teamName: GlobalFunctions.toLowerKebab(teamName)
        }];
    }

    private getModuleTitle(teamName: string): string {
        return "Player Stats - " + teamName;
    }

    getPageTitle(teamName: string): string {
        return teamName ? "Player Stats - " + teamName : "Player Stats";
    }

    loadAllTabsForModule(teamId: number, teamName: string, isTeamProfilePage: boolean) {
        return {
            moduleTitle: this.getModuleTitle(teamName),
            pageRouterLink: this.getLinkToPage(teamId, teamName),
            tabs: this.initializeAllTabs(teamName, isTeamProfilePage)
        };
    }

    getStatsTabData(tabData: Array<any>, pageParams: SportPageParameters, tabDataLoaded: Function, maxRows?: number) {
        if ( !tabData || tabData.length <= 1 ) {
            console.log("Error getting stats data - invalid tabData object");
            return;
        }


        var standingsTab: MLBPlayerStatsTableData = tabData[0];
        var seasonArray=standingsTab.seasonIds;
        //console.log(seasonArray);

        var columnTabType;
        var seasonTabClicked = seasonArray.find(function (e) {
            if( e.value===tabData[1]){
            return true;
        }

        });

        if(seasonTabClicked){
               this.seasonId = tabData[1];


            if(standingsTab.tabActive=="Special"){
                //console.log(this.tabName);
                this.tabName=this.tabName;

            }else {
                this.tabName = standingsTab.tabTitle.toLowerCase();

                this.GlossaryData=standingsTab.glossary;

            }

        }else{
             columnTabType = tabData[1];


            if(standingsTab.tabActive=="Special"){


                this.tabName=columnTabType.toLowerCase();

            }else {
                this.tabName = standingsTab.tabTitle.toLowerCase();

                this.GlossaryData=standingsTab.glossary;

            }
        }



        /*if ( !seasonId && standingsTab.seasonIds.length > 0 ) {
            seasonId = standingsTab.seasonIds[0].key;
        }*/
        var hasData = false;
        /*if ( standingsTab ) {
            var table = standingsTab.seasonTableData[columnTabType];
            if ( table ) {
                standingsTab.isLoaded = true;
                standingsTab.tableData = table;
                return;
            }
        }*/


        standingsTab.isLoaded = false;
        standingsTab.hasError = false;
        standingsTab.tableData = null;
        // standingsTab.tabActive="Passing";


        let url = GlobalSettings.getApiUrl() + "/teamPlayerStats/team/"+ this.seasonId+ "/" +pageParams.teamId +'/'+ this.tabName ;
        //console.log(url);
        this.http.get(url)
            .map(res => res.json())
            .map(data => this.setupTableData(standingsTab, pageParams, data.data, maxRows))
            .subscribe(data => {

                    standingsTab.isLoaded = true;
                    standingsTab.hasError = false;
                    standingsTab.seasonTableData[columnTabType] = data;
                    standingsTab.tableData = data;

                    tabDataLoaded(data);
                },
                err => {
                    standingsTab.isLoaded = true;
                    standingsTab.hasError = true;
                    console.log("Error getting player stats data");
                });



    }
    ngOnDestroy(){

    }


    initializeAllTabs(teamName: string, isActive?:boolean, isTeamProfilePage?: boolean): Array<MLBPlayerStatsTableData> {

        return this._allTabs.map(tabActive => new MLBPlayerStatsTableData(teamName, tabActive, tabActive=="Passing"?true:false , isTeamProfilePage));

    }

    private setupTableData(standingsTab: MLBPlayerStatsTableData, pageParams: SportPageParameters, data: Array<PlayerStatsData>, maxRows?: number): MLBPlayerStatsTableModel {
        let table = new MLBPlayerStatsTableModel(data, standingsTab.tabActive);
        //Limit to maxRows, if necessary
        if ( maxRows !== undefined ) {
            table.rows = table.rows.slice(0, maxRows);
        }
        table.istab=this.tabName;


        //Set display values
        table.rows.forEach((value, index) => {
            value.displayDate = GlobalFunctions.formatUpdatedDate(value.lastUpdate, false);
            value.fullPlayerImageUrl = GlobalSettings.getImageUrl(value.playerHeadshot);
            value.fullTeamImageUrl = GlobalSettings.getImageUrl(value.teamLogo);
            if ( value.backgroundImage ) {
                value.fullBackgroundImageUrl = VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(value.backgroundImage);
            }


        });
        
        return table;

    }
}
