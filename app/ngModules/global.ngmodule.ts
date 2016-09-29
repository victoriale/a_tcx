//spits out router-outlet for our deepdive websites
import { AppComponent }  from '../app-component/app.component';

import {CommonModule} from "@angular/common";
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { ScrollerFunctions } from '../global/scroller-functions';
import { VerticalGlobalFunctions } from "../global/vertical-global-functions";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { GlobalSettings } from "../global/global-settings";
import { GlobalFunctions } from "../global/global-functions";
//components
import { HeaderComponent } from "../fe-core/components/header/header.component";
import { Search } from "../fe-core/components/search/search.component";
import { HamburgerMenuComponent, MenuData } from '../fe-core/components/hamburger-menu/hamburger-menu.component';
import { RectangleImage } from "../fe-core/components/images/rectangle-image/rectangle-image";
import { CircleImage } from "../fe-core/components/images/circle-image/circle-image";
import { HoverImage } from "../fe-core/components/images/hover-image";
import { FooterComponent } from "../fe-core/components/footer/footer.component";
import { ModuleHeader } from "../fe-core/components/module-header/module-header.component";
import { ImagesMedia } from "../fe-core/components/carousels/images-media-carousel/images-media-carousel.component";
import { CircleButton } from "../fe-core/components/buttons/circle/circle.button";
import { LoadingComponent } from "../fe-core/components/loading/loading.component";
import { CircleImageData } from "../fe-core/components/images/image-data";
import { ScrollableContent } from "../fe-core/components/scrollable-content/scrollable-content.component";
import { DropdownComponent } from "../fe-core/components/dropdown/dropdown.component";
import { SearchBoxModule } from "../fe-core/modules/search-box-module/search-box-module.module";
import { WidgetModule } from "../fe-core/modules/widget/widget.module";
import { WidgetCarouselModule } from "../fe-core/modules/widget/widget-carousel.module";
import { SidekickWrapperAI } from "../fe-core/components/sidekick-wrapper-ai/sidekick-wrapper-ai.component";
import { Larousel } from '../fe-core/components/larousel/larousel';

//Pipes
import {SanitizeScript, SanitizeHtml, SanitizeRUrl, SanitizeStyle} from "../fe-core/pipes/safe.pipe";

//router
import { routing  } from '../app.routing';


@NgModule({
    imports: [
      CommonModule,
      HttpModule,
      routing,
    ],
    declarations: [
      AppComponent,
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
      SearchBoxModule,
      SidekickWrapperAI,
      WidgetModule,
      WidgetCarouselModule,
      SanitizeHtml,
      SanitizeRUrl,
      SanitizeStyle,
      SanitizeScript,
      ScrollableContent,
      DropdownComponent,
	    Larousel
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
      SearchBoxModule,
      SidekickWrapperAI,
      WidgetModule,
      WidgetCarouselModule,
      ScrollableContent,
      SanitizeHtml,
      SanitizeRUrl,
      SanitizeStyle,
      SanitizeScript,
      Larousel,
      DropdownComponent,
      Search
    ],
    providers: [
      VerticalGlobalFunctions,
      ScrollerFunctions,
      SanitizeScript,
      GlobalSettings,
      GlobalFunctions,
    ]
})
export class GlobalModule { }
