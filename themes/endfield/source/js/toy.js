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

  /* 3. Konami code 彩蛋(↑↑↓↓←→←→BA → 彩虹模式) */
  var konami = [], seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  var rainbowOn = false, hueInt = null;
  document.addEventListener('keydown', function(e){
    konami.push(e.key.length===1 ? e.key.toLowerCase() : e.key);
    if(konami.length > seq.length) konami.shift();
    if(konami.join(',') === seq.join(',')){
      if(rainbowOn){
        rainbowOn = false; clearInterval(hueInt); document.body.style.filter = '';
        console.log('%c[彩蛋关闭]','color:#888');
      } else {
        rainbowOn = true; var hue = 0;
        hueInt = setInterval(function(){ hue = (hue+3)%360; document.body.style.filter = 'hue-rotate('+hue+'deg)'; }, 60);
        console.log('%c[Konami 彩蛋触发] 彩虹模式!再输入一次关闭','color:#fffa00;font-size:14px');
      }
      konami = [];
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

/* 3. 科乐美秘籍 ↑↑↓↓←→←→BA → 隐藏小游戏: 弹反 */
(function(){
  "use strict";
  var seq=[38,38,40,40,37,39,37,39,66,65], pos=0;
  document.addEventListener("keydown", function(e){
    if(e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if(e.keyCode===seq[pos]){ pos++; if(pos===seq.length){ pos=0; openMini(); } }
    else pos = (e.keyCode===seq[0])?1:0;
  });

  function openMini(){
    if(document.getElementById("ef-mini")) return;
    var ov=document.createElement("div"); ov.id="ef-mini";
    ov.style.cssText="position:fixed;left:0;top:0;right:0;bottom:0;z-index:2147483000;background:rgba(8,9,10,.94);font-family:Consolas,monospace;color:#fffa00;user-select:none;cursor:crosshair";
    ov.innerHTML =
      "<div id=\\"ef-mini-hud\\" style=\\"position:absolute;left:0;right:0;top:0;padding:14px 20px;display:flex;justify-content:space-between;font-size:13px;letter-spacing:.1em;border-bottom:1px solid rgba(255,250,0,.2)\\">"+
        "<span>DEFLECT // 弹反</span><span id=\\"ef-mini-sc\\">SCORE 0</span><span id=\\"ef-mini-lf\\">LIVES ▲▲▲</span>"+
      "</div>"+
      "<canvas id=\\"ef-mini-cv\\" style=\\"position:absolute;left:0;top:0;width:100%;height:100%\\"></canvas>"+
      "<div id=\\"ef-mini-tip\\" style=\\"position:absolute;left:0;right:0;bottom:18px;text-align:center;font-size:12px;color:#9a9a86;letter-spacing:.15em\\">点击 / 空格 弹反 · 方块接近核心时出手 · ESC 退出</div>";
    document.body.appendChild(ov);
    startLoop(ov);
  }

  function startLoop(ov){
    var cv=ov.querySelector("#ef-mini-cv"), ctx=cv.getContext("2d");
    var scEl=ov.querySelector("#ef-mini-sc"), lfEl=ov.querySelector("#ef-mini-lf");
    var W,H,CX,CY, blocks, parts, score, lives, over, spawnT, speed, raf, last;
    function resize(){ W=cv.width=innerWidth; H=cv.height=innerHeight; CX=W/2; CY=H/2; }
    addEventListener("resize", resize); resize();

    function reset(){ blocks=[]; parts=[]; score=0; lives=3; over=false; spawnT=0; speed=2.2; upd(); }
    function upd(){ scEl.textContent="SCORE "+score; lfEl.textContent="LIVES "+"▲".repeat(Math.max(0,lives)); }

    function spawn(){
      var side=Math.floor(Math.random()*4), m=30, x,y;
      if(side===0){x=-m;y=Math.random()*H;} else if(side===1){x=W+m;y=Math.random()*H;}
      else if(side===2){x=Math.random()*W;y=-m;} else {x=Math.random()*W;y=H+m;}
      var d=Math.hypot(CX-x,CY-y), vx=(CX-x)/d, vy=(CY-y)/d;
      blocks.push({x:x,y:y,vx:vx,vy:vy,s:14,dead:false});
    }

    function burst(x,y,col){ for(var i=0;i<14;i++){ var a=Math.random()*6.28, sp=2+Math.random()*4;
      parts.push({x:x,y:y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,l:1,col:col}); } }

    function act(){
      if(over){ reset(); return; }
      var best=null, bd=1e9;
      blocks.forEach(function(b){ if(b.dead) return;
        var d=Math.hypot(b.x-CX,b.y-CY); if(d<bd){bd=d;best=b;} });
      var R=Math.min(W,H)*0.13;
      if(best && bd < R){ best.dead=true; score+=10; speed+=0.12; burst(best.x,best.y,"#fffa00"); upd(); }
      else { burst(CX,CY,"#5a5a4a"); }
    }

    ov.addEventListener("mousedown", act);
    var keyHandler=function(e){ if(e.keyCode===32){ e.preventDefault(); act(); }
      if(e.keyCode===27){ close(); } };
    document.addEventListener("keydown", keyHandler);

    function close(){
      cancelAnimationFrame(raf); document.removeEventListener("keydown", keyHandler);
      if(ov.parentNode) ov.parentNode.removeChild(ov);
    }

    function tick(){
      raf=requestAnimationFrame(tick);
      ctx.fillStyle="rgba(8,9,10,.28)"; ctx.fillRect(0,0,W,H);
      // 网格
      ctx.strokeStyle="rgba(255,250,0,.05)"; ctx.lineWidth=1;
      for(var g=0;g<W;g+=48){ ctx.beginPath(); ctx.moveTo(g,0); ctx.lineTo(g,H); ctx.stroke(); }
      for(g=0;g<H;g+=48){ ctx.beginPath(); ctx.moveTo(0,g); ctx.lineTo(W,g); ctx.stroke(); }

      if(!over){
        spawnT--; if(spawnT<=0){ spawn(); spawnT=Math.max(16, 50-score*0.15); }
        var CR=14;
        blocks.forEach(function(b){ if(b.dead) return;
          b.x+=b.vx*speed; b.y+=b.vy*speed;
          if(Math.hypot(b.x-CX,b.y-CY)<CR+4){ b.dead=true; lives--; upd(); burst(CX,CY,"#ff4d4d");
            if(lives<=0){ over=true; setTimeout(function(){},0); } } });
        blocks=blocks.filter(function(b){ return !b.dead; });

        // 核心脉冲
        var pr=(Math.sin(Date.now()/220)*0.5+0.5);
        ctx.strokeStyle="rgba(255,250,0,"+(0.25+pr*0.5)+")"; ctx.lineWidth=2;
        ctx.beginPath(); ctx.arc(CX,CY,Math.min(W,H)*0.13,0,6.28); ctx.stroke();
        ctx.fillStyle="#fffa00"; ctx.fillRect(CX-CR,CY-CR,CR*2,CR*2);
      }

      // 方块
      blocks.forEach(function(b){
        ctx.fillStyle="#fffa00"; ctx.shadowColor="#fffa00"; ctx.shadowBlur=10;
        ctx.fillRect(b.x-b.s/2,b.y-b.s/2,b.s,b.s); ctx.shadowBlur=0;
      });
      // 粒子
      parts.forEach(function(p){ p.x+=p.vx; p.y+=p.vy; p.vx*=.94; p.vy*=.94; p.l-=.03;
        ctx.globalAlpha=Math.max(0,p.l); ctx.fillStyle=p.col; ctx.fillRect(p.x-2,p.y-2,4,4); });
      ctx.globalAlpha=1; parts=parts.filter(function(p){ return p.l>0; });

      if(over){
        ctx.fillStyle="rgba(8,9,10,.7)"; ctx.fillRect(0,0,W,H);
        ctx.fillStyle="#fffa00"; ctx.textAlign="center"; ctx.font="bold 42px monospace";
        ctx.fillText("DEFLECT",CX,CY-20);
        ctx.font="16px monospace"; ctx.fillStyle="#cfcf9a";
        ctx.fillText("SCORE "+score+"  ·  点击重新开始",CX,CY+30);
        ctx.fillStyle="#7a7a66"; ctx.font="12px monospace";
        ctx.fillText("ESC 退出",CX,CY+58);
      }
    }
    reset(); tick();
  }
})();
