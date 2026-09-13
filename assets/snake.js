/* ── SNAKE ── */
(function(){
  var COLS=28,ROWS=16,CELL=18,GAP=2;
  var LW=COLS*(CELL+GAP)-GAP,LH=ROWS*(CELL+GAP)-GAP;
  var canvas=document.getElementById('snakeCanvas');
  canvas.width=LW;canvas.height=LH;
  var ctx=canvas.getContext('2d');
  var snake,dir,nextDir,food,score,best=0,state='idle',gameTimer=null;
  function init(){var mx=Math.floor(COLS/2),my=Math.floor(ROWS/2);snake=[{x:mx,y:my},{x:mx-1,y:my},{x:mx-2,y:my}];dir={x:1,y:0};nextDir={x:1,y:0};score=0;placeFood();hud();}
  function placeFood(){if(snake.length===COLS*ROWS){food=null;return;}var occ={};snake.forEach(function(s){occ[s.x+','+s.y]=1;});var f;do{f={x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)};}while(occ[f.x+','+f.y]);food=f;}
  function px(n){return n*(CELL+GAP);}
  function hud(){document.getElementById('scoreDisplay').textContent=score;document.getElementById('bestDisplay').textContent=best;}
  function draw(){
    ctx.fillStyle='#f0f7ff';ctx.fillRect(0,0,LW,LH);
    ctx.fillStyle='#dbeeff';
    for(var gx=0;gx<COLS;gx++)for(var gy=0;gy<ROWS;gy++){ctx.beginPath();ctx.arc(px(gx)+CELL/2,px(gy)+CELL/2,1.5,0,Math.PI*2);ctx.fill();}
    if(food){ctx.fillStyle='rgba(232,123,191,.35)';ctx.beginPath();ctx.arc(px(food.x)+CELL/2,px(food.y)+CELL/2,CELL*.85,0,Math.PI*2);ctx.fill();
    ctx.font='14px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🍜',px(food.x)+CELL/2,px(food.y)+CELL/2+1);}
    for(var i=snake.length-1;i>=0;i--){
      var seg=snake[i],tt=i/snake.length;
      ctx.fillStyle=i===0?'#2484d8':(tt<.5?'#4aa3f5':'#7cbfff');
      ctx.beginPath();if(ctx.roundRect)ctx.roundRect(px(seg.x),px(seg.y),CELL,CELL,i===0?7:5);else ctx.rect(px(seg.x),px(seg.y),CELL,CELL);ctx.fill();
      if(i===0){
        var ex=dir.x===0?3:dir.x>0?12:3,ey=dir.y===0?3:dir.y>0?12:3;
        var ex2=dir.x===0?CELL-5:dir.x>0?12:3,ey2=dir.y===0?CELL-5:dir.y>0?12:3;
        ctx.fillStyle='white';ctx.beginPath();ctx.arc(px(seg.x)+ex,px(seg.y)+ey,2.5,0,Math.PI*2);ctx.fill();
        ctx.beginPath();ctx.arc(px(seg.x)+ex2,px(seg.y)+ey2,2.5,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#1a3a5a';ctx.beginPath();ctx.arc(px(seg.x)+ex+.5,px(seg.y)+ey+.5,1.2,0,Math.PI*2);ctx.fill();
        ctx.beginPath();ctx.arc(px(seg.x)+ex2+.5,px(seg.y)+ey2+.5,1.2,0,Math.PI*2);ctx.fill();
      }
    }
  }
  function speed(){return Math.max(90,210-score*8);}
  function step(){dir={x:nextDir.x,y:nextDir.y};var head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};if(head.x<0||head.x>=COLS||head.y<0||head.y>=ROWS){gameOver();return;}for(var i=0;i<snake.length-(head.x===food.x&&head.y===food.y?0:1);i++){if(snake[i].x===head.x&&snake[i].y===head.y){gameOver();return;}}snake.unshift(head);if(head.x===food.x&&head.y===food.y){score++;if(score>best)best=score;hud();placeFood();if(!food){state='over';clearInterval(gameTimer);gameTimer=null;document.getElementById('pauseBtn').style.display='none';draw();ov('🏆',t('你赢啦！','You win!'),t('所有面条都吃到了！','You filled the board!'),t('再来一次','Play again'));return;}if(gameTimer){clearInterval(gameTimer);gameTimer=setInterval(step,speed());}}else snake.pop();draw();}
  function ov(em,ti,su,bt){var o=document.getElementById('snakeOverlay');o.querySelector('.overlay-emoji').textContent=em;o.querySelector('.overlay-title').textContent=ti;o.querySelector('.overlay-sub').innerHTML=su;o.querySelector('#overlayBtn').textContent=bt;o.classList.remove('hidden');}
  function hideOv(){document.getElementById('snakeOverlay').classList.add('hidden');}
  function gameOver(){state='over';if(gameTimer){clearInterval(gameTimer);gameTimer=null;}document.getElementById('startBtn').innerHTML='▶ '+t('重来','Restart');document.getElementById('pauseBtn').style.display='none';draw();ov('😵',t('游戏结束！','Game Over!'),t('得分：','Score: ')+score+t(' — 再来一次？',' — try again?'),t('再来一次','Play Again'));}
  window.startSnake=function(){if(gameTimer){clearInterval(gameTimer);gameTimer=null;}init();draw();hideOv();state='running';document.getElementById('startBtn').innerHTML='↺ '+t('重来','Restart');document.getElementById('pauseBtn').style.display='';document.getElementById('pauseBtn').innerHTML='⏸ '+t('暂停','Pause');gameTimer=setInterval(step,speed());};
  window.pauseSnake=function(){var btn=document.getElementById('pauseBtn');if(state==='running'){clearInterval(gameTimer);gameTimer=null;state='paused';btn.innerHTML='▶ '+t('继续','Resume');}else if(state==='paused'){state='running';btn.innerHTML='⏸ '+t('暂停','Pause');gameTimer=setInterval(step,speed());}};
  function applyDir(d){if(state!=='running')return;var map={UP:{x:0,y:-1},DOWN:{x:0,y:1},LEFT:{x:-1,y:0},RIGHT:{x:1,y:0}};var nd=map[d];if(nd.x===-dir.x&&nd.y===-dir.y)return;nextDir=nd;}
  window.dpadPress=function(e,d){if(e)e.preventDefault();applyDir(d);var ids={UP:'dUp',DOWN:'dDown',LEFT:'dLeft',RIGHT:'dRight'};var btn=document.getElementById(ids[d]);btn.classList.add('pressed');setTimeout(function(){btn.classList.remove('pressed');},150);};
  var KEYS={ArrowUp:'UP',ArrowDown:'DOWN',ArrowLeft:'LEFT',ArrowRight:'RIGHT',w:'UP',s:'DOWN',a:'LEFT',d:'RIGHT'};
  document.addEventListener('keydown',function(e){if(state!=='running')return;var d=KEYS[e.key];if(!d)return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].indexOf(e.key)>=0&&document.activeElement.tagName!=='INPUT')e.preventDefault();applyDir(d);});
  var tx0,ty0;
  canvas.addEventListener('touchstart',function(e){tx0=e.touches[0].clientX;ty0=e.touches[0].clientY;e.preventDefault();},{passive:false});
  canvas.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-tx0,dy=e.changedTouches[0].clientY-ty0;if(Math.abs(dx)<10&&Math.abs(dy)<10)return;if(Math.abs(dx)>Math.abs(dy))applyDir(dx>0?'RIGHT':'LEFT');else applyDir(dy>0?'DOWN':'UP');},{passive:false});
  if('ontouchstart' in window)document.getElementById('snakeHint').textContent=t('滑动或使用方向盘','Swipe or use D-pad');
  document.addEventListener('languagechange',function(){
    document.getElementById('startBtn').textContent=state==='idle'?'▶ '+t('开始','Play'):'↺ '+t('重来','Restart');
    document.getElementById('pauseBtn').textContent=state==='paused'?'▶ '+t('继续','Resume'):'⏸ '+t('暂停','Pause');
    if(state==='idle')ov('🐍',t('贪吃蛇','Snake Game'),t('用方向键或下方方向盘，帮小蛇吃到面条！','Use arrow keys or the D-pad to eat the noodles!'),t('开始游戏','Start Playing'));
    if(state==='over')ov(food?'😵':'🏆',food?t('游戏结束！','Game Over!'):t('你赢啦！','You win!'),t('得分：','Score: ')+score,t('再来一次','Play Again'));
  });
  function autoPause(){if(state==='running')window.pauseSnake();}
  window.addEventListener('blur',autoPause);window.addEventListener('pagehide',autoPause);document.addEventListener('visibilitychange',function(){if(document.hidden)autoPause();});
  init();draw();
  ov('🐍',t('贪吃蛇','Snake Game'),t('用方向键或下方方向盘<br>帮小蛇吃到 🍜！','Use arrow keys or the D-pad<br>to eat the 🍜!'),t('开始游戏','Start Playing'));
})();
