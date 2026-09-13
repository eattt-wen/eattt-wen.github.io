'use strict';
(() => {
 const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
 const pair=(en,zh)=>window.siteLang==='zh'?zh:en;
 const cards=[
 {url:'research.html',en:'Research notebook',zh:'研究手记',meta:'01 / RESEARCH NOTES',title:['From pixels to<br>clinical meaning.','从像素，<br>到临床意义。'],body:['Medical images, clinical knowledge, and AI that can explain its reasoning.','医学影像、临床知识，以及能够解释其推理的人工智能。'],hand:['always asking “why?”','一直在问「为什么？」'],backTitle:['What makes it explainable?','如何让诊断有据可循？'],back:['CEFM connects quantitative clinical ABC features with image representations through contrastive learning, then generates structured diagnostic reports.','CEFM 用对比学习连接量化的 ABC 临床特征与影像表征，再生成结构化诊断报告。'],backNote:['Extract → align → explain','提取 → 对齐 → 解释'],link:['Explore the research','走进研究手记']},
 {url:'publications.html',en:'The AAAI paper',zh:'AAAI 论文',meta:'02 / SELECTED PUBLICATION',title:['Explainable Melanoma Diagnosis','可解释黑色素瘤诊断'],body:['with Contrastive Learning and LLM-Based Report Generation','结合对比学习与大语言模型报告生成'],hand:['an idea, written down.','把一个想法，认真写下来。'],backTitle:['The paper, and beyond.','论文，以及背后的工作。'],back:['First-author research presented as an oral at AAAI 2026. The paper page brings together the project website, arXiv, PDF, and GitHub repository.','第一作者研究，AAAI 2026 口头报告。论文页汇集项目主页、arXiv、PDF 和 GitHub 代码仓库。'],backNote:['Read it. Explore it.','读一读，也动手探索。'],link:['Open the paper & code','查看论文与代码']},
 {url:'luckyoffer.html',en:'LuckyOffer',zh:'LuckyOffer',meta:'03 / SOMETHING I BUILT',title:['LuckyOffer','LuckyOffer'],body:['An AI job-hunt copilot.<br>From a job description to a little more confidence.','AI 求职助手。<br>从理解一份 JD，到多一点从容。'],hand:['from ideas to useful things.','把想法，做成能用的东西。'],backTitle:['Take a look inside.','打开看看，亲自试一试。'],back:['Explore the real product in a live preview. Switch between the home page, job-description analysis, and mock interview, with desktop and mobile views.','在实时预览中探索真实产品：切换首页、岗位分析与模拟面试，也可以查看桌面和手机两种布局。'],backNote:['build, try, learn, repeat.','做出来，试一试，再改进。'],link:['Step inside LuckyOffer','走进 LuckyOffer']},
 {url:'#contact',en:'About Junwen',zh:'关于钧文',meta:'04 / THE PERSON BEHIND IT',title:['A researcher.<br>A builder, too.','研究者。<br>也是创造者。'],body:['M.Eng. (Research) at NTU.<br>Medical AI, explainability, and a curious mind.','南洋理工大学研究型工程硕士。<br>医学 AI、可解释性，和一颗好奇心。'],hand:['hello, nice to meet you.','你好，很高兴认识你。'],backTitle:['Let’s start a conversation.','从一次交流开始。'],back:['I work with Prof. Xiuyi Fan in the Health Informatics Lab. I’m looking for PhD opportunities in medical AI, explainable AI, and multimodal learning.','我在 Health Informatics Lab 跟随 Xiuyi Fan 教授开展研究，正在寻找医学 AI、可解释 AI 与多模态学习方向的博士机会。'],backNote:['JUNWEN003@e.ntu.edu.sg','JUNWEN003@e.ntu.edu.sg'],link:['Say hello','和我打个招呼']},
 {url:'simba.html',en:'Simba’s room',zh:'辛巴的小房间',meta:'05 / A LITTLE COMPANION',image:'xinba_web/IMG_9788.jpg',alt:['Simba the cat','小猫辛巴'],title:['Simba, my little joy.','辛巴，我的小小快乐。'],body:['A cat, a camera, a lot of love.','一只小猫，一些照片，很多很多爱。'],backTitle:['Welcome to Simba’s room.','欢迎来到辛巴的小房间。'],back:['A little photo album for my cat. Step inside, pick a photo, and take a closer look.','这是属于辛巴的小相册。进去看看，点开一张照片，认识一下这位小家伙。'],backNote:['a softer side of the day.','给日常，留一点柔软。'],link:['Visit Simba’s room','去辛巴的小房间']},
 {url:'food.html',en:'Eat, eat, eat!',zh:'吃吃吃小食堂',meta:'06 / A DELICIOUS DETOUR',image:'assets/food-hotpot.jpg',alt:['A hot pot meal, photographed by Dennis Zhang','Dennis Zhang 拍摄的火锅照片'],title:['Good food, good mood.','热气腾腾，好好吃饭。'],body:['Photo: Dennis Zhang / Unsplash','摄影：Dennis Zhang / Unsplash'],backTitle:['What shall we eat today?','今天，又吃点什么好？'],back:['A tiny diner for a very familiar question. Choose a craving, draw a dish, or pick something from the menu and stamp your dinner ticket.','专治「今天吃什么」的小食堂。按口味挑选、随机抽一道，或直接点菜，给今天的餐单盖个章。'],backNote:['stay fed, stay curious.','吃饱了，继续保持好奇。'],link:['Enter the little diner','去吃吃吃小食堂']},
 {url:'games.html',en:'The playroom',zh:'小游戏室',meta:'07 / JUST ONE MORE ROUND',title:['Play a little.','玩一小会儿。'],body:['Two little games, no rush.<br>Sometimes, a break is a good idea.','两款小游戏，不用着急。<br>有时候，休息一下也是好主意。'],hand:['one more bite, one more try.','再吃一口，再试一次。'],backTitle:['Choose your little challenge.','选一个小挑战。'],back:['Guide the snake to its next bite, or catch falling food in your bowl. Both games support keyboard and touch controls, and pause when you leave the window.','带小蛇吃到下一口面条，或者用碗接住掉落的美食。两款游戏都支持键盘与触屏操作，切换窗口时会自动暂停。'],backNote:['play a little. come back refreshed.','玩一会儿，再精神满满地回来。'],link:['Open the playroom','去小游戏室玩一会儿']}
 ];
 let current=0,flipped=false,drag=null,animation=null;
 const card=$('#note-card'),deck=$('#card-deck'),front=$('#card-front'),back=$('#card-back');
 const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const text=values=>pair(...values);
 function faces(){card.classList.toggle('flipped',flipped);front.setAttribute('aria-hidden',String(flipped));front.inert=flipped;back.setAttribute('aria-hidden',String(!flipped));back.inert=!flipped;$('#flip-card').setAttribute('aria-pressed',String(flipped));$('#flip-card').setAttribute('aria-label',flipped?pair('Show the front of the card','查看卡片正面'):pair('Turn the card over','翻到卡片背面'));$('#flip-card span').textContent=flipped?pair('Front','看正面'):pair('Turn over','翻一面');}
 function render(){
  const d=cards[current];const meta=`<div class="card-meta"><span>${d.meta}</span><span aria-hidden="true">✳</span></div>`;
  front.className='card-face card-front'+(d.image?' photo-face':current===2?' product-face':'');
  if(d.image){front.innerHTML=meta+`<img class="preview-photo" src="${d.image}" alt="${text(d.alt)}" width="500" height="300" draggable="false"><h2 class="photo-title">${text(d.title)}</h2><p class="photo-caption">${text(d.body)}</p>`;}
  else{front.innerHTML=meta+`<h2 class="card-title ${current===1?'paper-card-title':''}">${text(d.title)}</h2><p class="card-subtitle">${text(d.body)}</p>`;
   if(current===0)front.innerHTML+='<div class="research-equation"><strong>Image</strong><span>↔</span><strong>ABC</strong><span>→</span><strong>Report</strong></div>';
   if(current===1)front.innerHTML+=`<span class="paper-seal">AAAI 2026 · ${pair('ORAL PRESENTATION','口头报告')}</span>`;
   if(current===2)front.innerHTML+=`<div class="product-pills"><span>${pair('JD analysis','岗位分析')}</span><span>${pair('Résumé matching','简历匹配')}</span><span>${pair('Mock interview','模拟面试')}</span></div>`;
   if(current===3)front.innerHTML+='<span class="card-tag">Health Informatics Lab</span>';
   if(current===6)front.innerHTML+=`<div class="game-grid"><div class="game-tile"><span aria-hidden="true">🐍</span><strong>${pair('Snake','贪吃蛇')}</strong></div><div class="game-tile"><span aria-hidden="true">🥣</span><strong>${pair('Catch the food','接美食')}</strong></div></div>`;
   if(d.hand&&current!==6)front.innerHTML+=`<p class="card-hand">${text(d.hand)}</p>`;
  }
  back.innerHTML=meta+`<h2 class="back-title">${text(d.backTitle)}</h2><p class="back-body">${text(d.back)}</p><p class="back-note">${text(d.backNote)}</p>`;
  $('#deck-counter').textContent=String(current+1).padStart(2,'0')+' / 07';
  $('#enter-page').href=d.url;$('#enter-page').textContent=text(d.link)+' ↗';
  $$('[data-card]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.card)===current)));
  deck.setAttribute('aria-label',pair('Explore my notebook. Use left and right arrows to change cards.','探索我的手记，左右方向键切换卡片。'));
  $('#previous-card').setAttribute('aria-label',pair('Previous card','上一张卡片'));$('#next-card').setAttribute('aria-label',pair('Next card','下一张卡片'));
  faces();$('#deck-status').textContent=pair(`${current+1} of 7. ${d.en}.`, `第 ${current+1} 张，共 7 张。${d.zh}。`);
 }
 function change(next,direction=1){
  const index=(next+cards.length)%cards.length;if(index===current)return;
  animation?.cancel();animation=null;const pointer=drag?.id;drag=null;deck.classList.remove('dragging');if(pointer!==undefined&&deck.hasPointerCapture?.(pointer))deck.releasePointerCapture(pointer);card.style.transform='';current=index;flipped=false;
  // Reset the face without showing a reverse flip of freshly changed content.
  card.classList.add('changing');render();
  if(!reduced()&&card.animate)animation=card.animate([{opacity:0,transform:`translateX(${direction*42}px) rotate(${direction*5}deg) scale(.97)`},{opacity:1,transform:'translateX(0) rotate(0) scale(1)'}],{duration:470,easing:'cubic-bezier(.2,.7,.2,1)'});
  requestAnimationFrame(()=>card.classList.remove('changing'));
 }
 $('#previous-card').addEventListener('click',()=>change(current-1,-1));$('#next-card').addEventListener('click',()=>change(current+1,1));
 $$('[data-card]').forEach(b=>b.addEventListener('click',()=>{const next=Number(b.dataset.card);change(next,next>current?1:-1);}));
 $('#flip-card').addEventListener('click',()=>{flipped=!flipped;faces();});
 deck.addEventListener('keydown',event=>{if(event.target.closest('button,a'))return;if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();change(current+(event.key==='ArrowRight'?1:-1),event.key==='ArrowRight'?1:-1);}if(event.key==='Enter'||event.key===' '){event.preventDefault();flipped=!flipped;faces();}});
 deck.addEventListener('pointerdown',event=>{if(event.button!==0||event.target.closest('a,button'))return;animation?.cancel();drag={id:event.pointerId,x:event.clientX,y:event.clientY,dx:0,locked:false};});
 deck.addEventListener('pointermove',event=>{
  if(!drag||drag.id!==event.pointerId)return;
  const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
  if(!drag.locked&&Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)){drag=null;return;}
  if(Math.abs(dx)>7){drag.locked=true;deck.setPointerCapture?.(event.pointerId);deck.classList.add('dragging');drag.dx=dx;if(!reduced())card.style.transform=`translateX(${Math.max(-105,Math.min(105,dx*.55))}px) rotate(${Math.max(-8,Math.min(8,dx/18))}deg)`;}
 });
 function release(event,cancel=false){if(!drag||event.pointerId!==drag.id)return;const dx=drag.dx,from=card.style.transform;drag=null;deck.classList.remove('dragging');card.style.transform='';if(deck.hasPointerCapture?.(event.pointerId))deck.releasePointerCapture(event.pointerId);if(!cancel&&Math.abs(dx)>42)change(current+(dx<0?1:-1),dx<0?1:-1);else if(from&&!reduced()&&card.animate){animation=card.animate([{transform:from},{transform:'translateX(0) rotate(0)'}],{duration:320,easing:'cubic-bezier(.2,.8,.2,1.15)'});}}
 deck.addEventListener('pointerup',e=>release(e));deck.addEventListener('pointercancel',e=>release(e,true));deck.addEventListener('lostpointercapture',e=>release(e,true));
 deck.addEventListener('pointerleave',()=>{if(drag&&!drag.locked)drag=null;});
 document.addEventListener('languagechange',render);
 window.addEventListener('pagehide',()=>{drag=null;animation?.cancel();card.style.transform='';deck.classList.remove('dragging');});
 render();
})();
