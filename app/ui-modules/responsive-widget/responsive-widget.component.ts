import {Component, Input, Output, ChangeDetectorRef, OnInit} from '@angular/core';

@Component({
  selector: 'responsive-widget',
  templateUrl: './app/ui-modules/responsive-widget/responsive-widget.component.html',
})

export class ResponsiveWidget implements OnInit {
  @Input() embedPlace: string;
  @Input() displayAtRes: string;
  @Input() scope: string;
  windowWidth: number = window.innerWidth;
  widgetMed:boolean=false;
  widgetSml:boolean=false;

  ngOnInit() {
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
