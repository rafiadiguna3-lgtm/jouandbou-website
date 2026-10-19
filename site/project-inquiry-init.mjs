import {projects} from './project-catalog.mjs';
import {inquiryHTML} from './project-inquiry.mjs?v=3';
for(const project of projects.filter(p=>p.kind==='jou')){
 const content=document.getElementById(project.panel);
 if(content&&!content.querySelector('.project-inquiry'))content.insertAdjacentHTML('beforeend',inquiryHTML(project));
}
