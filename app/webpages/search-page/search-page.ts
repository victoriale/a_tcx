
import {Component} from "@angular/core";
import {SearchInput} from "../../fe-core/components/search/search.component";
import {SyndicateArticleData} from "../../fe-core/interfaces/syndicate-article.data";
@Component({
    selector:"search-page",
    templateUrl:"app/webpages/search-page/search-page.html",
})
export class SearchPage{
    searchArticlesData:Array<SyndicateArticleData>=[
        {
            isStockPhoto:false,
            articleId: 1,
            title: "Title of the article 1",
            keyword: "Keyword 1",
            publishedDate: "sept 29 2016", // unix time in millisecond
            author: "Author 1 ", // author full name
            publisher: "Publisher 1", // publisher full name
            imagePathData: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",//for  >1 images in the carousel
            teaser: "teaser 1 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
            articleUrl: "", // link of the article source
            provider:"Provider 1",//provider information
        },{
            isStockPhoto:false,
            articleId: 2,
            title: "Title of the article 2",
            keyword: "Keyword 2",
            publishedDate: "sept 29 2016", // unix time in millisecond
            author: "Author 2", // author full name
            publisher: "Publisher 2", // publisher full name
            imagePathData: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",//for  >1 images in the carousel
            teaser: "teaser 2 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
            articleUrl: "", // link of the article source
            provider:"Provider 2",//provider information
        },{
            isStockPhoto:false,
            articleId: 3,
            title: "Title of the article 3",
            keyword: "Keyword 3",
            publishedDate: "sept 29 2016", // unix time in millisecond
            author: "Author 3 ", // author full name
            publisher: "Publisher 3", // publisher full name
            imagePathData: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",//for  >1 images in the carousel
            teaser: "teaser 3 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
            articleUrl: "", // link of the article source
            provider:"Provider 3",//provider information
        },{
            isStockPhoto:false,
            articleId: 1,
            title: "Title of the article 4",
            keyword: "Keyword 4",
            publishedDate: "sept 29 2016", // unix time in millisecond
            author: "Author 4 ", // author full name
            publisher: "Publisher 4", // publisher full name
            imagePathData: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",//for  >1 images in the carousel
            teaser: "teaser 4 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
            articleUrl: "", // link of the article source
            provider:"Provider 4",//provider information
        },{
            isStockPhoto:false,
            articleId: 1,
            title: "Title of the article 5",
            keyword: "Keyword 5",
            publishedDate: "sept 29 2016", // unix time in millisecond
            author: "Author 5 ", // author full name
            publisher: "Publisher 5", // publisher full name
            imagePathData: "http://www.thesupercars.org/wp-content/uploads/2011/04/2011-Porsche-Panamera-Individualization-Programme-white.jpg",//for  >1 images in the carousel
            teaser: "teaser 5 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,", //description
            articleUrl: "", // link of the article source
            provider:"Provider 5",//provider information
        },
    ];
}