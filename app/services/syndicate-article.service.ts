import { VerticalGlobalFunctions } from "../global/vertical-global-functions";
import {Http, Headers, URLSearchParams, RequestOptions} from "@angular/http";
import { GlobalSettings } from "../global/global-settings";
import { Injectable } from "@angular/core";
import {GlobalFunctions} from "../global/global-functions";

declare var moment;

@Injectable()
export class SyndicateArticleService {
    private _syndicateUrl: string = GlobalSettings.getArticleBatchUrl();
    private headerOptions = new RequestOptions({headers:new Headers()});


    constructor(public _http: Http) { }

    setToken() {
        var headers = new Headers({ 'content-type': 'application/json' });
        //headers.append(this.headerName, this.apiToken);
        return headers;
    }
    getSyndicateArticleService(articleID) {
        let params:URLSearchParams=new URLSearchParams();
        params.set("articleID", articleID.toString());
        this.headerOptions.search=params;
        var callURL = this._syndicateUrl;
        return this._http.get(callURL, this.headerOptions).retry(2)
            .map(res => res.json())
            .map(data => data)
    }

    transformMainArticle(data,c,sc,ai,et){
        var imageData=[];
        var imageTitle=[];
        var copyright=[];
        var artwriter='';
        data = data[0];
        var mainArticleData:any={
            'url':'',
            'title':'',
            'author':'',
            'publisher':'',
            'imageData':[],
            'imageTitle':[],
            'copyright':[],
            'publishedDate':'',
            'article':[],
            'trendingKeyword':'',

        };
        if(data.author){
            let authorArray = data.author.split(' ');
            if(authorArray[0] =='By'){
                for(var i=1;i<authorArray.length;i++){artwriter += authorArray[i] + ' ';}
            }else{
                for(var i=0;i<authorArray.length;i++){artwriter += authorArray[i] + ' ';}
            }
        }
        if(data.is_stock_photo && data.is_stock_photo==true){
            mainArticleData['is_stock']=true;
        }else{
            mainArticleData['is_stock']=false;
        }
        mainArticleData['url'] = VerticalGlobalFunctions.formatArticleRoute(c, sc, ai, et);
        mainArticleData['title'] = data.title.replace(/\'/g, "'");
        mainArticleData['author'] = artwriter;
        mainArticleData['publisher'] = data.publisher;
        mainArticleData['publishedDate'] = GlobalFunctions.sntGlobalDateFormatting(data.publication_date, 'timeZone');
        var imageLength = data.article_data.images.length;
        if(imageLength > 0){
          for (var i = 0; i < imageLength; i++) {
            imageData[imageData.length] = GlobalSettings.getImageUrl(data.article_data.images[i].image_url, GlobalSettings._imgLgScreen);
            copyright[copyright.length] = data.article_data.images[i].image_copyright;
            imageTitle[imageTitle.length] = data.article_data.images[i].image_title;
          }
        }
        mainArticleData['imageData'] = imageLength > 0 ? imageData : null;
        mainArticleData['imageTitle'] = imageTitle ? imageTitle : null;
        mainArticleData['copyright'] = copyright ? copyright : null;
        mainArticleData['is_stock'] = data.is_stock_photo;
        if(data.keywords.length > 0 && data.keywords[0] != "none" && data.keywords[0]){
            if(data.keywords.length > 1 && data.keywords[1] != "none" && data.keywords[1]){
                mainArticleData['trendingKeyword'] = data.keywords[1];
            } else {
                mainArticleData['trendingKeyword']=data.keywords[0];
            }
        }else{
            if(data.subcategory){
                mainArticleData['trendingKeyword'] = data.subcategory;
            } else {
                mainArticleData['trendingKeyword'] = data.category;
            }
        }
        mainArticleData['article'] = data.article_data.article;
        return mainArticleData;
    }
    getSyndicateVideoService(subcategory, articleID){
        //Configure HTTP Headers
        /*var headers = this.setToken();*/
        var callURL = GlobalSettings.getApiUrl() + '/tcx/videoSingle/' +subcategory +'/'+ articleID;
        return this._http.get(callURL)
            .map(res => res.json())
            .map(data => {
                return data;
            })
    }

    getArticleBatch(category, subcategory,count,trending?,page?){
        if(subcategory=="real-estate"){
            subcategory=subcategory.replace(/-/g," ");
        };
        let params:URLSearchParams=new URLSearchParams();

        if(GlobalSettings.getTCXscope(subcategory).topScope == 'basketball' || GlobalSettings.getTCXscope(subcategory).topScope == 'football'||GlobalSettings.getTCXscope(subcategory).topScope == 'baseball'){
            params.set("category", "sports");
            params.set("subCategory",subcategory);
        }else{
            params.set("category", category)
        };
        params.set("count", count.toString());
        params.set("metaDataOnly","1");
        if(typeof trending==='undefined') {
            params.set("random","1");
            this.headerOptions.search=params;
            let callURL = GlobalSettings.getArticleBatchUrl()+"?&source[]=snt_ai&source[]=tca-curated&source[]=tronc";
            return this._http.get(callURL, this.headerOptions)
                .map(res => res.json())
                .map(data => {
                    return data.data;
                })
        } else{
            params.set("trending","1");
            params.set("page",page.toString());
            this.headerOptions.search=params;
            let callURL = GlobalSettings.getArticleBatchUrl();
            return this._http.get(callURL, this.headerOptions)
                .map(res => res.json())
                .map(data => {
                    return data.data;
                })
        }
    }

    transformToRecArticles(data, c, scope, articleType, currentArticleId) {
        articleType = "story";
        var sampleImage = "/app/public/placeholder_XL.png";
        var articleStackArray = [];
        data.forEach(function(val, index) {
            if (val.article_id != currentArticleId){
                var category = val.article_sub_type ? val.article_sub_type : val.article_type;
                var date = GlobalFunctions.sntGlobalDateFormatting(val.publication_date, 'dayOfWeek');
                var s = {
                    imageConfig: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: val.image_url != null ? GlobalSettings.getImageUrl(val.image_url, GlobalSettings._imgFullScreen) : sampleImage,
                        extUrl: val.source != "snt_ai" ? false : true,
                        urlRouteArray: val.source != "snt_ai" ? VerticalGlobalFunctions.formatArticleRoute(c, scope, val.article_id, articleType) : GlobalSettings.getOffsiteLink(val.scope, "article", VerticalGlobalFunctions.formatExternalArticleRoute(val.scope, category, val.event_id)),
                        imageDesc: "",
                    },
                    citationInfo: {//TODO
                        url: "/",
                        info: "title/author"
                    },
                    keyword: val.keywords.length>0? val.keywords[0].toUpperCase():scope,
                    timeStamp: date,
                    title: val.title? val.title.replace(/\'/g, "'"): "",
                    extUrl:val.source != "snt_ai" ? false : true,
                    keyUrl: val['keywords'][0] ? VerticalGlobalFunctions.formatSectionFrontRoute(val['keywords'][0]) : ["/news-feed"],
                    articleUrl: val.source != "snt_ai" ? VerticalGlobalFunctions.formatArticleRoute(c, scope, val.article_id, articleType) : GlobalSettings.getOffsiteLink(val.scope, "article", VerticalGlobalFunctions.formatExternalArticleRoute(val.scope, articleType, val.event_id)),

                }
                articleStackArray.push(s);
            }
        });
        if(articleStackArray.length==3){ return articleStackArray;}
        else if(articleStackArray.length>3){return articleStackArray.slice(1)}

    }

    transformTrending(data, c, scope, articleType, currentArticleId) {
        articleType = "story";
        var placeholder = "/app/public/placeholder_XL.png";
        data.forEach(function(val, index) {
            var category = val.article_sub_type ? val.article_sub_type : val.article_type;
            val["date"] = GlobalFunctions.sntGlobalDateFormatting(val.publication_date, 'timeZone');
            val["image"] = val.image_url != null ? GlobalSettings.getImageUrl(val.image_url, GlobalSettings._imgFullScreen) : GlobalSettings.getImageUrl(placeholder);
            val["content"]=val.teaser;
            val['extUrl']=val.source!="snt_ai"?false:true;
            val["url"] = val.source!="snt_ai"?VerticalGlobalFunctions.formatArticleRoute(c, scope, val.article_id, articleType):GlobalSettings.getOffsiteLink(val.scope,"article", VerticalGlobalFunctions.formatExternalArticleRoute(val.scope, category, val.event_id));
            val['teaser']=val.teaser?val.teaser:val.article_data.article[0];
            var articleWriter='';
            if(val.author){
                let authorArray = val.author.split(' ');
                if(authorArray[0] =='By'){
                    for(var i=1;i<authorArray.length;i++) {
                        articleWriter += authorArray[i] + ' ';
                    }
                }else{
                    for(var i=0;i<authorArray.length;i++) {
                        articleWriter += authorArray[i] + ' ';
                    }
                }
            }
            val['citationInfo'] = {//TODO
                url: "/",
                info: "title/author"
            };
            val['author']=articleWriter;
            val['title']= val.title? val.title.replace(/\'/g, "'"): "";
        })
        return data;
    }
}
