/* Endfield · 小玩具彩蛋 */
(function(){
  'use strict';

  /* 1. 点击粒子特效(黄色小方块爆炸) */
  document.addEventListener('click', function(e){
    if(e.target.closest('a,button,input,select,textarea')) return;
    var colors = ['#fffa00','#ffd700','#ffffff'];
    for(var i=0;i<10;i++){
      var p = document.createElement('div');
      var c = colors[i%3];
      p.style.cssText = 'position:fixed;left:'+e.clientX+'px;top:'+e.clientY+'px;'+
        'width:5px;height:5px;background:'+c+';pointer-events:none;z-index:99999;'+
        'transition:all .7s cubic-bezier(.2,.8,.3,1);border-radius:1px';
      document.body.appendChild(p);
      var ang = Math.random()*Math.PI*2, dist = 40+Math.random()*60, rot = Math.random()*720-360;
      (function(p,ang,dist,rot){
        setTimeout(function(){
          p.style.transform = 'translate('+Math.cos(ang)*dist+'px,'+Math.sin(ang)*dist+'px) rotate('+rot+'deg) scale(0)';
          p.style.opacity = '0';
        },10);
        setTimeout(function(){ p.remove(); },750);
      })(p,ang,dist,rot);
    }
  });

  /* 2. 切走标签页标题变化 */
  var origTitle = document.title;
  var titles = ['ヽ(°〇°)ノ 回来呀！','(っ°Д°;)っ 别走','(´･ω･`) 想你了'];
  var tIdx = 0;
  document.addEventListener('visibilitychange', function(){
    if(document.hidden){
      document.title = titles[tIdx % titles.length];
      tIdx++;
    } else {
      document.title = origTitle;
    }
  });

  /* 4. 控制台彩蛋 */
  console.log('%cEndfield','color:#fffa00;font-size:24px;font-weight:bold;text-shadow:0 0 10px rgba(255,250,0,.5)');
  console.log('%c// 发现了这个隐藏的控制台','color:#888');
  console.log('%c试试 ↑↑↓↓←→←→BA 或者点击页面空白处','color:#666');

  /* 5. 一言(角落随机终末地原文台词,点击切换,自动轮换) */
  var quotes = [
    {t:"我们曾这样不断抵抗……期待着你能再一次归来。",w:"佩丽卡"},
    {t:"只有徒步行走在这片大地上，我们才能感受到生命的气息……这也是终末地战斗的意义。",w:"佩丽卡"},
    {t:"泪锋之招，当断即断。",w:"陈千语"},
    {t:"泪锋之剑，当弃即弃。",w:"陈千语"},
    {t:"云裂之剑，当立则立。",w:"陈千语"},
    {t:"火焰，照亮黄昏！",w:"莱万汀"},
    {t:"如果还觉得冷，可以往我这边靠。",w:"莱万汀"},
    {t:"又见面了，管理员。没想到在半路上还能遇到你。",w:"莱万汀",s:"任务对话"},
    {t:"记忆不总是真的。有时候，它会被虚假的幻影代替。",w:"莱万汀",s:"任务对话"},
    {t:"这片土地还有太多的未知，我们必须了解脚下的这颗星球，就像……我们应该更加了解我们自己。对吧，前辈？",w:"艾尔黛拉"},
    {t:"卡特洛·狼卫·卢皮诺，正式向管理员报到。",w:"狼卫"},
    {t:"不知当不当问，那你就别问了。",w:"狼卫"},
    {t:"多谢你的好意，管理员。往后……要是真遇到了难以解决的麻烦，我会来找你的。",w:"狼卫",s:"信赖对话"},
    {t:"轮到我出任务了么？正好，我也想找机会测试浮游炮的改造成效。",w:"安塔尔",s:"干员演示"},
    {t:"别打扰他，他正在进行第一百一十五次用源石技艺将火焰压缩成尘埃的试验。",w:"安塔尔",s:"档案"},
    {t:"我们要去哪里？",w:"洁尔佩塔",s:"剧情"}
  ];
  var qIdx = Math.floor(Math.random()*quotes.length);
  var quoteBox = document.createElement('div');
  quoteBox.style.cssText = 'position:fixed;right:20px;bottom:150px;max-width:320px;'+
    'background:rgba(13,13,13,.82);border-left:2px solid #fffa00;padding:10px 14px;'+
    'font-size:12px;color:#ccc;border-radius:4px;backdrop-filter:blur(8px);'+
    'cursor:pointer;z-index:50;transition:opacity .3s;line-height:1.6;font-family:inherit;'+
    'user-select:none';
  quoteBox.title = '点击换一句';
  function showQuote(){
    var q = quotes[qIdx];
    quoteBox.innerHTML = '<span style="color:#fffa00;font-size:10px;letter-spacing:1px;display:block;margin-bottom:4px">// 一言 · 终末地</span>'+
      '「'+q.t+'」'+
      '<span style="display:block;margin-top:4px;color:#888;font-size:11px">—— '+q.w+(q.s?'（'+q.s+'）':'')+'</span>';
  }
  showQuote();
  document.body.appendChild(quoteBox);
  quoteBox.addEventListener('click', function(e){
    e.stopPropagation();
    qIdx = (qIdx+1)%quotes.length;
    quoteBox.style.opacity = '0';
    setTimeout(function(){ showQuote(); quoteBox.style.opacity='1'; },250);
  });
  setInterval(function(){
    qIdx = (qIdx+1)%quotes.length;
    quoteBox.style.opacity = '0';
    setTimeout(function(){ showQuote(); quoteBox.style.opacity='1'; },250);
  }, 12000);
  /* 手机端隐藏(避免和 mini 播放器冲突) */
  if(window.innerWidth<=768){ quoteBox.style.display='none'; }
})();

/* 3. 科乐美秘籍 ↑↑↓↓←→←→BA → 隐藏小游戏: 弹幕躲避 */
(function(){
  "use strict";
  var seq=[38,38,40,40,37,39,37,39,66,65], pos=0;
  // 用 e.code(物理键码)检测, 不受中文输入法/语言影响
  function kc(e){
    var map={ArrowUp:38,ArrowDown:40,ArrowLeft:37,ArrowRight:39,KeyB:66,KeyA:65};
    if(e.code && map[e.code]!==undefined) return map[e.code];
    if(e.key){ var k=e.key.toLowerCase();
      if(k==="arrowup")return 38; if(k==="arrowdown")return 40;
      if(k==="arrowleft")return 37; if(k==="arrowright")return 39;
      if(k==="b")return 66; if(k==="a")return 65; }
    return e.keyCode;
  }
  document.addEventListener("keydown", function(e){
    if(e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    var c=kc(e);
    if(c===seq[pos]){ pos++; if(pos===seq.length){ pos=0; openMini(); } }
    else pos=(c===seq[0])?1:0;
  });
  // 备用: 控制台手动触发 window.efOpenMini()
  window.efOpenMini=openMini;

  function openMini(){
    if(document.getElementById("ef-mini")) return;
    var ov=document.createElement("div"); ov.id="ef-mini";
    ov.style.cssText="position:fixed;left:0;top:0;right:0;bottom:0;z-index:2147483000;background:rgba(8,9,10,.94);font-family:Consolas,monospace;color:#fffa00;user-select:none;cursor:crosshair";
    var hud=document.createElement("div");
    hud.style.cssText="position:absolute;left:0;right:0;top:0;padding:14px 20px;display:flex;justify-content:space-between;font-size:13px;letter-spacing:.1em;border-bottom:1px solid rgba(255,250,0,.2);pointer-events:none";
    hud.innerHTML="<span>DEFLECT // 弹幕躲避</span><span id='ef-mini-sc'>SCORE 0</span><span id='ef-mini-lf'>LIVES</span>";
    var cv=document.createElement("canvas");
    cv.style.cssText="position:absolute;left:0;top:0;width:100%;height:100%";
    var tip=document.createElement("div");
    tip.style.cssText="position:absolute;left:0;right:0;bottom:18px;text-align:center;font-size:12px;color:#9a9a86;letter-spacing:.15em;pointer-events:none";
    tip.innerHTML="WASD / 方向键 / 鼠标 移动 · 躲避黄色弹幕 · ESC 退出";
    ov.appendChild(hud); ov.appendChild(cv); ov.appendChild(tip);
    document.body.appendChild(ov);
    startLoop(ov,cv);
  }

  function startLoop(ov,cv){
    var ctx=cv.getContext("2d");
    var scEl=ov.querySelector("#ef-mini-sc"), lfEl=ov.querySelector("#ef-mini-lf");
    var W,H,CX, plane, bullets, parts, score, lives, over, spawnT, frame, raf, inv;
    var keys={};

    function resize(){ W=cv.width=innerWidth; H=cv.height=innerHeight; CX=W/2; }
    addEventListener("resize", resize); resize();

    function reset(){
      plane={x:CX,y:H*0.78,r:9}; bullets=[]; parts=[];
      score=0; lives=3; over=false; spawnT=0; frame=0; inv=0;
      upd();
    }
    function upd(){
      scEl.textContent="SCORE "+score;
      lfEl.textContent="LIVES "+"▲".repeat(Math.max(0,lives));
    }
    function burst(x,y,col,n){
      for(var i=0;i<(n||16);i++){
        var a=Math.random()*6.283, sp=2+Math.random()*4;
        parts.push({x:x,y:y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,l:1,col:col});
      }
    }
    function spawn(){
      var x=20+Math.random()*(W-40), y=-14;
      var sp=2.2+Math.min(4,score*0.004)+Math.random()*1.2;
      var vx=(Math.random()-0.5)*1.2;
      bullets.push({x:x,y:y,vx:vx,vy:sp,r:5});
    }

    function hitPlayer(){
      if(inv>0) return;
      lives--; inv=90; burst(plane.x,plane.y,"#ff4d4d",24); upd();
      if(lives<=0){ over=true; }
    }

    function move(){
      var sp=4.6, dx=0, dy=0;
      if(keys[37]||keys[65]) dx-=sp;
      if(keys[39]||keys[68]) dx+=sp;
      if(keys[38]||keys[87]) dy-=sp;
      if(keys[40]||keys[83]) dy+=sp;
      plane.x+=dx; plane.y+=dy;
      plane.x=Math.max(14,Math.min(W-14,plane.x));
      plane.y=Math.max(H*0.4,Math.min(H-16,plane.y));
    }

    var keyHandler=function(e){
      var k=e.keyCode;
      if([37,38,39,40,87,65,83,68,32].indexOf(k)>=0) e.preventDefault();
      keys[k]=true;
      if(k===27){ close(); }
      if(over && k===13){ reset(); }
    };
    var keyUpHandler=function(e){ keys[e.keyCode]=false; };
    var mouseHandler=function(e){
      var r=cv.getBoundingClientRect();
      plane.x=e.clientX-r.left; plane.y=e.clientY-r.top;
      plane.y=Math.max(H*0.4,Math.min(H-16,plane.y));
    };
    var touchHandler=function(e){
      if(!e.touches[0]) return;
      var r=cv.getBoundingClientRect();
      plane.x=e.touches[0].clientX-r.left; plane.y=e.touches[0].clientY-r.top;
      plane.y=Math.max(H*0.4,Math.min(H-16,plane.y));
      e.preventDefault();
    };
    var clickHandler=function(){ if(over) reset(); };
    document.addEventListener("keydown", keyHandler);
    document.addEventListener("keyup", keyUpHandler);
    ov.addEventListener("mousemove", mouseHandler);
    ov.addEventListener("touchmove", touchHandler, {passive:false});
    ov.addEventListener("mousedown", clickHandler);

    function close(){
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", keyHandler);
      document.removeEventListener("keyup", keyUpHandler);
      if(ov.parentNode) ov.parentNode.removeChild(ov);
    }

    function drawPlane(){
      ctx.save(); ctx.translate(plane.x,plane.y);
      if(inv>0 && Math.floor(inv/6)%2===0) ctx.globalAlpha=0.35;
      // 尾焰
      ctx.fillStyle="rgba(255,250,0,.55)";
      ctx.beginPath(); ctx.moveTo(-4,8); ctx.lineTo(0,16+Math.random()*6); ctx.lineTo(4,8); ctx.fill();
      // 机身(黄色三角)
      ctx.fillStyle="#fffa00"; ctx.shadowColor="#fffa00"; ctx.shadowBlur=12;
      ctx.beginPath(); ctx.moveTo(0,-13); ctx.lineTo(10,9); ctx.lineTo(0,4); ctx.lineTo(-10,9); ctx.closePath(); ctx.fill();
      ctx.shadowBlur=0; ctx.globalAlpha=1; ctx.restore();
    }

    function tick(){
      raf=requestAnimationFrame(tick);
      ctx.fillStyle="rgba(8,9,10,.3)"; ctx.fillRect(0,0,W,H);
      ctx.strokeStyle="rgba(255,250,0,.05)"; ctx.lineWidth=1;
      for(var g=0;g<W;g+=48){ ctx.beginPath(); ctx.moveTo(g,0); ctx.lineTo(g,H); ctx.stroke(); }
      for(g=0;g<H;g+=48){ ctx.beginPath(); ctx.moveTo(0,g); ctx.lineTo(W,g); ctx.stroke(); }

      if(!over){
        frame++; move();
        if(inv>0) inv--;
        spawnT--; if(spawnT<=0){ spawn(); spawnT=Math.max(6,22-frame*0.02); }
        for(var i=bullets.length-1;i>=0;i--){
          var b=bullets[i]; b.x+=b.vx; b.y+=b.vy;
          if(b.y>H+20||b.x<-20||b.x>W+20){ bullets.splice(i,1); score++; upd(); continue; }
          if(Math.hypot(b.x-plane.x,b.y-plane.y) < b.r+plane.r-2){ bullets.splice(i,1); hitPlayer(); }
        }
      }

      bullets.forEach(function(b){
        ctx.fillStyle="#fffa00"; ctx.shadowColor="#fffa00"; ctx.shadowBlur=10;
        ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,6.283); ctx.fill(); ctx.shadowBlur=0;
      });
      parts.forEach(function(p){ p.x+=p.vx; p.y+=p.vy; p.vx*=.94; p.vy*=.94; p.l-=.03;
        ctx.globalAlpha=Math.max(0,p.l); ctx.fillStyle=p.col; ctx.fillRect(p.x-2,p.y-2,4,4); });
      ctx.globalAlpha=1; parts=parts.filter(function(p){ return p.l>0; });

      if(!over) drawPlane();
      else {
        ctx.fillStyle="rgba(8,9,10,.72)"; ctx.fillRect(0,0,W,H);
        ctx.textAlign="center";
        ctx.fillStyle="#fffa00"; ctx.font="bold 42px monospace"; ctx.fillText("GAME OVER",CX,H/2-20);
        ctx.font="16px monospace"; ctx.fillStyle="#cfcf9a"; ctx.fillText("SCORE "+score,CX,H/2+22);
        ctx.fillStyle="#7a7a66"; ctx.font="12px monospace"; ctx.fillText("点击 / Enter 重新开始  ·  ESC 退出",CX,H/2+52);
      }
    }
    reset(); tick();
  }
})();
/* sig */
try{console.log("%c325 · Longking · Lovely · 2550360","color:#fffa00;font-size:10px;opacity:.55;letter-spacing:.08em");}catch(e){}
