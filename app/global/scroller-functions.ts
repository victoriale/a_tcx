export class Scroller{
  public scrollContentWrapper: any;
  public scrollContent: any;
  scrollbarHeightRatio: number;
  scrollbarBaseHeight: number;
  contentRatio: number;
  scrollerHeight: number
  scrollOffset: number
  scrollerElement: any;
  scrollerAlreadyOnPage: boolean;
  public scrollContainer: any;

  normalizedPosition: number;
  contentPosition: number;
  public scrollerBeingDragged: boolean;

  constructor(scrollContainer) {
    this.construct(scrollContainer);
  }

  construct (scrollContainer) {
    this.scrollContainer = scrollContainer;
    this.scrollContentWrapper = scrollContainer.getElementsByClassName('scrollable-item-wrapper');
    this.scrollContent = scrollContainer.getElementsByClassName('scrollable-item-content');
    if ( this.scrollContentWrapper.length == 0 || this.scrollContent.length == 0 ) {
      return;
    }
    else {
      this.scrollContentWrapper = this.scrollContentWrapper[0];
      this.scrollContent = this.scrollContent[0];
    }

    // Setup Scroller
    this.scrollbarHeightRatio = 0.90;
    this.scrollbarBaseHeight = scrollContainer.offsetHeight * this.scrollbarHeightRatio;
    this.contentRatio = scrollContainer.offsetHeight / this.scrollContentWrapper.scrollHeight;
    this.scrollerHeight = this.contentRatio * this.scrollbarBaseHeight;
    this.scrollOffset = 5; // should be the same as offset in scroll-content.component.less file

    let scrollerElements = scrollContainer.getElementsByClassName('scrollable-item-scroller');
    if ( scrollerElements && scrollerElements.length > 0 ) {
      this.scrollerElement = scrollerElements[0];
      this.scrollerAlreadyOnPage = true;
    }
    else {
      this.scrollerAlreadyOnPage = false;
    }
  }

  setup() {
    if ( !this.scrollerElement ) {
      this.scrollerElement = document.createElement("div");
    }

    this.scrollerElement.className = 'scrollable-item-scroller';

    if (this.contentRatio < 1) {
        this.scrollerElement.style.height = this.scrollerHeight + 'px';

        // append scroller to scrollContainer div
        if ( !this.scrollerAlreadyOnPage ) {
          this.scrollerElement.style.top = this.scrollOffset.toString();
          this.createScroller();
        }
    }
  }

  // Functions
  startDrag(evt, ths) {
      ths.normalizedPosition = evt.pageY;
      ths.contentPosition = ths.scrollContentWrapper.scrollTop;
      ths.scrollerBeingDragged = true;
  }

  stopDrag(evt, ths) {
      ths.scrollerBeingDragged = false;
  }

  scrollBarScroll(evt, ths) {
      if (ths.scrollerBeingDragged === true) {
          var mouseDifferential = evt.pageY - ths.normalizedPosition;
          var scrollEquivalent = mouseDifferential * (ths.scrollContentWrapper.scrollHeight / ths.scrollContainer.offsetHeight);
          ths.scrollContentWrapper.scrollTop = ths.contentPosition + scrollEquivalent;
      }
  }

  createScroller() {
    var self = this;

    this.normalizedPosition = 0;
    this.contentPosition = 0;
    this.scrollerBeingDragged = false;

    this.scrollContainer.appendChild(this.scrollerElement);

    // show scroll path divot
    this.scrollContainer.className += ' showScroll';

    // attach related draggable listeners
    this.scrollerElement.addEventListener('mousedown', function(evt){
      self.startDrag(evt, self);
    });
    window.addEventListener('mouseup', function(evt){
      self.stopDrag(evt, self);
    });
    window.addEventListener('mousemove', function(evt){
      self.scrollBarScroll(evt, self);
    });
    this.scrollContentWrapper.addEventListener('scroll', function(evt) {
        // Move Scroll bar to top offset
        var scrollPercentage = evt.target.scrollTop / self.scrollContentWrapper.scrollHeight;
        var topPosition = (scrollPercentage * self.scrollbarBaseHeight);
        topPosition += self.scrollOffset;
        self.scrollerElement.style.top = topPosition + 'px';
    });
  }

  scrollToItem(element) {
    var containerRect = this.scrollContainer.getBoundingClientRect();
    var itemRect = element.getBoundingClientRect();

    var diff = 0;
    if ( itemRect.bottom > containerRect.bottom ) {
      diff = itemRect.bottom - containerRect.bottom;
    }
    else if ( itemRect.top < containerRect.top ) {
      diff = itemRect.top - containerRect.top;
    }

    if ( diff != 0 ) {
      this.scrollContentWrapper.scrollTop += diff;
    }
  }
}

export class ScrollerFunctions {

  static initializeScroller(nativeElement: any, document: HTMLDocument): Scroller {
    var scrollContainers = nativeElement.getElementsByClassName('scrollable-item');
    var container = scrollContainers.length > 0 ? scrollContainers[0] : null;
    if ( !container ) {
      return null;
    }

    var scroller = new Scroller(container);
    scroller.setup();
    return scroller;
  }
}
