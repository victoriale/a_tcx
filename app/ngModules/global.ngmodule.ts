import {CommonModule} from "@angular/common";
import { NgModule }from '@angular/core';
import { HttpModule }    from '@angular/http';
import { routing  } from '../app.routing';

import { HeaderComponent } from "../fe-core/components/header/header.component";
//import { RectangleImage } from "../fe-core/components/images/rectangle-image/rectangle-image";
import { CircleImage } from "../fe-core/components/images/circle-image/circle-image";
import { HoverImage } from "../fe-core/components/images/hover-image";
import { FooterComponent } from "../fe-core/components/footer/footer.component";
import { ModuleHeader } from "../fe-core/components/module-header/module-header.component";
import { SideScroll } from "../fe-core/components/side-scroll/side-scroll.component";
import {SanitizeStyle, SanitizeHtml, SanitizeRUrl} from '../fe-core/pipes/safe.pipe';

@NgModule({
    imports: [
      CommonModule,
      HttpModule,
      routing
    ],
    declarations: [
      //components
      HeaderComponent,
      HoverImage,
      CircleImage,
      //RectangleImage,
      FooterComponent,

      //modules
      SideScroll,
      ModuleHeader,

      //pipes
      SanitizeStyle,
      SanitizeHtml,
      SanitizeRUrl
    ],
    exports:[
      HeaderComponent,
      HoverImage,
      CircleImage,
      //RectangleImage,
      FooterComponent,
      ModuleHeader,
      SideScroll
    ],
    providers: []
})
export class GlobalModule { }
