import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'term-of-service',
  templateUrl: 'app/webpages/term-of-service/term-of-service.html',
})

export class TermOfService implements OnInit{
  aboutUsData: any;
  ngOnInit(){
    this.aboutUsData = {
      title: "Term of Service",
      lastUpdated: "Last Updated On: Wednesday, Oct. 19, 2016",
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
