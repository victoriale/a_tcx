import {Component, AfterViewInit, Input, OnChanges, OnDestroy} from '@angular/core';
import {SyndicateArticleService} from "../../services/syndicate-article.service";
import {GlobalSettings} from "../../global/global-settings";
import {ActivatedRoute, Route, Router, NavigationStart, Event as NavigationEvent} from "@angular/router";
import {GlobalFunctions} from "../../global/global-functions";

declare var jQuery:any;
declare var moment;

@Component({
    selector: 'syndicated-article-page',
    templateUrl: './app/webpages/syndicated-article-page/syndicated-article-page.html',

})

export class SyndicatedArticlePage implements OnChanges,OnDestroy{
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
    public category:string;
    public subcategory: string;
    isStockPhoto:boolean=true;
    prevarticle;
    iframeUrl: any;
    paramsub;
    constructor(

        private _synservice:SyndicateArticleService, private activateRoute:ActivatedRoute, private router:Router

    ){


        /* GlobalSettings.getParentParams(_router, partnerID => {
             this.partnerID = partnerID.partnerID;
             this.getPartnerHeader();
         });*/
        this.checkPartner = GlobalSettings.getHomeInfo().isPartner;
    }


    ngOnInit(){
        this.initializePage();
    }
    ngOnChanges(){
        this.initializePage();

    }
    initializePage(){
        this.paramsub= this.activateRoute.params.subscribe(
            (param :any)=> {
                this.articleID= param['articleID'],
                    this.articleType= param['articleType'],
                    this.category=param['category'],
                    this.subcategory=param['subCategory'];
                if (this.articleType == "story" && this.articleID) {
                    this.getSyndicateArticle(this.articleID);
                    this.getRecomendationData();
                }
                else {
                    this.getSyndicateVideoArticle(this.articleID);
                    this.getRecomendationData();
                }
            }

        );
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
    private getSyndicateArticle(articleID) {
        this._synservice.getSyndicateArticleService(articleID).subscribe(
            data => {

                if (data.data[0].image_url == null || data.data.imagePath == undefined || data.data.imagePath == "") {
                    this.imageData  = ["/app/public/placeholder_XL.png"];
                    this.copyright = [data.data[0].article_data.images[0].image_copyright];
                    this.imageTitle = [data.data[0].article_data.images[0].image_title];
                }
                else {
                    
                    this.imageData = ["/app/public/placeholder_XL.png"];
                    this.copyright = [data.data[0].article_data.images[0].image_copyright];
                    this.imageTitle = [data.data[0].article_data.images[0].image_title];
                }

                this.articleData = data.data[0].article_data;

                this.articleData.publishedDate = moment.unix(this.articleData.publication_date/1000).format("MMMM Do, YYYY h:mm A") + " EST";
            }
        )


    }
    private getSyndicateVideoArticle(articleID){
        this._synservice.getSyndicateVideoService(articleID).subscribe(
            data => {
                this.articleData = data.data;
                console.log(this.articleData);

                this.iframeUrl = this.articleData.video_url + "&autoplay=on";
            }
        )
    }
    ngOnDestroy(){
        this.paramsub.unsubscribe();
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
        if(this.subcategory) {
            this._synservice.getRecArticleData(this.category, 3, this.subcategory)

                .subscribe(data => {
                    this.recomendationData = this._synservice.transformToRecArticles(data,this.subcategory,this.articleType);


                });
        }
        else{
            this._synservice.getRecArticleData(this.category, 3)

                .subscribe(data => {
                    this.recomendationData = this._synservice.transformToRecArticles(data,this.category,this.articleType);


                });
        }

    }
   /* getRecomendationData(){
        var startNum=Math.floor((Math.random() * 49) + 1);
        var state = 'KS'; //needed to uppoercase for ai to grab data correctly
        this._synservice.getTrendingArticles('sports','nfl',10).subscribe(
            data => {
                this.recomendationData = this._synservice.transformToRecArticles(data);

            }

        )

    }*/


    formatDate(date) {

        return moment(date).format("MMMM DD, YYYY at h:mm A ")

    }

}
