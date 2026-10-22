import {projects} from './project-catalog.mjs';
const published=new Set(projects.filter(p=>p.kind==='jou').map(p=>p.modelId));
const construction=new Set([36,38,40,41,42,43,45,46,47]);
export function projectStatus(id){return published.has(id)?'':construction.has(id)?'Under construction':'3D preview · details coming soon';}
export function detailLabel(id){return published.has(id)?'Project details':construction.has(id)?'Progress update':'Project preview';}

export function projectBadge(id){return published.has(id)?'':construction.has(id)?'Under construction':'3D preview';}
