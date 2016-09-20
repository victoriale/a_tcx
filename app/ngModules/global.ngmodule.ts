import {CommonModule} from "@angular/common";
import { NgModule }from '@angular/core';

import { HeaderComponent } from "../fe-core/components/header/header.component";


@NgModule({
    imports: [
      CommonModule
    ],
    declarations: [
        HeaderComponent
    ],
    exports:[
        HeaderComponent
    ],
    providers: []
})
export class GlobalModule { }
