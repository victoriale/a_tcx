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

    searchArticleService(userInput,currentPage,filter1?,filter2?){
        var callUrl = null;
        if(filter1 || filter2){
            callUrl = this._searchApi + '/' + 'elasticSearch' + '/' + userInput + '/' + 10 + '/' + currentPage + '?';
            if(filter1){
              callUrl += 'category=football';//TODO default to football until more data available
              // callUrl += 'category=' + filter1;
            } else if(filter2){
              if(filter1){callUrl += '&';}
              callUrl += 'sortType=' + filter2;
            }
        }else {
            callUrl = this._searchApi + '/' + 'elasticSearch' + '/' + userInput + '/' + 10 + '/' + currentPage;
        }
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
                urlRouteArray: '/news-feed',
            };
            val['title']=val.title;
            val["teaser"]=val.teaser.replace(/<ng2-route>|<\/ng2-route>|/ig,'');
            val['articleUrl']=val.article_url;
            val['keyword']=val.filter_keywords[0];
            val['author']=val.author;
            val['publisher']=val.publisher;
            val['is_stock_photo']=val.is_stock_photo;
        })
        return data;
    }

    getkeyWords(){
        return [
            {
                key:"All",
                value:"All Keywords",
            },
            {
                key:"Automotive",
                value:"Automotive",
            },
            {
                key:"Business",
                value:"Business",
            },
            {
                key:'Celebrities',
                value:"Celebrities",
            },
            {
                key:'Entertainment',
                value:"Entertainment",
            },
            {
                key:'Food',
                value:"Food",
            },
            {
                key:'Health',
                value:"Health",
            },
            {
                key:'Lifestyle',
                value:"Lifestyle",
            },
            {
                key:'MLB',
                value:"MLB",
            },
            {
                key:'Movies',
                value:"Movies",
            },
            {
                key:'Music',
                value:"Music",
            },
            {
                key:'NBA',
                value:"NBA",
            },
            {
                key:'NCAAF',
                value:"NCAAF",
            },
            {
                key:'NCAAM',
                value:"NCAAM",
            },
            {
                key:'NFL',
                value:"NFL",
            },
            {
                key:'Politics',
                value:"Politics",
            },
            {
                key:'Real Estate',
                value:"Real Estate",
            },
            {
                key:'Sports',
                value:"Sports",
            },
            {
                key:'Travel',
                value:"Travel",
            },
            {
                key:'Trending',
                value:"Trending",
            },
            {
                key:'Television Shows',
                value:"Television Shows",
            },
            {
                key:'Weather',
                value:"Weather",
            }];


    }
    getSortOptions(){
        return [
            {
                key:'None',
                value:"None",
            },

            {
                key:"MostRecent",
                value:"Most Recent",
            },
            {
                key:'Oldest',
                value:"Oldest",
            },
            {
                key:'last24Hours',
                value:"Last 24 Hours",
            },
            {
                key:'past7days',
                value:"Past 7 Days",
            },
            /*{
             key:'MostShares',
             value:"Most Shares",
             },
             {
             key:'MostViews',
             value:"Most Views",
             },*/
        ];
    }

}
