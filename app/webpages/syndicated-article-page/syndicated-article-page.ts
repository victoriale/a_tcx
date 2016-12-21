import {Component, AfterViewInit, Input, OnChanges, OnDestroy, HostListener, ElementRef, Renderer} from '@angular/core';
import {SyndicateArticleService} from "../../services/syndicate-article.service";
import {GlobalSettings} from "../../global/global-settings";
import {ActivatedRoute, Route, Router, NavigationStart, Event as NavigationEvent} from "@angular/router";
import {GlobalFunctions} from "../../global/global-functions";
import {VerticalGlobalFunctions} from "../../global/vertical-global-functions";
import {SeoService} from "../../global/seo.service";
import {runInNewContext} from "vm";
import {element} from "@angular/upgrade/src/angular_js";

declare var jQuery:any;
declare var moment;

@Component({
    selector: 'syndicated-article-page',
    templateUrl: './app/webpages/syndicated-article-page/syndicated-article-page.html',

})

export class SyndicatedArticlePage implements OnDestroy{
    public partnerID: string;
    checkPartner: boolean;
    public geoLocation:string;
    public widgetPlace: string = "widgetForPage";
    public articleData: any;
    public recomendationData: any;
    public articleID: string;
    public trendingData:Array<any>=[];
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
    public scrollTopPrev:number=0;
    public prevArticles;
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
        this.getDeepDiveArticle(this.category, this.trendingLength, this.subcategory, this.eventType, this.articleID);
    }
    initializePage(){
        this.paramsub= this.activateRoute.params.subscribe(
            (param :any)=> {
                window.scrollTo(0, 0);
                this.articleID = param['articleID'],
                    this.eventType= param['articleType'],
                    this.category=param['category'],
                    this.subcategory=param['subCategory']?param['subCategory']:param['category'];
                if (this.eventType == "story" && this.articleID) {
                    this.getSyndicateArticle(this.articleID);
                }
                else {
                    this.getSyndicateVideoArticle(this.subcategory, this.articleID);
                }
                this.getRecomendationData(this.category, 4, this.subcategory);
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
                this.articleData=this._synservice.transformMainArticle(data.data,this.subcategory,articleID,this.eventType);
                this.imageData=this.articleData.imageData;
                this.imageTitle=this.articleData.imageTitle;
                this.copyright=this.articleData.copyright;
                this.metaTags(data.data[0],this.eventType);
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
        this._synservice.getRecArticleData(c,count,sc)
            .subscribe(data => {
                this.recomendationData=[];
                this.recomendationData = this._synservice.transformToRecArticles(data.data,this.subcategory,this.eventType, this.articleID);
            });
    }
    private getDeepDiveArticle(c,tl,sc,type,aid) {
        this.loadingshow=true;

        this._synservice.getTrendingArticles(c,tl,sc).subscribe(
            data => {

                if(data.length==10) {
                    this.loadingshow=true;
                    var newArray = this._synservice.transformTrending(data, sc, type, aid);
                    for(var i=0;i<newArray.length;i++) {
                        this.trendingData.push(newArray[i]);
                    }
                    this.trendingLength = this.trendingLength + 10;
                }else if(data.length>0 && data.length<10){
                    this.loadingshow=true;

                    var newArray = this._synservice.transformTrending(data, sc, type, aid);
                    for(var i=0;i<newArray.length;i++) {
                        this.trendingData.push(newArray[i]);
                    }
                    this.trendingLength = this.trendingLength + data.length;
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
        this._seo.setMetaRobots('INDEX, NOFOLLOW');
        this._seo.setOgTitle(this.subcategory);


        if(artType=="story") {
            let image;
           if(data.image_url != undefined && data.image_url != null){
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
            this._seo.setArticleTitle(data.title.replace(/\\'/g, "'"));
            this._seo.setImageUrl(image);
            this._seo.setArticleUrl(link);
            this._seo.setArticleType(this.subcategory);
            this._seo.setArticleId(data.article_id);
            this._seo.setAuthor(articleAuthor);
            this._seo.setPublishedDate(data.last_updated);
            this._seo.setKeyword(data.keywords);
            this._seo.setSearchType('article');
            this._seo.setPublisher(data.publisher);
            this._seo.setSearchString(data.keywords);//should be user input for search
            data.teaser?this._seo.setTeaser(data.teaser):this._seo.setTeaser(data.article_data.article[0]);

        }else{//video pages, etc. not article pages
            this._seo.setArticleTitle(data.title.replace(/\\'/g, "'"));
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
        var trendingElement= e.target.body.getElementsByClassName('trending-small')[0];
        var topHeight= window.pageYOffset? window.pageYOffset: window.scrollY;
        var scrollerHeight = e.target.documentElement.scrollHeight?e.target.documentElement.scrollHeight:e.target.body.scrollHeight;
        if(window.innerHeight + topHeight >= scrollerHeight && this.trendingLength>10){
            this.getDeepDiveArticle(this.category, this.trendingLength, this.subcategory, this.eventType, this.articleID);

        };


    }


}
