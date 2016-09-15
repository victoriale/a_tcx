import {it, describe, expect, beforeEach, inject} from '@angular/testing';
import {Gradient} from './global-gradient';

  describe('', () => {
    it('two blues are close', () => {
      //62.33
      expect(Gradient.areColorsClose("#003087", "#134A8E")).toEqual(true);
    });

    it('blue (1) and orange aren\'t close', () => {
      //521.12
      expect(Gradient.areColorsClose("#003087", "#E8C115")).toEqual(false);
    });

    it('blue (2) and orange aren\'t close', () => {
      //471.20
      expect(Gradient.areColorsClose("#134A8E", "#E8C115")).toEqual(false);
    });

    it('2 blues are close', () => {
      //
      expect(Gradient.areColorsClose("#0C2C56", "#1D2D5C")).toEqual(true);
    });

    it('2 reds are close', () => {
      //73.46
      expect(Gradient.areColorsClose("#CE1141", "#A71930")).toEqual(true);
    });

    it('blue and red (1) aren\'t close', () => {
      //304.94
      expect(Gradient.areColorsClose("#134A8E", "#A71930")).toEqual(false);
    });

    it('blue and red (2) aren\'t close', () => {
      //360.22
      expect(Gradient.areColorsClose("#134A8E", "#CE1141")).toEqual(false);
    });

    it(' 2 blue (variation) are close', () => {
    //difference between #092C5C and #0077C8 is 214.6415616790001
      expect(Gradient.areColorsClose("#092C5C", "#0077C8")).toEqual(true);
    });

  })
