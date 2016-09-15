import {Component, OnInit} from '@angular/core';
import {ArticlesModule} from "../../fe-core/modules/articles/articles.module";

@Component({
    selector: 'Module-page',
    templateUrl: './app/webpages/module-page/module.page.html',
    directives: [ArticlesModule],
    providers: [],
})

export class ModulePage implements OnInit{

    ngOnInit(){

    }
}