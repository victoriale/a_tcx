import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {DeepDiveNgModule} from "./ngModules/deep-dive.ngmodule";
import {DeepDivePage} from "./webpages/deep-dive-page/deep-dive-page";
import {SyndicatedArticlePage} from "./webpages/syndicated-article-page/syndicated-article-page";

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'deep-dive',
    pathMatch: 'full'
  },
  {
    path: 'deep-dive',
    component: DeepDivePage
  },
  {
    path: 'news/:articleType/:articleID',

    component: SyndicatedArticlePage
  }
];

export const routing = RouterModule.forRoot(appRoutes);
