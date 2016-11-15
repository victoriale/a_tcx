import { Component, OnInit, Input } from '@angular/core';
import { DeepDiveService } from '../../../services/deep-dive.service';
import { ArticleStackData } from "../../../fe-core/interfaces/deep-dive.data";
declare var moment;

@Component({
  selector: 'deep-dive-block-3',
  templateUrl: './app/ui-modules/deep-dive-blocks/deep-dive-block-3/deep-dive-block-3.module.html',
})

export class DeepDiveBlock3 implements OnInit {
  @Input() scope: string;
  articleData: Array<ArticleStackData>;
  articleCallLimit:number = 31;
  batchNum: number = 1;

  constructor(private _deepDiveData: DeepDiveService){}
  getFirstArticleStackData(){
    this._deepDiveData.getDeepDiveBatchService(this.scope, this.articleCallLimit, this.batchNum)
        .subscribe(data => {
          this.articleData = this._deepDiveData.transformToArticleStack(data, this.scope);
        },
        err => {
            console.log("Error getting article data");
        });
  }

  callModules(){
    this.getFirstArticleStackData();
  }

  ngOnChanges() {
    this.callModules();
  }

  ngOnInit() {
    this.callModules();
  }
}
