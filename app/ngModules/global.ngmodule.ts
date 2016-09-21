import {CommonModule} from "@angular/common";
import { NgModule }from '@angular/core';
import { routing  } from '../app.routing';

import { HeaderComponent } from "../fe-core/components/header/header.component";
import { CircleImage } from "../fe-core/components/images/circle-image/circle-image";
import { HoverImage } from '../fe-core/components/images/hover-image';

@NgModule({
    imports: [
      CommonModule,
      routing
    ],
    declarations: [
      HeaderComponent,
      HoverImage,
      CircleImage
    ],
    exports:[
      HeaderComponent,
      HoverImage,
      CircleImage
    ],
    providers: [

    ]
})
export class GlobalModule { }
