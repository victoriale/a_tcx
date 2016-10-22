


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
        var callURL = this._syndicateUrl + 'videoSingle/' + articleID;
        return this._http.get(callURL)
            .map(res => res.json())
            .map(data => {
                return data;
            })
    }
    getRecArticleData(category, subcategory, count){
       /* var headers = this.setToken();*/

        var callURL= this._syndicateUrl+ '?source=tca&count='+count+"&category="+category+"&subCategory="+subcategory;

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

        data.forEach(function(val, index){
            var info = val.info;
            /*var date = moment(Number(info.dateline)*1000);
            date = GlobalFunctions.formatAPMonth(date.month()) + date.format(' DD, YYYY');*/
            var s = {
                urlRouteArray: VerticalGlobalFunctions.formatAiArticleRoute(val.keywords[0], eventID),
                bg_image_var: val.image_url != null ? GlobalSettings.getImageUrl(val.image_url) : sampleImage,
                keyword: val.keywords[0].toUpperCase(),
                /*new_date: date,*/
                displayHeadline: val.title,
            }
            articleStackArray.push(s);
        });
        return articleStackArray;
    }
//http://dev-tcxmedia-api.synapsys.us/articles?source=tca&count=10&category=entertainment&subCategory=television
    getTrendingArticles(category, subcategory,count){
        var headers = this.setToken();
        var callURL= this._syndicateUrl+ '?source=tca&count='+count+"&category="+category+"&subCategory="+subcategory;
        return this._http.get(callURL)
            .map(res => res.json())
            .map(data => {
                return data;
            })
    }


    transformTrending (data) {
        data.forEach(function(val,index){
            //if (val.id != currentArticleId) {
            val["date"] = val.article_data.publication_date;
            val["imagePath"] = GlobalSettings.getImageUrl(val.image_url);
            val["newsRoute"] = VerticalGlobalFunctions.formatNewsRoute(val.id);
            //console.log(VerticalGlobalFunctions.formatNewsRoute(val.id,this.articleType),"News Route");
            //}
        })

        return data;
    }





}
