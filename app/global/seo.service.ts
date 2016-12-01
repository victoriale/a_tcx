//learn about robots.txt here
//http://www.robotstxt.org/robotstxt.html

/**
  *Optimal Length for Search Engines
  *Roughly 155 Characters
***/
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
/*import { getDOM } from '@angular/platform-browser/src/dom/dom_adapter';*/
import { __platform_browser_private__ } from '@angular/platform-browser'
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
  private es_search_type: HTMLElement;
  private es_source: HTMLElement;
  private es_article_id: HTMLElement;
  private es_article_title: HTMLElement;
  private es_keyword: HTMLElement;
  private es_published_date: HTMLElement;
  private es_author: HTMLElement;
  private es_publisher: HTMLElement;
  private es_image_url: HTMLElement;
  private es_article_teaser: HTMLElement;
  private es_article_url: HTMLElement;
  private es_article_type: HTMLElement;


    private robots: HTMLElement;
  private DOM: any;

 /**
  * Inject the Angular 2 Title Service
  * @param titleService
  */
  constructor(titleService: Title){
    this.titleService = titleService;
    this.DOM = __platform_browser_private__.getDOM();

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
    this.es_search_type= this.getOrCreateMetaElement('es_search_type');
     this.es_source= this.getOrCreateMetaElement('es_source');
     this.es_article_id= this.getOrCreateMetaElement('es_article_id');
     this.es_article_title= this.getOrCreateMetaElement('es_article_title');
     this.es_keyword= this.getOrCreateMetaElement('es_keyword');
     this.es_published_date= this.getOrCreateMetaElement('es_published_date');
     this.es_author= this.getOrCreateMetaElement('es_author');
     this.es_publisher= this.getOrCreateMetaElement('es_publisher');
     this.es_image_url= this.getOrCreateMetaElement('es_image_url');
     this.es_article_teaser= this.getOrCreateMetaElement('es_article_teaser');
     this.es_article_url= this.getOrCreateMetaElement('es_article_url');
     this.es_article_type= this.getOrCreateMetaElement('es_article_type');


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
    public setsearchtype(es_search_type: string){
      this.es_search_type.setAttribute('content', es_search_type);
    };
    public setsource(es_source:string){
        this.es_source.setAttribute('content', es_source);
    };
    public setarticleid(es_article_id){
        this.es_article_id.setAttribute('content', es_article_id);
    };
    public setarticletitle(es_article_title){
        this.es_article_title.setAttribute('content', es_article_title);

    };
    public setkeyword(es_keyword){
        this.es_keyword.setAttribute('content', es_keyword);

    };
    public setpublisheddate(es_published_date){
        this.es_published_date.setAttribute('content',es_published_date);

    };
    public setauthor(es_author){
        this.es_author.setAttribute('content', es_author);

    };
    public setpublisher(es_publisher){
        this.es_publisher.setAttribute('content', es_publisher);
    };
    public setimage_url(es_image_url){
        this.es_image_url.setAttribute('content', es_image_url);

    };
    public setteaser(es_article_teaser){
        this.es_article_teaser.setAttribute('content', es_article_teaser);

    };
    public setarticleurl(es_article_url){
        this.es_article_url.setAttribute('content', es_article_url);

    };
    public setarticletype(es_article_type){
        this.es_article_type.setAttribute('content', es_article_type);

    };


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
      let canonicalLink = relPath;
      if (el === null) {
        el = this.DOM.createElement('link');
        el.setAttribute('rel', 'canonical');
        el.setAttribute('href', canonicalLink);
        this.headElement.appendChild(el);
      }
      return el;
    }
}
