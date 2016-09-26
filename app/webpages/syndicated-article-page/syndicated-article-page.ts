import {Component, AfterViewInit,Input} from '@angular/core';
import {SyndicateArticleService} from "../../services/syndicate-article.service";
import {GlobalSettings} from "../../global/global-settings";
import {ActivatedRoute} from "@angular/router";
import {GlobalFunctions} from "../../global/global-functions";

declare var jQuery:any;
declare var moment;

@Component({
    selector: 'syndicated-article-page',
    templateUrl: './app/webpages/syndicated-article-page/syndicated-article-page.html',

})

export class SyndicatedArticlePage{
    public partnerID: string;
    checkPartner: boolean;
    public geoLocation:string;

    public widgetPlace: string = "widgetForPage";
    public articleData: any;
    public recomendationData: any;
    public articleID: string;
    public articleType: string;
    public imageData: Array<string>;
    public imageTitle: Array<string>;
    public copyright: Array<string>;
    @Input() scope: string;
    iframeUrl: any;
    constructor(

        private _synservice:SyndicateArticleService, private GlobalSetting:GlobalSettings, private activateRoute:ActivatedRoute, private GlobalFunctions:GlobalFunctions

    ){
        activateRoute.params.subscribe(
            (param :any)=> {this.articleID= param['articleID'], this.articleType= param['articleType']}

        );


        if (this.articleType == "story") {
            this.getSyndicateArticle(this.articleID);
            this.getRecomendationData();
        }
        else {
            this.getSyndicateVideoArticle(this.articleID);
            this.getRecomendationData();
        }

       /* GlobalSettings.getParentParams(_router, partnerID => {
            this.partnerID = partnerID.partnerID;
            this.getPartnerHeader();
        });*/
        this.checkPartner = GlobalSettings.getHomeInfo().isPartner;
    }

    ngAfterViewInit(){
        // to run the resize event on load
        try {
            window.dispatchEvent(new Event('load'));
        }catch(e){
            //to run resize event on IE
            var resizeEvent = document.createEvent('UIEvents');
            resizeEvent.initUIEvent('load', true, false, window, 0);
            window.dispatchEvent(resizeEvent);
        }
    }
    ngDoCheck(){

    }
    ngOnChanges(){

    }
    private getSyndicateArticle(articleID) {
        this._synservice.getSyndicateArticleService(articleID).subscribe(
            data => {

                if (data.data.imagePath == null || data.data.imagePath == undefined || data.data.imagePath == "") {
                    this.imageData  = ["/app/public/stockphoto_bb_1.jpg", "/app/public/stockphoto_bb_2.jpg"];
                    this.copyright = ["USA Today Sports Images", "USA Today Sports Images"];
                    this.imageTitle = ["", ""];
                }
                else {
                    console.log("imageExist");
                    this.imageData = [GlobalSettings.getImageUrl(data.data.imagePath)];
                    this.copyright = ["USA Today Sports Images"];
                    this.imageTitle = [""];
                }
                this.articleData = data.data;
                this.articleData.publishedDate = moment.unix(this.articleData.publishedDate/1000).format("MMMM Do, YYYY h:mm A") + " EST";
            }
        )


    }
    private getSyndicateVideoArticle(articleID){
        this._synservice.getSyndicateVideoService(articleID).subscribe(
            data => {
                this.articleData = data.data;

                this.iframeUrl = this.articleData.videoLink + "&autoplay=on";
            }
        )
    }

    /*getGeoLocation() {
        var defaultState = 'ca';
        this._geoLocation.getGeoLocation()
            .subscribe(
                geoLocationData => {
                    this.geoLocation = geoLocationData[0].state;
                    this.geoLocation = this.geoLocation.toLowerCase();
                    this.getRecomendationData();
                },
                err => {
                    this.geoLocation = defaultState;
                    this.getRecomendationData();
                }
            );
    }

    getPartnerHeader(){//Since it we are receiving
        if(this.partnerID!= null){
            this._partnerData.getPartnerData(this.partnerID)
                .subscribe(
                    partnerScript => {
                        //super long way from partner script to get location using geo location api
                        var state = partnerScript['results']['location']['realestate']['location']['city'][0].state;
                        state = state.toLowerCase();
                        this.geoLocation = state;
                        this.getRecomendationData()
                    }
                );
        }else{
            this.getGeoLocation();
        }
    }*/

    getRecomendationData(){
        var startNum=Math.floor((Math.random() * 49) + 1);
        var state = 'KS'; //needed to uppoercase for ai to grab data correctly
        this._synservice.getRecArticleData(this.scope, this.geoLocation,startNum, 3)

            .subscribe(data => {
                this.recomendationData = this._synservice.transformToRecArticles(data);

            });

    }

    ngOnInit(){


    }
    formatDate(date) {

        return moment(date).format("MMMM DD, YYYY | h:mm A ")

    }

}
