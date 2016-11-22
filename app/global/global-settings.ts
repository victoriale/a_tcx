

export class GlobalSettings {
    private static _env = window.location.hostname.split('.')[0];
    private static _proto = window.location.protocol;
    private static _partnerId:string = '';

    private static _newsUrl:string = 'newsapi.synapsys.us';

    private static _apiUrl:string = '-tcxmedia-api.synapsys.us';
    private static _articleUrl:string = '-tcxmedia-ai.synapsys.us/tcx';


    private static _synArticleUrl:string= "-tcxmedia-api.synapsys.us/articles";

    private static _partnerApiUrl: string = 'apireal.synapsys.us/listhuv/?action=get_partner_data&domain=';

    //two different api since there is a possibility that these urls are going to change
    private static _widgetUrl: string = 'w1.synapsys.us';
    private static _geoUrl: string = 'w1.synapsys.us';

    //main domain for all our images
    public static _imageUrl:string = 'images.synapsys.us';
    public static _sportsimageUrl:string = 'sports-images.synapsys.us';

    //this changes per vertical
    private static _homepageUrl:string = '.tcxmedia.com';
    private static _homepageLinkName:string = 'tcxmedia';
    private static _partnerHomepageUrl:string = '.tcxzone.com';
    private static _partnerHomepageLinkName:string = 'tcxzone';

    //links from our share providers that do not change
    private static _siteTwitterUrl:string = 'https://twitter.com/home?status=';
    private static _siteFacebookUrl:string = 'https://www.facebook.com/sharer/sharer.php?u=';
    private static _siteLinkedinUrl:string = 'https://www.linkedin.com/shareArticle?mini=true&url=&title=&summary=&source=';
    private static _siteGoogleUrl:string = 'https://plus.google.com/share?url=';
    private static _verticalFacebook: string = 'https://www.facebook.com/TCX-382018522187919';
    private static _verticalTwitter: string = 'https://twitter.com/tcxmedia';


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
      if (env == "localhost"){//remove qa when we have qa env setup
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
          parentScope: 'sports',
          scope:'nfl',
          scopeList: ["MLB", "NCAAM", "NBA", "NCAAF", "NFL", "All"],
          topScope: 'football',
          displayName: 'Football',
          verticalApi: this.getVerticalEnv('-touchdownloyal-api.synapsys.us'),
          aiApi:this.getVerticalEnv('-touchdownloyal-ai.synapsys.us'),
          tcxApi: this.getApiUrl(),
          showEventSlider: true,
          showBoxScores:true,
          showSFTopNav: true,
          icon:'fa-tdl-football',
          pageType: 1,
          searchTitle:'Discover The Latest In',
          searchSubTitle:"Find the players and teams you love",
          placeHolderText:'Search for a Team or a Player...',
          searchBackground:"../app/public/Sports_Search-Module-Image.jpg",
          color:'#2d3e50',
          hoverColor: "rgba(45, 62, 80, 0.75)"
        },
        'ncaaf':{
          parentScope: 'sports',
          scope:'ncaaf',
          scopeList: ["MLB", "NCAAM", "NBA", "NCAAF", "NFL", "All"],
          topScope: 'football',
          displayName: 'Football',
          verticalApi: this.getVerticalEnv('-touchdownloyal-api.synapsys.us'),
          aiApi:this.getVerticalEnv('-touchdownloyal-ai.synapsys.us'),
          tcxApi: this.getApiUrl(),
          showEventSlider: true,
          showBoxScores:true,
          showSFTopNav: true,
          icon:'fa-tdl-football',
          pageType: 1,
          searchTitle:'Discover The Latest In',
          searchSubTitle:"Find the players and teams you love",
          placeHolderText:'Search for a Team or a Player...',
          searchBackground:"../app/public/Sports_Search-Module-Image.jpg",
          color:'#2d3e50',
          hoverColor: "rgba(45, 62, 80, 0.75)"
        },
        'fbs':{
          parentScope: 'sports',
          scope:'ncaaf',
          scopeList: ["MLB", "NCAAM", "NBA", "NCAAF", "NFL", "All"],
          topScope: 'football',
          displayName: 'Football',
          verticalApi: this.getVerticalEnv('-touchdownloyal-api.synapsys.us'),
          aiApi:this.getVerticalEnv('-touchdownloyal-ai.synapsys.us'),
          tcxApi: this.getApiUrl(),
          showEventSlider: true,
          showBoxScores:true,
          showSFTopNav: true,
          icon:'fa-tdl-football',
          pageType: 1,
          searchTitle:'Discover The Latest In',
          searchSubTitle:"Find the players and teams you love",
          placeHolderText:'Search for a Team or a Player...',
          searchBackground:"../app/public/Sports_Search-Module-Image.jpg",
          color:'#2d3e50',
          hoverColor: "rgba(45, 62, 80, 0.75)"
        },
        'mlb':{
          parentScope: 'sports',
          scope:'mlb',
          scopeList: ["MLB", "NCAAM", "NBA", "NCAAF", "NFL", "All"],
          topScope: 'baseball',
          displayName: 'Baseball',
          verticalApi: this.getVerticalEnv('-homerunloyal-api.synapsys.us'),
          aiApi:this.getVerticalEnv('-homerunloyal-ai.synapsys.us'),
          tcxApi: this.getApiUrl(),
          showEventSlider: true,
          showBoxScores:true,
          showSFTopNav: true,
          icon:'fa-strikeouts',
          pageType: 1,
          searchTitle:'Discover The Latest In',
          searchSubTitle:"Find the players and teams you love",
          placeHolderText:'Search for a Team or a Player...',
          searchBackground:"../app/public/Sports_Search-Module-Image.jpg",
          color:'#bc2027',
          hoverColor: "rgba(188, 32, 39, 0.75)"
        },
        'nba':{
          parentScope: 'sports',
          scope:'nba',
          scopeList: ["MLB", "NCAAM", "NBA", "NCAAF", "NFL", "All"],
          topScope: 'basketball',
          displayName: 'Basketball',
          verticalApi: this.getVerticalEnv('-sports-api.synapsys.us'),
          aiApi:this.getVerticalEnv('-sports-ai'),
          tcxApi: this.getApiUrl(),
          showEventSlider: true,
          showBoxScores:true,
          showSFTopNav: true,
          icon:'fa-dribble',
          pageType: 1,
          searchTitle:'Discover The Latest In',
          searchSubTitle:"Find the players and teams you love",
          placeHolderText:'Search for a Team or a Player...',
          searchBackground:"../app/public/Sports_Search-Module-Image.jpg",
          color:'#f26f26',
          hoverColor: "rgba(242, 111, 38, 0.75)"
        },
        'ncaam':{
          parentScope: 'sports',
          scope:'ncaam',
          scopeList: ["MLB", "NCAAM", "NBA", "NCAAF", "NFL", "All"],
          topScope:'basketball',
          displayName:'Basketball',
          verticalApi:this.getVerticalEnv('-sports-api.synapsys.us'),
          aiApi: this.getVerticalEnv('-sports-ai'),
          tcxApi: this.getApiUrl(),
          showEventSlider: true,
          showBoxScores:true,
          showSFTopNav: true,
          icon:'fa-dribble',
          pageType: 1,
          searchTitle:'Discover The Latest In',
          searchSubTitle:"Find the players and teams you love",
          placeHolderText:'Search for a Team or a Player...',
          searchBackground:"../app/public/Sports_Search-Module-Image.jpg",
          color:'#f26f26',
          hoverColor: "rgba(242, 111, 38, 0.75)"
        },
        'nhl':{
          parentScope: 'sports',
          scope:'nhl',
          scopeList: ["MLB", "NCAAM", "NBA", "NCAAF", "NFL", "All"],
          topScope: 'hockey',
          displayName: 'Hockey',
          verticalApi: this.getApiUrl() + '/tcx',
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: true,
          showBoxScores:true,
          showSFTopNav: true,
          icon:'fa-icon-nhl',
          pageType: 1,
          searchTitle:'Discover The Latest In',
          searchSubTitle:"Find the players and teams you love",
          placeHolderText:'Search for a Team or a Player...',
          searchBackground:"../app/public/Sports_Search-Module-Image.jpg",
          color:'#00b9e3',
          hoverColor: "rgba(0, 185, 227, 0.75)"
        },
        'business':{
          parentScope: null,
          scope:'all',
          scopeList: ["AMEX", "NYSE", "NASDAQ", "ALL"],
          topScope: 'finance',
          displayName: 'Business',
          verticalApi: this.getVerticalEnv('-finance-api.synapsys.us'),
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: true,
          showBoxScores:false,
          icon:'fa-fontawesome-webfont-3',
          pageType: 2,
          searchTitle:'Discover Your Next Investment',
          searchSubTitle:"Find the stocks you can invest in right in your neighborhood",
          placeHolderText:'Search for a Company, Executive or DMA',
          searchBackground:"../app/public/Finance_Search-Module-Image.jpg",
          color:'#009dfb',
          hoverColor: "rgba(48, 152, 255, 0.75)"
        },
        'real-estate':{
          parentScope: null,
          scope:'real-estate',
          topScope: 'real-estate',
          displayName: 'Real Estate',
          verticalApi: this.getVerticalEnv('-joyfulhome-api.synapsys.us'),//dev api is maybe api2.joyfulhome.com
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-home',
          pageType: 2,
          searchTitle:'Discover Homes For Sale In Your Area',
          searchSubTitle:" ",
          placeHolderText:'Search for a location or address...',
          searchBackground:"../app/public/Real-Estate_Search-Module-Image.jpg",
          color:'#44b224',
          hoverColor: "rgba(68, 178, 36, 0.75)"
        },
        //ABOVE are categories SNTMedia actually has Verticals built specifically for that category

        //BELOW are categories SNTMedia do no have specific verticals for therefore will not have anything linking to a category specific site
        'sports':{
          parentScope: null,
          scope:'sports',
          scopeList: ["MLB", "NCAAM", "NBA", "NCAAF", "NFL", "All"],
          topScope: 'sports',
          displayName: 'Sports',
          verticalApi: this.getApiUrl() + '/tcx',
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          showSFTopNav: true,
          icon:'fa-futbol-o',
          pageType: 1,
          color:'#00b9e3',
          hoverColor: "rgba(0, 185, 227, 0.75)"
        },
        'weather':{
          parentScope: null,
          scope:'hourly',
          scopeList: ["10 Day", "5 Day", "Hourly"],
          topScope: 'weather',
          displayName: 'Weather',
          verticalApi: this.getVerticalEnv('-weather.synapsys.us'),
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: true,
          showBoxScores:false,
          icon:'fa-cloud',
          pageType: 2,
          color:'#ffdf30',
          hoverColor: "rgba(255, 223, 48, 0.75)"
        },
        'trending':{
          parentScope: null,
          scope:'trending',
          topScope: 'trending',
          displayName: 'Trending',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-film',
          pageType: 3,
          color:'#00b9e3',
          hoverColor: "rgba(0, 185, 227, 0.75)"
        },
        'breaking':{
          parentScope: null,
          scope:'breaking',
          topScope: 'breaking',
          displayName: 'Breaking News',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-clock',
          pageType: 3,
          color:'#00b9e3',
          hoverColor: "rgba(0, 185, 227, 0.75)"
        },
        'entertainment':{
          parentScope: null,
          scope:'all',
          scopeList: ["Celebrities", "Music", "Movies", "TV", "All"],
          topScope: 'entertainment',
          displayName: 'Entertainment',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          showSFTopNav: true,
          icon:'fa-film',
          pageType: 3,
          color:'#00b9e3',
          hoverColor: "rgba(0, 185, 227, 0.75)"
        },
        'tv':{
          parentScope: 'entertainment',
          scope:'tv',
          scopeList: ["Celebrities", "Music", "Movies", "TV", "All"],
          topScope: 'entertainment',
          displayName: 'TV',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          showSFTopNav: true,
          icon:'fa-film',
          pageType: 3,
          color:'#00b9e3',
          hoverColor: "rgba(0, 185, 227, 0.75)"
        },
        'movies':{
          parentScope: 'entertainment',
          scope:'movies',
          scopeList: ["Celebrities", "Music", "Movies", "TV", "All"],
          topScope: 'entertainment',
          displayName: 'Movies',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          showSFTopNav: true,
          icon:'fa-film',
          pageType: 3,
          color:'#00b9e3',
          hoverColor: "rgba(0, 185, 227, 0.75)"
        },
        'music':{
          parentScope: 'entertainment',
          scope:'music',
          scopeList: ["Celebrities", "Music", "Movies", "TV", "All"],
          topScope: 'entertainment',
          displayName: 'Music',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          showSFTopNav: true,
          icon:'fa-film',
          pageType: 3,
          color:'#00b9e3',
          hoverColor: "rgba(0, 185, 227, 0.75)"
        },
        'celebrities':{
          parentScope: 'entertainment',
          scope:'celebrities',
          scopeList: ["Celebrities", "Music", "Movies", "TV", "All"],
          topScope: 'entertainment',
          displayName: 'Celebrities',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          showSFTopNav: true,
          icon:'fa-film',
          pageType: 3,
          color:'#00b9e3',
          hoverColor: "rgba(0, 185, 227, 0.75)"
        },
        'lifestyle':{
          parentScope: null,
          scope:'lifestyle',
          topScope: 'lifestyle',
          displayName: 'Lifestyle',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-diamond',
          pageType: 3,
          color:'#00b9e3',
          hoverColor: "rgba(0, 185, 227, 0.75)"
        },
        'food':{
          parentScope: null,
          scope:'food',
          topScope: 'food',
          displayName: 'Food',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-icon-food',
          pageType: 3,
          color:'#00b9e3',
          hoverColor: "rgba(0, 185, 227, 0.75)"
        },
        'travel':{
          parentScope: null,
          scope:'travel',
          topScope: 'travel',
          displayName: 'Travel',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-plane',
          pageType: 3,
          color:'#00b9e3',
          hoverColor: "rgba(0, 185, 227, 0.75)"
        },
        'politics':{
          parentScope: null,
          scope:'politics',
          topScope: 'politics',
          displayName: 'Politics',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-university',
          pageType: 3,
          color:'#ff0101',
          hoverColor: "rgba(255, 1, 1, 0.75)"
        },
        'health':{
          parentScope: null,
          scope:'health',
          topScope: 'health',
          displayName: 'Health',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-heartbeat',
          pageType: 3,
          color:'#00b9e3',
          hoverColor: "rgba(0, 185, 227, 0.75)"
        },
        'automotive':{
          parentScope: null,
          scope:'automotive',
          topScope: 'automotive',
          displayName: 'Automotive',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-auto-shape',
          pageType: 3,
          color:'#00b9e3',
          hoverColor: "rgba(0, 185, 227, 0.75)"
        },
        'all':{
          parentScope: null,
          scope:'deep-dive',
          topScope: null,
          displayName: null,
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-auto-shape',
          pageType: 'all',
          color:'#00b9e3',
          hoverColor: "rgba(0, 185, 227, 0.75)"
        },
        //ABOVE are categories SNTMedia do no have specific verticals for therefore will not have anything linking to a category specific site
      }
      if(category[section] == null){// default return
        return {
          parentScope: null,
          scope:'deep-dive',
          topScope: null,
          displayName: null,
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon: 'fa-fontawesome-webfont',
          pageType: 3,
          color:'#00b9e3',
          hoverColor: "rgba(0, 185, 227, 0.75)"
        };
      }else{
        return category[section];
      }
    }

    static checkPartnerDomain (partnerCode) {
      var result = false;
      var specialDomains = [
        "latimes.com",
        "orlandosentinel.com",
        "sun-sentinel.com",
        "baltimoresun.com",
        "mcall.com",
        "courant.com",
        "dailypress.com",
        "southflorida.com",
        "citypaper.com",
        "themash.com",
        "coastlinepilot.com",
        "sandiegouniontribune.com",
        "ramonasentinel.com",
        "capitalgazette.com",
        "chicagotribune.com"
      ];
      for (var i = 0; i < specialDomains.length; i++) {
        if (specialDomains[i] == partnerCode) {
          result = true;
          return result;
        }
      }
      return result;
    }

    static getOffsiteLink(scope, relativeUrl){
      var link = "";
      var siteVars = this.getHomeInfo();
      var partnerCode;
      if (siteVars.isPartner) {
        partnerCode = siteVars.partnerName;
      }
      switch(scope){
        //FOOTBALL URL
        case 'nfl':
        case 'ncaaf':
          if (partnerCode != null) {
            if (this.checkPartnerDomain(partnerCode)) {
              link = "http://football." + partnerCode + "/" + relativeUrl;
            }
            else {
              link = "http://mytouchdownzone.com/" + partnerCode + "/" + relativeUrl;
            }
          }
          else {
            link = "http://touchdownloyal.com" + "/" + relativeUrl;
          }
          break;
        //BASKETBALL URL
        case 'nba':
        case 'ncaam':
          if (partnerCode != null) {
            link = "http://myhoopszone.com/" + partnerCode + "/" + relativeUrl;
          }
          else {
            link = "http://hoopsloyal.com" + "/" + relativeUrl;
          }
          break;
        //BASEBALL URL
        case 'mlb':
          if (partnerCode != null) {
            if (this.checkPartnerDomain(partnerCode)) {
              link = "http://baseball." + partnerCode + "/" + relativeUrl;
            }
            else {
              link = "http://myhomerunzone.com/" + partnerCode + "/" + relativeUrl;
            }
          }
          else {
            link = "http://homerunloyal.com" + "/" + relativeUrl;
          }
          break;
        //FINANCE URL
        case 'business':

          if (partnerCode != null) {
            link = "http://myinvestkit.com/" + partnerCode + "/" + relativeUrl;
          }
          else {

            link = "http://www.investkit.com/" + relativeUrl;

          }
          break;
        //REALESTATE URL
        case 'real-estate':
          if (partnerCode != null) {
            link = "http://myhousekit.com/" + partnerCode + "/" + relativeUrl;
          }
          else {
            link = "http://joyfulhome.com" + "/" + relativeUrl;
          }
          break;
      }
      return link;
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
        case 'ncaam':
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
        var relPath = relativePath != null && relativePath != "" ? this._proto + "//" + this._imageUrl + relativePath: '/app/public/no-image.png';
        return relPath;
    }

    static getSportsImageUrl(relativePath):string {
        // var relPath = relativePath != null && relativePath != "" ? this._proto + "//" + this.getEnv(this._env) +  "-" + this._sportsimageUrl + relativePath: '/app/public/no-image.svg';

        //todo: when the dev and qa sports image servers are made change this from hardcoded prod to dynamic
        var relPath = relativePath != null && relativePath != "" ? this._proto + "//" + "prod" +  "-" + this._sportsimageUrl + '/' + relativePath: '/app/public/no-image.png';
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
      var partnerPage = /mytcxzone/.test(hostname) || /^newspaper\./.test(hostname); //todo: change to correct domain not localhost
      var urlSplit = window.location.pathname.split('/');
      var name = "";
      var partnerName = "";
      var isSubdomainPartner = /^newspaper\./.test(hostname);
      if(partnerPage){
        partner = partnerPage;
        partnerName = urlSplit[1];
        name = urlSplit[2];
      }
      else {
        name = urlSplit[1];
      }
      //PLEASE REVISIT and change
      if(partnerPage && (name == '' || name == 'news')){
        hide = true;
        isHome = true;
      }else if(!partnerPage && (name == '' || name == 'deep-dive')){
        hide = false;
        isHome = true;
      }else{
        hide = false;
        isHome = false;
      }

      return {
        isPartner: partner,
        hide:hide,
        isHome:isHome,
        partnerName: partnerName,
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
    static getVerticalFB() {
        return this._verticalFacebook;
    }
    static getVerticalTwitter() {
        return this._verticalTwitter;
    }
    static getSiteTwitterUrl(shareUrl: string) {
      return this._siteTwitterUrl + shareUrl;
    }
    static getSiteFacebookUrl(shareUrl: string) {
      return this._siteFacebookUrl + shareUrl;
    }
    static getLinkedInUrl(shareUrl: string) {
      return this._siteLinkedinUrl + shareUrl;
	  }
    static getSiteGoogleUrl(shareUrl: string) {
      return this._siteGoogleUrl + shareUrl;
	  }

    static getSocialMedia(shareUrl: string){
      let socialMediaItems = [
        {
          type:'facebook',
          url: this._siteFacebookUrl + shareUrl,
          target: '_blank',
          iconClass: 'fa fa-_siteFacebookUrl-1',
        },
        {
          type:'twitter',
          url: this._siteFacebookUrl + shareUrl,
          target: '_blank',
          iconClass: 'fa fa-twitter',
        },
        {
          type:'linkedin',
          url: this._siteLinkedinUrl + shareUrl,
          target: '_blank',
          iconClass: 'fa fa-linkedin',
        },
        {
          type:'google',
          url: this._siteGoogleUrl + shareUrl,
          target: '_blank',
          iconClass: 'fa fa-g-plus',
        },
      ];
      return socialMediaItems;
    }

    static getEstYear() {
      return this._estYear;
    }
  static getHomePageLinkName() {
    return this._homepageLinkName;
  }
  static getSyndicateUrl(){
      return this._proto + "//" + this.getEnv(this._env) + this._synArticleUrl;
  }

}
