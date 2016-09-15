import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {GlobalSettings} from "../global/global-settings";

@Injectable()

export class HeadlineDataService {

    constructor(public http:Http) {}

    getAiHeadlineData(scope, teamID) {
        var fullUrl = GlobalSettings.getHeadlineUrl();
        return this.http.get(fullUrl + 'headlines/' + scope + '/' + teamID)
            .map(res => res.json())
            .map(data => data);
    }

    getAiHeadlineDataLeague(count, scope) {
        if(count == null){
            count = 10;
        }
        var fullUrl = GlobalSettings.getHeadlineUrl();
        return this.http.get(fullUrl + "articles?page=1&count=" + count + "&affiliation="+scope+"&articleType=pregame-report" + "&affiliation=" + scope)
            .map(res => res.json())
            .map(data => data);
    }
}
