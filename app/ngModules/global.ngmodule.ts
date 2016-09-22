import {CommonModule} from "@angular/common";
import { NgModule }from '@angular/core';
import { routing  } from '../app.routing';

import { HeaderComponent } from "../fe-core/components/header/header.component";
import { RectangleImage } from "../fe-core/components/images/rectangle-image/rectangle-image";
import { CircleImage } from "../fe-core/components/images/circle-image/circle-image";
import { HoverImage } from "../fe-core/components/images/hover-image";
import { FooterComponent } from "../fe-core/components/footer/footer.component";
@NgModule({
    imports: [
      CommonModule,
      routing
    ],
    declarations: [
      HeaderComponent,
      HoverImage,
      CircleImage,
      RectangleImage,
      FooterComponent
    ],
    exports:[
      HeaderComponent,
      HoverImage,
      CircleImage,
      RectangleImage,
      FooterComponent
    ],
    providers: [

    ]
})
export class GlobalModule { }
