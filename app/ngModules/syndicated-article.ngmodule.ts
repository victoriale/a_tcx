import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalModule } from './global.ngmodule';
import { SyndicatedArticlePage } from "../webpages/syndicated-article-page/syndicated-article-page";
import {SyndicateArticleService} from "../services/syndicate-article.service";
import {ShareLinksComponent} from "../fe-core/components/articles/share-links/share-links.component";
import {MainArticle} from "../fe-core/components/syndicate-components/syndicate-article/main-article.component";
import {DisqusComponent} from "../fe-core/components/disqus/disqus.component";
import {SyndicatedTrendingComponent} from "../fe-core/components/syndicate-components/trending-articles/trending-articles.component";
import {RecommendationsComponent} from "../fe-core/components/recommendations/recommendations.component";
import {routing} from "../app.routing";
import {HttpModule, Http} from "@angular/http";


@NgModule({
    imports:[
        CommonModule,
        GlobalModule,
        routing,


    ],
    declarations:[
        SyndicatedArticlePage, ShareLinksComponent,MainArticle, DisqusComponent, SyndicatedTrendingComponent, RecommendationsComponent
    ],
    exports:[
        SyndicatedArticlePage, ShareLinksComponent,MainArticle, DisqusComponent, SyndicatedTrendingComponent, RecommendationsComponent
    ],
    providers: [SyndicateArticleService]
})

export class SyndicatedArticleNgModule{}
