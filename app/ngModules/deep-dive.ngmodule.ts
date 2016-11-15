import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from '../app.routing';
import { GlobalModule } from './global.ngmodule';
import { FormsModule } from '@angular/forms';

//providers
import { DeepDiveService } from '../services/deep-dive.service';
import { BoxScoresService } from '../services/box-scores.service';

import { SideScrollSchedule } from '../fe-core/modules/side-scroll-schedules/side-scroll-schedules.module';
import { ScheduleBox } from '../fe-core/components/schedule-box/schedule-box.component';
import { SideScroll } from '../fe-core/components/side-scroll/side-scroll.component';
import { SchedulesService } from '../services/schedules.service';

//deep-dive blocks
import { DeepDiveBlockMain } from '../ui-modules/deep-dive-blocks/deep-dive-block-main/deep-dive-block-main.module';
import { DeepDiveBlock1 } from '../ui-modules/deep-dive-blocks/deep-dive-block-1/deep-dive-block-1.module';
import { DeepDiveBlock2 } from '../ui-modules/deep-dive-blocks/deep-dive-block-2/deep-dive-block-2.module';
import { DeepDiveBlock3 } from '../ui-modules/deep-dive-blocks/deep-dive-block-3/deep-dive-block-3.module';

import { DeepDivePage } from "../webpages/deep-dive-page/deep-dive-page";
import { StackRowsComponent } from '../fe-core/components/stack-rows/stack-rows.component';
import { ArticleStacktopComponent } from '../fe-core/components/article-stacktop/article-stacktop.component';
import { ArticleStack1Module } from '../fe-core/modules/article-stack-style-1/article-stack.module';
import { ArticleStack2Module } from '../fe-core/modules/article-stack-style-2/article-stack.module';
import { DeepDiveVideoModule } from '../fe-core/modules/video-deep-dive/video-deep-dive.module';
import { VideoStackComponent } from '../fe-core/components/video-stack/video-stack.component';

//Box Scores
import { BoxScoresModule } from '../fe-core/modules/box-scores/box-scores.module';
import { GameInfo } from '../fe-core/components/game-info/game-info.component';
import { CalendarCarousel } from '../fe-core/components/carousels/calendar/calendar-carousel.component';
import { DatePicker } from '../fe-core/components/date-picker/date-picker.component';
import { GameArticle } from '../fe-core/components/game-article/game-article.component';

//pipes
import { StatHyphenValuePipe } from '../fe-core/pipes/stat-hyphen.pipe';

@NgModule({
    imports:[
      CommonModule,
      GlobalModule,
      routing,
      FormsModule
    ],
    declarations:[
      DeepDivePage,
      SideScrollSchedule,
      ScheduleBox,
      SideScroll,
      StackRowsComponent,
      ArticleStacktopComponent,
      ArticleStack1Module,
      ArticleStack2Module,
      VideoStackComponent,
      BoxScoresModule,
      StatHyphenValuePipe,
      BoxScoresModule,
      DatePicker,
      GameInfo,
      GameArticle,
      CalendarCarousel,
      DeepDiveVideoModule,
      DeepDiveBlockMain,
      DeepDiveBlock1,
      DeepDiveBlock2,
      DeepDiveBlock3,
    ],
    exports:[
      DeepDivePage,
      StackRowsComponent,
      ArticleStacktopComponent,
      ArticleStack1Module,
      ArticleStack2Module,
      VideoStackComponent,
      DeepDiveVideoModule,
      DeepDiveBlockMain,
      DeepDiveBlock1,
      DeepDiveBlock2,
      DeepDiveBlock3,
    ],
    providers: [
      DeepDiveService,
      BoxScoresService,
      SchedulesService
    ]
})

export class DeepDiveNgModule{}
