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
    private _searchApi:string=GlobalSettings.getApiUrl();
    constructor(private http: Http, private _router:Router){}

    searchArticleService(userInput,currentPage,filter1?,filter2?){
        var callUrl = null;
        //if user clicked on any of the dropdown filters then filter 1 and filer 2 has respected values to add to API
        if( filter1 || filter2 ){

            callUrl = this._searchApi + '/' + 'elasticSearch' + '/' + userInput + '/' + 10 + '/' + currentPage + '?';

            if(filter2 && filter2 != "none" && filter2 != undefined){

                callUrl += 'sortType=' + filter2;

            }

            if(filter1 && filter1!="all" && filter1!=undefined){

                callUrl += '&'+ 'category=' + filter1;

            }
        }

        // if there are no filters then the default API is called
        else {
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
                extUrl:true,
                imageClass: "embed-responsive-16by9",
                imageUrl:val.image_url?val.image_url+"?width="+GlobalSettings._imgMobile:GlobalSettings.getImageUrl(placeholder),
                urlRouteArray: val.article_url,
            };
            val['title']=val.title;
            val["teaser"]=val.teaser.replace(/<ng2-route>|<\/ng2-route>|/ig,'');
            val['keyword']=val.filter_keywords[0];
            val['author']=val.author;
            val['publisher']=val.publisher;
            val['is_stock_photo']=val.is_stock_photo;
            //val["url"] = val.source!="snt_ai"?VerticalGlobalFunctions.formatArticleRoute(scope, val.article_id, "story"):GlobalSettings.getOffsiteLink(val.scope,"article", VerticalGlobalFunctions.formatExternalArticleRoute(val.scope, articleType, val.event_id));
            val['citationInfo'] = {//TODO
              url: "/",
              info: "title/author"
            };
        })
        return data;
    }

    getkeyWords(){
        return [
            {
                key:"all",
                value:"All Keywords",
            },
            {
                key:"automotive",
                value:"Automotive",
            },
            {
                key:"business",
                value:"Business",
            },
            {
                key:'celebrities',
                value:"Celebrities",
            },
            {
                key:'entertainment',
                value:"Entertainment",
            },
            {
                key:'food',
                value:"Food",
            },
            {
                key:'health',
                value:"Health",
            },
            {
                key:'lifestyle',
                value:"Lifestyle",
            },
            {
                key:'mlb',
                value:"MLB",
            },
            {
                key:'movies',
                value:"Movies",
            },
            {
                key:'music',
                value:"Music",
            },
            {
                key:'nba',
                value:"NBA",
            },
            {
                key:'ncaaf',
                value:"NCAAF",
            },
            {
                key:'ncaam',
                value:"NCAAM",
            },
            {
                key:'nfl',
                value:"NFL",
            },
            {
                key:'politics',
                value:"Politics",
            },
            {
                key:'realestate',
                value:"Real Estate",
            },
            {
                key:'sports',
                value:"Sports",
            },
            {
                key:'travel',
                value:"Travel",
            },
            {
                key:'trending',
                value:"Trending",
            },
            {
                key:'tv',
                value:"Television Shows",
            },
            {
                key:'weather',
                value:"Weather",
            }];


    }
    getSortOptions(){
        return [
            {
                key:'none',
                value:"None",
            },

            {
                key:"recent",
                value:"Most Recent",
            },
            {
                key:'oldest',
                value:"Oldest",
            },
            {
                key:'past24hours',
                value:"Past 24 Hours",
            },
            {
                key:'past7days',
                value:"Past 7 Days",
            },
            {
             key:'past30days',
             value:"Past 30 Days",
             },
        ];
    }

}
