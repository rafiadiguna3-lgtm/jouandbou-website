export const origin='https://jouandbou.com';
export const homeMetadata={title:'Jou and Bou | Architecture & Interior Design Studio',description:'Jou and Bou is a Jakarta-based architecture and interior design studio creating thoughtful, functional spaces through creative design solutions.',socialDescription:'Jou and Bou is a Jakarta-based architecture and interior design studio creating thoughtful, functional spaces.',url:origin+'/',image:origin+'/assets/brand/jou-and-bou-share-solid-v3.png',imageAlt:'jou and bou solid black logo',imageType:'image/png',width:1200,height:1200,card:'summary',robots:'index, follow, max-image-preview:none'};
export function metadata(project){return project?{title:`${project.name} | Jou and Bou`,description:project.description,socialDescription:project.description,url:origin+project.path,image:origin+'/'+project.shareImage,imageAlt:project.name+' — Jou and Bou',imageType:'image/jpeg',width:1200,height:630,card:'summary_large_image',robots:'index, follow, max-image-preview:large'}:homeMetadata;}
export function structuredData(project){
 if(!project)return {'@context':'https://schema.org','@type':'WebSite',name:'jou and bou',url:origin+'/',image:homeMetadata.image};
 return {'@context':'https://schema.org','@graph':[
  {'@type':'WebPage','@id':origin+project.path,name:project.name,description:project.description,url:origin+project.path,mainEntity:{'@type':'CreativeWork',name:project.name,description:project.description,image:origin+'/'+project.image,creator:{'@type':'Organization',name:'Jou and Bou',url:origin+'/'}}},
  {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Jou and Bou',item:origin+'/'},{'@type':'ListItem',position:2,name:'Projects',item:origin+'/projects/'},{'@type':'ListItem',position:3,name:project.name,item:origin+project.path}]}
 ]};
}
