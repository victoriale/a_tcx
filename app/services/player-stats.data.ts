import {TableModel, TableColumn, CellData} from '../fe-core/components/custom-table/table-data.component';
import {CircleImageData} from '../fe-core/components/images/image-data';
import {StatsTableTabData} from '../fe-core/components/player-stats/player-stats.component';
import {SliderCarousel, SliderCarouselInput} from '../fe-core/components/carousels/slider-carousel/slider-carousel.component';
import {Link} from '../global/global-interface';
import {VerticalGlobalFunctions} from '../global/vertical-global-functions';
import {GlobalSettings} from '../global/global-settings';
import {PlayerStatsService} from'./player-stats.service';

export interface PlayerStatsData {
    teamName: string,
    teamId: string;
    teamLogo: string,
    playerName: string;
    playerFirstName: string;
    playerLastName: string;
    playerId: string;
    jerseyNumber:string;
    backgroundImage: string;
    seasonId: string;
    lastUpdate: string;
    playerPosition:string;
    teamMarket:string;
    stat1: string;
    stat2: string;
    stat3: string;
    stat4: string;
    stat5: string;
    stat6: string;
    stat7: string;
    stat8: string;
    stat1Type: string;
    stat2Type: string;
    stat3Type: string;
    stat4Type: string;
    stat5Type: string;
    stat6Type: string;
    stat7Type: string;
    stat8Type: string;
    SeasonBase:string;
    leagueId;
    leagueAbbreviation;
    lastUpdated;
    playerHeadshot;

    /**
     * - Formatted from the lastUpdatedDate
     */
    displayDate?: string;

    fullPlayerImageUrl?: string;

    fullTeamImageUrl?: string;

    fullBackgroundImageUrl?: string;
}

export class MLBPlayerStatsTableData implements StatsTableTabData<PlayerStatsData> {

    tabTitle: string;

    tableName: string;

    isLoaded: boolean;

    hasError: boolean;

    tableData: TableModel<PlayerStatsData>;

    seasonTableData: { [key: string]: TableModel<PlayerStatsData> } = {};

    seasonIds: Array<{key: string, value: string}> = []

    glossary: Array<{key: string, value: string}>;

    isActive: boolean;

    tabActive: string;

    tabN:string;

    isTeamProfilePage: boolean;
    subTabs:Array<any>;

    constructor(teamName: string, tabActive: string, isActive: boolean, isTeamProfilePage: boolean) {


        this.tabActive = tabActive;
        this.tableName = "<span class='text-heavy'>" + getTabTitle(tabActive).title + "</span> " + " : Team Player Stats";
        this.isActive = isActive;

        this.isTeamProfilePage = isTeamProfilePage;

        function getTabTitle(tabActive){
            return {
                Passing:{
                    title: "Passing",
                    glossary:[
                        {key: "ATT", value: "Passing Attempts"},
                        {key: "COMP", value: "Completions"},
                        {key: "YDS", value: "Passing Yards"},
                        {key: "AVG", value: "Yards Per Pass Attempt"},
                        {key: "TD", value: "Passing Touchdowns"},
                        {key: "INT", value: "Interceptions"},
                        {key: "RATE", value: "Passer Rating"}
                    ]
                },
                Rushing:{
                    title: "Rushing",
                    glossary:[
                        {key: "ATT", value: "Rushing Attempts"},
                        {key: "YDS", value: "Yards Per Rush Attempt"},
                        {key: "AVG", value: "Average"},
                        {key: "TD", value: "Rushing Touchdowns"},
                        {key: "YDS/G", value: "Yards per Game"},
                        {key: "FUM", value: "Rushing Fumbles"},
                        {key: "1DN", value: ": Rushing First Downs"}
                    ]
                },
                Receiving:{
                    title: "Receiving",
                    glossary:[
                        {key: "REC", value: "Receptions"},
                        {key: "TAR", value: "Receiving Targets"},
                        {key: "YDS", value: "Average Yards Per Reception"},
                        {key: "AVG", value: "Average"},
                        {key: "TD", value: "Receiving Touchdowns"},
                        {key: "YDS/G", value: "Receiving Yards Per Game"},
                        {key: "1DN", value: "Receiving First Downs"}
                    ]
                },
                Defense:{
                    title: "Defense",
                    glossary:[
                        {key: "SOLO", value: "Solo Tackles"},
                        {key: "AST", value: "Assisted Tackles"},
                        {key: "TOT", value: "Total Tackles"},
                        {key: "SACK", value: "Sacks"},
                        {key: "PD", value: "Passes Defended"},
                        {key: "INT", value: "Interceptions"},
                        {key: "FF", value: "Forced Fumbles"}
                    ]
                },
                Special:{
                    title:"Special Teams",
                    glossary:[
                        {key: "FGM", value: "Field Goals Made"},
                        {key: "FGA", value: "Field Goal Attempts"},
                        {key: "FG%", value: "Percentage of Field Goals Made"},
                        {key: "XPA", value: "Extra Point Attempts"},
                        {key: "PNTS", value: "Total Points Scored From Field Goals + Extra Point Kicks"},
                        {key: "XP%", value: "Percentage of Extra Points Made"},
                        {key: "XPM", value: "Extra Points Made"}
                    ],

                },
                returning:{
                    title:"Special Teams",
                    glossary:[
                        {key: "K.ATT", value: "Kickoff Return Attempts"},
                        {key: "K.YDS", value: "Total Kickoff Return Yards"},
                        {key: "K.AVG", value: "Kickoff Return Average"},
                        {key: "P.ATT", value: "Punt Return Attempts"},
                        {key: "P.YDS", value: "Total Punt Return Yards"},
                        {key: "P.AVG", value: "Punt Return Average"},
                        {key: "TD", value: "Run Average"}
                    ],

                },
                kicking:{
                    title:"Special Teams",
                    glossary:[
                        {key: "FGM", value: "Field Goals Made"},
                        {key: "FGA", value: "Field Goal Attempts"},
                        {key: "FG%", value: "Percentage of Field Goals Made"},
                        {key: "XPA", value: "Extra Point Attempts"},
                        {key: "PNTS", value: "Total Points Scored From Field Goals + Extra Point Kicks"},
                        {key: "XP%", value: "Percentage of Extra Points Made"},
                        {key: "XPM", value: "Extra Points Made"}
                    ],

                },
                punting:{
                    title:"Special Teams",
                    glossary:[
                        {key: "FGM", value: "Field Goals Made"},
                        {key: "FGA", value: "Field Goals Average"},
                        {key: "FG%", value: "Field Goals Percentage"},
                        {key: "WHIP", value: "Walks + Hits per Inning Pitched"},
                        {key: "SO", value: "Strikeouts"},
                        {key: "SV", value: "Saves"},
                        {key: "ERA", value: "Run Average"}
                    ],

                },
            }[tabActive];
        }

        this.tabTitle= getTabTitle(tabActive).title;
        this.glossary=getTabTitle(tabActive).glossary;


        var currYear = new Date().getFullYear();
        var year = currYear;
        for ( var i = 0; i < 4; i++ ) {
            this.seasonIds.push({
                key: year.toString(),
                //value: i == 0 ? "Current Season" : year.toString() + " Season"
                value: year.toString()
            });
            year--;
        }
        this.subTabs= [
            {
                key:'Kicking', value:'Kicking'
            },
            {
                key:'Punting',value:'Punting'
            },
            {
                key:'Returning',value:'Returning'
            }];

    }

    convertToCarouselItem(item: PlayerStatsData, index: number, tabName): SliderCarouselInput {

        var description: Array<Link | string> = [];
        var tense = " has";
        var temporalInfo = "";
        var subHeaderYear = "Current ";
        if ( item.seasonId != this.seasonIds[0].key ) {
            subHeaderYear = item.seasonId + " ";
            tense = " had";
            temporalInfo = " in " + item.seasonId;
        }
        var playerRoute = VerticalGlobalFunctions.formatPlayerRoute(item.teamName, item.playerName, item.playerId.toString());
        var playerLinkText = {
            route: playerRoute,
            text: item.playerFirstName+" "+item.playerLastName,
            class: 'text-heavy'

        }
        var teamRoute =this.isTeamProfilePage ? null : VerticalGlobalFunctions.formatTeamRoute(item.teamName, item.teamId.toString());
        var teamLinkText = {
            route: teamRoute,
            text: item.teamName
        }

        function getTabDescription(tabActive){

            return {
                Passing:{
                    description:[item.playerFirstName + " "+ item.playerLastName + " has a total of " + item.stat1 + " attempts with "+ item.stat2 +" Completions, " + item.stat3+ " Passing Yards and " + item.stat5 + " Touchdowns."],
                },
                Rushing:{
                    description:[item.playerFirstName + " "+ item.playerLastName + " has a total of " + item.stat1 + " attempts with "+ item.stat2 +" Rushing Yards, " + item.stat3+ " Average and " + item.stat4 + " Touchdowns."],
                },
                Receiving:{
                    description:[item.playerFirstName + " "+ item.playerLastName + " has a total of " + item.stat1 + " Receptions, "+  item.stat2+ " Targets, " + item.stat3 + " Receiving Yards and " + item.stat4 + " Average."],
                },
                Defense:{
                    description:[item.playerFirstName + " "+ item.playerLastName + " has a total of " + item.stat1 + " Solo Tackles, "+ item.stat2 +" Assists, " + item.stat3+ " Total Tackles and " + item.stat5 + " Sacks."],
                },
                Special:{

                    description:[item.playerFirstName + " "+ item.playerLastName + " has a total of " + item.stat1 + " Field Goals Made, "+ item.stat2 +" Field Goal Average Distance, " + item.stat3+ " Field Goal Percentage and " + item.stat4 + " Extra Points Made."],

                },
                Kicking:{
                    description:[item.playerFirstName + " "+ item.playerLastName + " has a total of " + item.stat1 + " Field Goals Made, "+ item.stat2 +" Field Goal Average Distance, " + item.stat3+ " Field Goal Percentage and " + item.stat4 + " Extra Points Made."],

                },
                Punting:{
                    description:[item.playerFirstName + " "+ item.playerLastName + " has a total of " + item.stat1 + " Punts, "+ item.stat2 +" Yards, " + item.stat3+ " Average and " + item.stat4 + " Net Punting Yards."],


                },
                Returning:{
                    description:[item.playerFirstName + " "+ item.playerLastName + " has a total of " + item.stat1 + " Kicking Attempt, "+ item.stat2 +" Yards, " + item.stat3+ " Kicking Average and " + item.stat5 + " Punting Returns."],

                }

            }[tabActive];
        }
        return SliderCarousel.convertToCarouselItemType1(index, {
            backgroundImage: item.fullBackgroundImageUrl,
            copyrightInfo: GlobalSettings.getCopyrightInfo(),
            subheader: [" Player Stats - ", teamLinkText],
            profileNameLink: playerLinkText,
            description: this.tabActive =="Special"? getTabDescription(tabName).description : getTabDescription(this.tabActive).description,
            lastUpdatedDate: item.displayDate,
            circleImageUrl: item.fullPlayerImageUrl,
            circleImageRoute: playerRoute
            // subImageUrl: item.fullTeamImageUrl,
            // subImageRoute: teamRoute
        });
    }

}

export class MLBPlayerStatsTableModel implements TableModel<PlayerStatsData> {
    columns: Array<TableColumn>;

    rows: Array<PlayerStatsData>;

    selectedKey:string = "";

    istab: string;


    constructor(rows: Array<PlayerStatsData> ,tabActive: string) {

        this.rows = rows;

        if ( this.rows === undefined || this.rows === null ) {
            this.rows = [];
        }
        this.istab = tabActive;



        function getTabTableData(tabActive){
            return{
                columns:[{
                    headerValue: "Player Name",
                    columnClass: "image-column",
                    key: "name"
                },{
                    headerValue: rows[0].stat1Type,
                    columnClass: "data-column",
                    isNumericType: true,
                    key: "stat1-type"
                },{
                    headerValue: rows[0].stat2Type,
                    columnClass: "data-column",
                    isNumericType: true,
                    key: "stat2-type"
                },{
                    headerValue: rows[0].stat3Type,
                    columnClass: "data-column",
                    sortDirection: -1, //descending
                    isNumericType: true,
                    key: "stat3-type"

                },{
                    headerValue: rows[0].stat4Type,
                    columnClass: "data-column",
                    isNumericType: true,
                    key: "stat4-type"
                },{
                    headerValue: rows[0].stat5Type,
                    columnClass: "data-column",
                    isNumericType: true,
                    key: "stat5-type"
                },{
                    headerValue: rows[0].stat6Type,
                    columnClass: "data-column",
                    isNumericType: true,
                    key: "stat6-type"
                },{
                    headerValue: rows[0].stat7Type,
                    columnClass: "data-column",
                    isNumericType: true,
                    key: "stat7-type"
                }]
            }
        }
        this.columns=getTabTableData(tabActive).columns;
        //this.columns = getTabTableData(tabActive).columns;
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

    isRowSelected(item:PlayerStatsData, rowIndex:number): boolean {
        return this.selectedKey == item.playerId;
    }

    getCellData(item:PlayerStatsData, column:TableColumn):CellData {

        var display=null;
        var sort: any = null;
        var link: Array<any> = null;
        var imageUrl: string = null;
        var presentColumn;
        function tabCellData(columnType) {
            return{
                "name":{
                    display : item.playerFirstName + " " + item.playerLastName,
                    sort : item.playerLastName + ', ' + item.playerFirstName,
                    link : VerticalGlobalFunctions.formatPlayerRoute(item.teamName, item.playerFirstName + " " + item.playerLastName, item.playerId),
                    imageUrl : GlobalSettings.getImageUrl(item.playerHeadshot),
                    bottomStat: item.stat8Type != null ? item.stat8Type: 'N/A',
                    bottomStat2:item.stat8 != null ? item.stat8: 'N/A',

                },
                "stat1-type":{
                    display:item.stat1 != null ? item.stat1: 'N/A',
                    sort : item.stat1 != null ? Number(item.stat1) : null,
                },
                "stat2-type":{
                    display:item.stat2 != null ? item.stat2: 'N/A',
                    sort : item.stat2 != null ? Number(item.stat2) : null,
                },

                "stat3-type":{

                    display:item.stat3 != null ? item.stat3: 'N/A',
                    sort : item.stat3 != null ? Number(item.stat3) : null,

                },
                "stat4-type":{
                    display:item.stat4 != null ? item.stat4: 'N/A',
                    sort : item.stat4 != null ? Number(item.stat4) : null,
                },

                "stat5-type":{
                    display:item.stat5 != null ? item.stat5: 'N/A',
                    sort : item.stat5 != null ? Number(item.stat5) : null,
                },
                "stat6-type":{
                    display:item.stat6 != null ? item.stat6: 'N/A',
                    sort : item.stat6 != null ? Number(item.stat6) : null,
                },
                "stat7-type":{
                    display:item.stat7 != null ? item.stat7: 'N/A',
                    sort : item.stat7 != null ? Number(item.stat7) : null,
                }


            }[columnType];
        }
        presentColumn = tabCellData(column.key);



       return new CellData(presentColumn.display,presentColumn.sort,presentColumn.link,presentColumn.imageUrl, presentColumn.bottomStat, presentColumn.bottomStat2);


    }


}
