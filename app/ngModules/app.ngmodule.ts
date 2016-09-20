import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { routing } from '../app.routing';

//Root Component
import { AppComponent }  from '../app-domain/app.component';

//NgModules
import {GlobalModule} from "./global.ngmodule";
import { DeepDiveNgModule } from "./deep-dive.ngmodule";
import { SyndicatedArticleNgModule } from "./syndicated-article.ngmodule";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    GlobalModule,
    DeepDiveNgModule,
    SyndicatedArticleNgModule,
  ],
  declarations: [
    AppComponent
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
