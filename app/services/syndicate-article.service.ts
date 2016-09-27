
import {SyndicateArticleData, RecommendArticleData} from "../fe-core/interfaces/syndicate-article.data";
import {Inject, Injectable} from "@angular/core";
import {VerticalGlobalFunctions} from "../global/vertical-global-functions";
import {Http, Headers, HttpModule} from "@angular/http";
import { GlobalFunctions} from "../global/global-functions";
import {GlobalSettings} from "../global/global-settings";



declare var moment;



export class SyndicateArticleService{
    private _apiURL: string = "http://dev-touchdownloyal-api.synapsys.us/";
    private _articleUrl:string = 'http://dev-touchdownloyal-ai.synapsys.us/';

 constructor( @Inject private VerticalGlobalFunctions:VerticalGlobalFunctions, @Inject private _http:Http){}

    setToken(){
        var headers = new Headers({'content-type':'application/json'});
        //headers.append(this.headerName, this.apiToken);
        return headers;
    }
    getSyndicateArticleService(articleID){
        //Configure HTTP Headers
/*
        var headers = this.setToken();
*/
        var callURL = this._apiURL + 'article/' + articleID;
        return this._http.get(callURL)
            .map(res => res.json())
            .map(data => {
                return data;
            })
    }
    getSyndicateVideoService(articleID){
        //Configure HTTP Headers
        /*var headers = this.setToken();*/
        var callURL = this._apiURL + 'videoSingle/' + articleID;
        return this._http.get(callURL)
            .map(res => res.json())
            .map(data => {
                return data;
            })
    }
    getRecArticleData(scope, state, batch, limit){
       /* var headers = this.setToken();*/
        if(scope == null){
            scope = 'NFL';
        }
        if(state == null){
            state = 'CA';
        }
        if(batch == null || limit == null){
            batch = 1;
            limit = 1;
        }
        //this is the sidkeick url
        var callURL = this._articleUrl + "sidekick-regional/" + scope + "/" + state + "/" + batch + "/" + limit;//TODO won't need uppercase after ai fixes

        return this._http.get(callURL)
            .map(res => res.json())
            .map(data => {
                
                return data;
            });
    }

    transformToRecArticles(data){
        data = data.data;
        var sampleImage = "/app/public/placeholder_XL.png";
        var articleStackArray = [];
        var articles = [];
        var eventID = null;
       for(var obj in data){
            if(obj != "meta-data" && obj != "timestamp"){
                var a = {
                    keyword: obj,
                    info: data[obj]
                }
                articles.push(a);
            } else {
                var eventID = data['meta-data']['current']['eventID'];
            }
        }
        articles.forEach(function(val, index){
            var info = val.info;
            /*var date = moment(Number(info.dateline)*1000);
            date = GlobalFunctions.formatAPMonth(date.month()) + date.format(' DD, YYYY');*/
            var s = {
                urlRouteArray: VerticalGlobalFunctions.formatAiArticleRoute(val.keyword, eventID),
                bg_image_var: info.image != null ? GlobalSettings.getImageUrl(info.image) : sampleImage,
                keyword: val.keyword.replace('-', ' ').toUpperCase(),
                /*new_date: date,*/
                displayHeadline: info.displayHeadline,
            }
            articleStackArray.push(s);
        });
        return articleStackArray;
    }

    getDeepDiveBatchService(scope, limit, startNum, state?){
        //Configure HTTP Headers
        var headers = this.setToken();

        if(startNum == null){
            startNum = 1;
        }

        // http://dev-touchdownloyal-api.synapsys.us/articleBatch/nfl/5/1
        var callURL = this._apiURL + 'articleBatch/';

        if(scope != null){
            callURL += scope;
        } else {
            callURL += 'nfl';
        }
        if(state == null){
            state = 'CA';
        }
        callURL += '/' + limit + '/' + startNum + '/' + state;
        return this._http.get(callURL)
            .map(res => res.json())
            .map(data => {
                return data;
            })
    }

    transformTrending (data, currentArticleId) {
        data.forEach(function(val,index){
            //if (val.id != currentArticleId) {
            val["date"] = val.dateline;
            val["imagePath"] = GlobalSettings.getImageUrl(val.imagePath);
            val["newsRoute"] = VerticalGlobalFunctions.formatNewsRoute(val.id);
            //console.log(VerticalGlobalFunctions.formatNewsRoute(val.id,this.articleType),"News Route");
            //}
        })

        return data;
    }





}
