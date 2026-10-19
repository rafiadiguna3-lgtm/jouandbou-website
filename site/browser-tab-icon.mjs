// Runtime tab preference, separate from the static favicon and share metadata.
// No user-agent detection: crawlers that execute JS can observe the same change.
const icon=document.getElementById('site-favicon');
if(icon)icon.href='/assets/brand/jou-and-bou-white-48-v143.png?v=browser-tab-3';
