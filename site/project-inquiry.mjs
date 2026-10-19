export const inquiryPhone='628118111439';
export function inquiryMessage(project){
 return `Halo Jou and Bou, saya tertarik dengan proyek ${project.name} dan ingin konsultasi\n\nhttps://jouandbou.com${project.path}`;
}
export function inquiryURL(project){return `https://wa.me/${inquiryPhone}?text=${encodeURIComponent(inquiryMessage(project))}`;}
export function inquiryHTML(project){
 return `<p class="project-inquiry"><a href="${inquiryURL(project)}" target="_blank" rel="noopener noreferrer"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.4-4.8a8.5 8.5 0 1 1 16.1-4.1Z"/><path d="m8.2 7.2 1.5 2.5-1 1.1c.8 1.7 2 2.9 3.8 3.7l1.1-1 2.5 1.4c-.2 1.2-1 1.9-2.2 1.7-3.8-.6-6.8-3.6-7.4-7.3-.2-1.1.5-1.9 1.7-2.1Z"/></svg><span>lets talk~</span></a></p>`;
}
