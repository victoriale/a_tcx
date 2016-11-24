import {Component, AfterViewInit, Input, OnChanges, OnDestroy, HostListener, ElementRef, Renderer} from '@angular/core';
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
    public imageData=[];
    public imageTitle=[];
    public copyright=[];
    public trendingLength: number = 2;
    @Input() scope: string;
    public category:string;
    public subcategory: string;
    isStockPhoto:boolean=true;
    prevarticle;
    iframeUrl: any;
    paramsub;
    constructor(

        private _synservice:SyndicateArticleService, private activateRoute:ActivatedRoute, private router:Router, private _eref:ElementRef, private _render:Renderer

    ){
        this.checkPartner = GlobalSettings.getHomeInfo().isPartner;
    }


    ngOnInit(){
        this.initializePage();
        console.log("article", this.articleData);

    }
    ngOnChanges(){
        this.initializePage();
        console.log("article", this.articleData)

    }
    initializePage(){
        this.paramsub= this.activateRoute.params.subscribe(
            (param :any)=> {
                this.articleID = param['articleID'],
                    this.articleType = param['articleType'],
                    this.category=param['category'],
                    this.subcategory=param['subCategory']?param['subCategory']:param['category'];
                if (this.articleType == "story" && this.articleID) {
                    this.getSyndicateArticle(this.articleID);
                }
                else {
                    this.getSyndicateVideoArticle(this.articleID);
                }
                this.getRecomendationData();
                this.getDeepDiveArticle();
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
        console.log(articleID,"article id");
        this._synservice.getSyndicateArticleService(articleID).subscribe(
            data => {
                console.log(data.data[0],"articledata")
                if (data.data[0].article_data.images == null) {
                    this.imageData  = ["/app/public/placeholder_XL.png"];

                }
                else {

                    var imageLength=data.data[0].article_data.images.length;
                    for( var i=0;i<imageLength;i++) {
                        this.imageData[this.imageData.length]=GlobalSettings.getImageUrl(data.data[0].article_data.images[i].image_url);
                        this.copyright[this.copyright.length]=data.data[0].article_data.images[i].image_copyright;
                        this.imageTitle[this.imageTitle.length]=data.data[0].article_data.images[i].image_title;
                    }
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
        console.log(this.category, this.subcategory,"page level");
            this._synservice.getRecArticleData(this.category, 3, this.subcategory)
                .subscribe(data => {
                    this.recomendationData = this._synservice.transformToRecArticles(data,this.subcategory,this.articleType);
                });
    }

    private getDeepDiveArticle() {

            this._synservice.getTrendingArticles(this.category, 40, this.subcategory).subscribe(
                data => {
                    this.trendingData = this._synservice.transformTrending(data.data,this.subcategory, this.articleType, this.articleID);

                    if (this.trendingLength <= 40) {

                        this.trendingLength = this.trendingLength + 10;
                    }
                }
            )
    }

   @HostListener('window:scroll',['$event']) onScroll(e){
     if(e.target.body.getElementsByClassName('syndicate-widget')[0]) {
         var element = e.target.body.getElementsByClassName('syndicate-widget')[0];
         console.log(window.innerHeight, window.outerHeight);
         if (window.scrollY > 845) {
             var a = window.scrollY - 845 + "px";
             this._render.setElementStyle(element, "top", a)
         }
         else {
             this._render.setElementStyle(element, "top", '0')
         }
     }
}


}
