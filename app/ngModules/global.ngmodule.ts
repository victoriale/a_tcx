import {CommonModule} from "@angular/common";
import { NgModule }from '@angular/core';
import { HttpModule }    from '@angular/http';
import { routing  } from '../app.routing';

import { HeaderComponent } from "../fe-core/components/header/header.component";
import { Search } from "../fe-core/components/search/search.component";
import { HamburgerMenuComponent, MenuData } from '../fe-core/components/hamburger-menu/hamburger-menu.component';
import { RectangleImage } from "../fe-core/components/images/rectangle-image/rectangle-image";
import { CircleImage } from "../fe-core/components/images/circle-image/circle-image";
import { HoverImage } from "../fe-core/components/images/hover-image";
import { FooterComponent } from "../fe-core/components/footer/footer.component";
import { ModuleHeader } from "../fe-core/components/module-header/module-header.component";
import {ImagesMedia} from "../fe-core/components/carousels/images-media-carousel/images-media-carousel.component";
import {CircleButton} from "../fe-core/components/buttons/circle/circle.button";
import {LoadingComponent} from "../fe-core/components/loading/loading.component";
import { CircleImageData } from "../fe-core/components/images/image-data";
import { ScrollableContent } from "../fe-core/components/scrollable-content/scrollable-content.component";
import { SearchBoxModule } from "../fe-core/modules/search-box-module/search-box-module.module";

import {ScrollerFunctions} from '../global/scroller-functions';
import {VerticalGlobalFunctions} from "../global/vertical-global-functions";

//Pipes


@NgModule({
    imports: [
      CommonModule,
      HttpModule,
      routing
    ],
    declarations: [
      HeaderComponent,
      Search,
      HamburgerMenuComponent,
      HoverImage,
      CircleImage,
      RectangleImage,
      FooterComponent,
      ModuleHeader,
      ImagesMedia,
      CircleButton,
      LoadingComponent,
      ScrollableContent,
      SearchBoxModule
    ],
    exports: [
      HeaderComponent,
      HoverImage,
      CircleImage,
      RectangleImage,
      FooterComponent,
      ModuleHeader,
      ImagesMedia,
      CircleButton,
      LoadingComponent,
      ScrollableContent,
      SearchBoxModule
    ],
    providers: [
      VerticalGlobalFunctions,
      ScrollerFunctions
    ]
})
export class GlobalModule { }
