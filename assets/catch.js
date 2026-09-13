/* ── 接食物游戏 ── */
(function(){
  var CW=480,CH=320,BOWL_W=70,BOWL_H=20,BOWL_SPD=7;
  var canvas=document.getElementById('catchCanvas');
  canvas.width=CW;canvas.height=CH;
  var ctx=canvas.getContext('2d');
  var bowl,items,score,best=0,lives,state='idle',frameId=null;
  var FOODS=['🍲','🥩','🌶️','🍜','🫕','🍣','🍖','🌿','🍢','🍝','🧋'];
  var BAD=['💀','🤢'];
  var keys={};
  var spawnTimer=0;
  function init(){
    bowl={x:CW/2-BOWL_W/2,y:CH-36,w:BOWL_W,h:BOWL_H,moving:0};
    items=[];score=0;lives=3;spawnTimer=0;
    document.getElementById('catchScore').textContent=0;
    document.getElementById('catchLives').textContent=3;
  }
  function spawnItem(){
    var bad=Math.random()<0.15;
    items.push({x:20+Math.random()*(CW-40),y:-20,vy:2+Math.random()*2+score*0.04,
      emoji:bad?BAD[Math.floor(Math.random()*BAD.length)]:FOODS[Math.floor(Math.random()*FOODS.length)],bad:bad,size:24});
  }
  function drawFrame(){
    ctx.fillStyle='#edf5ff';ctx.fillRect(0,0,CW,CH);
    ctx.fillStyle='rgba(65,134,218,.13)';
    for(var gx=0;gx<CW;gx+=28)for(var gy=0;gy<CH;gy+=28){ctx.beginPath();ctx.arc(gx,gy,2,0,Math.PI*2);ctx.fill();}
    ctx.font='24px serif';ctx.textAlign='center';ctx.textBaseline='middle';
    items.forEach(function(it){ctx.fillText(it.emoji,it.x,it.y);});
    var bx=bowl.x,by=bowl.y,bw=bowl.w,bh=bowl.h;
    ctx.fillStyle='#2484d8';ctx.beginPath();
    if(ctx.roundRect)ctx.roundRect(bx,by,bw,bh,10);else ctx.rect(bx,by,bw,bh);ctx.fill();
    ctx.fillStyle='#4aa3f5';ctx.beginPath();
    if(ctx.roundRect)ctx.roundRect(bx+4,by+4,bw-8,6,6);else ctx.rect(bx+4,by+4,bw-8,6);ctx.fill();
    ctx.font='18px serif';ctx.fillText('🥣',bx+bw/2,by+bh/2+1);
  }
  var lastFrame=0;
  function gameLoop(now){
    if(now && now-lastFrame<16){frameId=requestAnimationFrame(gameLoop);return;}lastFrame=now||0;
    if(state!=='running'){frameId=null;return;}
    if(keys['ArrowLeft']||keys['a']||bowl.moving===-1)bowl.x=Math.max(0,bowl.x-BOWL_SPD);
    if(keys['ArrowRight']||keys['d']||bowl.moving===1)bowl.x=Math.min(CW-bowl.w,bowl.x+BOWL_SPD);
    spawnTimer++;
    if(spawnTimer>Math.max(38,80-score*2)){spawnItem();spawnTimer=0;}
    var survived=[];
    items.forEach(function(it){
      if(state!=='running')return;
      it.y+=it.vy;
      if(it.y>bowl.y-4&&it.y<bowl.y+bowl.h+4&&it.x>bowl.x-10&&it.x<bowl.x+bowl.w+10){
        if(it.bad){lives--;document.getElementById('catchLives').textContent=lives;if(lives<=0){gameOver();return;}}
        else{score++;if(score>best)best=score;document.getElementById('catchScore').textContent=score;document.getElementById('catchBest').textContent=best;}
      }else if(it.y<CH+30){
        if(!it.bad&&it.y>CH){lives--;document.getElementById('catchLives').textContent=lives;if(lives<=0){gameOver();return;}}
        else survived.push(it);
      }
    });
    items=survived;drawFrame();if(state==='running')frameId=requestAnimationFrame(gameLoop);
  }
  function gameOver(){
    state='over';if(frameId){cancelAnimationFrame(frameId);frameId=null;}
    document.getElementById('catchStartBtn').innerHTML='↺ '+t('重来','Restart');
    document.getElementById('catchPauseBtn').style.display='none';
    drawFrame();
    var o=document.getElementById('catchOverlay');
    o.querySelector('div:nth-child(1)').textContent='😵';
    o.querySelector('div:nth-child(2)').textContent=t('游戏结束！','Game Over!');
    o.querySelector('div:nth-child(3)').innerHTML=t('得分：','Score: ')+score+t('<br>再来一次？','<br>Try again?');
    o.querySelector('button').textContent=t('再来一次','Play Again');
    o.classList.remove('hidden');
  }
  window.startCatch=function(){
    if(frameId){cancelAnimationFrame(frameId);frameId=null;}
    init();drawFrame();
    document.getElementById('catchOverlay').classList.add('hidden');
    state='running';
    document.getElementById('catchStartBtn').innerHTML='↺ '+t('重来','Restart');
    document.getElementById('catchPauseBtn').style.display='';
    document.getElementById('catchPauseBtn').innerHTML='⏸ '+t('暂停','Pause');
    frameId=requestAnimationFrame(gameLoop);
  };
  window.pauseCatch=function(){
    var btn=document.getElementById('catchPauseBtn');
    if(state==='running'){cancelAnimationFrame(frameId);frameId=null;state='paused';btn.innerHTML='▶ '+t('继续','Resume');}
    else if(state==='paused'){state='running';btn.innerHTML='⏸ '+t('暂停','Pause');frameId=requestAnimationFrame(gameLoop);}
  };
  window.catchDpad=function(e,d){
    if(e)e.preventDefault();
    if(state!=='running')return;
    bowl.moving=(d==='L'?-1:1);
    var id=d==='L'?'cLeft':'cRight';
    document.getElementById(id).classList.add('pressed');
    setTimeout(function(){bowl.moving=0;document.getElementById(id).classList.remove('pressed');},180);
    if(d==='L')bowl.x=Math.max(0,bowl.x-BOWL_SPD*4);
    else bowl.x=Math.min(CW-bowl.w,bowl.x+BOWL_SPD*4);
  };
  document.addEventListener('keydown',function(e){if(state!=='running')return;keys[e.key]=true;if(['ArrowLeft','ArrowRight'].indexOf(e.key)>=0)e.preventDefault();});
  document.addEventListener('keyup',function(e){keys[e.key]=false;});
  var tx0c;
  canvas.addEventListener('touchstart',function(e){tx0c=e.touches[0].clientX;e.preventDefault();},{passive:false});
  canvas.addEventListener('touchend',function(e){
    if(state!=='running')return;
    var dx=e.changedTouches[0].clientX-tx0c;
    if(Math.abs(dx)>20)bowl.x=Math.max(0,Math.min(CW-bowl.w,bowl.x+dx*0.5));
  },{passive:false});
  if('ontouchstart' in window)document.getElementById('catchHint').textContent=t('左右滑动或使用按钮','Swipe or use buttons');
  document.addEventListener('languagechange',function(){
    document.getElementById('catchStartBtn').textContent=state==='idle'?'▶ '+t('开始','Play'):'↺ '+t('重来','Restart');
    document.getElementById('catchPauseBtn').textContent=state==='paused'?'▶ '+t('继续','Resume'):'⏸ '+t('暂停','Pause');
    if(state==='over'){
      var o=document.getElementById('catchOverlay');
      o.querySelector('div:nth-child(2)').textContent=t('游戏结束！','Game Over!');
      o.querySelector('div:nth-child(3)').textContent=t('得分：','Score: ')+score;
      o.querySelector('button').textContent=t('再来一次','Play Again');
    }
  });
  function autoPause(){keys={};bowl.moving=0;if(state==='running')window.pauseCatch();}
  window.addEventListener('blur',autoPause);window.addEventListener('pagehide',autoPause);document.addEventListener('visibilitychange',function(){if(document.hidden)autoPause();});
  init();drawFrame();
})();

