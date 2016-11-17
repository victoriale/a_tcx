import {Component, Input, OnInit, OnChanges, Output, EventEmitter, ElementRef, Renderer} from '@angular/core';
import {GlobalSettings} from "../../global/global-settings";
import {HeaderLinksService} from '../../services/header-links.service';


declare var stButtons: any;
declare var jQuery:any;

@Component({
    selector: 'header-component',
    templateUrl: './app/ui-modules/header/header.component.html',
    providers: [HeaderLinksService]
})
export class HeaderComponent implements OnInit,OnChanges {
  @Input('partner') partnerID:string;
  @Output() tabSelected = new EventEmitter();
  public logoUrl:string;
  public partnerLogoUrl: string;
  private _stickyHeader: string;
  public searchInput: any = {
       placeholderText: "Search for a topic...",
       hasSuggestions: true
  };
  public hamburgerMenuData: Array<any>;
  public hamburgerMenuInfo: Array<any>;
  public headerLinks: Array<any> = HeaderLinksService.createMenu();
  public titleHeader: string;
  public isOpened: boolean = false;
  public isSearchOpened: boolean = false;
  public isActive: boolean = false;
  // public _sportLeagueAbbrv: string = GlobalSettings.getSportLeagueAbbrv();
  // public _collegeDivisionAbbrv: string = GlobalSettings.getCollegeDivisionAbbrv();
  // public _sportName: string = GlobalSettings.getSportName().toUpperCase();
  private elementRef:any;

  constructor(elementRef: ElementRef, private _renderer: Renderer){
    this.elementRef = elementRef;
    // GlobalSettings.getParentParams(_router, parentParams =>
    //   this.scope = parentParams.scope
    // );
  }
  openSearch(event) {
    if(this.isSearchOpened == true){
      this.isSearchOpened = false;
    }else{
      this.isSearchOpened = true;
    }
  }
  // Page is being scrolled
  onScrollStick(event) {
    //check if partner header exist and the sticky header shall stay and not partner header
    if( document.getElementById('partner') != null){
      var partnerHeight = document.getElementById('partner').offsetHeight;
      var scrollTop = jQuery(window).scrollTop();
      let stickyHeader = partnerHeight ? partnerHeight : 0;

      let maxScroll = stickyHeader - scrollTop;

      if(maxScroll <= 0){
        maxScroll = 0;
      }

      this._stickyHeader = (maxScroll) + "px";
    }else{
      this._stickyHeader = "0px"
    }
  }//onScrollStick ends
   public getMenu(event): void{
     if(this.isOpened == true){
       this.isOpened = false;
     }else{
       this.isOpened = true;
     }
   }
  ngOnInit(){
    stButtons.locateElements();
    this._renderer.listenGlobal('document', 'mousedown', (event) => {

      var element = document.elementFromPoint(event.clientX, event.clientY);
      if(element != null){
        var menuCheck = element.className.indexOf("menucheck");
        let searchCheck = element.className.indexOf("searchcheck");
        if(this.isOpened && menuCheck < 0){
          this.isOpened = false;
        }
        if(this.isSearchOpened && searchCheck < 0){
          this.isSearchOpened = false;
        }
      }
    });
    this.logoUrl = 'app/public/TCX_Logo_Outlined.svg';
    this.partnerLogoUrl = 'app/public/Football-DeepDive_Logo_Outlined-W.svg';
  }

  ngOnChanges() {
    // GlobalSettings.getParentParams(this._router, parentParams =>
    //   {
    //     this.scope = parentParams.scope;
    //   }
    // );
  }
}
