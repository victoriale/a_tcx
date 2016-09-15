import {Component, OnInit} from '@angular/core';
import {Router, RouteParams, ROUTER_DIRECTIVES} from '@angular/router-deprecated';

@Component({
    selector: 'Partner-home-page',
    templateUrl: './app/webpages/partner-home-page/partner-home-page.html',

    directives: [ROUTER_DIRECTIVES],
    providers: [],
})

export class PartnerHomePage implements OnInit{
    private partners: any;
    private websites: any;
    public partnerData: Object;

    getPartners() {
      var partners = [
        {
          name: 'Arkansas',
          websites: [
            {
              name: 'Arkansas Democrat Gazette',
              url: 'Home-page',
              partner_id: 'arkansasonline.com'
            },
            {
              name: 'Northwest Arkansas Democrat Gazette',
              url: 'Home-page',
              partner_id: 'nwaonline.com'
            }
          ]
        },
        {
          name: 'California',
          websites: [
            {
              name: 'Brentwood Press',
              url: 'Home-page',
              partner_id: 'thepress.net'
            },
            {
              name: 'Contra Costa Times',
              url: 'Home-page',
              partner_id: 'contracostatimes.com'
            },
            {
              name: 'Inside Bay Area',
              url: 'Home-page',
              partner_id: 'insidebayarea.com'
            },
            {
              name: 'Los Angeles Times',
              url: 'Home-page',
              partner_id: 'latimes.com'
            },
            {
              name: 'NBC Bay Area',
              url: 'Home-page',
              partner_id: 'nbcbayarea.com'
            },
            {
              name: 'NBC Los Angeles',
              url: 'Home-page',
              partner_id: 'nbclosangeles.com'
            },
            {
              name: 'NBC San Diego',
              url: 'Home-page',
              partner_id: 'nbcsandiego.com'
            },
            {
              name: 'San Diego Union Tribune',
              url: 'Home-page',
              partner_id: 'sandiegouniontribune.com'
            },
            {
              name: 'San Jose Mercury News',
              url: 'Home-page',
              partner_id: 'mercurynews.com'
            },
            {
              name: 'Silicon Beat',
              url: 'Home-page',
              partner_id: 'siliconbeat.com'
            },
            {
              name: 'Silicon Valley',
              url: 'Home-page',
              partner_id: 'siliconvalley.com'
            },
          ]
        },
        {
          name: 'Connecticut',
          websites: [
            {
              name: 'Hartford Courant',
              url: 'Home-page',
              partner_id: 'courant.com'
            },
            {
              name: 'NBC Connecticut',
              url: 'Home-page',
              partner_id: 'nbcconnecticut.com'
            },
          ]
        },
        {
          name: 'Florida',
          websites: [
            {
              name: 'NBC Miami',
              url: 'Home-page',
              partner_id: 'nbcmiami.com'
            },
            {
              name: 'Orlando Sentinel',
              url: 'Home-page',
              partner_id: 'orlandosentinel.com'
            },
            {
              name: 'Sun-Sentinel',
              url: 'Home.page',
              partner_id: 'sun-sentinel.com'
            },
            {
              name: 'Tampa Bay Times',
              url: 'Home-page',
              partner_id: 'tampabay.com'
            },
          ]
        },
        {
          name: 'Georgia',
          websites: [
            {
              name: 'LaGrange Daily News',
              url: 'Home-page',
              partner_id: 'lagrangedailynews.com'
            },
            {
              name: 'Thomaston Times',
              url: 'Home-page',
              partner_id: 'thomastontimes.com'
            },
          ]
        },
        {
          name: 'Illinois',
          websites: [
            {
              name: 'The Alton Telegraph',
              url: 'Home-page',partner_id: 'thetelegraph.com'
            },
            {
              name: 'Chicago Tribune',
              url: 'Home-page',partner_id: 'chicagotribune.com'
            },
            {
              name: 'Journal Courier',
              url: 'Home-page',partner_id: 'myjournalcourier.com'
            },
            {
              name: 'NBC Chicago',
              url: 'Home-page',partner_id: 'nbcchicago.com'
            },
          ]
        },
        {
          name: 'Kentucky',
          websites: [
            {
              name: 'Floyd County Times',
              url: 'Home-page',partner_id: 'floydcountytimes.com'
            },
            {
              name: 'Grayson County News Gazette',
              url: 'Home-page',partner_id: 'gcnewsgazette.com'
            },
            {
              name: 'Harlan Daily Enterprise',
              url: 'Home-page',partner_id: 'harlandaily.com'
            },
            {
              name: 'Hazard Herald',
              url: 'Home-page',partner_id: 'hazard-herald.com'
            },
            {
              name: 'Middlesboro Daily News',
              url: 'Home-page',partner_id: 'middlesborodailynews.com'
            },
            {
              name: 'News Democrat Leader',
              url: 'Home-page',partner_id: 'newsdemocratleader.com'
            },
          ]
        },
        {
          name: 'Maryland',
          websites: [
            {
              name: 'Baltimore Sun',
              url: 'Home-page',partner_id: 'baltimoresun.com'
            },
          ]
        },
        {
          name: 'Massachusetts',
          websites: [
            {
              name: 'New England Cable News',
              url: 'Home-page',partner_id: 'necn.com'
            },
          ]
        },
        {
          name: 'Missouri',
          websites: [
            {
              name: 'Sedalia Democrat',
              url: 'Home-page',partner_id: 'sedaliademocrat.com'
            },
          ]
        },
        {
          name: 'New York',
          websites: [
            {
              name: 'NBC New York',
              url: 'Home-page',partner_id: 'nbcnewyork.com'
            },
          ]
        },
        {
          name: 'North Carolina',
          websites: [
            {
              name: 'Anson Record',
              url: 'Home-page',partner_id: 'ansonrecord.com'
            },
            {
              name: 'Bladen Journal',
              url: 'Home-page',partner_id: 'bladenjournal.com'
            },
            {
              name: 'Fairmont Bugle',
              url: 'Home-page',partner_id: 'fairmontbugle.com'
            },
            {
              name: 'Laurinburg Exchange',
              url: 'Home-page',partner_id: 'laurinburgexchange.com'
            },
            {
              name: 'Mt. Airy News',
              url: 'Home-page',partner_id: 'mtairynews.com'
            },
            {
              name: 'My Pembroke NC',
              url: 'Home-page',partner_id: 'mypembrokenc.com'
            },
            {
              name: 'Pilot Mountain News',
              url: 'Home-page',partner_id: 'pilotmountainnews.com'
            },
            {
              name: 'Red Springs Citizen',
              url: 'Home-page',partner_id: 'redspringscitizen.com'
            },
            {
              name: 'Richmond County Daily Journal',
              url: 'Home-page',partner_id: 'yourdailyjournal.com'
            },
            {
              name: 'Robesonian',
              url: 'Home-page',partner_id: 'robesonian.com'
            },
            {
              name: 'Sampson Independent',
              url: 'Home-page',partner_id: 'clintonnc.com'
            },
            {
              name: 'St. Pauls Review',
              url: 'Home-page',partner_id: 'stpaulsreview.com'
            },
            {
              name: 'The Elkin Tribune',
              url: 'Home-page',partner_id: 'elkintribune.com'
            },
            {
              name: 'The Jefferson Post',
              url: 'Home-page',partner_id: 'jeffersonpost.com'
            },
            {
              name: 'The Stokes News',
              url: 'Home-page',partner_id: 'thestokesnews.com'
            },
            {
              name: 'The Williamson Daily News',
              url: 'Home-page',partner_id: 'williamsondailynews.com'
            },
            {
              name: 'Yadkin Ripple',
              url: 'Home-page',partner_id: 'yadkinripple.com'
            },
          ]
        },
        {
          name: 'Ohio',
          websites: [
            {
              name: 'Amherst News Times',
              url: 'Home-page',partner_id: 'theamherstnewstimes.com'
            },
            {
              name: 'Beaver Creek News Current',
              url: 'Home-page',partner_id: 'beavercreeknewscurrent.com'
            },
            {
              name: 'Bellbrook Times',
              url: 'Home-page',partner_id: 'bellbrooktimes.com'
            },
            {
              name: 'Bellevue Gazette',
              url: 'Home-page',partner_id: 'thebellevuegazette.com'
            },
            {
              name: 'Bellville Star',
              url: 'Home-page',partner_id: 'thebellvillestar.com'
            },
            {
              name: 'Clyde Enterprise',
              url: 'Home-page',partner_id: 'clydeenterprise.com'
            },
            {
              name: 'Community Common',
              url: 'Home-page',partner_id: 'communitycommon.com'
            },
            {
              name: 'Daily Advocate',
              url: 'Home-page',partner_id: 'dailyadvocate.com'
            },
            {
              name: 'Delaware Gazette',
              url: 'Home-page',partner_id: 'delgazette-com'
            },
            {
              name: 'Englewood Independent',
              url: 'Home.page',partner_id: 'englewoodindependent.com'
            },
            {
              name: 'Exponent News',
              url: 'Home-page',partner_id: 'exponentnews.com'
            },
            {
              name: 'Fairborn Daily Herald',
              url: 'Home-page',partner_id: 'fairborndailyherald.com'
            },
            {
              name: 'Fulton County Expositor',
              url: 'Home-page',partner_id: 'fcnews.org'
            },
            {
              name: 'Galion Inquirer',
              url: 'Home-page',partner_id: 'galioninquirer.com'
            },
            {
              name: 'Gallipolis Daily Tribune',
              url: 'Home-page',partner_id: 'mydailytribune.com'
            },
            {
              name: 'Huber Heights Courier',
              url: 'Home-page',partner_id: 'hhcourier.com'
            },
            {
              name: 'Knox County Citizen',
              url: 'Home-page',partner_id: 'knoxcountycitizen.com'
            },
            {
              name: 'The Lima News',
              url: 'Home-page',partner_id: 'limaohio.com'
            },
            {
              name: 'Madison Press',
              url: 'Home-page',partner_id: 'madison-press.com'
            },
            {
              name: 'Mechanicsburg Telegram',
              url: 'Home-page',partner_id: 'burgtelegram.com'
            },
            {
              name: 'Morrow County Sentinel',
              url: 'Home-page',partner_id: 'morrowcountysentinel.com'
            },
            {
              name: 'Mt. Sterling Tribune',
              url: 'Home-page',partner_id: 'themtsterlingtribune.com'
            },
            {
              name: 'News Democrat',
              url: 'Home-page',partner_id: 'newsdemocrat.com'
            },
            {
              name: 'Wilmington News Journal',
              url: 'Home-page',partner_id: 'wnewsj.com'
            },
            {
              name: 'Oberlin News Tribune',
              url: 'Home-page',partner_id: 'theoberlinnewstribune.com'
            },
            {
              name: 'The Peninsula News',
              url: 'Home-page',partner_id: 'thepennews.com'
            },
            {
              name: 'Peoples Defender',
              url: 'Home-page',partner_id: 'peoplesdefender.com'
            },
            {
              name: 'Piqua Daily Call',
              url: 'Home-page',partner_id: 'dailycall.com'
            },
            {
              name: 'The Plain City Advocate',
              url: 'Home-page',partner_id: 'plaincity-advocate.com'
            },
            {
              name: 'Pomeroy Daily Sentinel',
              url: 'Home-page',partner_id: 'mydailysentinel.com'
            },
            {
              name: 'Portsmouth Daily Times',
              url: 'Home-page',partner_id: 'portsmouth-dailytimes.com'
            },
            {
              name: 'The Record Herald',
              url: 'Home-page',partner_id: 'recordherald.com'
            },
            {
              name: 'Register Herald',
              url: 'Home-page',partner_id: 'registerherald.com'
            },
            {
              name: 'Ripley Bee',
              url: 'Home-page',partner_id: 'ripleybee.com'
            },
            {
              name: 'Sidney Daily News',
              url: 'Home-page',partner_id: 'sidneydailynews.com'
            },
            {
              name: 'Sunbury News',
              url: 'Home-page',partner_id: 'sunburynews.com'
            },
            {
              name: 'Swanton Enterprise',
              url: 'Home-page',partner_id: 'swantonenterprise.com'
            },
            {
              name: 'Times Gazette',
              url: 'Home-page',partner_id: 'timesgazette.com'
            },
            {
              name: 'Troy Daily News',
              url: 'Home-page',partner_id: 'tdn-net.com'
            },
            {
              name: 'Urbana Daily Citizen',
              url: 'Home-page',partner_id: 'urbanacitizen.com'
            },
            {
              name: 'Vandalia Drummer News',
              url: 'Home-page',partner_id: 'vandaliadrummernews.com'
            },
            {
              name: 'Weekly Currents',
              url: 'Home-page',partner_id: 'weeklycurrents.com'
            },
            {
              name: 'Weekly Record Herald',
              url: 'Home-page',partner_id: 'weeklyrecordherald.com'
            },
            {
              name: 'The Wellington Enterprise',
              url: 'Home-page',partner_id: 'thewellingtonenterprise.com'
            },
            {
              name: 'Xenia Gazette',
              url: 'Home-page',partner_id: 'xeniagazette.com'
            },
          ]
        },
        {
          name: 'Oklahoma',
          websites: [
            {
              name: 'Altus Times',
              url: 'Home-page',partner_id: 'altustimes.com'
            },
            {
              name: 'Press-Leader',
              url: 'Home-page',partner_id: 'press-leader.com'
            },
            {
              name: 'The Durant Daily Democrat',
              url: 'Home-page',partner_id: 'durantdemocrat.com'
            },
          ]
        },
        {
          name: 'Pennsylvania',
          websites: [
            {
              name: 'The Abington Journal',
              url: 'Home-page',partner_id: 'theabingtonjournal.com'
            },
            {
              name: 'Citizens\' Voice',
              url: 'Home-page',partner_id: 'citizensvoice.com'
            },
            {
              name: 'Daily Review',
              url: 'Home-page',partner_id: 'thedailyreview.com'
            },
            {
              name: 'The Dallas Post',
              url: 'Home-page',partner_id: 'mydallaspost.com'
            },
            {
              name: 'Morning Call',
              url: 'Home-page',partner_id: 'mcall.com'
            },
            {
              name: 'NBC Philadelphia',
              url: 'Home-page',partner_id: 'nbcphiladelphia.com'
            },
            {
              name: 'News Item',
              url: 'Home-page',partner_id: 'newsitem.com'
            },
            {
              name: 'Republican Herald',
              url: 'Home-page',partner_id: 'republicanherald.com'
            },
            {
              name: 'Standard Speaker',
              url: 'Home-page',partner_id: 'standardspeaker.com'
            },
            {
              name: 'The Sunday Dispatch',
              url: 'Home-page',partner_id: 'psdispatch.com'
            },
            {
              name: 'The Times Leader',
              url: 'Home-page',partner_id: 'timesleader.com'
            },
            {
              name: 'Times Tribune',
              url: 'Home-page',partner_id: 'thetimes-tribune.com'
            },
            {
              name: 'The Weekender',
              url: 'Home-page',partner_id: 'theweekender.com'
            },
          ]
        },
        {
          name: 'South Carolina',
          websites: [
            {
              name: 'Cheraw Chronicle',
              url: 'Home-page',partner_id: 'thecherawchronicle.com'
            },
            {
              name: 'Easley Progress',
              url: 'Home-page',partner_id: 'theeasleyprogress.com'
            },
            {
              name: 'Herald Independent',
              url: 'Home-page',partner_id: 'heraldindependent.com'
            },
            {
              name: 'Newberry Observer',
              url: 'Home-page',partner_id: 'newberryobserver.com'
            },
            {
              name: 'Pickens Sentinel',
              url: 'Home-page',partner_id: 'pickenssentinel.com'
            },
            {
              name: 'The Powdersville Post',
              url: 'Home-page',partner_id: 'powdersvillepost.com'
            },
            {
              name: 'Union Daily Times',
              url: 'Home-page',partner_id: 'uniondailytimes.com'
            },
          ]
        },
        {
          name: 'Tennessee',
          websites: [
            {
              name: 'Claiborne Progress',
              url: 'Home-page',partner_id: 'claiborneprogress.net'
            },
            {
              name: 'Macon County Times',
              url: 'Home-page',partner_id: 'maconcountytimes.com'
            },
          ]
        },
        {
          name: 'Texas',
          websites: [
            {
              name: 'NBC Dallas-Fort Worth',
              url: 'Home-page',partner_id: 'nbcdfw.com'
            },
            {
              name: 'Odessa American',
              url: 'Home-page',partner_id: 'oaoa.com'
            },
          ]
        },
        {
          name: 'Virginia',
          websites: [
            {
              name: 'Carroll News',
              url: 'Home-page',partner_id: 'thecarrollnews.com'
            },
            {
              name: 'Daily Press',
              url: 'Home-page',partner_id: 'dailypress.com'
            },
            {
              name: 'Inside Nova',
              url: 'Home-page',partner_id: 'insidenova.com'
            },
            {
              name: 'Leesburg Today',
              url: 'Home-page',partner_id: 'leesburgtoday.com'
            },
          ]
        },
        {
          name: 'Washington D.C.',
          websites: [
            {
              name: 'NBC Washington',
              url: 'Home-page',partner_id: 'nbcwashington.com'
            },
          ]
        },
        {
          name: 'West Virginia',
          websites: [
            {
              name: 'Coal Valley News',
              url: 'Home-page',partner_id: 'coalvalleynews.com'
            },
            {
              name: 'Gilbert Times',
              url: 'Home-page',partner_id: 'gilberttimes.net'
            },
            {
              name: 'Independent Herald',
              url: 'Home-page',partner_id: 'independentherald.com'
            },
            {
              name: 'Logan Banner',
              url: 'Home-page',partner_id: 'loganbanner.com'
            },
            {
              name: 'The Point Pleasant Register',
              url: 'Home-page',partner_id: 'mydailyregister.com'
            },
          ]
        },
      ];
      for ( var i = 0; i < partners.length; i++ ) {
        for ( var j = 0; j < partners[i].websites.length; j++ ) {
          partners[i].websites[j].url = "/"+partners[i].websites[j].partner_id;
        }
      }
      return partners;
    }
    ngOnInit() {
      this.partners = this.getPartners();
    }
}
