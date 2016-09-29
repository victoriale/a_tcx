import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { AppComponent }  from './app-component/app.component';

import {DeepDiveNgModule} from "./ngModules/deep-dive.ngmodule";
import {DeepDivePage} from "./webpages/deep-dive-page/deep-dive-page";
import {SyndicatedArticlePage} from "./webpages/syndicated-article-page/syndicated-article-page";
import {SearchPage} from "./webpages/search-page/search-page";

const relativeChildRoutes = [
    {
        path:'search/:userInput',
        component: SearchPage
    },
    {
        path: ':category/:articleCategory/article/:articleType/:articleID',
    //redirectTo: 'news/:articleType/:articleID',
        component: SyndicatedArticlePage,
    },
    {
        path: ':category/article/:articleType/:articleID',
        //redirectTo: 'news/:articleType/:articleID',
        component: SyndicatedArticlePage,
    },
    {
        //added article category
        path: ':category/:articleCategory',
        component: DeepDivePage,
    },
    {
        //category is top level deep dive page that are groupings of other deep dive pages (ex: sports)
        path: ':category',
        component: DeepDivePage,
    },
    {
        //category is top level deep dive page that are groupings of other deep dive pages (ex: sports)
        path: '',
        component: DeepDivePage,
    },



    ]

const appRoutes: Routes = [
    {
        path: 'deep-dive',
        component: AppComponent,
        children: relativeChildRoutes
    },
    {
        path: ':partner_id/news',
        component: AppComponent,
        children: relativeChildRoutes
    },
    {
        path: ':partner_id',
        redirectTo:':partner_id/news',
        pathMatch:'full'
    },
    {
        path: '',
        redirectTo:'deep-dive',
        pathMatch:'full'
    },

    ];

// [routerLink]=["jimmy", {relativeTo: this.route}]



// [routerLink]=["/deep-dive/:category/:articleCategory", 'sports', 'nfl']

export const routing = RouterModule.forRoot(appRoutes);
