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
  windowWidth: number = window.innerWidth;
  srcLink: string;
  getData(){
    if(this.category == "real estate"){this.category = "real-estate";}
    var topScope = GlobalSettings.getTCXscope(this.category).topScope ? GlobalSettings.getTCXscope(this.category).topScope : null;
    if(topScope && this.category != "all"){
      this.category = topScope ? topScope : 'keyword-' + this.category;
      this.subCategory = this.subCategory && this.subCategory != this.category && this.category != "real-estate" ? this.subCategory : "";
    } else {
      this.category = "breaking";
      this.subCategory = "";
    }
    this.srcLink = "/app/ads/horizontal_widget.html?category=" + this.category + "&sub_category=" + this.subCategory;
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
