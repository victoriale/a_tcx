import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'about-us-page',
  templateUrl: 'app/webpages/aboutus/aboutus.html',
})

export class AboutUsPage implements OnInit{
  aboutUsData: any;
  ngOnInit(){
    this.aboutUsData = {
      title: "About Us",
      lastUpdated: "Last Updated On: Oct. 19, 2016<span class='hide-320'> at 3:19PM ET</span>",
      paragraph: [{
          subHeader: "sub header 1",
          info: ['Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae d']
        },{
            subHeader: "sub header 2",
            info: ['Duis aute irure dolor in reprehender velit esse cillum dolore eu fugiat nulla pariatur. Excepteur roident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error doloremque laudantium, totam rem aperiam, eaque ipsa qua architecto beatae vitae d', 'START HERE omnis iste natus error doloremque laudantium, totam rem aperiam, eaque ipsa qua architecto beatae vitae d']
        },
      ]
    }
  }
}
