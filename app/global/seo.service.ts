//learn about robots.txt here
//http://www.robotstxt.org/robotstxt.html

/**
  *Optimal Length for Search Engines
  *Roughly 155 Characters
***/
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { getDOM } from '@angular/platform-browser/src/dom/dom_adapter';
import {GlobalSettings} from "./global-settings";

@Injectable()

export class SeoService {
  private titleService: Title;

  private headElement: HTMLElement;

  private metaDescription: HTMLElement;

  private canonicalLink: HTMLElement;

  private ogTitle: HTMLElement;
  private ogType: HTMLElement;
  private ogUrl: HTMLElement;
  private ogImage: HTMLElement;
  private ogDesc: HTMLElement;

  private robots: HTMLElement;
  private DOM: any;

 /**
  * Inject the Angular 2 Title Service
  * @param titleService
  */
  constructor(titleService: Title){
    this.titleService = titleService;
    this.DOM = getDOM();

   /**
    * get the <head> Element
    * @type {any}
    */
    this.headElement = this.DOM.query('head');
    this.metaDescription = this.getOrCreateMetaElement('description');
    this.robots = this.getOrCreateMetaElement('robots');
    this.ogTitle = this.getOgMetaElement("og:title");
    this.ogType = this.getOgMetaElement("og:type");
    this.ogUrl = this.getOgMetaElement("og:url");
    this.ogImage = this.getOgMetaElement("og:image");
    this.ogDesc = this.getOgMetaElement("og:description");
  }

  public getTitle(): string {
    return this.titleService.getTitle();
  }

  public setTitle(newTitle: string) {
    let splitTitle = newTitle.split(' ');
    let shortTitle;
    if(splitTitle.length > 3){
      splitTitle = splitTitle.splice(0,3);
      shortTitle = splitTitle.join(' ') + '...';
    }else{
      shortTitle = splitTitle.join(' ');
    }
    this.titleService.setTitle(shortTitle);
  }

  public getMetaDescription(): string {
    return this.metaDescription.getAttribute('content');
  }

  public setMetaDescription(description: string) {
    let html = description;
    let div = document.createElement("div");
    div.innerHTML = html;
    let truncatedDescription = div.textContent || div.innerText || "";
    if(truncatedDescription.length > 167){
      truncatedDescription = truncatedDescription.substring(0, 167);
      truncatedDescription += '...';
    }
    this.metaDescription.setAttribute('content', truncatedDescription);
  }

  public getMetaRobots(): string {
    return this.robots.getAttribute('content');
  }

  //Valid values for the "CONTENT" attribute are: "INDEX", "NOINDEX", "FOLLOW", "NOFOLLOW"
  //http://www.robotstxt.org/meta.html
  public setMetaRobots(robots: string) {
    this.robots.setAttribute('content', robots);
  }

  public setOgTitle(newTitle: string) {
    this.ogTitle.setAttribute('content', newTitle);
  }
  public setOgType(newType: string) {
    this.ogType.setAttribute('content', newType);
  }
  public setOgUrl(url: string) {
    this.ogUrl.setAttribute('content', url);
  }
  public setOgImage(imageUrl: string) {
    this.ogImage.setAttribute('content', imageUrl);
  }
  public setOgDesc(description: string) {
    this.ogDesc.setAttribute('content', description);
  }

   /**
    * get the HTML Element when it is in the markup, or create it.
    * @param name
    * @returns {HTMLElement}
    */
    private getOrCreateMetaElement(name: string): HTMLElement {
      let el: HTMLElement;
      el = this.DOM.query('meta[name=' + name + ']');
      if (el === null) {
        el = this.DOM.createElement('meta');
        el.setAttribute('name', name);
        this.headElement.appendChild(el);
      }
      return el;
    }
    private getOgMetaElement(name: string): HTMLElement {
      let el: HTMLElement;
      el = this.DOM.query('meta[property="' + name + '"]');
      if (el === null) {
        el = this.DOM.createElement('meta');
        el.setAttribute('property', name);
        this.headElement.appendChild(el);
      }
      return el;
    }
    public setCanonicalLink(relPath): HTMLElement {
      let el: HTMLElement;
      el = this.DOM.query("link[rel='canonical']");
      //given the route by params find the hostComponent page to keep it synchronous
      //// let pageName = router.parent.currentInstruction.component.routeName;
      //router deprecated get the route name of the first child in root router outlet
      let canonicalLink = 'vertical' + '/' + relPath;
      if (el === null) {
        el = this.DOM.createElement('link');
        el.setAttribute('rel', 'canonical');
        el.setAttribute('href', canonicalLink);
        this.headElement.appendChild(el);
      }
      return el;
    }
}
