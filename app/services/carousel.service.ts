import {Injectable, Injector} from '@angular/core';
import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig, RouteParams } from '@angular/router-deprecated';
import {HTTP_PROVIDERS, Http, Response, Headers} from "@angular/http";
import {GlobalSettings} from "../global/global-settings";
import {Observable} from "rxjs/Observable";

import {VerticalGlobalFunctions} from '../global/vertical-global-functions';

@Injectable()

export class ImagesService {
    constructor(public http:Http) {
    };

    getImages(profileType, profileId?) {
        var fullUrl = GlobalSettings.getApiUrl() + "/images/" + profileType.toLowerCase();
        if (profileId !== undefined) {
            fullUrl += "/" + profileId;
        }
        return this.http.get(fullUrl)
            .map(res => res.json())
            .map(data => this.getImageArray(data.data));
    }

    getImageArray(imageData) {
        var imageArray = [];
        var copyArray = [];
        var titleArray = [];
        imageData.forEach(function (val, index) {
            val['images'] = VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(val.imageUrl);
            val['copyright'] = val.imageCopyright;
            val['title'] = val.imageDescription;
            imageArray.push(val['images']);
            copyArray.push(val['copyright']);
            titleArray.push(val['title']);
        });
        return {
            imageArray: imageArray,
            copyArray: copyArray,
            titleArray: titleArray
        }
    }

    getImageArrayAI(imageData) {
        var imageArray = [];
        var copyArray = [];
        var titleArray = [];
        imageData.forEach(function (val, index) {
            val['images'] = VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(val['image_url']);
            val['copyright'] = val['image_copyright'];
            val['title'] = val['image_title'];
            imageArray.push(val['images']);
            copyArray.push(val['copyright']);
            titleArray.push(val['title']);
        });
        return {
            imageArray: imageArray,
            copyArray: copyArray,
            titleArray: titleArray
        }
    }
}
