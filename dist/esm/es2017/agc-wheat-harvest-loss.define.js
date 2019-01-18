
// AgcWheatHarvestLoss: Custom Elements Define Library, ES Module/es2017 Target

import { defineCustomElement } from './agc-wheat-harvest-loss.core.js';
import {
  AgcWheatHarvestLoss,
  AgcWheatHarvestLossProgress,
  AgcWheatHarvestLossResults,
  AgcWheatHarvestLossResults,
  AgcWheatHarvestLossResultsPlaceholder
} from './agc-wheat-harvest-loss.components.js';

export function defineCustomElements(win, opts) {
  return defineCustomElement(win, [
    AgcWheatHarvestLoss,
    AgcWheatHarvestLossProgress,
    AgcWheatHarvestLossResults,
    AgcWheatHarvestLossResults,
    AgcWheatHarvestLossResultsPlaceholder
  ], opts);
}
