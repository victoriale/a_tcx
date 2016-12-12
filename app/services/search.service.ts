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
        var callUrl = this._searchApi + '/' +'elasticSearch'+'/'+userInput+'/'+ currentPage;
        console.log(callUrl,"fhdjahfjsdh");
        return this.http.get(callUrl)
            .map(res=>res.json())
            .map(data => {
             return data;
            },  err => {
                console.log('ERROR search results');
            })
    }
    transformSearchResults(data) {

        var placeholder = "/app/public/placeholder_XL.png"

        data.forEach(function(val, index) {
            val['articleId']=val._source.id;
            val["publishedDate"] = GlobalFunctions.sntGlobalDateFormatting(val._source.lastModified, 'timeZone');
            val["imagePathData"] = {
                imageClass: "embed-responsive-16by9",
                imageUrl:val._source.image_url?GlobalSettings.getImageUrl(val._source.image_url):GlobalSettings.getImageUrl(placeholder),
                urlRouteArray: '/deep-dive',
            };
            val['title']=val._source.title;
            val["teaser"]=val._source.content;
            val['articleUrl']=val._source.url;
            val["provider"] = 'unknown';
            val['keyword']='unknown';
            val['author']='unknown';
            val['publisher']='unknown';
        })
        return data;
    }

    getdummydata(currentPage) {
        currentPage=currentPage-1;
        var startElem;
        if(currentPage==0) {
            startElem = 0;
        }else if(currentPage>0){
            startElem = currentPage*10;
        }
            return [
                {
                    isStockPhoto: false,
                    articleId: 1,
                    title: "Title of the article 1 : orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 1",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 1 ", // author full name
                    publisher: "Publisher 1", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQvl4MrtvCnxmU9xGdJZvXki5TSXz_aDJ0UpEPzpUz5GHdpIBKS",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQvl4MrtvCnxmU9xGdJZvXki5TSXz_aDJ0UpEPzpUz5GHdpIBKS",//for  >1 images in the carousel
                    teaser: "teaser 1 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 1",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 2,
                    title: "Title of the article 2: orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 2",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 2", // author full name
                    publisher: "Publisher 2", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",//for  >1 images in the carousel
                    teaser: "teaser 2 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 2",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 3,
                    title: "Title of the article 3: orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 3",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 3 ", // author full name
                    publisher: "Publisher 3", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSapwoNLnSIwdEf_8Z0atxkenYk7W_p3Nod2p6VDjKD5WQ8K4wj",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSapwoNLnSIwdEf_8Z0atxkenYk7W_p3Nod2p6VDjKD5WQ8K4wj",//for  >1 images in the carousel
                    teaser: "teaser 3 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 3",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 1,
                    title: "Title of the article 4: orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 4",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 4 ", // author full name
                    publisher: "Publisher 4", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",//for  >1 images in the carousel
                    teaser: "teaser 4 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 4",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 5,
                    title: "Title of the article 5",
                    keyword: "Keyword 5",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 5 ", // author full name
                    publisher: "Publisher 5", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "http://media.caranddriver.com/images/media/51/25-cars-worth-waiting-for-lp-ford-gt-photo-658253-s-original.jpg",//for  >1 images in the carousel
                    teaser: "teaser 5 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 5",//provider information
                },
                {
                    isStockPhoto: false,
                    articleId: 6,
                    title: "Title of the article 6 : orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 6",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 1 ", // author full name
                    publisher: "Publisher 1", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQvl4MrtvCnxmU9xGdJZvXki5TSXz_aDJ0UpEPzpUz5GHdpIBKS",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQvl4MrtvCnxmU9xGdJZvXki5TSXz_aDJ0UpEPzpUz5GHdpIBKS",//for  >1 images in the carousel
                    teaser: "teaser 1 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 1",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 7,
                    title: "Title of the article 7: orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 7",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 2", // author full name
                    publisher: "Publisher 2", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",//for  >1 images in the carousel
                    teaser: "teaser 2 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 2",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 8,
                    title: "Title of the article 8: orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 8",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 3 ", // author full name
                    publisher: "Publisher 3", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSapwoNLnSIwdEf_8Z0atxkenYk7W_p3Nod2p6VDjKD5WQ8K4wj",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSapwoNLnSIwdEf_8Z0atxkenYk7W_p3Nod2p6VDjKD5WQ8K4wj",//for  >1 images in the carousel
                    teaser: "teaser 3 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 3",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 9,
                    title: "Title of the article 9: orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 9",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 4 ", // author full name
                    publisher: "Publisher 4", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",//for  >1 images in the carousel
                    teaser: "teaser 4 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 4",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 10,
                    title: "Title of the article 10",
                    keyword: "Keyword 10",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 5 ", // author full name
                    publisher: "Publisher 5", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "http://media.caranddriver.com/images/media/51/25-cars-worth-waiting-for-lp-ford-gt-photo-658253-s-original.jpg",//for  >1 images in the carousel
                    teaser: "teaser 5 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 5",//provider information
                },
                {
                    isStockPhoto: false,
                    articleId: 11,
                    title: "Title of the article 11 : orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 11",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 1 ", // author full name
                    publisher: "Publisher 1", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQvl4MrtvCnxmU9xGdJZvXki5TSXz_aDJ0UpEPzpUz5GHdpIBKS",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQvl4MrtvCnxmU9xGdJZvXki5TSXz_aDJ0UpEPzpUz5GHdpIBKS",//for  >1 images in the carousel
                    teaser: "teaser 1 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 1",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 12,
                    title: "Title of the article 12: orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 12",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 2", // author full name
                    publisher: "Publisher 2", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",//for  >1 images in the carousel
                    teaser: "teaser 2 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 2",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 13,
                    title: "Title of the article 13: orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 13",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 3 ", // author full name
                    publisher: "Publisher 3", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSapwoNLnSIwdEf_8Z0atxkenYk7W_p3Nod2p6VDjKD5WQ8K4wj",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSapwoNLnSIwdEf_8Z0atxkenYk7W_p3Nod2p6VDjKD5WQ8K4wj",//for  >1 images in the carousel
                    teaser: "teaser 3 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 3",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 14,
                    title: "Title of the article 14: orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 14",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 4 ", // author full name
                    publisher: "Publisher 4", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",//for  >1 images in the carousel
                    teaser: "teaser 4 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 4",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 15,
                    title: "Title of the article 15",
                    keyword: "Keyword 15",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 5 ", // author full name
                    publisher: "Publisher 5", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "http://media.caranddriver.com/images/media/51/25-cars-worth-waiting-for-lp-ford-gt-photo-658253-s-original.jpg",//for  >1 images in the carousel
                    teaser: "teaser 5 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 5",//provider information
                },
                {
                    isStockPhoto: false,
                    articleId: 16,
                    title: "Title of the article 16 : orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 16",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 1 ", // author full name
                    publisher: "Publisher 1", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQvl4MrtvCnxmU9xGdJZvXki5TSXz_aDJ0UpEPzpUz5GHdpIBKS",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQvl4MrtvCnxmU9xGdJZvXki5TSXz_aDJ0UpEPzpUz5GHdpIBKS",//for  >1 images in the carousel
                    teaser: "teaser 1 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 1",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 17,
                    title: "Title of the article 17: orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 17",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 2", // author full name
                    publisher: "Publisher 2", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",//for  >1 images in the carousel
                    teaser: "teaser 2 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 2",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 18,
                    title: "Title of the article 18: orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 18",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 3 ", // author full name
                    publisher: "Publisher 3", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSapwoNLnSIwdEf_8Z0atxkenYk7W_p3Nod2p6VDjKD5WQ8K4wj",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSapwoNLnSIwdEf_8Z0atxkenYk7W_p3Nod2p6VDjKD5WQ8K4wj",//for  >1 images in the carousel
                    teaser: "teaser 3 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 3",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 19,
                    title: "Title of the article 19: orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 19",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 4 ", // author full name
                    publisher: "Publisher 4", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",//for  >1 images in the carousel
                    teaser: "teaser 4 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 4",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 20,
                    title: "Title of the article 20",
                    keyword: "Keyword 20",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 5 ", // author full name
                    publisher: "Publisher 5", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "http://media.caranddriver.com/images/media/51/25-cars-worth-waiting-for-lp-ford-gt-photo-658253-s-original.jpg",//for  >1 images in the carousel
                    teaser: "teaser 5 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 5",//provider information
                },
                {
                    isStockPhoto: false,
                    articleId: 21,
                    title: "Title of the article 21 : orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 21",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 1 ", // author full name
                    publisher: "Publisher 1", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQvl4MrtvCnxmU9xGdJZvXki5TSXz_aDJ0UpEPzpUz5GHdpIBKS",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQvl4MrtvCnxmU9xGdJZvXki5TSXz_aDJ0UpEPzpUz5GHdpIBKS",//for  >1 images in the carousel
                    teaser: "teaser 1 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 1",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 22,
                    title: "Title of the article 22: orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 22",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 2", // author full name
                    publisher: "Publisher 2", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",//for  >1 images in the carousel
                    teaser: "teaser 2 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 2",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 23,
                    title: "Title of the article 23: orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 23",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 3 ", // author full name
                    publisher: "Publisher 3", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSapwoNLnSIwdEf_8Z0atxkenYk7W_p3Nod2p6VDjKD5WQ8K4wj",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSapwoNLnSIwdEf_8Z0atxkenYk7W_p3Nod2p6VDjKD5WQ8K4wj",//for  >1 images in the carousel
                    teaser: "teaser 3 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 3",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 24,
                    title: "Title of the article 24: orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 24",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 4 ", // author full name
                    publisher: "Publisher 4", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",//for  >1 images in the carousel
                    teaser: "teaser 4 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 4",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 25,
                    title: "Title of the article 25",
                    keyword: "Keyword 25",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 5 ", // author full name
                    publisher: "Publisher 5", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "http://media.caranddriver.com/images/media/51/25-cars-worth-waiting-for-lp-ford-gt-photo-658253-s-original.jpg",//for  >1 images in the carousel
                    teaser: "teaser 5 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 5",//provider information
                },
                {
                    isStockPhoto: false,
                    articleId: 26,
                    title: "Title of the article 26 : orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 26",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 1 ", // author full name
                    publisher: "Publisher 1", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQvl4MrtvCnxmU9xGdJZvXki5TSXz_aDJ0UpEPzpUz5GHdpIBKS",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQvl4MrtvCnxmU9xGdJZvXki5TSXz_aDJ0UpEPzpUz5GHdpIBKS",//for  >1 images in the carousel
                    teaser: "teaser 1 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 1",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 27,
                    title: "Title of the article 27: orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 27",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 2", // author full name
                    publisher: "Publisher 2", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",//for  >1 images in the carousel
                    teaser: "teaser 2 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 2",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 28,
                    title: "Title of the article 28: orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 28",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 3 ", // author full name
                    publisher: "Publisher 3", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSapwoNLnSIwdEf_8Z0atxkenYk7W_p3Nod2p6VDjKD5WQ8K4wj",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSapwoNLnSIwdEf_8Z0atxkenYk7W_p3Nod2p6VDjKD5WQ8K4wj",//for  >1 images in the carousel
                    teaser: "teaser 3 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 3",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 29,
                    title: "Title of the article 29: orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 29",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 4 ", // author full name
                    publisher: "Publisher 4", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",//for  >1 images in the carousel
                    teaser: "teaser 4 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 4",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 30,
                    title: "Title of the article 30",
                    keyword: "Keyword 30",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 5 ", // author full name
                    publisher: "Publisher 5", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "http://media.caranddriver.com/images/media/51/25-cars-worth-waiting-for-lp-ford-gt-photo-658253-s-original.jpg",//for  >1 images in the carousel
                    teaser: "teaser 5 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 5",//provider information
                },
                {
                    isStockPhoto: false,
                    articleId: 31,
                    title: "Title of the article 31 : orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 31",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 1 ", // author full name
                    publisher: "Publisher 1", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQvl4MrtvCnxmU9xGdJZvXki5TSXz_aDJ0UpEPzpUz5GHdpIBKS",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQvl4MrtvCnxmU9xGdJZvXki5TSXz_aDJ0UpEPzpUz5GHdpIBKS",//for  >1 images in the carousel
                    teaser: "teaser 1 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 1",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 32,
                    title: "Title of the article 32: orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 32",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 2", // author full name
                    publisher: "Publisher 2", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",//for  >1 images in the carousel
                    teaser: "teaser 2 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 2",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 33,
                    title: "Title of the article 33: orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 33",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 3 ", // author full name
                    publisher: "Publisher 3", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSapwoNLnSIwdEf_8Z0atxkenYk7W_p3Nod2p6VDjKD5WQ8K4wj",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSapwoNLnSIwdEf_8Z0atxkenYk7W_p3Nod2p6VDjKD5WQ8K4wj",//for  >1 images in the carousel
                    teaser: "teaser 3 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 3",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 34,
                    title: "Title of the article 34: orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 34",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 4 ", // author full name
                    publisher: "Publisher 4", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",//for  >1 images in the carousel
                    teaser: "teaser 4 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 4",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 35,
                    title: "Title of the article 35",
                    keyword: "Keyword 35",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 5 ", // author full name
                    publisher: "Publisher 5", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "http://media.caranddriver.com/images/media/51/25-cars-worth-waiting-for-lp-ford-gt-photo-658253-s-original.jpg",//for  >1 images in the carousel
                    teaser: "teaser 5 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 5",//provider information
                },
                {
                    isStockPhoto: false,
                    articleId: 36,
                    title: "Title of the article 36 : orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 36",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 1 ", // author full name
                    publisher: "Publisher 1", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQvl4MrtvCnxmU9xGdJZvXki5TSXz_aDJ0UpEPzpUz5GHdpIBKS",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQvl4MrtvCnxmU9xGdJZvXki5TSXz_aDJ0UpEPzpUz5GHdpIBKS",//for  >1 images in the carousel
                    teaser: "teaser 1 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 1",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 37,
                    title: "Title of the article 37: orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 37",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 2", // author full name
                    publisher: "Publisher 2", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",//for  >1 images in the carousel
                    teaser: "teaser 2 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 2",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 38,
                    title: "Title of the article 38: orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 38",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 3 ", // author full name
                    publisher: "Publisher 3", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSapwoNLnSIwdEf_8Z0atxkenYk7W_p3Nod2p6VDjKD5WQ8K4wj",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSapwoNLnSIwdEf_8Z0atxkenYk7W_p3Nod2p6VDjKD5WQ8K4wj",//for  >1 images in the carousel
                    teaser: "teaser 3 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 3",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 39,
                    title: "Title of the article 39: orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 39",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 4 ", // author full name
                    publisher: "Publisher 4", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",//for  >1 images in the carousel
                    teaser: "teaser 4 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 4",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 40,
                    title: "Title of the article 40",
                    keyword: "Keyword 40",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 5 ", // author full name
                    publisher: "Publisher 5", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "http://media.caranddriver.com/images/media/51/25-cars-worth-waiting-for-lp-ford-gt-photo-658253-s-original.jpg",//for  >1 images in the carousel
                    teaser: "teaser 5 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 5",//provider information
                },
                {
                    isStockPhoto: false,
                    articleId: 41,
                    title: "Title of the article 41 : orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 41",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 1 ", // author full name
                    publisher: "Publisher 1", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQvl4MrtvCnxmU9xGdJZvXki5TSXz_aDJ0UpEPzpUz5GHdpIBKS",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQvl4MrtvCnxmU9xGdJZvXki5TSXz_aDJ0UpEPzpUz5GHdpIBKS",//for  >1 images in the carousel
                    teaser: "teaser 1 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 1",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 42,
                    title: "Title of the article 42: orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 42",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 2", // author full name
                    publisher: "Publisher 2", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",//for  >1 images in the carousel
                    teaser: "teaser 2 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 2",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 43,
                    title: "Title of the article 43: orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 43",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 3 ", // author full name
                    publisher: "Publisher 3", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSapwoNLnSIwdEf_8Z0atxkenYk7W_p3Nod2p6VDjKD5WQ8K4wj",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSapwoNLnSIwdEf_8Z0atxkenYk7W_p3Nod2p6VDjKD5WQ8K4wj",//for  >1 images in the carousel
                    teaser: "teaser 3 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 3",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 44,
                    title: "Title of the article 44: orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 44",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 4 ", // author full name
                    publisher: "Publisher 4", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",//for  >1 images in the carousel
                    teaser: "teaser 4 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 4",//provider information
                }, {
                    isStockPhoto: false,
                    articleId: 45,
                    title: "Title of the article 45",
                    keyword: "Keyword 45",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 5 ", // author full name
                    publisher: "Publisher 5", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "http://media.caranddriver.com/images/media/51/25-cars-worth-waiting-for-lp-ford-gt-photo-658253-s-original.jpg",//for  >1 images in the carousel
                    teaser: "teaser 5 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 5",//provider information
                },
                {
                    isStockPhoto: false,
                    articleId: 46,
                    title: "Title of the article 46 : orem Ipsum is simply dummy text of the printing and typesetting industry",
                    keyword: "Keyword 46",
                    publishedDate: "sept 29 2016", // unix time in millisecond
                    author: "Author 1 ", // author full name
                    publisher: "Publisher 1", // publisher full name
                    imagePathData: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQvl4MrtvCnxmU9xGdJZvXki5TSXz_aDJ0UpEPzpUz5GHdpIBKS",
                        urlRouteArray: '/deep-dive'
                    },
                    //imagePathData: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQvl4MrtvCnxmU9xGdJZvXki5TSXz_aDJ0UpEPzpUz5GHdpIBKS",//for  >1 images in the carousel
                    teaser: "teaser 1 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
                    articleUrl: "", // link of the article source
                    provider: "Provider 1",//provider information
                },

            ].splice(startElem,10);

    }




}
