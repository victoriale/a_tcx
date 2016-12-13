import {Injectable} from '@angular/core';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {Http} from '@angular/http';
import {GlobalFunctions} from '../global/global-functions';
import {VerticalGlobalFunctions}  from '../global/vertical-global-functions';
import {GlobalSettings} from '../global/global-settings';
declare let Fuse: any;

@Injectable()
export class SearchService{
    public pageMax: number = 10;
    public searchJSON: any;
    private _searchApi:string=GlobalSettings.getApiUrl();

    public searchAPI: string = "http://dev-touchdownloyal-api.synapsys.us" + '/landingPage/search';
    constructor(private http: Http, private _router:Router){
    }

    searchArticleService(userInput,currentPage){
        var callUrl = this._searchApi + '/' +'elasticSearch'+'/'+userInput+'/'+ 10 +'/'+ currentPage;
        return this.http.get(callUrl)
            .map(res=>res.json())
            .map(data => {
             return data;
            },  err => {
                console.log('ERROR search results');
            })
    }
    transformSearchResults(data) {
        data=data.article_data;

        var placeholder = "/app/public/placeholder_XL.png"

        data.forEach(function(val, index) {
            val['articleId']=val.article_id;
            val["publishedDate"] = GlobalFunctions.sntGlobalDateFormatting(val.published_date, 'timeZone');
            val["imagePathData"] = {
                imageClass: "embed-responsive-16by9",
                imageUrl:val.image_url?val.image_url:GlobalSettings.getImageUrl(placeholder),
                urlRouteArray: '/deep-dive',
            };
            val['title']=val.title;
            val["teaser"]=val.teaser.replace(/<ng2-route>|<\/ng2-route>/g,'');
            val['articleUrl']=val.article_url;
            val['keyword']=val.filter_keywords[0];
            val['author']=val.author;
            val['publisher']=val.publisher;
            val['is_stock_photo']=val.is_stock_photo;
        })
        return data;
    }


}
