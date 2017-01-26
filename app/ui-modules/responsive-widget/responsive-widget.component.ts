import {Component, Input, Output, ChangeDetectorRef, OnInit} from '@angular/core';
import { GlobalSettings } from "../../global/global-settings";

@Component({
  selector: 'responsive-widget',
  templateUrl: './app/ui-modules/responsive-widget/responsive-widget.component.html',
})

export class ResponsiveWidget implements OnInit {
  @Input() embedPlace: string;//not sure why we need this
  @Input() category: string;
  @Input() subCategory: string;
  //adding temporary variables in order to avoid making changes to the category and subcategory directly
  wcategory:string;
  wsubCategory:string;
  windowWidth: number = window.innerWidth;
  srcLink: string;
  getData(){
    var topScope = GlobalSettings.getTCXscope(this.category).topScope ? GlobalSettings.getTCXscope(this.category).topScope : null;

    this.wcategory = this.category=="real estate"? this.category.replace(/ /g,"-"):this.category;
    this.wsubCategory = this.subCategory=="real estate"? this.subCategory.replace(/ /g,"-"):this.wcategory;

    if(topScope && this.wcategory != "all"){
      this.wcategory = this.wcategory;
      this.wsubCategory = this.wsubCategory && this.wsubCategory != this.wcategory && this.wsubCategory != "real-estate" ? this.wsubCategory : "";
    } else {
      this.wcategory = "trending";
      this.wsubCategory = "";
    }
    this.srcLink = "/app/ads/horizontal_widget.html?category=" + this.wcategory + "&sub_category=" + this.wsubCategory;
  }
  ngOnInit() {
    this.getData();
    this.windowWidth = window.innerWidth;
  }
  ngOnChanges(){
    this.getData();
  }
  private onWindowLoadOrResize(event) {
    var windowWidth = event.target.innerWidth;
    this.windowWidth = windowWidth;
  }
}
