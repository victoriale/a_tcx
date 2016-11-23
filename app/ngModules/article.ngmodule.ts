import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalModule } from './global.ngmodule';
import { SyndicatedArticlePage } from "../webpages/syndicated-article-page/syndicated-article-page";
import {SyndicateArticleService} from "../services/syndicate-article.service";
import {DisqusComponent} from "../fe-core/components/disqus/disqus.component";
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
        SyndicatedArticlePage, DisqusComponent, RecommendationsComponent, TrendingComponent
    ],
    exports:[
        SyndicatedArticlePage, DisqusComponent, RecommendationsComponent, TrendingComponent
    ],
    providers: [SyndicateArticleService]
})

export class SyndicatedArticleNgModule{}
