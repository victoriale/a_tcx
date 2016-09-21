import {CommonModule} from "@angular/common";
import { NgModule }from '@angular/core';
import { HttpModule }    from '@angular/http';

import { HeaderComponent } from "../fe-core/components/header/header.component";
import { ModuleHeader } from "../fe-core/components/module-header/module-header.component";

@NgModule({
    imports: [
      CommonModule,
      HttpModule
    ],
    declarations: [
        HeaderComponent,
        ModuleHeader
    ],
    exports:[
        HeaderComponent,
        ModuleHeader
    ],
    providers: []
})
export class GlobalModule { }
