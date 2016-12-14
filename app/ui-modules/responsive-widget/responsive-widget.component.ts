import {Component, Input, Output, ChangeDetectorRef, OnInit} from '@angular/core';
import { GlobalSettings } from "../../global/global-settings";

@Component({
  selector: 'responsive-widget',
  templateUrl: './app/ui-modules/responsive-widget/responsive-widget.component.html',
})

export class ResponsiveWidget implements OnInit {
  @Input() embedPlace: string;//not sure why we need this
  // @Input() displayAtRes: string;
  // @Input() scope: string;
  windowWidth: number = window.innerWidth;
  // widgetMed:boolean=false;
  // widgetSml:boolean=false;
  srcLink: string;
  @Input() category: string;
  @Input() subCategory: string;
  getData(){
    if(this.category && this.category != "all"){
      var topScope = GlobalSettings.getTCXscope(this.category).topScope;
      topScope = topScope != "real-estate" ? topScope : "real estate";
      this.category = topScope ? topScope : 'keyword-' + this.category;
      this.subCategory = this.subCategory && this.subCategory != this.category && this.category != "real estate" ? this.subCategory : "";
    } else {
      this.category = "breaking";
      this.subCategory = "";
    }
    this.srcLink = "/app/ads/horizontal_widget.html?category=" + this.category + "&sub_category=" + this.subCategory;
  }
  ngOnInit() {
    this.getData();
    // this.isSmall = window.innerWidth <= 814;
    // this.displayAtRes = "_" + this.displayAtRes + "only"
    // var windowWidth = window.innerWidth;
    // if(windowWidth < 768){
    //   this.widgetSml = true;
    //   this.widgetMed = false;
    // }else if(windowWidth < 1280 && windowWidth >= 768){
    //   this.widgetSml = false;
    //   this.widgetMed = true;
    // }
    this.windowWidth = window.innerWidth;
  }
  ngOnChanges(){
    this.getData();
  }
  private onWindowLoadOrResize(event) {
    var windowWidth = event.target.innerWidth;
    // if(windowWidth < 768){
    //   this.widgetSml = true;
    //   this.widgetMed = false;
    // }else if(windowWidth < 1280 && windowWidth >= 768){
    //   this.widgetSml = false;
    //   this.widgetMed = true;
    // }
    this.windowWidth = windowWidth;
  }
}
