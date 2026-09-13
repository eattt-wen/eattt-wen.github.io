'use strict';
(() => {
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 let lang='zh';try{const saved=localStorage.getItem('research-language');if(saved==='en'||saved==='zh')lang=saved;}catch{}
 let category='all', selected=null, confirmed=false, busy=false, order=1, timer;
 const dishes=[
 ['hotpot','warm','🍲','火锅','Hotpot','围着一锅热气，慢慢吃。','A bubbling pot, good company, and no rush.'],
 ['malatang','warm','🥘','麻辣烫','Malatang','挑几样喜欢的，煮成一碗热乎。','Your favorite ingredients, together in a cozy bowl.'],
 ['wonton','warm','🥣','小馄饨','Wonton soup','来一碗汤汤水水的温柔。','A little bowl of warmth, one wonton at a time.'],
 ['bbq','grill','🥩','烤肉','Barbecue','听到滋滋声，心情就开始变好。','That sizzle is the sound of a good evening.'],
 ['skewers','grill','🍢','烧烤','Grilled skewers','今天的快乐，可以一串一串来。','A little joy, one skewer at a time.'],
 ['chicken','grill','🍗','炸鸡','Fried chicken','咔嚓一口，给今天加点脆。','A crispy little celebration of an ordinary day.'],
 ['noodles','carbs','🍜','拌面','Noodles','把酱汁拌匀，把烦恼先放一边。','Toss the noodles. Set the worries aside.'],
 ['dumplings','carbs','🥟','饺子','Dumplings','圆滚滚的小快乐，一盘刚刚好。','Little pockets of happiness, by the plate.'],
 ['rice','carbs','🍚','炒饭','Fried rice','一勺一勺，都是踏实的快乐。','Comfort by the spoonful.'],
 ['cake','sweet','🍰','蛋糕','Cake','给普通的一天，切一小块庆祝。','A slice of celebration, no occasion required.'],
 ['icecream','sweet','🍦','冰淇淋','Ice cream','冰冰甜甜，暂停一下赶路。','A sweet little pause in the middle of everything.'],
 ['tea','sweet','🧋','奶茶','Milk tea','把这一口甜，留给现在。','A sweet sip for this very moment.']
 ];
 const categories={all:['都可以','Anything'],warm:['热乎乎','Warm & cozy'],grill:['滋滋香','Grilled & crispy'],carbs:['碳水快乐','Carb comfort'],sweet:['甜一点','Something sweet']};
 const t=pair=>pair[lang==='zh'?0:1];const name=d=>d[lang==='zh'?3:4];const description=d=>d[lang==='zh'?5:6];
 const pool=()=>dishes.filter(d=>category==='all'||d[1]===category);
 function renderResult(){
  $('#meal-name').textContent=selected?name(selected):t(['今日菜单，待揭晓','Your next bite awaits']);
  $('#meal-description').textContent=selected?description(selected):t(['选个口味，抽一道菜；或者直接点下面的菜单。','Pick a craving and draw a dish, or choose from the menu below.']);
  $('.meal-emoji').textContent=selected?selected[2]:'🍽️';
  $('.ticket-kicker').textContent=confirmed?t(['今日餐单已盖章 ✓','Dinner ticket stamped ✓']):selected?t(['今日灵感，请享用。','A little dinner inspiration, just for you.']):t(['选择困难？让饭来选你。','Can’t decide? Let dinner find you.']);
  $('#confirm-meal').disabled=!selected||busy||confirmed;
  $('#meal-ticket').classList.toggle('is-confirmed',confirmed);
  $('#decision-status').textContent=confirmed?t([`就决定是${name(selected)}了，开饭！`,`It’s ${name(selected).toLowerCase()} — enjoy!`]):'';
  $('#order-number').textContent=String(order).padStart(3,'0');
 }
 function renderMenu(){
  const list=pool();$('#menu-grid').replaceChildren(...list.map(d=>{
   const button=document.createElement('button');button.type='button';button.className='menu-item';button.dataset.dish=d[0];button.setAttribute('aria-pressed',String(selected?.[0]===d[0]));button.disabled=busy;
   const icon=document.createElement('span');icon.className='dish-icon';icon.setAttribute('aria-hidden','true');icon.textContent=d[2];
   const title=document.createElement('strong');title.textContent=name(d);
   const tag=document.createElement('small');tag.textContent=t(categories[d[1]]);
   const plus=document.createElement('span');plus.className='plus';plus.setAttribute('aria-hidden','true');plus.textContent=selected?.[0]===d[0]?'✓':'+';
   button.append(icon,title,tag,plus);button.addEventListener('click',()=>{select(d);$('#meal-ticket').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});});return button;
  }));$('#menu-count').textContent=t([`${list.length} 道小快乐`,`${list.length} little joys`]);
 }
 function select(d){if(confirmed)order++;selected=d;confirmed=false;renderResult();renderMenu();}
 function controls(){ $$('[data-category]').forEach(b=>{b.disabled=busy;b.setAttribute('aria-pressed',String(b.dataset.category===category));});$('#draw-meal').disabled=busy;$('#food-language').disabled=busy;}
 function setLanguage(){document.documentElement.lang=lang==='zh'?'zh-CN':'en';$$('[data-zh][data-en]').forEach(el=>{el.innerHTML=el.dataset[lang];});$('#food-language').textContent=lang==='zh'?'EN':'中文';$('#food-language').setAttribute('aria-label',t(['Switch to English','切换为中文']));$('.categories').setAttribute('aria-label',t(['菜品分类','Dish categories']));$('.food-photo img').alt=t(['一锅热气腾腾的火锅','A hot pot meal']);document.title=t(['吃吃吃！· 钧文的小食堂','Eat, eat, eat! · Junwen’s little diner']);renderResult();renderMenu();controls();try{localStorage.setItem('research-language',lang);}catch{}}
 $('#food-language').addEventListener('click',()=>{lang=lang==='zh'?'en':'zh';setLanguage();});
 $$('[data-category]').forEach(b=>b.addEventListener('click',()=>{if(busy)return;category=b.dataset.category;controls();renderMenu();}));
 $('#draw-meal').addEventListener('click',()=>{
  if(busy)return;busy=true;controls();renderMenu();$('#confirm-meal').disabled=true;$('#meal-ticket').classList.add('is-drawing');$('#meal-result').setAttribute('aria-busy','true');
  const options=pool().filter(d=>d[0]!==selected?.[0]);const choice=options[Math.floor(Math.random()*options.length)];
  $('#meal-name').textContent=t(['菜单翻翻翻…','Flipping through the menu…']);
  const finish=()=>{busy=false;$('#meal-ticket').classList.remove('is-drawing');$('#meal-result').setAttribute('aria-busy','false');select(choice);controls();};
  timer=setTimeout(finish,window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:650);
 });
 $('#confirm-meal').addEventListener('click',()=>{if(!selected||busy||confirmed)return;confirmed=true;renderResult();});
 window.addEventListener('pagehide',()=>{clearTimeout(timer);busy=false;$('#meal-ticket').classList.remove('is-drawing');$('#meal-result').setAttribute('aria-busy','false');renderResult();controls();renderMenu();});
 setLanguage();
})();
