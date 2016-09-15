import {provide} from '@angular/core';
import {it, describe, expect, beforeEachProviders, injectAsync} from '@angular/testing';
import {XHRBackend, BaseRequestOptions, Http, HTTP_PROVIDERS} from '@angular/http';
import 'rxjs/add/operator/map'; //allows the `map` function on Http Observable objects, which is used by services

import {ComparisonStatsService} from '../comparison-stats.service';

describe('player comparison api tests', () => {

  beforeEachProviders(() => [
    HTTP_PROVIDERS,
    XHRBackend,
    BaseRequestOptions,
    provide(Http, {
      useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
      deps: [XHRBackend, BaseRequestOptions]
    }),
    ComparisonStatsService
  ]);

  it('loading team list for comparison', 
  injectAsync([ComparisonStatsService], (service: ComparisonStatsService) => {
    return new Promise((pass, fail) => {
      service.getTeamList()
        .subscribe(
          data => { 
            expect(data).not.toBeNull();
            expect(data.length).toBe(30);
            for ( var key in data ) {
              var item = data[key];
              expect(item.key).not.toBeNull();
              expect(item.value).not.toBeNull();
            }
            pass();            
          },
          err => { 
            fail("Unable to load api"); 
          });
    });
  }));

  it('loading player list for comparison', 
  injectAsync([ComparisonStatsService], (service: ComparisonStatsService) => {
    return new Promise((pass, fail) => {
      var teamId = "2791"; //Boston Red Sox
      service.getPlayerList(teamId)
        .subscribe(
          data => { 
            expect(data).not.toBeNull();
            expect(data.length).toBeGreaterThan(0);
            for ( var i = 0; i < data.length; i++ ) {              
              var item = data[i];
              expect(item.key).not.toBeNull();
              expect(item.value).not.toBeNull();

              if ( i == 0 ) {
                expect(item.key).toEqual('');
              }
              if ( item.key == '' ) {
                expect(item.class).toEqual('dropdown-grp-lbl');
              }
              else {                
                expect(item.class).toEqual('dropdown-grp-item');
              }
            }
            pass();            
          },
          err => { 
            fail("Unable to load api"); 
          });
    });
  }));

  it('loading player comparison for players', 
  injectAsync([ComparisonStatsService], (service: ComparisonStatsService) => {
    return new Promise((pass, fail) => {
      var validPlayerIds = [96546, 96554, 95097];
      validPlayerIds.forEach((id) => {
        service.getInitialPlayerStats({playerId: id})
          .subscribe(
            data => { 
              expect(data.data.playerOne.playerId).toBe(id.toString());
              pass();
            },
            err => { 
              fail("Unable to load api"); 
            });
      });
    });
  }));
});

function logObject(data: any, level?:number) {
  if ( level == null ) {
    level = 0;
  }  
  var tabs = "";
  for ( var i = 0; i < level; i++ ) { tabs += "  "; }

  for ( var key in data ) {
    var item = data[key];
    if ( item == null ) {
      console.log(tabs + key + " => " + item);
    }
    else if ( typeof item === 'object' ) {
      console.log(tabs + key + "=> {");
      logObject(item, level+1);
      console.log(tabs + "}");
    }
    else if ( typeof item === 'array' ) {
      console.log(tabs + key + "=> [");
      logObject(item, level+1);
      console.log(tabs + "]");
    }
    else {
      console.log(tabs + key + "=>" + item);
    }                            
  }
}