import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from '../app.routing';
import { GlobalModule } from './global.ngmodule';
//providers
import { DeepDiveService } from '../services/deep-dive.service';
import { BoxScoresService } from '../services/box-scores.service';
//deep-dive blocks
import { DeepDiveBlock1 } from '../fe-core/modules/deep-dive-blocks/deep-dive-block-1/deep-dive-block-1.module';

import { DeepDivePage } from "../webpages/deep-dive-page/deep-dive-page";
import { StackRowsComponent } from '../fe-core/components/stack-rows/stack-rows.component';
import { ArticleStacktopComponent } from '../fe-core/components/article-stacktop/article-stacktop.component';
import { ArticleStackModule } from '../fe-core/modules/article-stack/article-stack.module';
import { DeepDiveVideoModule } from '../fe-core/modules/video-deep-dive/video-deep-dive.module';
import { VideoStackComponent } from '../fe-core/components/video-stack/video-stack.component';

//Box Scores
import { BoxScoresModule } from '../fe-core/modules/box-scores/box-scores.module';
import { GameInfo } from '../fe-core/components/game-info/game-info.component';
import { CalendarCarousel } from '../fe-core/components/carousels/calendar/calendar-carousel.component';

//pipes
import { StatHyphenValuePipe } from '../fe-core/pipes/stat-hyphen.pipe';

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
      BoxScoresModule,
      StatHyphenValuePipe,
      BoxScoresModule,
      GameInfo,
      CalendarCarousel,
      DeepDiveVideoModule,
      DeepDiveBlock1
    ],
    exports:[
      DeepDivePage,
      StackRowsComponent,
      ArticleStacktopComponent,
      ArticleStackModule,
      VideoStackComponent,
      DeepDiveVideoModule,
      DeepDiveBlock1
    ],
    providers: [
      DeepDiveService,
      BoxScoresService
    ]
})

export class DeepDiveNgModule{

}
