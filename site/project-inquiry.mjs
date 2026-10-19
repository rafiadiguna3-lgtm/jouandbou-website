export const inquiryPhone='628118111439';
export function inquiryMessage(project){
 return `Halo Jou and Bou, saya tertarik dengan proyek ${project.name} dan ingin konsultasi untuk proyek saya.\n\nhttps://jouandbou.com${project.path}`;
}
export function inquiryURL(project){return `https://wa.me/${inquiryPhone}?text=${encodeURIComponent(inquiryMessage(project))}`;}
export function inquiryHTML(project){
 return `<p class="project-inquiry"><a href="${inquiryURL(project)}" target="_blank" rel="noopener noreferrer">Discuss a similar project <span aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 19 19 5M5 5h14v14"/></svg></span></a></p>`;
}
