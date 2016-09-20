import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalModule } from './global.ngmodule';
import { SyndicatedArticlePage } from "../webpages/syndicated-article-page/syndicated-article-page";

@NgModule({
    imports:[
      CommonModule,
      GlobalModule
    ],
    declarations:[
      SyndicatedArticlePage
    ],
    exports:[
      SyndicatedArticlePage
    ],
    providers: []
})

export class SyndicatedArticleNgModule{}
