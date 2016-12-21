import {Component, Input, OnInit} from '@angular/core';
import {Http, Headers} from '@angular/http';
import { GlobalSettings } from "../../global/global-settings";

declare var jQuery:any;

@Component({
    selector: 'chatterbox-module',
    templateUrl: './app/ui-modules/chatterbox/chatterbox.module.html',
})

export class ChatterboxModule implements OnInit {
    srcLink: string;
    isSmall:boolean = false;
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
      this.srcLink = "/app/ads/chatterbox.html?category=" + this.category + "&sub_category=" + this.subCategory;
    }
    ngOnInit() {
      this.getData();
      this.isSmall = document.body.scrollWidth < 600;
    }
    ngOnChanges(){
      this.getData();
    }
    onResize(event) {
      this.isSmall = document.body.scrollWidth < 600;
    }
}
