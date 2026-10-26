// White tab preference applies immediately, independently of the 3D app.
// Static HTML retains the black favicon, but JS-rendering crawlers may see white.
const icon=document.getElementById('site-favicon');
if(icon){icon.href='/assets/brand/jou-and-bou-white-48-v143.png?v=browser-tab-3';icon.sizes='48x48';}
