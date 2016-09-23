
import {SyndicateArticleData, RecommendArticleData} from "../fe-core/interfaces/syndicate-article.data";
import {Inject} from "@angular/core";
import {VerticalGlobalFunctions} from "../global/vertical-global-functions";


export class SyndicateArticleService{

 constructor(@Inject private VerticalGlobalFunctions:VerticalGlobalFunctions){}
  dummyData: SyndicateArticleData={
        articleId: 1,
        title: "Static Article Title",
        keyword: "Static Keyword",
        publishedDate: "Sept 21 2016",
        author:"Anonymous",
        publisher:"Anonymous",
        imagePathData:["http://media.caranddriver.com/images/media/51/25-cars-worth-waiting-for-lp-ford-gt-photo-658253-s-original.jpg"],
        teaser:"Lorem Ipsum is simply dummy text of the printing and typesetting industry, scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. I",
        articleUrl: "",
        provider:"Anonymous",
  };
  recommendationsDummyData = {
      data:[ {
          keyword: "KEYWORD1 TCX",
          publishedDate: "Sept 22 2016",
          headLine: "This is headline 1",
          imagePath: "http://media.caranddriver.com/images/16q1/665057/buick-avista-concept-dissected-design-powertrain-and-more-feature-car-and-driver-photo-666699-s-450x274.jpg",

      },
    {
        keyword: "KEYWORD2 TCX",
        publishedDate: "Sept 22 2016",
        headLine: "This is headline 2",
        imagePath: "http://media.caranddriver.com/images/16q1/665057/buick-avista-concept-dissected-design-powertrain-and-more-feature-car-and-driver-photo-666699-s-450x274.jpg",

    },
      {
          keyword: "KEYWORD3 TCX",
          publishedDate: "Sept 22 2016",
          headLine: "This is headline 3",
          imagePath: "http://media.caranddriver.com/images/16q1/665057/buick-avista-concept-dissected-design-powertrain-and-more-feature-car-and-driver-photo-666699-s-450x274.jpg",

      },

  ]

  };

  trendingData = {
      data:[ {
          articleId: 2,
          title: "Static Article Title",
          keyword: "Static Keyword",
          publishedDate: "Sept 21 2016",
          author:"Anonymous",
          publisher:"Anonymous",
          imagePathData:"http://media.caranddriver.com/images/media/51/25-cars-worth-waiting-for-lp-ford-gt-photo-658253-s-original.jpg",
          teaser:"Lorem Ipsum is simply dummy text of the printing and typesetting industry, scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. I",
          articleUrl: "",
          provider:"Anonymous",
      },
          {
              articleId: 3,
              title: "Static Article Title",
              keyword: "Static Keyword",
              publishedDate: "Sept 21 2016",
              author:"Anonymous",
              publisher:"Anonymous",
              imagePathData:"http://assets-jpcust.jwpsrv.com/thumbs/JwBiVKGa.jpg",
              teaser:"Lorem Ipsum is simply dummy text of the printing and typesetting industry, scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. I",
              articleUrl: "",
              provider:"Anonymous",
          },
          {
              articleId: 4,
              title: "Static Article Title",
              keyword: "Static Keyword",
              publishedDate: "Sept 21 2016",
              author:"Anonymous",
              publisher:"Anonymous",
              imagePathData:"http://media.caranddriver.com/images/media/51/25-cars-worth-waiting-for-lp-ford-gt-photo-658253-s-original.jpg",
              teaser:"Lorem Ipsum is simply dummy text of the printing and typesetting industry, scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. I",
              articleUrl: "",
              provider:"Anonymous",
          },
          {
              articleId: 5,
              title: "Static Article Title",
              keyword: "Static Keyword",
              publishedDate: "Sept 21 2016",
              author:"Anonymous",
              publisher:"Anonymous",
              imagePathData:"http://assets-jpcust.jwpsrv.com/thumbs/JwBiVKGa.jpg",
              teaser:"Lorem Ipsum is simply dummy text of the printing and typesetting industry, scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. I",
              articleUrl: "",
              provider:"Anonymous",
          },
          {
              articleId: 6,
              title: "Static Article Title",
              keyword: "Static Keyword",
              publishedDate: "Sept 21 2016",
              author:"Anonymous",
              publisher:"Anonymous",
              imagePathData:"http://media.caranddriver.com/images/media/51/25-cars-worth-waiting-for-lp-ford-gt-photo-658253-s-original.jpg",
              teaser:"Lorem Ipsum is simply dummy text of the printing and typesetting industry, scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. I",
              articleUrl: "",
              provider:"Anonymous",
          },
          {
              articleId: 7,
              title: "Static Article Title",
              keyword: "Static Keyword",
              publishedDate: "Sept 21 2016",
              author:"Anonymous",
              publisher:"Anonymous",
              imagePathData:"http://assets-jpcust.jwpsrv.com/thumbs/JwBiVKGa.jpg",
              teaser:"Lorem Ipsum is simply dummy text of the printing and typesetting industry, scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. I",
              articleUrl: "",
              provider:"Anonymous",
          },
          {
              articleId: 8,
              title: "Static Article Title",
              keyword: "Static Keyword",
              publishedDate: "Sept 21 2016",
              author:"Anonymous",
              publisher:"Anonymous",
              imagePathData:"http://media.caranddriver.com/images/media/51/25-cars-worth-waiting-for-lp-ford-gt-photo-658253-s-original.jpg",
              teaser:"Lorem Ipsum is simply dummy text of the printing and typesetting industry, scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. I",
              articleUrl: "",
              provider:"Anonymous",
          },
          {
              articleId: 9,
              title: "Static Article Title",
              keyword: "Static Keyword",
              publishedDate: "Sept 21 2016",
              author:"Anonymous",
              publisher:"Anonymous",
              imagePathData:"http://assets-jpcust.jwpsrv.com/thumbs/JwBiVKGa.jpg",
              teaser:"Lorem Ipsum is simply dummy text of the printing and typesetting industry, scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. I",
              articleUrl: "",
              provider:"Anonymous",
          },
          {
              articleId: 10,
              title: "Static Article Title",
              keyword: "Static Keyword",
              publishedDate: "Sept 21 2016",
              author:"Anonymous",
              publisher:"Anonymous",
              imagePathData:"http://media.caranddriver.com/images/media/51/25-cars-worth-waiting-for-lp-ford-gt-photo-658253-s-original.jpg",
              teaser:"Lorem Ipsum is simply dummy text of the printing and typesetting industry, scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. I",
              articleUrl: "",
              provider:"Anonymous",
          },
          {
              articleId: 1,
              title: "Static Article Title",
              keyword: "Static Keyword",
              publishedDate: "Sept 21 2016",
              author:"Anonymous",
              publisher:"Anonymous",
              imagePathData:"http://assets-jpcust.jwpsrv.com/thumbs/JwBiVKGa.jpg",
              teaser:"Lorem Ipsum is simply dummy text of the printing and typesetting industry, scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. I",
              articleUrl: "",
              provider:"Anonymous",
          },


      ]
  }
 getDummyData(articleId){

       return this.dummyData;

 }
 getRecommendDummyData(){
     return this.recommendationsDummyData.data;
 }

 getTrendingData(currentArticleId){
      this.trendingData.data.forEach(function(val, index){

         val["newsRoute"]= VerticalGlobalFunctions.formatNewsRoute(val.articleId);

     })

     return this.trendingData.data;
 }




}
