'use strict';
(() => {
 const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
 const root=document.documentElement,body=document.body;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const fine=window.matchMedia('(hover: hover) and (pointer: fine)');
 const sceneEls=$$('[data-scene]');
 const indexLinks=$$('.scene-index a');
 const actors={researcher:$('.researcher'),builder:$('.builder'),ribbon:$('.editorial-ribbon'),intro:$('.perspective-copy'),svg:$('.constellation-lines'),connection:$('.connection'),poster:$('.poster-object'),posterImage:$('.poster-crop img'),product:$('.showcase-browser'),prefix:$('.closing-prefix'),middle:$('.closing-middle'),ending:$('.closing-word')};
 const nodes=$$('.interest-node');
 const canvas=$('#ambient-field');let ctx=null;
 try{ctx=canvas.getContext('2d');}catch{}
 let scenes=[],vh=window.innerHeight,vw=window.innerWidth,enabled=false,dirty=true,raf=0,lastTime=0;
 let targetY=window.scrollY||0,currentY=targetY;
 let mouse={x:0,y:0,tx:0,ty:0};let lastCanvas=-1000,canvasW=0,canvasH=0;
 let activeScene=-1,interest='medical',copyState='idle',copyTimer=0;
 const magnetic=[];let inView=false;
 const clamp=(n,min=0,max=1)=>Math.min(max,Math.max(min,n));
 const lerp=(a,b,p)=>a+(b-a)*p;
 const smooth=p=>{p=clamp(p);return p*p*(3-2*p);};
 const range=(value,start,end)=>smooth((value-start)/(end-start));
 const language=(zh,en)=>window.siteLang==='zh'?zh:en;
 const motionStyle=(el,values)=>{for(const [property,value] of Object.entries(values))el.style[property]=value;};
 function requestFrame(){if(!raf&&!document.hidden)raf=requestAnimationFrame(frame);}
 function measure(){
  const y=window.scrollY||0;vh=window.innerHeight;vw=window.innerWidth;
  scenes=sceneEls.map(el=>{const r=el.getBoundingClientRect();return{el,top:r.top+y,height:r.height};});
  const rect=canvas.getBoundingClientRect();canvasW=Math.max(1,rect.width);canvasH=Math.max(1,rect.height);
  if(ctx){const dpr=Math.min(window.devicePixelRatio||1,1.5);const w=Math.round(canvasW*dpr),h=Math.round(canvasH*dpr);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;ctx.setTransform(dpr,0,0,dpr,0,0);}}
  dirty=false;
 }
 function clearMotion(){
  root.style.removeProperty('--bg');root.style.removeProperty('--ink');root.style.removeProperty('--accent');root.style.removeProperty('--whole');
  for(const el of [...Object.values(actors),...nodes]){if(el)for(const prop of ['transform','opacity','clipPath','strokeDashoffset','letterSpacing'])el.style[prop]='';}
  for(const prop of ['--node-x','--node-y'])nodes.forEach(n=>n.style.removeProperty(prop));
  $('.opening-stage').style.removeProperty('--parallax-x');$('.opening-stage').style.removeProperty('--parallax-y');$('.opening-stage').style.removeProperty('--identity-x');$('.opening-stage').style.removeProperty('--identity-y');$('.opening-stage').style.removeProperty('--orbit-rotation');
  magnetic.forEach(m=>{m.tx=m.ty=m.x=m.y=0;applyMagnet(m);});
 }
 function configure(){
  const next=!reduced.matches&&window.innerWidth>800&&window.innerHeight>600;
  enabled=next;body.classList.toggle('motion-ready',enabled);
  if(!enabled)clearMotion();
  targetY=currentY=window.scrollY||0;dirty=true;lastCanvas=-1000;requestFrame();
 }
 const palette=[
  {bg:[234,243,255],ink:[32,65,109],accent:[87,139,204]},
  {bg:[239,243,248],ink:[25,44,66],accent:[89,129,176]},
  {bg:[228,237,247],ink:[27,47,71],accent:[77,117,165]},
  {bg:[235,243,252],ink:[32,65,109],accent:[87,139,204]},
  {bg:[237,242,248],ink:[30,49,74],accent:[99,135,178]}
 ];
 function colorAt(y){let a=palette[0],b=a,mix=0;for(let i=1;i<scenes.length;i++){const start=scenes[i].top-vh*.85,end=scenes[i].top-vh*.05;if(y>=end){a=palette[i];b=a;mix=0;}else if(y>start){b=palette[i];mix=range(y,start,end);break;}else break;}
  for(const k of ['bg','ink','accent'])root.style.setProperty('--'+k,`rgb(${a[k].map((c,j)=>Math.round(lerp(c,b[k][j],mix))).join(',')})`);
 }
 function progress(scene){return clamp((currentY-scene.top)/Math.max(1,scene.height-vh));}
 function updateStory(){
  const opening=progress(scenes[0]),perspective=progress(scenes[1]),academic=progress(scenes[2]);
  const heroOut=range(opening,.27,.79),builderIn=range(opening,.12,.68);
  motionStyle(actors.researcher,{transform:`translate3d(${(-opening*25+mouse.x*5).toFixed(2)}px,${(-opening*vh*.2+mouse.y*3).toFixed(2)}px,0) scale(${(1-opening*.08).toFixed(4)})`,clipPath:`inset(0 0 ${(heroOut*100).toFixed(2)}% -3%)`});
  motionStyle(actors.builder,{transform:`translate3d(${((1-builderIn)*75-mouse.x*4).toFixed(2)}px,${((1-builderIn)*55).toFixed(2)}px,0) scale(${(.96+builderIn*.04).toFixed(4)})`,clipPath:`inset(0 ${((1-builderIn)*103).toFixed(2)}% 0 -3%)`});
  const stage=$('.opening-stage');stage.style.setProperty('--parallax-x',`${mouse.x*12}px`);stage.style.setProperty('--parallax-y',`${mouse.y*9}px`);stage.style.setProperty('--identity-x',`${-mouse.x*4}px`);stage.style.setProperty('--identity-y',`${-mouse.y*3}px`);stage.style.setProperty('--orbit-rotation',`${opening*8}deg`);
  motionStyle(actors.ribbon,{transform:`translate3d(${-vw*.14*perspective}px,0,0)`,letterSpacing:`${-.06+perspective*.026}em`});
  motionStyle(actors.intro,{transform:`translate3d(0,${16-perspective*22}px,0)`});
  actors.connection.style.strokeDashoffset=String(700*(1-range(perspective,0,.85)));
  actors.svg.style.transform=`rotate(${(perspective-.5)*4}deg)`;
  const offsets=[[-28,23],[25,-21],[-17,22],[21,30]];
  nodes.forEach((node,i)=>{const p=range(perspective,i*.12,.33+i*.12);node.style.setProperty('--node-x',`${offsets[i][0]*(1-p)+mouse.x*(i%2?3:-3)}px`);node.style.setProperty('--node-y',`${offsets[i][1]*(1-p)+mouse.y*(i%2?-2:2)}px`);node.style.opacity=String(.4+.6*p);});
  actors.poster.style.transform=`translate3d(0,${(1-academic)*30}px,0) rotate(${-4+academic*5}deg)`;
  actors.posterImage.style.transform=`translateY(${-academic*14}%)`;
  const product=progress(scenes[3]);
  actors.product.style.transform=`translate3d(0,${(1-product)*24}px,0) rotate(${2-product*2}deg)`;
  const closeIn=range(currentY,scenes[4].top-vh*.65,scenes[4].top+vh*.15);
  actors.prefix.style.transform=`translate3d(0,${(1-closeIn)*25}px,0)`;
  actors.middle.style.transform=`translate3d(${(1-closeIn)*-20}px,0,0)`;
  actors.ending.style.transform=`translate3d(${(1-closeIn)*35}px,0,0) scale(${.92+.08*closeIn})`;
  actors.ending.style.clipPath=`inset(0 ${(1-closeIn)*100}% 0 -5%)`;
  colorAt(currentY);
  const total=Math.max(1,scenes[4].top+scenes[4].height-vh);root.style.setProperty('--whole',String(clamp(currentY/total)));
 }
 // Deterministic abstract points and fixed edges: no per-frame particle allocation.
 const points=Array.from({length:27},(_,i)=>({x:.36+((i*37)%61)/100,y:.08+((i*29)%83)/100,phase:i*.83}));
 const coordinates=points.map(()=>({x:0,y:0}));
 const edges=[];for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++)if(Math.hypot(points[i].x-points[j].x,points[i].y-points[j].y)<.23)edges.push([i,j]);
 function drawAmbient(time){if(!ctx)return;ctx.clearRect(0,0,canvasW,canvasH);const t=reduced.matches?0:time*.00013;
  points.forEach((p,i)=>{coordinates[i].x=(p.x+Math.sin(t+p.phase)*.012+mouse.x*.004)*canvasW;coordinates[i].y=(p.y+Math.cos(t*.8+p.phase)*.014+mouse.y*.003)*canvasH;});
  ctx.strokeStyle='rgba(102,151,211,.12)';ctx.lineWidth=.7;ctx.beginPath();for(const [i,j] of edges){ctx.moveTo(coordinates[i].x,coordinates[i].y);ctx.lineTo(coordinates[j].x,coordinates[j].y);}ctx.stroke();
  ctx.fillStyle='rgba(144,182,227,.4)';for(const p of coordinates){ctx.beginPath();ctx.arc(p.x,p.y,1.3,0,Math.PI*2);ctx.fill();}
 }
 function applyMagnet(m){const prefix=m.node.classList.contains('interest-node')?'--hover-':'--mag-';m.node.style.setProperty(prefix+'x',`${m.x.toFixed(2)}px`);m.node.style.setProperty(prefix+'y',`${m.y.toFixed(2)}px`);}
 function frame(time){raf=0;if(document.hidden)return;const dt=Math.min(64,lastTime?time-lastTime:16.7);lastTime=time;
  if(dirty)measure();targetY=window.scrollY||0;
  const factor=enabled?1-Math.exp(-dt/48):1;currentY=lerp(currentY,targetY,factor);if(Math.abs(targetY-currentY)<.05)currentY=targetY;
  const mouseFactor=1-Math.exp(-dt/110);mouse.x=lerp(mouse.x,mouse.tx,mouseFactor);mouse.y=lerp(mouse.y,mouse.ty,mouseFactor);
  let unsettled=Math.abs(targetY-currentY)>.1||Math.abs(mouse.x-mouse.tx)>.001||Math.abs(mouse.y-mouse.ty)>.001;
  magnetic.forEach(m=>{const f=reduced.matches?1:1-Math.exp(-dt/75);m.x=lerp(m.x,m.tx,f);m.y=lerp(m.y,m.ty,f);applyMagnet(m);if(Math.abs(m.x-m.tx)>.05||Math.abs(m.y-m.ty)>.05)unsettled=true;});
  if(enabled)updateStory();
  let index=0;scenes.forEach((s,i)=>{if(targetY+vh*.45>=s.top)index=i;});
  if(index!==activeScene){activeScene=index;indexLinks.forEach((link,i)=>{if(i===index)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}
  inView=scenes[3].top<targetY+vh&&scenes[3].top+scenes[3].height>targetY;
  $('#product').classList.toggle('is-in-view',inView);
  const ambientVisible=targetY<scenes[0].top+scenes[0].height&&targetY+vh>scenes[0].top;
  if((enabled&&ambientVisible&&time-lastCanvas>30)||lastCanvas===-1000){drawAmbient(time);lastCanvas=time;}
  if(unsettled||(enabled&&ambientVisible&&ctx))requestFrame();
 }
 const interests={
  medical:{label:'01 / MEDICAL AI',en:'Connecting medical images with clinically meaningful questions.',zh:'让医学影像与有临床意义的问题相连接。'},
  explain:{label:'02 / EXPLAINABLE AI',en:'Aligning visual representations with quantitative clinical features, then generating structured reports.',zh:'将视觉表征与量化临床特征对齐，再生成结构化报告。'},
  multi:{label:'03 / MULTIMODAL LEARNING',en:'Bringing medical images, clinical features, and language into the same research question.',zh:'围绕同一个研究问题，连接医学影像、临床特征与语言信息。'},
  trust:{label:'04 / TRUSTWORTHY AI',en:'Asking how medical AI can offer understandable, clinically grounded reasoning.',zh:'探索医学 AI 如何提供可理解、具有临床依据的推理。'}
 };
 let interestAnimation;
 function showInterest(animate=false){const data=interests[interest];$('.interest-detail-label').textContent=data.label;$('#interest-description').textContent=language(data.zh,data.en);nodes.forEach(n=>n.setAttribute('aria-pressed',String(n.dataset.interest===interest)));
  interestAnimation?.cancel();if(animate&&!reduced.matches&&$('#interest-detail').animate)interestAnimation=$('#interest-detail').animate([{clipPath:'inset(0 100% 0 0)',transform:'translateX(9px)'},{clipPath:'inset(0 0% 0 0)',transform:'translateX(0)'}],{duration:360,easing:'cubic-bezier(.22,.7,.2,1)'});
 }
 nodes.forEach(node=>node.addEventListener('click',()=>{interest=node.dataset.interest;showInterest(true);}));
 for(const node of [...nodes,...$$('.magnetic')]){
  const item={node,x:0,y:0,tx:0,ty:0,rect:null};magnetic.push(item);
  node.addEventListener('pointerenter',()=>{if(!fine.matches||reduced.matches)return;item.rect=node.getBoundingClientRect();});
  node.addEventListener('pointermove',e=>{if(!fine.matches||reduced.matches||!item.rect)return;const r=item.rect;item.tx=clamp((e.clientX-r.left-r.width/2)*.12,-7,7);item.ty=clamp((e.clientY-r.top-r.height/2)*.16,-5,5);requestFrame();});
  const reset=()=>{item.tx=item.ty=0;item.rect=null;requestFrame();};node.addEventListener('pointerleave',reset);node.addEventListener('blur',reset);
 }
 for(const selector of ['.opening-stage','.research-space']){const el=$(selector);let rect=null;el.addEventListener('pointerenter',()=>{if(enabled&&fine.matches)rect=el.getBoundingClientRect();});el.addEventListener('pointermove',e=>{if(!enabled||!fine.matches||!rect)return;mouse.tx=clamp((e.clientX-rect.left)/rect.width*2-1,-1,1);mouse.ty=clamp((e.clientY-rect.top)/rect.height*2-1,-1,1);requestFrame();});el.addEventListener('pointerleave',()=>{rect=null;mouse.tx=mouse.ty=0;requestFrame();});}
 function invalidate(){dirty=true;requestFrame();}
 const copy=$('#story-copy');
 function copyFeedback(){copy.setAttribute('aria-label',copyState==='success'?language('邮箱已复制','Email copied'):language('复制邮箱地址','Copy email address'));copy.classList.toggle('copied',copyState==='success');$('#copy-status').textContent=copyState==='success'?language('邮箱已复制，期待交流。','Email copied. Let’s start a conversation.'):copyState==='error'?language('请选中上方邮箱地址进行复制。','Please select and copy the email address above.'):'';}
 copy.addEventListener('click',async()=>{if(copy.disabled)return;copy.disabled=true;clearTimeout(copyTimer);try{await navigator.clipboard.writeText('JUNWEN003@e.ntu.edu.sg');copyState='success';}catch{copyState='error';}finally{copy.disabled=false;copyFeedback();copyTimer=setTimeout(()=>{copyState='idle';copyFeedback();},3500);}});
 document.addEventListener('languagechange',()=>{showInterest();copyFeedback();invalidate();});
 window.addEventListener('scroll',()=>{targetY=window.scrollY||0;requestFrame();},{passive:true});
 window.addEventListener('resize',configure,{passive:true});
 reduced.addEventListener?.('change',()=>{configure();});
 fine.addEventListener?.('change',()=>{mouse.tx=mouse.ty=0;magnetic.forEach(m=>m.tx=m.ty=0);requestFrame();});
 document.addEventListener('visibilitychange',()=>{body.classList.toggle('is-background',document.hidden);if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0;}else{lastTime=0;invalidate();}});
 window.addEventListener('blur',()=>{mouse.tx=mouse.ty=0;magnetic.forEach(m=>m.tx=m.ty=0);requestFrame();});
 window.addEventListener('pagehide',()=>{if(raf)cancelAnimationFrame(raf);raf=0;clearTimeout(copyTimer);});
 window.addEventListener('pageshow',()=>{lastTime=0;invalidate();});
 if('ResizeObserver' in window){const observer=new ResizeObserver(invalidate);observer.observe($('#main'));observer.observe($('#product'));}
 document.fonts?.ready.then(invalidate);
 const dialog=$('#poster-dialog'),posterButton=$('#open-poster');
 posterButton.addEventListener('click',()=>{dialog.showModal();});
 $('#close-poster').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
 dialog.addEventListener('close',()=>posterButton.focus());
 let previewActive=false;const activation=$('#activate-preview'),previewFrame=$('#lucky-frame');
 function updateActivation(){activation.innerHTML=language(previewActive?'退出网页体验 ↙':'体验真实网页 ↗',previewActive?'Leave live preview ↙':'Play with the live website ↗');activation.setAttribute('aria-pressed',String(previewActive));previewFrame.inert=!previewActive;previewFrame.setAttribute('tabindex',previewActive?'0':'-1');$('.showcase-browser').classList.toggle('preview-active',previewActive);}
 activation.addEventListener('click',()=>{previewActive=!previewActive;updateActivation();});
 document.addEventListener('languagechange',updateActivation);updateActivation();
 showInterest();copyFeedback();configure();
 if(window.location.hash){requestAnimationFrame(()=>{let id;try{id=decodeURIComponent(window.location.hash.slice(1));}catch{return;}document.getElementById(id)?.scrollIntoView({behavior:'instant',block:'start'});invalidate();});}
})();
