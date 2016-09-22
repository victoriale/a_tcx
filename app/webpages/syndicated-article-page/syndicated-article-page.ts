import {Component} from '@angular/core';
import {SyndicateArticleService} from "../../services/syndicate-article.service";

@Component({
    selector: 'syndicated-article-page',
    templateUrl: 'app/webpages/syndicated-article-page/syndicated-article-page.html'
})

export class SyndicatedArticlePage{
    dummyData:any;
    title:string="Here we have syndicate article page";
    constructor(private _synService:SyndicateArticleService){}
    ngOnInit(){
        this.dummyData=this._synService.dummyData;

    }
}

