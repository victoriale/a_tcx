


import {VerticalGlobalFunctions} from "../global/vertical-global-functions";
import {Http, Headers, HttpModule} from "@angular/http";
import {GlobalSettings} from "../global/global-settings";
import {Inject, Injectable} from "@angular/core";



declare var moment;



export class SyndicateArticleService{
    private _syndicateUrl:string= GlobalSettings.getSyndicateUrl();


 constructor( @Inject public _http:Http){}

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
        var callURL = this._syndicateUrl + '?articleID=' + articleID;
        return this._http.get(callURL)
            .map(res => res.json())
            .map(data => {
                return data;
            })
    }
    getSyndicateVideoService(articleID){
        //Configure HTTP Headers
        /*var headers = this.setToken();*/
        var callURL = GlobalSettings.getApiUrl()+ '/tcx/videoSingle/' + articleID;
        return this._http.get(callURL)
            .map(res => res.json())
            .map(data => {
                return data;
            })
    }
    getRecArticleData(category, count, subcategory?){
       /* var headers = this.setToken();*/
        if(category=='real-estate'){
            category='real+estate';
        }
        var callURL
        if(subcategory) {
            callURL= this._syndicateUrl + '?source=tca&count=' + count + "&category=" + category + "&subCategory=" + subcategory;

        }else{
            callURL= this._syndicateUrl + '?source=tca&count=' + count + "&category=" + category;
        }

        return this._http.get(callURL)
            .map(res => res.json())
            .map(data => {
                
                return data;
            });
    }

    transformToRecArticles(data, scope,articleType){
        data = data.data;
        articleType="story";
        var sampleImage = "/app/public/placeholder_XL.png";
        var articleStackArray = [];
        var articles = [];
        var eventID = null;

        data.forEach(function(val, index){
            var info = val.info;
            var date = moment(Number(val.publication_date)*1000);
            date = moment(date).format("dddd MMMM, YYYY | h:mm A");
            var s = {
                urlRouteArray: VerticalGlobalFunctions.formatArticleRoute(scope,val.article_id,articleType),
                bg_image_var: val.image_url != null ? GlobalSettings.getImageUrl(val.image_url) : sampleImage,
                keyword: val.keywords[0].toUpperCase(),
                new_date: date,
                displayHeadline: val.title,
            }
            articleStackArray.push(s);
        });
        return articleStackArray;
    }
//http://dev-tcxmedia-api.synapsys.us/articles?source=tca&count=10&category=entertainment&subCategory=television
    getTrendingArticles(category, count,subcategory?){
        if(category=='real-estate'){
            category='real+estate';
        }
        var headers = this.setToken();
        var callURL
        if(subcategory) {
            callURL= this._syndicateUrl + '?source=tca&count=' + count + "&category=" + category + "&subCategory=" + subcategory;
        }else{
            callURL= this._syndicateUrl + '?source=tca&count=' + count + "&category=" + category;
        }

        return this._http.get(callURL)
            .map(res => res.json())
            .map(data => {
                return data;
            })
    }


    transformTrending (data, scope, articleType,currentArticleId) {
        articleType="story";
        var placeholder="/app/public/placeholder_XL.png"
        data.forEach(function(val,index){
            if (val.article_id != currentArticleId) {

            val["date"] = val.article_data.publication_date;
            val["imagePath"] = val.image_url?GlobalSettings.getImageUrl(val.image_url):GlobalSettings.getImageUrl(placeholder);
            val["newsRoute"] = VerticalGlobalFunctions.formatArticleRoute(scope,val.article_id,articleType);
            //console.log(VerticalGlobalFunctions.formatNewsRoute(val.id,this.articleType),"News Route");
            }
        })

        return data;
    }





}
