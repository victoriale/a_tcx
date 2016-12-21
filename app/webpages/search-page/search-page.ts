
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
    currentPage:number=0;
    pageCount:number;
    articleCount:number;
    keywordFilter:any;
    sortFilter:any;
    error:any;
    public scrollTopPrev:number=0;
    filter1:string;
    filter2:string;
    constructor(private activateRoute:ActivatedRoute, private searchService:SearchService, private _render:Renderer){
        this.paramsub=activateRoute.params.subscribe(
            (param :any)=> {
                this.currentPage=0; //initialize current page to start page (i.e currently 0 in the API)
                this.userInput= param['userInput'];
                this.getSearchResult(this.userInput,this.currentPage);
                this.keywordFilter=this.searchService.getkeyWords(); //get all the keywords for the dropdown
                this.sortFilter=this.searchService.getSortOptions(); //get all the sort options for the dropdown
            }
        );
    }

    ngOnChanges(){}

    /* method to get the articles*/
    private getSearchResult(i,currentPage,filter1?,filter2?){
        this.searchService.searchArticleService(i,currentPage,filter1,filter2).subscribe(
            data=>{
                if(data.data.article_data) {
                    this.searchArticlesData = this.searchService.transformSearchResults(data.data);
                    this.pageCount=data.data.total_pages;
                    this.articleCount=this.pageCount*10;
                }else{
                    this.searchArticlesData=null;
                    this.pageCount=0;
                    this.articleCount=this.pageCount*10;
                }
            }
        )
    }

    ngOnDestroy(){
        this.paramsub.unsubscribe();
    }
    getPageOnClick(e){ //e => page number i
        this.currentPage=e;
        this.getSearchResult(this.userInput,this.currentPage,this.filter1,this.filter2);


    }
    chosenFilter1(e){ //e => selection from the dropdown filter: categories
        this.currentPage=0;
        this.filter1=e;
        this.getSearchResult(this.userInput,this.currentPage,this.filter1,this.filter2)

    }
    chosenFilter2(e){ //e => selection from the dropdown filter: sort options
        this.currentPage=0;
        this.filter2=e;
        this.getSearchResult(this.userInput,this.currentPage,this.filter1,this.filter2)
         }
}
