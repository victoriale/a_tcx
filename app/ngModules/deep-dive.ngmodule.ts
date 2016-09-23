import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing  } from '../app.routing';

import { GlobalModule } from './global.ngmodule';
import { DeepDivePage } from "../webpages/deep-dive-page/deep-dive-page";
import { StackRowsComponent } from '../fe-core/components/stack-rows/stack-rows.component';
import { ArticleStacktopComponent } from '../fe-core/components/article-stacktop/article-stacktop.component';
import { ArticleStackModule } from '../fe-core/modules/article-stack/article-stack.module';
import { VideoStackComponent } from '../fe-core/components/video-stack/video-stack.component';

//Box Scores
import { BoxScoresModule } from '../fe-core/modules/box-scores/box-scores.module';
import { BoxScoresService } from '../services/box-scores.service';
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
      BoxScoresModule
      StatHyphenValuePipe,
      BoxScoresModule,
      GameInfo,
      CalendarCarousel
    ],
    exports:[
      DeepDivePage,
      StackRowsComponent,
      ArticleStacktopComponent,
      ArticleStackModule,
      VideoStackComponent,
    ],
    providers: [
      BoxScoresService
    ]
})

export class DeepDiveNgModule{

}
