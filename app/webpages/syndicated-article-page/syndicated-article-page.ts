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
    public trendingData:any;
    public articleType: string;
    public imageData: Array<string>;
    public imageTitle: Array<string>;
    public copyright: Array<string>;
    public trendingLength: number = 2;
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
                    this.getDeepDiveArticle();
                }
                else {
                    this.getSyndicateVideoArticle(this.articleID);
                    this.getRecomendationData();
                    this.getDeepDiveArticle();
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
                this.iframeUrl = this.articleData.video_url + "&autoplay=on";
            }
        )
    }
    ngOnDestroy(){
        this.paramsub.unsubscribe();
    }

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

    private getDeepDiveArticle() {
        //var startNum=Math.floor((Math.random() * 29) + 1);
        if(this.subcategory) {
            this._synservice.getTrendingArticles(this.category, 40, this.subcategory).subscribe(
                data => {
                    this.trendingData = this._synservice.transformTrending(data.data,this.subcategory, this.articleType, this.articleID);

                    if (this.trendingLength <= 40) {

                        this.trendingLength = this.trendingLength + 10;
                    }
                    console.log(this.trendingData)
                }
            )
        }
        else{
            this._synservice.getTrendingArticles(this.category,20).subscribe(
                data => {
                    this.trendingData = this._synservice.transformTrending(data.data,this.category, this.articleType, this.articleID);

                    if (this.trendingLength <= 20) {

                        this.trendingLength = this.trendingLength + 10;
                    }
                    console.log(this.trendingData)
                }

            )
        }
        /* this._synService.getDeepDiveBatchService(scope, numItems, startNum, state).subscribe(
         data => {
         this.articleData = this._synService.transformTrending(data.data, currentArticleId);


         if (this.trendingLength <= 20) {

         this.trendingLength = this.trendingLength + 10;
         }
         }

         )*/


    }

}
