import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalModule } from './global.ngmodule';
import { SyndicatedArticlePage } from "../webpages/syndicated-article-page/syndicated-article-page";
import {SyndicateArticleService} from "../services/syndicate-article.service";
import {ShareLinksComponent} from "../fe-core/components/syndicate-components/shareLinks/shareLinks.component";
import {MainArticle} from "../fe-core/components/syndicate-components/syndicate-article/main-article.component";
import {DisqusComponent} from "../fe-core/components/syndicate-components/disqus/disqus.component";


@NgModule({
    imports:[
        CommonModule,
        GlobalModule
    ],
    declarations:[
        SyndicatedArticlePage, ShareLinksComponent,MainArticle, DisqusComponent
    ],
    exports:[
        SyndicatedArticlePage, ShareLinksComponent,MainArticle, DisqusComponent
    ],
    providers: [SyndicateArticleService]
})

export class SyndicatedArticleNgModule{}
