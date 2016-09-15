import {Injectable} from '@angular/core';
import {Router} from '@angular/router-deprecated';

@Injectable()

export class GlobalSettings {
    private static _env = window.location.hostname.split('.')[0];
    private static _proto = window.location.protocol;

    private static _newsUrl:string = 'newsapi.synapsys.us';

    private static _apiUrl:string = '-touchdownloyal-api.synapsys.us';
    private static _articleUrl:string = '-touchdownloyal-ai.synapsys.us/';

    private static _partnerApiUrl: string = 'apireal.synapsys.us/listhuv/?action=get_partner_data&domain=';
    private static _widgetUrl: string = 'w1.synapsys.us';
    private static _geoUrl: string = 'w1.synapsys.us';

    private static _dynamicApiUrl: string = 'dw.synapsys.us/list_creator_api.php';

    public static _imageUrl:string = 'images.synapsys.us';
    private static _recUrl:string = '-homerunloyal-ai.synapsys.us/sidekick-regional';
    private static _homepageUrl:string = '.touchdownloyal.com';
    private static _homepageLinkName:string = 'touchdownloyal';
    private static _partnerHomepageUrl:string = '.mytouchdownzone.com';
    private static _partnerHomepageLinkName:string = 'mytouchdownzone';

    private static _siteTwitterUrl:string = 'https://twitter.com/touchdownloyal';
    private static _siteFacebookUrl:string = 'https://www.facebook.com/touchdownloyal';
    private static _siteGoogleUrl:string = 'https://plus.google.com/share?url=';

    private static _baseTitle: string = "Touchdown Loyal";
    private static _basePartnerTitle: string = "My Touchdown Zone";
    private static _sportName: string ="football";

    private static _sportLeagueAbbrv: string ="NFL";
    private static _sportLeagueFull: string ="National Football League";
    private static _sportLeagueChampionship: string = "Superbowl";
    private static _sportLeagueSegments: string = "Divisions";

    private static _collegeDivisionAbbrv: string="FBS";
    private static _collegeDivisionFullAbbrv: string="NCAAF";
    private static _collegeDivisionChampionship: string = "National Championships";
    private static _collegeDivisionSegments: string = "Conferences";

    private static _estYear: string = " 2016";
    private static _copyrightInfo: string = "USA Today Sports Images";

    static getEnv(env:string):string {
      if (env == "localhost"){
          env = "dev";
      }
      if (env != "dev" && env !="qa"){
          env = "prod";
      }
      return env;
    }

    static isProd():boolean {
      if( this.getEnv(this._env) == "prod" ){
        return true;
      }else{
        return false;
      }
    }

    static getDynamicWidet():string {
        return this._proto + "//" + this._dynamicApiUrl;
    }

    static getApiUrl():string {
        return this._proto + "//" + this.getEnv(this._env) + this._apiUrl;

    }

    static getPartnerApiUrl(partnerID):string {
        return this._proto + "//"+ this._partnerApiUrl + partnerID;
    }

    static getGeoLocation():string {
        return this._proto + "//" + this._geoUrl;
    }

    static widgetUrl():string {
        return this._proto + "//" + this._widgetUrl;
    }

    static getImageUrl(relativePath):string {
        var relPath = relativePath != null && relativePath != "" ? this._proto + "//" + this._imageUrl + relativePath: '/app/public/no-image.svg';
        return relPath;
    }

    static getBackgroundImageUrl(relativePath):string {
        var relPath = relativePath != null ? this._proto + "//" + this._imageUrl + relativePath: '/app/public/drk-linen.png';
        return relPath;
    }

    static getArticleUrl():string {
        return this._proto + "//" + this.getEnv(this._env) + this._articleUrl;
    }

    static getRecommendUrl():string {
        return this._proto + "//" + this.getEnv(this._env) + this._articleUrl;
    }

    static getTrendingUrl():string {
        return this._proto + "//" + this.getEnv(this._env) + this._articleUrl;
    }
    static getRecUrl():string {
        return this._proto + "//" + this.getEnv(this._env) + this._recUrl;
    }

    static getHeadlineUrl():string {
        return this._proto + "//" + this.getEnv(this._env) + this._articleUrl;
    }

    static getNewsUrl():string {
        //[https:]//[prod]-homerunloyal-api.synapsys.us
        return this._proto + "//" + this._newsUrl;
    }

    static getHomePageLinkName() {
      return this._homepageLinkName;
    }

    static getPartnerHomePageLinkName() {
      return this._partnerHomepageLinkName;
    }

    static getHomePage(partnerId: string, includePartnerId?: boolean) {
      var linkEnv = this._env != 'localhost' && this._env != "touchdownloyal" && this._env != "mytouchdownzone" && this._env != "football" ? this._env:'www';
        if ( partnerId ) {
            return this._proto + "//" + linkEnv + this._partnerHomepageUrl + (includePartnerId ? "/" + partnerId : "");
        }
        else {
            return this._proto + "//" + linkEnv + this._homepageUrl;
        }
    }

    static getHomeInfo(){
      //grabs the domain name of the site and sees if it is our partner page
      var partner = false;
      var isHome = false;
      var hide = false;
      var hostname = window.location.hostname;
      var partnerPage = /mytouchdownzone/.test(hostname) || /^football\./.test(hostname);
      var name = window.location.pathname.split('/')[1];
      var isSubdomainPartner = /^football\./.test(hostname);
      //PLEASE REVISIT and change
      if(partnerPage && (name == '' || name == 'deep-dive')){
        hide = true;
        isHome = true;
      }else if(!partnerPage && (name == '' || name == 'deep-dive')){
        hide = false;
        isHome = true;
      }else{
        hide = false;
        isHome = false;
      }

      if(partnerPage){
        partner = partnerPage;
      }
      return {
        isPartner: partner,
        hide:hide,
        isHome:isHome,
        partnerName: name,
        isSubdomainPartner: isSubdomainPartner
      };
    }

    static getSiteLogoUrl():string {
        return "/app/public/mainLogo.jpg";
    }

    /**
     * This should be called by classes in their constructor function, so that the
     * 'subscribe' function actually gets called and the partnerID and scope can be located from the route
     *
     * @param{Router} router
     * @param {Function} subscribeListener - takes a single parameter that represents the partnerID: (partnerID) => {}
     */

    //static getPartnerID(router: Router, subscribeListener: Function)
    static getParentParams(router: Router, subscribeListener: Function) {
        if ( !subscribeListener ) return;

        router.root.subscribe (
            route => {
                let partnerID = null;
                let scope = route.instruction.params["scope"];
                if ( route && route.instruction && route.instruction.params["partner_id"] != null ) {
                  partnerID = route.instruction.params["partner_id"];
                }else if(window.location.hostname.split(".")[0].toLowerCase() == "football"){
                  partnerID = window.location.hostname.split(".")[1] + "." + window.location.hostname.split(".")[2];
                }

                if ( scope == null ) {
                  scope = this.getSportLeagueAbbrv();
                }

                subscribeListener({
                  partnerID: partnerID == '' ? null : partnerID,
                  scope: this.getScope(scope)
                });
            }
        )
    }

    //converts URL route scope from NCAAF to FBS
    //NCAAF is for display purpose and returning FBS is for API requirements
    //lowercase is for common practice
    static getScope(scope?) {
      switch(scope) {
        case ( this.getCollegeDivisionFullAbbrv().toLowerCase() ) :
        case ( this.getCollegeDivisionFullAbbrv() ) :
        return this.getCollegeDivisionAbbrv().toLowerCase();

        default:
        return this.getSportLeagueAbbrv().toLowerCase();
      }
    }

    static getPageTitle(subtitle?: string, profileName?: string) {
      if(this.getHomeInfo().isPartner){
        this._baseTitle = this._basePartnerTitle;
      }
        return this._baseTitle +
            (profileName && profileName.length > 0 ? " - " + profileName : "") +
            (subtitle && subtitle.length > 0 ? " - " + subtitle : "");
    }

    static getBaseTitle() {
      return this._baseTitle;
    }

    static getBasePartnerTitle() {
      return this._basePartnerTitle;
    }

    static getSportLeagueAbbrv() {
      return this._sportLeagueAbbrv;
    }
    static getSportLeagueFull() {
      return this._sportLeagueFull;
    }
    static getSportLeagueChampionship() {
      return this._sportLeagueChampionship;
    }
    static getSportLeagueSegments() {
      return this._sportLeagueSegments;
    }

    static getCollegeDivisionAbbrv() {
      return this._collegeDivisionAbbrv;
    }
    static getCollegeDivisionFullAbbrv() {
      return this._collegeDivisionFullAbbrv;
    }
    static getCollegeDivisionChampionship() {
      return this._collegeDivisionChampionship;
    }
    static getCollegeDivisionSegments() {
      return this._collegeDivisionSegments;
    }

    static getCopyrightInfo() {
        return this._copyrightInfo;
    }
    static getSiteTwitterUrl() {
      return this._siteTwitterUrl;
    }
    static getSiteFacebookUrl() {
      return this._siteFacebookUrl;
    }
    static getSiteGoogleUrl(partnerId: string) {
      return this._siteGoogleUrl + this.getHomePage(partnerId);
	  }
    static getSportName() {
      return this._sportName;
    }
    static getEstYear() {
      return this._estYear;
    }

}
