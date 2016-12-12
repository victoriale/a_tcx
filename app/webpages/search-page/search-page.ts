
import {Component} from "@angular/core";
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
    constructor(private activateRoute:ActivatedRoute, private searchService:SearchService){
        this.paramsub=activateRoute.params.subscribe(
            (param :any)=> {
                this.userInput= param['userInput'];
                //this.getSearchResult(this.userInput,currentPage);
                this.getDummySearchResults(this.currentPage);
            }
        );

    }

    ngOnChanges(){

    }
    private getSearchResult(i,currentPage){
        this.searchService.searchArticleService(i,currentPage).subscribe(
            data=>{
                this.searchArticlesData=this.searchService.transformSearchResults(data);
                console.log(this.searchArticlesData);
            }
        )
    }
    private getDummySearchResults(currentPage){
      this.searchArticlesData=this.searchService.getdummydata(currentPage);
    }
    ngOnDestroy(){
        this.paramsub.unsubscribe();
    }
    getPageOnClick(e){
        this.currentPage=e;
        this.getDummySearchResults(this.currentPage);
    }
}