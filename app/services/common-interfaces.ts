import {ComparisonBarInput} from '../fe-core/components/comparison-bar/comparison-bar.component';

export interface ComparisonBarList {
  [year: string]: Array<ComparisonBarInput>;
}