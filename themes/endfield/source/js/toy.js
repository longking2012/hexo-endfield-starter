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
