import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalModule } from './global.ngmodule';
import { SyndicatedArticlePage } from "../webpages/syndicated-article-page/syndicated-article-page";
import {SyndicateArticleService} from "../services/syndicate-article.service";
import {MainArticle} from "../fe-core/components/syndicate-components/syndicate-article/main-article.component";
import {DisqusComponent} from "../fe-core/components/disqus/disqus.component";
import {SyndicatedTrendingComponent} from "../fe-core/components/syndicate-components/trending-articles/trending-articles.component";
import {RecommendationsComponent} from "../fe-core/components/recommendations/recommendations.component";
import {routing} from "../app.routing";
import {HttpModule, Http} from "@angular/http";
import {ArticleContentComponent} from "../fe-core/components/articles/article-content/article-content.component";
import {TrendingComponent} from "../fe-core/components/articles/trending/trending.component";


@NgModule({
    imports:[
        CommonModule,
        GlobalModule,
        routing,


    ],
    declarations:[
        SyndicatedArticlePage,MainArticle, DisqusComponent, SyndicatedTrendingComponent, RecommendationsComponent, TrendingComponent
    ],
    exports:[
        SyndicatedArticlePage,MainArticle, DisqusComponent, SyndicatedTrendingComponent, RecommendationsComponent, TrendingComponent
    ],
    providers: [SyndicateArticleService]
})

export class SyndicatedArticleNgModule{}
