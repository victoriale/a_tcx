
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SearchPage} from "../webpages/search-page/search-page";
import {GlobalModule} from "./global.ngmodule";
import {SearchPageFilter} from "../fe-core/modules/search-page-filter/search-page-filter.module";
import {SearchArticleResults} from "../fe-core/modules/search-article-results/search-article-results.module";
@NgModule({
    imports:[CommonModule,GlobalModule],
    declarations:[SearchPage,SearchPageFilter,SearchArticleResults],
    /*exports:[],
    providers:[],*/
})
export class SearchPageNgModule{

}
