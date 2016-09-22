import {CommonModule} from "@angular/common";
import { NgModule }from '@angular/core';
import { routing  } from '../app.routing';

import { HeaderComponent } from "../fe-core/components/header/header.component";
import { RectangleImage } from "../fe-core/components/images/rectangle-image/rectangle-image";
import { CircleImage } from "../fe-core/components/images/circle-image/circle-image";
import { HoverImage } from "../fe-core/components/images/hover-image";
import { FooterComponent } from "../fe-core/components/footer/footer.component";
import { SideScroll } from "../fe-core/components/side-scroll/side-scroll.component";
import {SanitizeStyle, SanitizeHtml, SanitizeRUrl} from '../fe-core/pipes/safe.pipe';

@NgModule({
    imports: [
      CommonModule,
      routing
    ],
    declarations: [
      //components
      HeaderComponent,
      HoverImage,
      CircleImage,
      RectangleImage,
      FooterComponent,

      //modules
      SideScroll,

      //pipes
      SanitizeStyle,
      SanitizeHtml,
      SanitizeRUrl
    ],
    exports:[
      HeaderComponent,
      HoverImage,
      CircleImage,
      RectangleImage,
      FooterComponent,
      SideScroll
    ],
    providers: [

    ]
})
export class GlobalModule { }
