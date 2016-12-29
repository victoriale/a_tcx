import { Component, OnInit, Input } from '@angular/core';
import { DeepDiveService } from '../../../services/deep-dive.service';
import { ArticleStackData, VideoStackData, SectionNameData } from "../../../fe-core/interfaces/deep-dive.data";
import { GlobalSettings } from "../../../global/global-settings";
import { GlobalFunctions } from "../../../global/global-functions";
import { VerticalGlobalFunctions } from "../../../global/vertical-global-functions";

declare var moment;

@Component({
    selector: 'deep-dive-block-main',
    templateUrl: './app/ui-modules/deep-dive-blocks/deep-dive-block-main/deep-dive-block-main.module.html',
})

export class DeepDiveBlockMain implements OnInit {
    @Input() geoLocation: string;
    private callApi: boolean = true;

    private breakingStack: Array<ArticleStackData>;
    private recDataSports: Array<ArticleStackData>;
    private businessStack: Array<ArticleStackData>;
    private politicsStack: Array<ArticleStackData>;
    private recDataEntertain: Array<ArticleStackData>;
    private foodStack: Array<ArticleStackData>;
    private recDataHealth: Array<ArticleStackData>;
    private lifestyleStack: Array<ArticleStackData>;
    private estateStack: Array<ArticleStackData>;
    private recDataTravel: Array<ArticleStackData>;
    private weatherStack: Array<ArticleStackData>;
    private recDataAuto: Array<ArticleStackData>;

    private videoDataBatch1: Array<VideoStackData>;
    private videoDataBatch2: Array<VideoStackData>;
    private videoDataBatch3: Array<VideoStackData>;
    private blockIndex: number = 0;
    private secName: Array<SectionNameData>;
    private batchNum: number = 1;
    private homePageBlocks = ["breaking", "video", "sports", "business", "politics", "entertainment", "food", "video", "health", "lifestyle", "real-estate", "travel", "weather", "video", "automotive"];
    constructor(private _deepDiveData: DeepDiveService) { }

    getSectionNameData() {
        var sectionNameArray = [];
        this.homePageBlocks.forEach(function(val, index) {
            var d = {
                icon: val != 'video' ? GlobalSettings.getTCXscope(val).icon : 'fa-play-circle',
                title: val != 'video' ? GlobalFunctions.toTitleCase(GlobalSettings.getTCXscope(val).displayName) : 'Videos',
                route: val != 'video' ? VerticalGlobalFunctions.formatSectionFrontRoute(GlobalSettings.getTCXscope(val).topScope) : null
            }
            sectionNameArray.push(d);
        });
        return sectionNameArray;
    }

    private onScroll(event) {
        var bodyHeight = event.target.documentElement.scrollHeight?event.target.documentElement.scrollHeight:event.target.body.scrollHeight;
        var scrollTop = window.pageYOffset? window.pageYOffset: window.scrollY;
        var footer = document.getElementById('footer');
        var footerHeight=footer?footer.offsetHeight:0;

        if(window.innerHeight + scrollTop >= bodyHeight ){
            //fire when scrolled into footer
            this.blockIndex = this.blockIndex + 1;
            this.callModules();
        };

    }

    getBreakingData() {
        this._deepDiveData.getDeepDiveBatchService("breaking", 7, this.batchNum, this.geoLocation)
            .subscribe(data => {
                this.breakingStack = this._deepDiveData.transformToArticleStack(data, "breaking");
            },
            err => {
                console.log("Error getting Breaking News data");
            });
    }
    getSportsData() {
        this._deepDiveData.getDeepDiveBatchService("sports", 6, this.batchNum, this.geoLocation)
            .subscribe(data => {
                data = data.length > 2 ? data.length >=3 && data.length < 6 ? data.splice(0,3) : data.splice(0,6): null;
                this.recDataSports = this._deepDiveData.transformToArticleStack(data, "sports");
            },
            err => {
                console.log("Error getting Sports News data");
            });
    }
    getBusinessData() {
        this._deepDiveData.getDeepDiveBatchService("business", 7, this.batchNum, this.geoLocation)
            .subscribe(data => {
                this.businessStack = this._deepDiveData.transformToArticleStack(data, "business");
            },
            err => {
                console.log("Error getting Business News data");
            });
    }
    getPoliticsData() {
        this._deepDiveData.getDeepDiveBatchService("politics", 5, this.batchNum, this.geoLocation)
            .subscribe(data => {
                this.politicsStack = this._deepDiveData.transformToArticleStack(data, "politics");
            },
            err => {
                console.log("Error getting Politics News data");
            });
    }
    getEntertainData() {
        this._deepDiveData.getDeepDiveBatchService("entertainment", 6, this.batchNum, this.geoLocation)
            .subscribe(data => {
              data = data.length > 2 ? data.length >= 3 && data.length < 6 ? data.splice(0,3) : data.splice(0,6): null;
              this.recDataEntertain = this._deepDiveData.transformToArticleStack(data, "entertainment");
            },
            err => {
                console.log("Error getting Entertainment News data");
            });
    }
    getHealthData() {
        this._deepDiveData.getDeepDiveBatchService("health", 6, this.batchNum, this.geoLocation)
            .subscribe(data => {
              data = data.length > 2 ? data.length >= 3 && data.length < 6 ? data.splice(0,3) : data.splice(0,6): null;
              this.recDataHealth = this._deepDiveData.transformToArticleStack(data, "health");
            },
            err => {
                console.log("Error getting Health News data");
            });
    }
    getLifeStyleData() {
        this._deepDiveData.getDeepDiveBatchService("lifestyle", 7, this.batchNum, this.geoLocation)
            .subscribe(data => {
                this.lifestyleStack = this._deepDiveData.transformToArticleStack(data, "lifestyle");
            },
            err => {
                console.log("Error getting Lifestyle News data");
            });
    }
    getRealEstateData() {
        this._deepDiveData.getDeepDiveBatchService("real estate", 5, this.batchNum, this.geoLocation)
            .subscribe(data => {
                this.estateStack = this._deepDiveData.transformToArticleStack(data, "real-estate");
            },
            err => {
                console.log("Error getting Real Estate News data");
            });
    }
    getTravelData() {
        this._deepDiveData.getDeepDiveBatchService("travel", 6, this.batchNum, this.geoLocation)
            .subscribe(data => {
              data = data.length > 2 ? data.length >= 3 && data.length < 6 ? data.splice(0,3) : data.splice(0,6): null;
              this.recDataTravel = this._deepDiveData.transformToArticleStack(data, "travel");
            },
            err => {
                console.log("Error getting Travel News data");
            });
    }
    getWeatherData() {
        this._deepDiveData.getDeepDiveBatchService("weather", 7, this.batchNum, this.geoLocation)
            .subscribe(data => {
                this.weatherStack = this._deepDiveData.transformToArticleStack(data, "weather");
            },
            err => {
                console.log("Error getting Weather News data");
            });
    }
    getAutomotiveData() {
        this._deepDiveData.getDeepDiveBatchService("automotive", 6, this.batchNum, this.geoLocation)
            .subscribe(data => {
              data = data.length > 2 ? data.length >= 3 && data.length < 6 ? data.splice(0,3) : data.splice(0,6): null;
              this.recDataAuto = this._deepDiveData.transformToArticleStack(data, "automotive");
            },
            err => {
                console.log("Error getting Automotive News data");
            });
    }
    getFoodData() {
        this._deepDiveData.getDeepDiveBatchService("food", 7, this.batchNum, this.geoLocation)
            .subscribe(data => {
                this.foodStack = this._deepDiveData.transformToArticleStack(data, "food");
            },
            err => {
                console.log("Error getting Food News data");
            });
    }
    getDeepDiveVideo() {
        this._deepDiveData.getDeepDiveVideoBatchService("sports", 15, 1, this.geoLocation)
            .subscribe(data => {
                if (data.length > 0) {
                    let videoBatch1 = data.splice(0, 5);
                    this.videoDataBatch1 = videoBatch1 ? this._deepDiveData.transformSportVideoBatchData(videoBatch1, "sports") : null;
                    if (data.length > 1) {
                        let videoBatch2 = data.splice(0, 5);
                        let videoBatch3 = data.splice(0, 5);
                        this.videoDataBatch2 = videoBatch2 ? this._deepDiveData.transformSportVideoBatchData(videoBatch2, "sports") : null;
                        this.videoDataBatch3 = videoBatch3 ? this._deepDiveData.transformSportVideoBatchData(videoBatch3, "sports") : null;
                    }
                }
            },
            err => {
                console.log("Error getting video batch data");
            });
    }
    callModules() {
      if(this.blockIndex >= 0 && !this.breakingStack && !this.recDataSports ){
        this.getBreakingData();
        this.getSportsData();
      }else if(this.blockIndex > 1 && !this.businessStack && !this.politicsStack){
        this.getBusinessData();
        this.getPoliticsData();
      }else if(this.blockIndex > 2 && !this.recDataHealth && !this.recDataHealth){
        this.getEntertainData();
        this.getHealthData();
      }else if(this.blockIndex > 3 && !this.lifestyleStack && !this.estateStack){
        this.getLifeStyleData();
        this.getRealEstateData();
      }else if(this.blockIndex > 4 && !this.recDataTravel && !this.weatherStack){
        this.getTravelData();
        this.getWeatherData();
      }else if(this.blockIndex > 5 && !this.recDataAuto && !this.foodStack){
        this.getAutomotiveData();
        this.getFoodData();
      }
      if(!this.videoDataBatch1 && this.blockIndex > 2){
        this.getDeepDiveVideo();
      }
    }

    ngOnInit() {
        this.secName = this.getSectionNameData();
        this.callModules();
    }
}
