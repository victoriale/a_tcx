import {Component, OnInit, OnDestroy} from '@angular/core';
import {RouteParams, Router} from '@angular/router-deprecated';
import {Title} from '@angular/platform-browser';

import {GlobalSettings} from "../../global/global-settings";
import {SearchPageModule} from '../../fe-core/modules/search-page/search-page.module';
import {SearchService} from '../../services/search.service';
import {SearchPageInput} from '../../fe-core/modules/search-page/search-page.module';
import {SidekickWrapper} from "../../fe-core/components/sidekick-wrapper/sidekick-wrapper.component";

interface SearchPageParams {
    query: string;
}

@Component({
    selector: 'search-page',
    templateUrl: './app/webpages/search-page/search.page.html',
    directives: [SidekickWrapper, SearchPageModule],
    providers: [Title]
})

export class SearchPage implements OnInit {
    public pageParams: SearchPageParams;

    public searchPageInput: SearchPageInput;
    public searchPageFilters: Array<any>;
    public partnerId: string;
    public scope: string;

    constructor(_params: RouteParams, private _searchService: SearchService, private _title: Title, private _router: Router) {
        _title.setTitle(GlobalSettings.getPageTitle("Search"));
        let query = decodeURIComponent(_params.get('query'));
        this.pageParams = {
            query: query
        }
        GlobalSettings.getParentParams(_router, parentParams => {
            this.partnerId = parentParams.partnerID;
            this.scope = parentParams.scope;
        });
    }

    configureSearchPageData(filter?){
        let self = this;
        let query = self.pageParams.query;

        if(typeof filter == 'undefined'){
          filter = null;
        }
        self._searchService.getSearch()
            .subscribe(
                data => {
                  let searchData = self._searchService.getSearchPageData(this._router, this.partnerId, query, filter, data);
                    self.searchPageInput = searchData.results;
                    if(self.searchPageFilters == null){
                      self.searchPageFilters = searchData.filters;
                    }
                }
            );
    }

    filterSwitch(event){
      this.configureSearchPageData(event.key);
    }
    ngOnInit() {
        this.configureSearchPageData();
    }

}
