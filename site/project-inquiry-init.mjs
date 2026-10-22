import {projectSocialHTML} from './project-social.mjs';
import {projects} from './project-catalog.mjs';
import {inquiryHTML} from './project-inquiry.mjs?v=5';
for(const project of projects.filter(p=>p.kind==='jou')){
 const content=document.getElementById(project.panel);
 const copy=content&&[...content.querySelectorAll('.project-content p,.editorial-content p')].filter(p=>p.textContent.trim().length>90&&!p.matches('.project-facts,.photo-credit')&&!/Photography\s*:/i.test(p.textContent)).at(-1);
 if(copy&&!copy.querySelector('.project-social'))copy.insertAdjacentHTML('beforeend',projectSocialHTML());
 if(content&&!content.querySelector('.project-inquiry'))content.insertAdjacentHTML('beforeend',inquiryHTML(project));
}
