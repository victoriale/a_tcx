

export class GlobalSettings {
    private static _env = window.location.hostname.split('.')[0];
    private static _proto = window.location.protocol;
    private static _partnerId:string = '';

    private static _newsUrl:string = 'newsapi.synapsys.us';

    private static _apiUrl:string = '-tcxmedia-api.synapsys.us/tcx';
    private static _articleUrl:string = '-tcxmedia-ai.synapsys.us/tcx';

    private static _partnerApiUrl: string = 'apireal.synapsys.us/listhuv/?action=get_partner_data&domain=';

    //two different api since there is a possibility that these urls are going to change
    private static _widgetUrl: string = 'w1.synapsys.us';
    private static _geoUrl: string = 'w1.synapsys.us';

    //main domain for all our images
    public static _imageUrl:string = 'images.synapsys.us';

    //this changes per vertical
    private static _homepageUrl:string = '.tcxmedia.com';
    private static _homepageLinkName:string = 'tcxmedia';
    private static _partnerHomepageUrl:string = '.tcxzone.com';
    private static _partnerHomepageLinkName:string = 'tcxzone';

    //links from our share providers that do not change
    private static _siteTwitterUrl:string = 'https://twitter.com/touchdownloyal';
    private static _siteFacebookUrl:string = 'https://www.facebook.com/touchdownloyal';
    private static _siteGoogleUrl:string = 'https://plus.google.com/share?url=';

    //base titles that will be used to displayed different when on white labeled partner domains
    private static _baseTitle: string = "TCX";
    private static _basePartnerTitle: string = "MyTCX";

    //copyright info that is to be manually change whenever a copyright info is needed to be updated
    private static _estYear: string = " 2016";
    private static _copyrightInfo: string = "USA Today Sports Images";

    //this is proned to be removed but used as dummy data
    private static _tdlAPI: string = '-touchdownloyal-api.synapsys.us/tcx';
    private static _hrlAPI: string = '-homerunloyal-api.synapsys.us/tcx';
    private static _tcxAPI: string = '-tcxmedia-api.synapsys.us/tcx';

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

    static getTCXscope(section){
      var category = {
        //BELOW are categories SNTMedia actually has Verticals built specifically for that category
        'nfl':{
          scope:'nfl',
          scopeList: ["MLB", "NCAAB", "NBA", "NCAAF", "NFL", "All"],
          topScope: 'football',
          displayName: 'football',
          verticalApi: this.getVerticalEnv('-touchdownloyal-api.synapsys.us'),
          aiApi:this.getVerticalEnv('-touchdownloyal-ai.synapsys.us'),
          tcxApi: this.getApiUrl(),
          showEventSlider: true,
          showBoxScores:true,
          icon:'fa-tdl-football',
          pageType: 1,
          searchInput:{
            placeholderText: "Search for a topic...",
            hasSuggestions: true
          }

        },
        'ncaaf':{
          scope:'ncaaf',
          scopeList: ["MLB", "NCAAB", "NBA", "NCAAF", "NFL", "All"],
          topScope: 'football',
          displayName: 'football',
          verticalApi: this.getVerticalEnv('-touchdownloyal-api.synapsys.us'),
          aiApi:this.getVerticalEnv('-touchdownloyal-ai.synapsys.us'),
          tcxApi: this.getApiUrl(),
          showEventSlider: true,
          showBoxScores:true,
          icon:'fa-tdl-football',
          pageType: 1
        },
        'mlb':{
          scope:'mlb',
          scopeList: ["MLB", "NCAAB", "NBA", "NCAAF", "NFL", "All"],
          topScope: 'baseball',
          displayName: 'baseball',
          verticalApi: this.getVerticalEnv('-homerunloyal-api.synapsys.us'),
          aiApi:this.getVerticalEnv('-homerunloyal-ai.synapsys.us'),
          tcxApi: this.getApiUrl(),
          showEventSlider: true,
          showBoxScores:true,
          icon:'fa-strikeouts-01',
          pageType: 1
        },
        'nba':{
          scope:'nba',
          scopeList: ["MLB", "NCAAB", "NBA", "NCAAF", "NFL", "All"],
          topScope: 'basketball',
          displayName: 'basketball',
          verticalApi: this.getVerticalEnv('-sports-api.synapsys.us'),
          aiApi:this.getVerticalEnv('-sports-ai'),
          tcxApi: this.getApiUrl(),
          showEventSlider: true,
          showBoxScores:true,
          icon:'fa-dribble',
          pageType: 1
        },
        'ncaam':{
          scope:'ncaam',
          scopeList: ["MLB", "NCAAB", "NBA", "NCAAF", "NFL"],
          scopeList: ["MLB", "NCAAB", "NBA", "NCAAF", "NFL", "All"],
          topScope:'basketball',
          displayName:'basketball',
          verticalApi:this.getVerticalEnv('-sports-api.synapsys.us'),
          aiApi: this.getVerticalEnv('-sports-ai'),
          tcxApi: this.getApiUrl(),
          showEventSlider: true,
          showBoxScores:true,
          icon:'fa-dribble',
          pageType: 1
        },
        'business':{
          scope:'all',
          scopeList: ["AMEX", "NYSE", "NASDAQ", "ALL"],
          topScope: 'finance',
          displayName: 'business',
          verticalApi: this.getVerticalEnv('-finance-api.synapsys.us'),
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: true,
          showBoxScores:false,
          icon:'fa-fontawesome-webfont-3',
          pageType: 2
        },
        'realestate':{
          scope:'realestate',
          topScope: 'realestate',
          displayName: 'realestate',
          verticalApi: this.getVerticalEnv('-joyfulhome-api.synapsys.us'),//dev api is maybe api2.joyfulhome.com
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-home-1',
          pageType: 2
        },
        //ABOVE are categories SNTMedia actually has Verticals built specifically for that category

        //BELOW are categories SNTMedia do no have specific verticals for therefore will not have anything linking to a category specific site
        'sports':{
          scope:'sports',
          scopeList: ["MLB", "NCAAB", "NBA", "NCAAF", "NFL", "All"],
          topScope: 'sports',
          displayName: 'sports',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: true,
          showBoxScores:true,
          icon:'fa-futbol-o',
          pageType: 1,
          searchInput:{
            placeholderText: "Search for a topic...",
            hasSuggestions: true
          }
        },
        'weather':{
          scope:'hourly',
          scopeList: ["10 Day", "5 Day", "Hourly"],
          topScope: 'weather',
          displayName: 'weather',
          verticalApi: this.getVerticalEnv('-weather-api.synapsys.us'),
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: true,
          showBoxScores:false,
          icon:'fa-cloud-1',
          pageType: 2
        },
        'trending':{
          scope:'trending',
          topScope: 'trending',
          displayName: 'trending',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-film',
          pageType: 3
        },
        'breaking':{
          scope:'breaking',
          topScope: 'breaking',
          displayName: 'breaking',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-clock',
          pageType: 3
        },
        'entertainment':{
          scope:'entertainment',
          topScope: 'entertainment',
          displayName: 'entertainment',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-film',
          pageType: 3
        },
        'tv':{
          scope:'tv',
          topScope: 'entertainment',
          displayName: 'tv',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-film',
          pageType: 3
        },
        'movies':{
          scope:'movies',
          topScope: 'entertainment',
          displayName: 'movies',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-film',
          pageType: 3
        },
        'music':{
          scope:'music',
          topScope: 'entertainment',
          displayName: 'music',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-film',
          pageType: 3
        },
        'celeberties':{
          scope:'celeberties',
          topScope: 'entertainment',
          displayName: 'celeberties',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-film',
          pageType: 3
        },
        'lifestyle':{
          scope:'lifestyle',
          topScope: 'lifestyle',
          displayName: 'lifestyle',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-diamond',
          pageType: 3
        },
        'food':{
          scope:'food',
          topScope: 'food',
          displayName: 'food',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-cutlery',
          pageType: 3
        },
        'travel':{
          scope:'travel',
          topScope: 'travel',
          displayName: 'travel',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-plane',
          pageType: 3
        },
        'politics':{
          scope:'politics',
          topScope: 'politics',
          displayName: 'politics',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-university',
          pageType: 3
        },
        'health':{
          scope:'health',
          topScope: 'health',
          displayName: 'health',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-heartbeat',
          pageType: 3
        },
        'automotive':{
          scope:'automotive',
          topScope: 'automotive',
          displayName: 'automotive',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-auto-shape',
          pageType: 3
        },
        'all':{
          scope:'deep-dive',
          topScope: null,
          displayName: null,
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-auto-shape',
          pageType: 'all'
        },
        //ABOVE are categories SNTMedia do no have specific verticals for therefore will not have anything linking to a category specific site
      }
      return category[section];
    }

    static getVerticalEnv(api){
      return this._proto + "//" + this.getEnv(this._env) + api
    }

    static getCategoryAPI(category:string): string{
      var _apiURL;
      switch(category){
        //FOOTBALL URL
        case 'nfl':
        case 'ncaaf':
          _apiURL = this._proto + "//" + this.getEnv(this._env) + this._tdlAPI;
          break;
        //BASKETBALL URL
        case 'nba':
        case 'ncaab':
          _apiURL = this._proto + "//" + this.getEnv(this._env) + this._tcxAPI;
          break;
        //BASEBALL URL
        case 'mlb':
          _apiURL = this._proto + "//" + this.getEnv(this._env) + this._hrlAPI;
          break;
        //OTHERS TCX URL
        default:
          _apiURL = this._proto + "//" + this.getEnv(this._env) + this._tcxAPI;
          break;
      }
      return _apiURL;
    }

    static storePartnerId(partnerId) {
      this._partnerId = partnerId;
    }

    static getPartnerId():string {
        return this._partnerId;
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

    static getHeadlineUrl():string {
        return this._proto + "//" + this.getEnv(this._env) + this._articleUrl;
    }

    static getNewsUrl():string {
        //[https:]//[prod]-homerunloyal-api.synapsys.us
        return this._proto + "//" + this._newsUrl;
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

    static getEstYear() {
      return this._estYear;
    }

}
