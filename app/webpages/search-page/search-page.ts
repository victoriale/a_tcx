
import {Component, HostListener, Renderer} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {SearchService} from "../../services/search.service";
@Component({
    selector:"search-page",
    templateUrl:"app/webpages/search-page/search-page.html",
})
export class SearchPage{
    pageSearchTitle=" Stay Current With The Latest News";
    pageSearchSubTitle="Search for a topic or keyword that interests you!";
    paramsub:any;
    userInput;
    searchArticlesData:any;
    currentPage:number=1;
    pageCount:number=5;
    articleCount:number=this.pageCount*10;
    keywordFilter:any;
    sortFilter:any;
    public scrollTopPrev:number=0;
    filter1:string;
    filter2:string;
    constructor(private activateRoute:ActivatedRoute, private searchService:SearchService, private _render:Renderer){
        this.paramsub=activateRoute.params.subscribe(
            (param :any)=> {
                this.userInput= param['userInput'];
                this.getSearchResult(this.userInput,this.currentPage);
                this.keywordFilter=this.searchService.getkeyWords();
                this.sortFilter=this.searchService.getSortOptions();

            }
        );

    }

    ngOnChanges(){

    }
    private getSearchResult(i,currentPage,filter1?,filter2?){
        this.searchService.searchArticleService(i,currentPage,filter1,filter2).subscribe(
            data=>{
                if(data.data.article_data) {
                    this.searchArticlesData = this.searchService.transformSearchResults(data.data);
                }else{
                    this.searchArticlesData=null;
                }
            }
        )
    }

    ngOnDestroy(){
        this.paramsub.unsubscribe();
    }
    getPageOnClick(e){
        this.currentPage=e;
        this.getSearchResult(this.userInput,this.currentPage);
    }
    chosenFilter1(e){
        this.filter1=e;
        this.filter2?this.getSearchResult(this.userInput,1,this.filter1,this.filter2):this.getSearchResult(this.userInput,1,this.filter1);

    }
    chosenFilter2(e){
        this.filter2=e;
        this.filter1?this.getSearchResult(this.userInput,1,this.filter1,this.filter2):this.getSearchResult(this.userInput,1,this.filter2);
    }

    @HostListener('window:scroll',['$event']) onScroll(e){
        var scrollingElement=e.target.body.getElementsByClassName('search-widget')[0];
        var header = e.target.body.getElementsByClassName('header')[0];
        var articleContainer= e.target.body.getElementsByClassName('search-article-container')[0];
        var fixedHeader = e.target.body.getElementsByClassName('fixedHeader')[0] != null ? e.target.body.getElementsByClassName('fixedHeader')[0].offsetHeight : 0;
        var footer = e.target.body.getElementsByClassName('footer')[0];
        let topCSS = 0;
        topCSS = header != null ? topCSS + header.offsetHeight : topCSS;
        topCSS = articleContainer != null ? topCSS +  articleContainer.offsetHeight : topCSS;
        topCSS = topCSS - fixedHeader;
        let bottomCSS=0;
        bottomCSS = footer!=null? bottomCSS + footer.offsetHeight: bottomCSS;
        var scrollTop = e.srcElement.body.scrollTop;
        let scrollUp = scrollTop - this.scrollTopPrev>0?true:false;
        var scrollBottom = e.target.body.scrollHeight-e.target.body.scrollTop==e.target.body.clientHeight?true:false;
        this.scrollTopPrev=scrollTop;
        if(scrollingElement){
            if(window.scrollY > topCSS){
                if(scrollUp) {
                    var sctop = window.scrollY - topCSS - 25 + 'px';
                    this._render.setElementStyle(scrollingElement, 'top', sctop);
                }else{
                    var headerTop=e.target.body.getElementsByClassName('header-top')[0];
                    var partnerheadTop=document.getElementById('partner_header')?document.getElementById('partner_header').offsetHeight:0;
                    var sctop = headerTop.offsetHeight? window.scrollY - topCSS + headerTop.offsetHeight + partnerheadTop + 10 + 'px' :window.scrollY - topCSS + partnerheadTop + 'px';
                    this._render.setElementStyle(scrollingElement, 'top', sctop);
                }
                if(scrollBottom && window.innerHeight - footer.offsetHeight <600){
                    var newTopCSS = window.scrollY - topCSS - bottomCSS - 50+ 'px';
                    this._render.setElementStyle(scrollingElement,'top', newTopCSS);
                }
            }else {
                this._render.setElementStyle(scrollingElement, "top", '0')
            }

        }
    }

}