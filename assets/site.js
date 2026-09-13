'use strict';
(() => {
 let lang='en';try{lang=localStorage.getItem('research-language')==='zh'?'zh':'en';}catch{}
 window.siteLang=lang;
 window.t=(zh,en)=>window.siteLang==='zh'?zh:en;
 function translate(){
  window.siteLang=lang;document.documentElement.lang=lang==='zh'?'zh-CN':'en';
  document.querySelectorAll('[data-en][data-zh]').forEach(el=>{el.innerHTML=el.dataset[lang];});
  const button=document.getElementById('language');if(button){button.textContent=lang==='en'?'中文':'EN';button.setAttribute('aria-label',lang==='en'?'切换为中文':'Switch to English');}
  const title=document.body.dataset[lang==='en'?'titleEn':'titleZh'];if(title)document.title=title+' · Junwen Zheng';
  try{localStorage.setItem('research-language',lang);}catch{}
  document.dispatchEvent(new CustomEvent('languagechange'));
 }
 document.getElementById('language')?.addEventListener('click',()=>{lang=lang==='en'?'zh':'en';translate();});
 const copy=document.getElementById('copy-email');if(copy)copy.addEventListener('click',async()=>{const status=document.getElementById('copy-status');try{await navigator.clipboard.writeText('JUNWEN003@e.ntu.edu.sg');status.textContent=window.t('邮箱已复制，期待交流！','Email copied — let’s talk!');}catch{status.textContent=window.t('请选中上方邮箱地址进行复制。','Please select and copy the email address above.');}});
 translate();
})();
