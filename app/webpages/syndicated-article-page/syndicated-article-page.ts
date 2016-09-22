import {Component} from '@angular/core';
import {SyndicateArticleService} from "../../services/syndicate-article.service";

@Component({
    selector: 'syndicated-article-page',
    templateUrl: 'app/webpages/syndicated-article-page/syndicated-article-page.html'
})

export class SyndicatedArticlePage{
    dummyData:any;
    public articleType:string;
    public articleID:string;
    title:string="Here we have syndicate article page";
    constructor(private _synService:SyndicateArticleService){
        this.articleType="story";
        if (this.articleType == "story") {
            this._synService.getDummyData(this.articleID)
        }
        else {
            this._synService.getDummyData(this.articleID);
        }
    }
    ngOnInit(){
        this.dummyData=this._synService.dummyData;

    }
}

