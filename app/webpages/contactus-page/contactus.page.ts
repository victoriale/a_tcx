import {Component} from '@angular/core';
import {Http} from '@angular/http';
import {Router} from '@angular/router-deprecated';
import {Observable} from 'rxjs/Rx';
import {Title} from '@angular/platform-browser';

import {WidgetModule} from "../../fe-core/modules/widget/widget.module";
import {ContactUsModule} from '../../fe-core/components/contactus/contactus.component';
import {GlobalSettings} from '../../global/global-settings';
import {SidekickWrapper} from "../../fe-core/components/sidekick-wrapper/sidekick-wrapper.component";
import {ResponsiveWidget} from '../../fe-core/components/responsive-widget/responsive-widget.component';

declare var moment;
@Component({
    selector: 'contactus-page',
    templateUrl: './app/webpages/contactus-page/contactus.page.html',
    directives: [SidekickWrapper, ContactUsModule, WidgetModule, ResponsiveWidget],
    providers: [Title],
})
export class ContactUsPage{
    public widgetPlace: string = "widgetForPage";
    //Object that builds contact us module
    public mailManUrl: string;
    public contactusInput: Object;

    constructor(private http:Http, private _title: Title, private _router:Router) {
        _title.setTitle(GlobalSettings.getPageTitle("Contact Us"));
        GlobalSettings.getParentParams(_router, parentParams => {
          var domainTitle;
          if(parentParams.partnerID != null){
            domainTitle = GlobalSettings.getBasePartnerTitle();
          }else{
            domainTitle = GlobalSettings.getBaseTitle();
          }

          this.contactusInput = {
              subjects: [
                  {
                      value: 'General Feedback',
                      id: 'general'
                  },
                  {
                      value: 'Advertisement',
                      id: 'advertisement'
                  },
                  {
                      value: 'Copyright Infringement',
                      id: 'copyright'
                  },
                  {
                      value: 'Inquire about partnering with '+ domainTitle,
                      id: 'inquire'
                  }
              ],
              titleData: {
                  imageURL: GlobalSettings.getSiteLogoUrl(),
                  text1: 'Last Updated: Thursday, August 4, 2016',
                  text2: ' United States',
                  text3: 'Have a question about '+domainTitle+'? Write us a message.',
                  text4: '',
                  icon: 'fa fa-map-marker'
              }
          }
        });
    }

    formSubmitted(form){
        //start the form url to mailer and prepare for all the options user has checked
        this.mailManUrl = GlobalSettings.getApiUrl() + '/mailer';
        var options = [];

        //run through each case and append it to the url note the component should catch if client did not fill our entire form
        for(var items in form){
          switch(items){
            case 'name':
            this.mailManUrl += '/'+form[items];//items should equal 'name' here but in case of any type of changes
            break;
            case 'email':
            this.mailManUrl += '/'+form[items];//items should equal 'email' here but in case of any type of changes
            break;
            case 'description':
            this.mailManUrl += '/'+ encodeURIComponent(form[items]);//items should equal 'description' here but in case of any type of changes
            break;
            default:
              if(form[items] !== null){
                options.push(items);
              }
            break;
          }
        }

        //join all the options that were checked with commas and append to end of mailManUrl
        var stringOptions = options.join(',');
        this.mailManUrl += '/'+stringOptions
        //send to backend the full mail url of all options
        this.http.get(this.mailManUrl,{})
    }
}
