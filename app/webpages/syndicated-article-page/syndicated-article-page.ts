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
    public trendingData:any=[];
    public eventType: string;
    public imageData=[];
    public imageTitle=[];
    public copyright=[];
    public trendingLength: number = 10;
    public is_stock:boolean;
    @Input() scope: string;
    public category:string;
    public subcategory: string;
    public loadingshow:boolean;
    public articleCount:number;
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
        this.initializePage();
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
                    this.eventType= param['articleType'],
                    this.category=param['category'],
                    this.subcategory=param['subCategory']?param['subCategory']:param['category'];
                if (this.eventType == "story" && this.articleID) {this.getSyndicateArticle(this.articleID);}
                else {this.getSyndicateVideoArticle(this.subcategory, this.articleID);}
                this.getRecomendationData(this.category, 3, this.subcategory);
                this.getDeepDiveArticle(this.category, this.trendingLength, this.subcategory, this.eventType, this.articleID);


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

                if(data.data[0]) {
                    if(data.data[0].is_stock_photo && data.data[0].is_stock_photo==true){
                        this.is_stock=true;
                    }else{
                        this.is_stock=false;
                    }
                    if (data.data[0].article_data.images == null || data.data[0].article_data.images == undefined || data.data[0].article_data.images.length==0) {
                       if(data.data[0].image_url!=null ||data.data[0].image_url!= undefined){
                           this.imageData[0]=GlobalSettings.getImageUrl(data.data[0].image_url);
                       }else{
                           this.is_stock=true;
                       }
                    }
                    else {
                        var imageLength = data.data[0].article_data.images.length;
                        for (var i = 0; i < imageLength; i++) {
                            this.imageData[this.imageData.length] = GlobalSettings.getImageUrl(data.data[0].article_data.images[i].image_url);
                            this.copyright[this.copyright.length] = data.data[0].article_data.images[i].image_copyright;
                            this.imageTitle[this.imageTitle.length] = data.data[0].article_data.images[i].image_title;
                        }
                    }
                    this.articleData = data.data[0].article_data;
                    this.articleData.url = VerticalGlobalFunctions.formatArticleRoute(this.subcategory, this.articleID, this.eventType);

                    this.articleData.publishedDate = GlobalFunctions.sntGlobalDateFormatting(data.data[0].last_updated, 'timeZone');
                    this.metaTags(data.data[0], this.eventType);
                }
            }
        )
    }
    private getSyndicateVideoArticle(subCat, articleID){
        this._synservice.getSyndicateVideoService(subCat,articleID).subscribe(
            data => {
                this.articleData = data.data;
                this.articleData.url= VerticalGlobalFunctions.formatArticleRoute(this.subcategory,this.articleID,this.eventType);
                this.iframeUrl = this.articleData.video_url + "&autoplay=on";
                this.metaTags(this.articleData, this.eventType);
            }
        )
    }
    ngOnDestroy(){
        this.paramsub.unsubscribe();
    }
    getRecomendationData(c,count,sc){
        this.recomendationData=[];
        this._synservice.getRecArticleData(c,count,sc)
            .subscribe(data => {
                this.recomendationData = this._synservice.transformToRecArticles(data,this.subcategory,this.eventType);
            });
    }
    private getDeepDiveArticle(c,tl,sc,type,aid) {
        this.trendingData=[];
        this._synservice.getTrendingArticles(c,tl,sc).subscribe(
            data => {

                if(data.data.length==this.trendingLength) {
                    this.loadingshow=true;
                    this.trendingLength = this.trendingLength + 10;
                    this.trendingData= this._synservice.transformTrending(data.data, sc, type, aid);
                }
                else{
                    this.loadingshow=false;
                }
            }

        )
    }
    private metaTags(data, artType) {
        let metaDesc = GlobalSettings.getPageTitle('Dive into the most recent news about your favorite sports, movies and read the latest articles on politics, business, travel etc.', 'Articles');
        let link = window.location.href;

        this._seo.setCanonicalLink(link);
        this._seo.setOgDesc(metaDesc);
        this._seo.setOgType('Website');
        this._seo.setOgUrl(link);
        this._seo.setOgImage(GlobalSettings.getImageUrl('/app/public/mainLogo.png'));
        this._seo.setTitle('TCX Syndicate article');
        this._seo.setMetaDescription(metaDesc);
        this._seo.setMetaRobots('INDEX, FOLLOW');
        this._seo.setOgTitle(this.subcategory);


        if(artType=="story") {
            let image;
            if (data.article_data.images.length>=1  && data.article_data.images[0].image_url) {
                image = GlobalSettings.getImageUrl(data.article_data.images[0].image_url) ;
            } else if(data.article_data.images.length==0 ||data.article_data.images== null || data.article_data.images == undefined && data.image_url){
                image =GlobalSettings.getImageUrl(data.image_url);
            } else{
                image=GlobalSettings.getImageUrl("/app/public/placeholder_XL.png");
            }
            let articleAuthor = '';
            if (data.author) {

                let authorArray = data.author.split(' ');

                if (authorArray[0] == 'By') {
                    for (var i = 1; i < authorArray.length; i++) {
                        articleAuthor += authorArray[i] + ' ';
                    }
                } else {
                    for (var i = 0; i < authorArray.length; i++) {
                        articleAuthor += authorArray[i] + ' ';
                    }
                }

            }
            this._seo.setSource(data.source);
            this._seo.setArticleTitle(data.title);
            this._seo.setImageUrl(image);
            this._seo.setArticleUrl(link);
            this._seo.setArticleType(this.subcategory);
            this._seo.setArticleId(data.article_id);
            this._seo.setAuthor(articleAuthor);
            this._seo.setPublishedDate(data.last_updated);
            this._seo.setKeyword(data.keywords);
            this._seo.setSearchType('article');
            this._seo.setPublisher(data.publisher);
            this._seo.setSearchString(data.keywords);
            data.teaser?this._seo.setTeaser(data.teaser):this._seo.setTeaser(data.article_data.article[0]);

        }else{
            this._seo.setArticleTitle(data.title);
            this._seo.setArticleUrl(link);
            this._seo.setImageUrl(data.video_thumbnail);
            this._seo.setArticleId(data.id);
            this._seo.setKeyword(data.keyword);
            this._seo.setTeaser(data.teaser);
            this._seo.setSearchType('article');
            this._seo.setSearchString(data.keywords);
        }
    }

    @HostListener('window:scroll',['$event']) onScroll(e){
        var scrollingElement=e.target.body.getElementsByClassName('article-widget')[0];
        var header = e.target.body.getElementsByClassName('header')[0];
        var articleTitle = e.target.body.getElementsByClassName('articles-page-title')[0];
        var imageCarousel = e.target.body.getElementsByClassName('images-media')[0];
        var padding = 21;

        let topCSS = 0;
        topCSS = header != null ? topCSS + header.offsetHeight : topCSS;
        topCSS = articleTitle != null ? topCSS + articleTitle.offsetHeight : topCSS;
        topCSS = imageCarousel != null ? topCSS + imageCarousel.offsetHeight : topCSS;
        topCSS = topCSS - padding;

        if(scrollingElement){
            if(window.scrollY > topCSS){
                var sctop = window.scrollY-topCSS+'px';
                this._render.setElementStyle(scrollingElement,'top', sctop);
            }else {
                this._render.setElementStyle(scrollingElement, "top", '0')
            }
        }
        var trendingElement= e.target.body.getElementsByClassName('trending-small')[0];
        if(window.innerHeight + window.scrollY >= document.body.scrollHeight){
            this.getDeepDiveArticle(this.category, this.trendingLength, this.subcategory, this.eventType, this.articleID);

        };


    }


}
