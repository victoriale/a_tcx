import { Component, OnInit, Input } from '@angular/core';
import { DeepDiveService } from '../../../services/deep-dive.service';
import { ArticleStackData } from "../../../fe-core/interfaces/deep-dive.data";
import {GlobalSettings} from "../../../global/global-settings";
import {VerticalGlobalFunctions} from "../../../global/vertical-global-functions";

declare var moment;

@Component({
  selector: 'deep-dive-block-2',
  templateUrl: './app/ui-modules/deep-dive-blocks/deep-dive-block-2/deep-dive-block-2.module.html',
})

export class DeepDiveBlock2 implements OnInit {
  @Input() scope: string;
  @Input() category:string;
  firstStackTop: Array<ArticleStackData>;
  firstStackRow: Array<ArticleStackData>;
  recData: Array<ArticleStackData>;//TODO
  articleStack2DataTop: Array<ArticleStackData>;//TODO
  articleStack2DataBatch: Array<ArticleStackData>;//TODO
  geoLocation: string = "ks";//TODO
  articleCallLimit:number = 23;
  batchNum: number = 1;

  searchData: any;
  sportsList: Array<any>;

  constructor(private _deepDiveData: DeepDiveService){}
  getFirstArticleStackData(){
    this._deepDiveData.getDeepDiveBatchService(this.scope, this.articleCallLimit, this.batchNum, this.geoLocation)
        .subscribe(data => {
          let stackTop = [data[0]];
          this.firstStackTop = this._deepDiveData.transformToArticleStack(stackTop, this.scope);
          let stackRow = data.splice(1,8);
          this.firstStackRow  = this._deepDiveData.transformToArticleStack(stackRow, this.scope);
          let recInfo = data.splice(1, 6);//TODO
          this.recData = this._deepDiveData.transformToArticleStack(recInfo, this.scope);//TODO
          let articleStack2Top = [data[0]];//TODO
          this.articleStack2DataTop = this._deepDiveData.transformToArticleStack(articleStack2Top, this.scope);//TODO
          let articleStack2 = data.splice(1,4);//TODO
          this.articleStack2DataBatch = this._deepDiveData.transformToArticleStack(articleStack2, this.scope);//TODO
        },
        err => {
            console.log("Error getting first article stack data");
        });
  }

  callModules(){
    this.getFirstArticleStackData();
  }

  navigateSearch(e) {
    if(e.key == "Enter"){
      var rel_url = VerticalGlobalFunctions.createSearchLink(this.scope) + e.target.value;
      var fullSearchUrl = GlobalSettings.getOffsiteLink(this.scope, rel_url);
      window.open(fullSearchUrl);
    }
  }
  changeScope(event){
    this.searchData.searchModTitle = GlobalSettings.getTCXscope(event).searchTitle + " " + GlobalSettings.getTCXscope(this.scope).displayName.toUpperCase();
    this.searchData.searchSubTitle = GlobalSettings.getTCXscope(event).searchSubTitle;
  }
  createSearchBox(scope){
    var modSearchTitle;
    let sportsList;
    if(this.category == "sports"){
      modSearchTitle = GlobalSettings.getTCXscope(scope).searchTitle + " " + GlobalSettings.getTCXscope(scope).displayName.toUpperCase();
      sportsList = [
        {
          key: 'NFL',
          value: "NFL",
        },
        {
          key: 'NCAAF',
          value: "NCAAF",
        },
        {
          key: 'NBA',
          value: "NBA",
        },
        {
          key: 'NCAAM',
          value: "NCAAM",
        },
        {
          key: 'MLB',
          value: "MLB",
        },
      ];
    }else{
      sportsList = null;
      modSearchTitle = GlobalSettings.getTCXscope(scope).searchTitle;
    }
    this.searchData = {
      category: scope,
      searchModTitle: modSearchTitle,
      searchSubText: GlobalSettings.getTCXscope(scope).searchSubTitle,
      searchPlaceHolderText: GlobalSettings.getTCXscope(scope).placeHolderText,
      searchBackground: GlobalSettings.getTCXscope(scope).searchBackground,
      searchScopeDropdown:sportsList
    };
  }
  ngOnChanges(event) {
    this.createSearchBox(event);
    this.callModules();
  }
  ngOnInit() {
    this.createSearchBox(this.scope);
    this.callModules();
  }
}
