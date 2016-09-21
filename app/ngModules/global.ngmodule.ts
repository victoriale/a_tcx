import {CommonModule} from "@angular/common";
import { NgModule }from '@angular/core';
import { routing  } from '../app.routing';

import { HeaderComponent } from "../fe-core/components/header/header.component";
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
      FooterComponent
    ],
    exports:[
      HeaderComponent,
      HoverImage,
      CircleImage,
      FooterComponent
    ],
    providers: [

    ]
})
export class GlobalModule { }
