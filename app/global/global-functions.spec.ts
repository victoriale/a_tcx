import {it, describe, expect, beforeEach, inject} from '@angular/testing';
import {GlobalFunctions} from './global-functions';

// export class TestFunctions
// {
// }
  // describe('GlobalFunctions', () => {
  //   it('true is true', () => expect(true).toEqual(true));
  // });

  describe('', () => {
    let functions:GlobalFunctions;
    
    beforeEach(() => {
      this.functions = new GlobalFunctions();      
    });
    
    /*** toTitleCase ***/      
    it('toTitleCase "valley center" is "Valley Center"', () => {
      expect(this.functions.toTitleCase("valley center") === "Valley Center");
    });
       
    it('toTitleCase "wichita" is "Wichita"', () => {
      expect(this.functions.toTitleCase("wichita") === "Wichita");
    });
       
    it('toTitleCase "wIchIta" is "Wichita"', () => {
      expect(this.functions.toTitleCase("wIchIta") === "Wichita");
    });
       
    it('toTitleCase "san Franscisco" is "San Franscisco"', () => {
      expect(this.functions.toTitleCase("san Franscisco") === "San Franscisco");
    });
       
    it('toTitleCase "has-dashes" is "Has-dashes"', () => {
      expect(this.functions.toTitleCase("has-dashes") === "Has-dashes");
    });
       
    it('toTitleCase null is null', () => {
      expect(this.functions.toTitleCase(null) === null);
    });
       
    it('toTitleCase undefined is undefined', () => {
      expect(this.functions.toTitleCase(undefined) === undefined);
    });
    
    /*** formatPhoneNumber ***/         
    it('formatPhoneNumber "1234561" is "Nothing"', () => {
      expect(this.functions.formatPhoneNumber("1234561") === "123-4561");
    });      
    
    it('formatPhoneNumber "1444234561" is "Nothing"', () => {
      expect(this.functions.formatPhoneNumber("1444234561") === "(144) 423-4561");
    });
    
    it('formatPhoneNumber "31444234561" is "31444234561"', () => {
      expect(this.functions.formatPhoneNumber("31444234561") === "31444234561");
    });
    it('formatPhoneNumber 1234561 is "Nothing"', () => {
      expect(this.functions.formatPhoneNumber(1234561) === "123-4561");
    });      
    
    it('formatPhoneNumber 1444234561 is "Nothing"', () => {
      expect(this.functions.formatPhoneNumber(1444234561) === "(144) 423-4561");
    });
    
    it('formatPhoneNumber 31444234561 is "31444234561"', () => {
      expect(this.functions.formatPhoneNumber(31444234561) === "31444234561");
    });
    
    it('formatPhoneNumber "random text" is "random text"', () => {
      expect(this.functions.formatPhoneNumber("random text") === "random text");
    });
       
    it('formatPhoneNumber null is null', () => {
      expect(this.functions.formatPhoneNumber(null) === "N\A");
    });
       
    it('formatPhoneNumber undefined is undefined', () => {
      expect(this.functions.formatPhoneNumber(undefined) === "N\A");
    });
    
    /*** commaSeparateNumber ***/      
    it('commaSeparateNumber 4 is "4"', () => {
      expect(GlobalFunctions.commaSeparateNumber(4) === "4");
    });
      
    it('commaSeparateNumber null is ""', () => {
      expect(GlobalFunctions.commaSeparateNumber(null) === "");
    });
      
    it('commaSeparateNumber undefined is ""', () => {
      expect(GlobalFunctions.commaSeparateNumber(undefined) === "");
    });
      
    it('commaSeparateNumber null is "N\A"', () => {
      expect(GlobalFunctions.commaSeparateNumber(null, "N\A") === "N\A");
    });
      
    it('commaSeparateNumber 0 is "N\A"', () => {
      expect(GlobalFunctions.commaSeparateNumber(0) === "N\A");
    });
      
    it('commaSeparateNumber -1 is "-1"', () => {
      expect(GlobalFunctions.commaSeparateNumber(-1) === "-1");
    });
      
    it('commaSeparateNumber 999999 is "999,999"', () => {
      expect(GlobalFunctions.commaSeparateNumber(999999) === "999,999");
    });
      
    it('commaSeparateNumber 4000 is "4,000"', () => {
      expect(GlobalFunctions.commaSeparateNumber(4000) === "4,000");
    });
      
    it('commaSeparateNumber 4000.01 is "4,000.01"', () => {
      expect(GlobalFunctions.commaSeparateNumber(4000.01) === "4,000.01");
    });
      
    it('commaSeparateNumber .0514 is ".0514"', () => {
      expect(GlobalFunctions.commaSeparateNumber(.0514) === ".0514");
    });
      
    it('commaSeparateNumber 1000000 is "1,000,000"', () => {
      expect(GlobalFunctions.commaSeparateNumber(1000000) === "1,000,000");
    });
    
    /*** fullstate ***/      
    it('fullstate "KS" is "Kansas"', () => {
      expect(GlobalFunctions.fullstate("KS") === "Kansas");
    });
       
    it('fullstate "ny" is "New York"', () => {
      expect(GlobalFunctions.fullstate("ny") === "New York");
    });
       
    it('fullstate "Pr" is "Puerto Rico"', () => {
      expect(GlobalFunctions.fullstate("Pr") === "Puerto Rico");
    });
       
    it('fullstate "AA" is "AA"', () => {
      expect(GlobalFunctions.fullstate("AA") === "AA");
    });
       
    it('fullstate "Nothing" is "Nothing"', () => {
      expect(GlobalFunctions.fullstate("Nothing") === "Nothing");
    });
       
    it('fullstate null is null', () => {
      expect(GlobalFunctions.fullstate(null) === null);
    });
       
    it('fullstate undefined is undefined', () => {
      expect(GlobalFunctions.fullstate(undefined) === undefined);
    });
    
    /*** stateToAP ***/      
    it('stateToAP "KS" is "Kan."', () => {
      expect(GlobalFunctions.stateToAP("KS") === "Kan.");
    });
       
    it('stateToAP "ny" is "N.Y."', () => {
      expect(GlobalFunctions.stateToAP("ny") === "N.Y.");
    });
       
    it('stateToAP "Dc" is "D.C."', () => {
      expect(GlobalFunctions.stateToAP("Dc") === "D.C.");
    });
       
    it('stateToAP "Pr" is "Pr"', () => {
      expect(GlobalFunctions.stateToAP("Pr") === "Pr");
    });
       
    it('stateToAP "AA" is "AA"', () => {
      expect(GlobalFunctions.stateToAP("AA") === "AA");
    });
       
    it('stateToAP "Nothing" is "Nothing"', () => {
      expect(GlobalFunctions.stateToAP("Nothing") === "Nothing");
    });
       
    it('stateToAP null is null', () => {
      expect(GlobalFunctions.stateToAP(null) === null);
    });
       
    it('stateToAP undefined is undefined', () => {
      expect(GlobalFunctions.stateToAP(undefined) === undefined);
    });
    
    /*** camelCaseToRegularCase ***/      
    it('camelCaseToRegularCase "valleyCenter" is "Valley Center"', () => {
      expect(this.functions.camelCaseToRegularCase("valleyCenter") === "Valley Center");
    });
       
    it('camelCaseToRegularCase "wichita" is "Wichita"', () => {
      expect(this.functions.camelCaseToRegularCase("wichita") === "Wichita");
    });
       
    it('camelCaseToRegularCase "wIchIta" is "W Ich Ita"', () => {
      expect(this.functions.camelCaseToRegularCase("wIchIta") === "W Ich Ita");
    });
       
    it('camelCaseToRegularCase "sanFranscisco" is "San Franscisco"', () => {
      expect(this.functions.camelCaseToRegularCase("sanFranscisco") === "San Franscisco");
    });
       
    it('camelCaseToRegularCase "has-dashes" is "Has-dashes"', () => {
      expect(this.functions.camelCaseToRegularCase("has-dashes") === "Has-dashes");
    });
       
    it('camelCaseToRegularCase null is null', () => {
      expect(this.functions.camelCaseToRegularCase(null) === null);
    });
       
    it('camelCaseToRegularCase undefined is undefined', () => {
      expect(this.functions.camelCaseToRegularCase(undefined) === undefined);
    });
    
    /*** kababCaseToCamelCase ***/      
    it('kababCaseToCamelCase "valley-center" is "valleyCenter"', () => {
      expect(this.functions.kababCaseToCamelCase("valley-center") === "valleyCenter");
    });  
    
    it('kababCaseToCamelCase "Spring-hill" is "springHill"', () => {
      expect(this.functions.kababCaseToCamelCase("Spring-hill") === "springHill");
    });
       
    it('kababCaseToCamelCase "wichita" is "wichita"', () => {
      expect(this.functions.kababCaseToCamelCase("wichita") === "wichita");
    });
       
    it('kababCaseToCamelCase "san-Franscisco" is "sanFranscisco"', () => {
      expect(this.functions.kababCaseToCamelCase("san-Franscisco") === "sanFranscisco");
    });
       
    it('kababCaseToCamelCase "has-dashes" is "hasDashes"', () => {
      expect(this.functions.kababCaseToCamelCase("has-dashes") === "hasDashes");
    });
       
    it('camelCaseToRegularCase null is null', () => {
      expect(this.functions.kababCaseToCamelCase(null) === null);
    });
       
    it('kababCaseToCamelCase undefined is undefined', () => {
      expect(this.functions.kababCaseToCamelCase(undefined) === undefined);
    });
    
    /*** camelCaseToKababCase ***/      
    it('camelCaseToKababCase "valleyCenter" is "valley-center"', () => {
      expect(this.functions.camelCaseToKababCase("valleyCenter") === "valley-center");
    });  
    
    it('camelCaseToKababCase "SpringHill" is "spring-hill"', () => {
      expect(this.functions.camelCaseToKababCase("SpringHill") === "spring-hill");
    });
       
    it('camelCaseToKababCase "wichita" is "wichita"', () => {
      expect(this.functions.camelCaseToKababCase("wichita") === "wichita");
    });
       
    it('camelCaseToKababCase "sanFranscisco" is "san-fanscisco"', () => {
      expect(this.functions.camelCaseToKababCase("sanFranscisco") === "san-franscisco");
    });
       
    it('camelCaseToKababCase "has-dashes" is "has-dashes"', () => {
      expect(this.functions.camelCaseToKababCase("has-dashes") === "has-dashes");
    });
       
    it('camelCaseToKababCase null is null', () => {
      expect(this.functions.camelCaseToKababCase(null) === null);
    });
       
    it('camelCaseToKababCase undefined is undefined', () => {
      expect(this.functions.camelCaseToKababCase(undefined) === undefined);
    });
    
  })