import {Component, AfterViewInit, Input, OnChanges, OnDestroy, HostListener, ElementRef, Renderer} from '@angular/core';
import {SyndicateArticleService} from "../../services/syndicate-article.service";
import {GlobalSettings} from "../../global/global-settings";
import {ActivatedRoute, Route, Router, NavigationStart, Event as NavigationEvent} from "@angular/router";
import {GlobalFunctions} from "../../global/global-functions";
import {VerticalGlobalFunctions} from "../../global/vertical-global-functions";
import {SeoService} from "../../global/seo.service";

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
    public trendingLength: number = 10;
    @Input() scope: string;
    public category:string;
    public subcategory: string;
    isStockPhoto:boolean=true;
    isArticle:string;
    prevarticle;
    iframeUrl: any;
    paramsub;
    constructor(
        private _synservice:SyndicateArticleService, 
        private activateRoute:ActivatedRoute, 
        private router:Router, 
        private _eref:ElementRef, 
        private _render:Renderer,
        private _seo:SeoService

    ){
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
                this.articleID = param['articleID'],
                    this.articleType = param['articleType'],
                    this.category=param['category'],
                    this.subcategory=param['subCategory']?param['subCategory']:param['category'];
                if (this.articleType == "story" && this.articleID) {this.getSyndicateArticle(this.articleID);}
                else {this.getSyndicateVideoArticle(this.articleID);}
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
        this._synservice.getSyndicateArticleService(articleID).subscribe(

            data => {

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
                this.articleData.url= VerticalGlobalFunctions.formatArticleRoute(this.subcategory,this.articleID,this.articleType)
                var date = moment.unix(Number(data.data[0].last_updated));
                this.articleData.publishedDate = date.format('dddd') +', '+ date.format('MMM') + date.format('. DD, YYYY');
                this.metaTags(data);
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
            this._synservice.getRecArticleData(this.category, 3, this.subcategory)
                .subscribe(data => {
                    this.recomendationData = this._synservice.transformToRecArticles(data,this.subcategory,this.articleType);
                });
    }
    private getDeepDiveArticle() {
            this._synservice.getTrendingArticles(this.category, this.trendingLength, this.subcategory).subscribe(
                data => {


                    if (this.trendingLength <= 100) {

                        this.trendingLength = this.trendingLength + 10;
                        this.trendingData = this._synservice.transformTrending(data.data,this.subcategory, this.articleType, this.articleID);
                        this.getDeepDiveArticle();
                    }
                }
            )
    }
    private metaTags(data) {
            let metaDesc;
            if (data.data[0].teaser != null) {
                metaDesc = data.data[0].teaser;
            } else {
                metaDesc = data.data[0].article_data.article[0];
            }
            let link = window.location.href;
            let image;
            if (this.imageData != null) {
                image = this.imageData[0];
            } else {
                image = GlobalSettings.getImageUrl(data.data[0].image_url);
            }
            let articleAuthor='';
            if(data.data[0].author){

                let authorArray = data.data[0].author.split(' ');

                if(authorArray[0] =='By'){
                    for(var i=1;i<authorArray.length;i++) {
                        articleAuthor += authorArray[i] + ' ';
                    }
                }else{
                    for(var i=0;i<authorArray.length;i++) {
                        articleAuthor += authorArray[i] + ' ';
                    }
                }

            }

            this._seo.setCanonicalLink(link);
            this._seo.setOgTitle(data.data[0].title);
            this._seo.setOgDesc(metaDesc);
            this._seo.setOgType('Website');
            this._seo.setOgUrl(link);
            this._seo.setOgImage(image);
            this._seo.setTitle(data.data[0].title);
            this._seo.setMetaDescription(metaDesc);
            this._seo.setMetaRobots('INDEX, NOFOLLOW');
            this._seo.setOgId(data.data[0].article_id);
            this._seo.setOgAuthor(articleAuthor);
            this._seo.setOgDate(data.data[0].last_updated);
            this._seo.setOgKeyword(data.data[0].keywords[0]);
            data.data[0].keywords[1]?this._seo.setOgSubKeyword(data.data[0].keywords[1]):this._seo.setOgSubKeyword(data.data[0].keywords[0]);
    }

   @HostListener('window:scroll',['$event']) onScroll(e){
     if(e.target.body.getElementsByClassName('syndicate-widget')[0]) {
         var element = e.target.body.getElementsByClassName('syndicate-widget')[0];

         if (window.scrollY > 845) {
             var a = window.scrollY - 845 + 35 + "px";
             this._render.setElementStyle(element, "top", a)
         }
         else {
             this._render.setElementStyle(element, "top", '0')
         }
     }
}


}
