// Photo-led stories reuse the portfolio assets and keep every carousel photograph accessible.
const settings={
 marboy:{title:'Marboy House',titleId:'marboy-title',number:'jou.house 30',copy:'A compact contemporary home, with living spaces opening to a planted courtyard.',facts:['Design and Build','Land · 135 sqm','Building · 120 sqm'],groups:[['Living spaces',[0,1,2]],['Private spaces',[3,4,5]],['Materials and details',[6,7,8,9]]]},
 rempoa:{title:'Rempoa Padel',titleId:'rempoa-title',number:'jou.commercial 01',copy:'Four courts connected through a central link. A repeated facade, terracotta surfaces and planted edges bring the spaces together.',facts:['Commercial · Padel','Rempoa','4 courts'],groups:[['Arrival and courts',[0,1,2]],['The central link',[3,4]],['Changing rooms and planted edges',[5,6,7]]]},
 'rumah-anas':{title:'Rumah Anas',titleId:'project-01-title',number:'jou.house 01',copy:'A home in Cimanggis, near Cibubur, designed for a young couple with strong family ties. Named Anas, meaning human, it brings everyday life and shared moments together.',facts:['Design and Build','Land · 135 sqm','Building · 120 sqm'],images:['assets/rumah-anas/20.webp','assets/rumah-anas/26.webp','assets/rumah-anas/27.webp','assets/rumah-anas/28.webp'],second:'The house is composed of three parts. Supporting spaces sit beside the central living area, while carefully placed openings balance privacy and connection.'},
 rumasoka:{title:'rumasoka',titleId:'project-10-title',number:'jou.house 10',copy:'A compact tropical home in Cibubur. An open living space meets the inner courtyard, bringing greenery, natural light and fresh air into the house.',facts:['Design and Build','Land · 135 sqm','Building · 150 sqm'],images:['assets/rumasoka/01.webp','assets/rumasoka/10.webp','assets/rumasoka/08.webp','assets/rumasoka/09.webp','assets/rumasoka/11.webp','assets/rumasoka/12.webp'],second:'Palimanan stone continues from outside to inside. Brick screens, large openings and skylights give the compact house its own character.'}
};
const make=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text)node.textContent=text;return node;};
for(const [id,config] of Object.entries(settings)){
 const panel=document.getElementById(id),scroll=panel.querySelector('.project-scroll');panel.classList.add('photo-led');
 const film=scroll.querySelector('.film-hero'),originalImages=new Map([...scroll.querySelectorAll('img')].map(img=>[img.getAttribute('src'),img]));
 const originalSliders=[...scroll.querySelectorAll('.slider')];
 const content=make('div','photo-story');const intro=make('section','story-row story-intro');
 const heading=make('div','story-copy');const titles=make('div','story-heading');titles.append(make('p','story-number',config.number));const h1=make('h1','',config.title);h1.id=panel.getAttribute("aria-labelledby")||config.titleId;titles.append(h1);heading.append(titles,make('p','story-description',config.copy));const facts=make('p','story-facts');config.facts.forEach((fact,i)=>{if(i)facts.append(document.createElement('br'));facts.append(document.createTextNode(fact));});heading.append(facts);
 const cover=config.images?originalImages.get(config.images[0]):id==='marboy'?scroll.querySelector('.bento-card > img'):originalSliders[0]?.querySelector('img');
 const figure=make('figure','story-image');if(cover)figure.append(cover.cloneNode(true));intro.append(figure,heading);content.append(intro);
 if(config.images){
  const row=make('section','story-row story-secondary is-reversed');const copy=make('div','story-copy');copy.append(make('p','story-description',config.second));const image=make('figure','story-image');image.append(originalImages.get(config.images[1]).cloneNode(true));row.append(image,copy);content.append(row);
  const grid=make('section','story-photo-grid');for(const src of config.images.slice(2)){const fig=make('figure','story-image');fig.append(originalImages.get(src).cloneNode(true));grid.append(fig);}content.append(grid);
 }else{
  for(const [label,indices] of config.groups){const section=make('section','photo-series slider');section.setAttribute('aria-label',label);const track=make('div','slide-track');track.tabIndex=0;track.setAttribute('aria-label',`${label}; swipe or use arrow keys`);
   for(const index of indices)for(const slide of originalSliders[index]?.querySelectorAll('.gallery-slide')||[])track.append(slide.cloneNode(true));
   if(!track.children.length)continue;const caption=make('div','slide-caption');caption.append(make('span','',label));const controls=make('div','');for(const [kind,text] of [['prev','Previous'],['count','1'],['next','Next']]){const node=make(kind==='count'?'span':'button',`slide-${kind}`,text);if(kind!=='count')node.setAttribute('aria-label',`${text} ${label} photo`);else node.setAttribute('aria-live','polite');controls.append(node);}caption.append(controls);section.append(track,caption);content.append(section);
  }
 }
 scroll.replaceChildren();if(film)scroll.append(film);scroll.append(content);
}
