import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { AppComponent }  from './app-component/app.component';

import {DeepDiveNgModule} from "./ngModules/deep-dive.ngmodule";
import {DeepDivePage} from "./webpages/deep-dive-page/deep-dive-page";
import {SyndicatedArticlePage} from "./webpages/syndicated-article-page/syndicated-article-page";

const relativeChildRoutes = [
  {
    //category is top level deep dive page that are groupings of other deep dive pages (ex: sports)
    path: '',
    redirectTo:'deep-dive',
    match:'full'
  },
  {
    //category is top level deep dive page that are groupings of other deep dive pages (ex: sports)
    path: 'deep-dive',
    component: DeepDivePage,
  },
  {
    //category is top level deep dive page that are groupings of other deep dive pages (ex: sports)
    path: 'deep-dive/:category',
    component: DeepDivePage,
  },
  {
    //added article category
    path: 'deep-dive/:category/:articleCategory',
    component: DeepDivePage,
  },
  {
    path: 'deep-dive/:category/:articlCategory/news/:articleType/:articleID',
    //redirectTo: 'news/:articleType/:articleID',
    component: SyndicatedArticlePage,
  }
]

const appRoutes: Routes = [
  {
    path: ':partner_id',
    component: AppComponent,
    children: relativeChildRoutes
  },
  {
    path: '',
    component: AppComponent,
    children: relativeChildRoutes
  },
];

// [routerLink]=["jimmy", {relativeTo: this.route}]



// [routerLink]=["/deep-dive/:category/:articleCategory", 'sports', 'nfl']

export const routing = RouterModule.forRoot(appRoutes);
