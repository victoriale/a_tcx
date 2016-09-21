import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalModule } from './global.ngmodule';
import { DeepDivePage } from "../webpages/deep-dive-page/deep-dive-page";

//Box Scores
import { BoxScoresModule } from '../fe-core/modules/box-scores/box-scores.module';
import { BoxScoresService } from '../services/box-scores.service';

@NgModule({
    imports:[
      CommonModule,
      GlobalModule
    ],
    declarations:[
      DeepDivePage,
      BoxScoresModule
    ],
    exports:[
      DeepDivePage
    ],
    providers: [
      BoxScoresService
    ]
})

export class DeepDiveNgModule{}
