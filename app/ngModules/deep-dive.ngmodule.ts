import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing  } from '../app.routing';

import { GlobalModule } from './global.ngmodule';
import { DeepDivePage } from "../webpages/deep-dive-page/deep-dive-page";
import { RectangleImage } from "../fe-core/components/images/rectangle-image/rectangle-image";
import { StackRowsComponent } from '../fe-core/components/stack-rows/stack-rows.component';
import { ArticleStacktopComponent } from '../fe-core/components/article-stacktop/article-stacktop.component';
import { ArticleStackModule } from '../fe-core/modules/article-stack/article-stack.module';
import { VideoStackComponent } from '../fe-core/components/video-stack/video-stack.component';

@NgModule({
    imports:[
      CommonModule,
      GlobalModule,
      routing
    ],
    declarations:[
      DeepDivePage,
      StackRowsComponent,
      ArticleStacktopComponent,
      ArticleStackModule,
      VideoStackComponent,
    ],
    exports:[
      DeepDivePage,
      StackRowsComponent,
      ArticleStacktopComponent,
      ArticleStackModule,
      VideoStackComponent,
    ],
    providers: []
})

export class DeepDiveNgModule{

}
