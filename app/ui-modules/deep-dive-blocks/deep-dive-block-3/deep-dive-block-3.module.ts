import { Component, OnInit, Input } from '@angular/core';
import { DeepDiveService } from '../../../services/deep-dive.service';
import { ArticleStackData } from "../../../fe-core/interfaces/deep-dive.data";
declare var moment;
declare var jQuery: any;

@Component({
  selector: 'deep-dive-block-3',
  templateUrl: './app/ui-modules/deep-dive-blocks/deep-dive-block-3/deep-dive-block-3.module.html',
})

export class DeepDiveBlock3 {
  @Input() scope: string;
  articleData: Array<ArticleStackData>;
  articleCallLimit:number = 18;
  callApi: boolean = true;

  blockIndex: number = 1;
  routeSubscription: any;
  newArray: Array<any> = [];
  constructor(private _deepDiveData: DeepDiveService){}
  getFirstArticleStackData(pageNum){
    if(this.callApi){
      this.callApi = false;
      this.routeSubscription = this._deepDiveData.getDeepDiveBatchService(this.scope, this.articleCallLimit, pageNum)
      .subscribe(data => {
        if(data){
          this.articleData = this._deepDiveData.transformToArticleStack(data, this.scope);
          var len = this.articleData.length;
          var o = {
              stackTop1: len > 0 ? this.articleData.splice(0,1) : null ,
              stackRow1 : len > 0 ? this.articleData.splice(0,6) : null,
              recData : len > 0 ? this.articleData.splice(0,6) : null,
              stackTop2 : len > 0 ? this.articleData.splice(0,1) : null,
              stackRow2 : len > 0 ? this.articleData.splice(0,4) : null,
            }
          this.newArray.push(o);
          this.callApi = true;
        } else {
          this.callApi = false;
        }
      },
      err => {
        console.log("Error getting article data");
      });
    }
  }
  private onScroll(event) {
    if (this.callApi && (this.blockIndex <= this.newArray.length) && (jQuery(document).height() - window.innerHeight - jQuery("footer").height() <= jQuery(window).scrollTop())) {
      //fire when scrolled into footer
      this.blockIndex = this.blockIndex + 1;
      this.callModules(this.blockIndex);
    }
  }
  callModules(pageNum){
    this.getFirstArticleStackData(pageNum);
  }

  ngOnChanges(event){
    console.log(event);
    if(event.scope.currentValue != event.scope.previousGame){
      this.blockIndex = 1;
      this.newArray = [];
      this.callApi = true;
      this.articleData = null;
      this.callModules(this.blockIndex);
    }
  }

  ngOnDestroy(){
    this.routeSubscription.unsubscribe();
  }

  ngOnInit() {
    this.callModules(this.blockIndex);
  }
}
