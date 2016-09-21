import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GlobalModule } from './global.ngmodule';
import { DeepDivePage } from "../webpages/deep-dive-page/deep-dive-page";

@NgModule({
    imports:[
      CommonModule,
      GlobalModule
    ],
    declarations:[
      DeepDivePage,
    ],
    exports:[
      DeepDivePage
    ],
    providers: []
})

export class DeepDiveNgModule{

}
