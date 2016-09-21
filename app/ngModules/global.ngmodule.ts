import {CommonModule} from "@angular/common";
import { NgModule }from '@angular/core';

import { HeaderComponent } from "../fe-core/components/header/header.component";
import { CircleImage } from "../fe-core/components/images/circle-image/circle-image";
import { HoverImage } from '../fe-core/components/images/hover-image';
import { ImageData } from '../fe-core/components/images/image-data';

@NgModule({
    imports: [
      CommonModule
    ],
    declarations: [
      HeaderComponent,
      HoverImage,
      ImageData
    ],
    exports:[
      HeaderComponent,
      HoverImage
    ],
    providers: [

    ]
})
export class GlobalModule { }
