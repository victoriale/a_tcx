import {CommonModule} from "@angular/common";
import { NgModule }from '@angular/core';
import { HttpModule }    from '@angular/http';
import { routing  } from '../app.routing';

import { HeaderComponent } from "../fe-core/components/header/header.component";
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
        HoverImage,
        CircleImage,
        FooterComponent,
        ModuleHeader
    ],
    exports:[
        HeaderComponent,
        HoverImage,
        CircleImage,
        FooterComponent,
        ModuleHeader
    ],
    providers: []
})
export class GlobalModule { }
