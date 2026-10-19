import {projects} from './project-catalog.mjs';
import {inquiryHTML} from './project-inquiry.mjs';
for(const project of projects.filter(p=>p.kind==='jou')){
 const content=document.querySelector(`#${project.panel} .project-content, #${project.panel} .editorial-content`);
 if(content&&!content.querySelector('.project-inquiry'))content.insertAdjacentHTML('beforeend',inquiryHTML(project));
}
