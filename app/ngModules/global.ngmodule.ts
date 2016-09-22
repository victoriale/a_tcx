import {CommonModule} from "@angular/common";
import { NgModule }from '@angular/core';
import { HttpModule }    from '@angular/http';
import { routing  } from '../app.routing';

import { HeaderComponent } from "../fe-core/components/header/header.component";
import {HamburgerMenuComponent, MenuData} from '../fe-core/components/hamburger-menu/hamburger-menu.component';
//import { RectangleImage } from "../fe-core/components/images/rectangle-image/rectangle-image";
import { CircleImage } from "../fe-core/components/images/circle-image/circle-image";
import { HoverImage } from "../fe-core/components/images/hover-image";
import { FooterComponent } from "../fe-core/components/footer/footer.component";
import { ModuleHeader } from "../fe-core/components/module-header/module-header.component";

@NgModule({
    imports: [
      CommonModule,
      HttpModule,
      routing
    ],
    declarations: [
      HeaderComponent,
      HamburgerMenuComponent,
      HoverImage,
      CircleImage,
      //RectangleImage,
      FooterComponent,
      ModuleHeader
    ],
    exports:[
      HeaderComponent,
      HoverImage,
      CircleImage,
      //RectangleImage,
      FooterComponent,
      ModuleHeader
    ],
    providers: []
})
export class GlobalModule { }
