import {glbIds} from './glb-assets.mjs?v=114';
// Same imported-model set used by both renderers; other houses are scenery.
export const updatedHouseIds=new Set([0,9,13,29,44,...glbIds]);
export const canExplore=id=>updatedHouseIds.has(id);
