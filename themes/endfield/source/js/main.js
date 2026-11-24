(function(){
  'use strict';
  var toggle = document.getElementById('theme-toggle');
  var body = document.body;
  var KEY = 'ink-theme';
  function apply(mode) {
    body.setAttribute('data-theme', mode);
    if (toggle) toggle.textContent = (mode === 'dark') ? '\u25d1' : '\u25d0';
  }
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved === 'dark' || saved === 'light') {
    apply(saved);
  } else {
    var pref = body.getAttribute('data-theme') || 'auto';
    apply(pref);
  }
  if (toggle) {
    toggle.addEventListener('click', function(){
      var cur = body.getAttribute('data-theme');
      var next = (cur === 'dark') ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
    });
  }
  document.querySelectorAll('.post-content pre').forEach(function(pre){
    if (pre.querySelector('.copy-btn')) return;
    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = '\u590d\u5236';
    btn.addEventListener('click', function(){
      var code = pre.querySelector('code') || pre;
      var text = code.innerText;
      var done = function(){
        btn.textContent = '\u5df2\u590d\u5236';
        setTimeout(function(){ btn.textContent = '\u590d\u5236'; }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else { fallback(); }
      function fallback(){
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
    pre.appendChild(btn);
  });
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({behavior:'smooth', block:'start'});
    history.replaceState(null, '', '#' + id);
  });
})();

/* ===== 终末地: 滚动淡入动画 ===== */
(function(){
  var els=document.querySelectorAll('.post, .post-page');
  els.forEach(function(el){el.classList.add('ef-fade')});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); } });
    },{threshold:.08});
    els.forEach(function(el){ io.observe(el); });
  }else{ els.forEach(function(el){ el.classList.add('visible'); }); }
})();

/* ===== 终末地: 右侧边栏音乐播放器 ===== */
(function(){
  var p=document.getElementById('efPlayer'); if(!p) return;
  var au=document.getElementById('efAudio'); if(!au) return;
  /* 歌单: 换成你自己的音乐,把 src 改成 /music/xxx.mp3 并把文件放到 source/music/ 即可 */
  var PLAYLIST=[
  {title:"A Secluded Path",artist:"塞壬唱片-MSR, Castalia Audio & 红唐",src:"/music/A%20Secluded%20Path.m4a"},
  {title:"Little Wish",artist:"塞壬唱片-MSR, Sincere & WS Music",src:"/music/Little%20Wish.m4a"},
  {title:"My World (Blood Oath) [Tale Version]",artist:"铁痕电台-MSR, 桑曼容, Erik Castro & David Lin",src:"/music/My%20World%20%28Blood%20Oath%29%20%5BTale%20Version%5D.m4a"},
  {title:"Mystic Light Quest (Instrumental Version)",artist:"塞壬唱片-MSR & Machico",src:"/music/Mystic%20Light%20Quest%20%28Instrumental%20Version%29.m4a"},
  {title:"Mystic Light Quest",artist:"塞壬唱片-MSR & Machico",src:"/music/Mystic%20Light%20Quest.m4a"},
  {title:"Snapshot",artist:"铁痕电台-MSR, Adam Gubman & Sorah Eun",src:"/music/Snapshot.m4a"},
  {title:"Sparkling Days",artist:"塞壬唱片-MSR, Castalia Audio & Bangler",src:"/music/Sparkling%20Days.m4a"},
  {title:"Speed of Light",artist:"塞壬唱片-MSR, DJ OKAWARI & 二宫爱",src:"/music/Speed%20of%20Light.m4a"},
  {title:"东归处",artist:"铁痕电台-MSR, 再定义ReStudio & 邹畅",src:"/music/%E4%B8%9C%E5%BD%92%E5%A4%84.m4a"},
  {title:"春景故人来",artist:"铁痕电台-MSR & Kirara Magic",src:"/music/%E6%98%A5%E6%99%AF%E6%95%85%E4%BA%BA%E6%9D%A5.m4a"},
  {title:"来时新社",artist:"铁痕电台-MSR, VISION SOUND & Salty Salt",src:"/music/%E6%9D%A5%E6%97%B6%E6%96%B0%E7%A4%BE.m4a"},
  {title:"直到大地变成一颗酸橙",artist:"塞壬唱片-MSR, 星熊南巫, Earthists. & 平林佑人",src:"/music/%E7%9B%B4%E5%88%B0%E5%A4%A7%E5%9C%B0%E5%8F%98%E6%88%90%E4%B8%80%E9%A2%97%E9%85%B8%E6%A9%99.m4a"},
  {title:"知山水",artist:"铁痕电台-MSR & Gareth Coker",src:"/music/%E7%9F%A5%E5%B1%B1%E6%B0%B4.m4a"},
  {title:"青简注我",artist:"铁痕电台-MSR & Kirara Magic",src:"/music/%E9%9D%92%E7%AE%80%E6%B3%A8%E6%88%91.m4a"},
];
  var idx=0, mode='list'; /* list | one | random */
  var $=function(id){ return document.getElementById(id); };
  var playBtn=$('efPlay'), trackEl=$('efTrack'), artistEl=$('efArtist'), curEl=$('efCur'), durEl=$('efDur');
  var fill=$('efPFill'), buf=$('efPBuf'), bar=$('efPBar'), vol=$('efVol'), pBody=$('efPBody'), toggle=$('efToggle');

  function fmt(s){ if(!isFinite(s)) return '0:00'; s=Math.round(s); var m=Math.floor(s/60), r=s%60; return m+':'+(r<10?'0':'')+r; }
  function load(i){
    idx=(i+PLAYLIST.length)%PLAYLIST.length;
    var t=PLAYLIST[idx];
    au.src=t.src; trackEl.textContent=t.title; artistEl.textContent=t.artist;
    fill.style.width='0%'; buf.style.width='0%'; curEl.textContent='0:00'; durEl.textContent='0:00';
    renderLyrics(t);
    updatePlaylistActive();
  }
  function renderLyrics(t){
    var box=$('efLyrics'); if(!box) return;
    var lyr = (window.LYRICS && window.LYRICS[t.title]) || '';
    if(lyr && lyr.trim()){
      var lines=t.lyrics.split(/\r?\n/).map(function(l){
        return '<p class="ef-lyric-line'+(l.trim()?'':' ef-lyric-blank')+'">'+(l.trim()||'&nbsp;')+'</p>';
      }).join('');
      box.innerHTML='<div class="ef-lyrics-title">歌词 · Lyrics</div><div class="ef-lyrics-body">'+lines+'</div>';
    } else {
      box.innerHTML='<div class="ef-lyrics-title">歌词 · Lyrics</div><div class="ef-lyrics-empty">暂无歌词</div>';
    }
  }
  function renderPlaylist(){
    var box=$('efPlaylist'); if(!box) return;
    var html='<div class="ef-pl-title">歌单 · '+PLAYLIST.length+' 首</div>';
    html += '<div class="ef-pl-list">';
    PLAYLIST.forEach(function(t,i){
      var mark = (window.LYRICS && window.LYRICS[t.title]) ? ' ♪' : '';
      html += '<div class="ef-pl-item'+(i===idx?' active':'')+'" data-idx="'+i+'">'+
        '<span class="ef-pl-num">'+(i+1)+'</span>'+
        '<span class="ef-pl-info"><span class="ef-pl-name">'+t.title+mark+'</span>'+
        '<span class="ef-pl-artist">'+t.artist+'</span></span></div>';
    });
    html += '</div>';
    box.innerHTML = html;
    box.querySelectorAll('.ef-pl-item').forEach(function(el){
      el.addEventListener('click',function(e){
        e.stopPropagation();
        var i=parseInt(el.dataset.idx); load(i); play();
      });
    });
  }
  function updatePlaylistActive(){
    var box=$('efPlaylist'); if(!box) return;
    box.querySelectorAll('.ef-pl-item').forEach(function(el,i){
      el.classList.toggle('active', i===idx);
    });
    var act=box.querySelector('.ef-pl-item.active');
    if(act && act.scrollIntoView) act.scrollIntoView({block:'nearest'});
  }
  function play(){ au.play().then(function(){ p.classList.add('playing'); }).catch(function(){}); }
  function pause(){ au.pause(); p.classList.remove('playing'); }
  function next(){
    if(mode==='one'){ load(idx); play(); return; }
    if(mode==='random'){ var r; do{ r=Math.floor(Math.random()*PLAYLIST.length); }while(PLAYLIST.length>1 && r===idx); load(r); play(); return; }
    load(idx+1); play();
  }
  function prev(){ if(mode==='random'){ next(); return; } load(idx-1); play(); }

  playBtn.addEventListener('click',function(){ if(au.paused){ if(!au.src) load(0); play(); } else pause(); });
  $('efNext').addEventListener('click',next);
  $('efPrev').addEventListener('click',prev);
  $('efMode').addEventListener('click',function(){
    mode = mode==='list' ? 'one' : mode==='one' ? 'random' : 'list';
    this.style.color = mode==='one' ? '#fffa00' : mode==='random' ? '#00ffa2' : '';
  });
  $('efMute').addEventListener('click',function(){ au.muted=!au.muted; this.style.color=au.muted?'#fffa00':''; });
  vol.addEventListener('input',function(){ au.volume=this.value/100; au.muted=false; });
  au.volume=vol.value/100;

  au.addEventListener('timeupdate',function(){
    curEl.textContent=fmt(au.currentTime);
    if(au.duration) fill.style.width=(au.currentTime/au.duration*100)+'%';
  });
  au.addEventListener('durationchange',function(){ durEl.textContent=fmt(au.duration); });
  au.addEventListener('progress',function(){
    if(au.buffered.length && au.duration) buf.style.width=(au.buffered.end(au.buffered.length-1)/au.duration*100)+'%';
  });
  au.addEventListener('ended',function(){ next(); });
  au.addEventListener('error',function(){ trackEl.textContent='无法加载音频'; artistEl.textContent=''; });
  bar.addEventListener('click',function(e){
    var rect=bar.getBoundingClientRect();
    if(au.duration) au.currentTime=(e.clientX-rect.left)/rect.width*au.duration;
  });
  toggle.addEventListener('click',function(e){
    e.stopPropagation();
    if(window.innerWidth<=768){ p.classList.add('mini'); }
    else { p.classList.toggle('collapsed'); }
  });

  window.LYRICS = {};
  renderPlaylist();
  load(0);
  p.classList.add('show');
  fetch('/music/lyrics.json').then(function(r){ return r.json(); }).then(function(d){
    window.LYRICS = d || {};
    renderLyrics(PLAYLIST[idx]);
    renderPlaylist();
    p.classList.add('ready');
  }).catch(function(){ p.classList.add('ready'); });
  /* 跨页恢复播放状态(sessionStorage):曲目/进度/播放 */
  try {
    var saved = JSON.parse(sessionStorage.getItem('efPlayState') || 'null');
    if (saved && typeof saved.idx === 'number') {
      load(saved.idx);
      if (saved.progress && au.duration) au.currentTime = saved.progress;
      if (saved.playing) { au.play().then(function(){ p.classList.add('playing'); }).catch(function(){}); }
    }
  } catch(e) {}
  function saveState(){
    try { sessionStorage.setItem('efPlayState', JSON.stringify({ idx: idx, progress: au.currentTime, playing: !au.paused })); } catch(e){}
  }
  window.addEventListener('beforeunload', saveState);
  window.addEventListener('pagehide', saveState);
  /* 手机端: 初始就收缩成图标(避免遮挡内容),点击展开;电脑保持完整 */
  if(window.innerWidth<=768){ p.classList.add('mini'); }
  p.addEventListener('click',function(e){
    if(p.classList.contains('mini')){ p.classList.remove('mini'); e.stopPropagation(); }
  });
})();

/* 手机端: 地名卡初始收缩成图标(点击展开);ef-bg.js 异步创建,轮询等待 */
if(window.innerWidth<=768){
  (function waitIdx(){
    var idx=document.querySelector('.ef-index');
    if(idx){
      idx.classList.add('mini');
      idx.addEventListener('click',function(e){ if(idx.classList.contains('mini')){ idx.classList.remove('mini'); e.stopPropagation(); } });
    } else { setTimeout(waitIdx,400); }
  })();
}
/* 播放器可调大小: 拖拽右下角调整宽度 */
(function(){
  var rz = document.getElementById('efResize');
  var pl = document.getElementById('efPlayer');
  if (!rz || !pl) return;
  var startX=0, startW=0;
  rz.addEventListener('mousedown', function(e){
    e.preventDefault(); e.stopPropagation();
    startX = e.clientX; startW = pl.offsetWidth;
    function move(ev){
      var w = startW + (ev.clientX - startX);
      if (w >= 260 && w <= 460) { pl.style.width = w + 'px'; }
    }
    function up(){
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    }
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  });
  rz.addEventListener('touchstart', function(e){
    if (e.touches.length !== 1) return;
    e.preventDefault(); e.stopPropagation();
    startX = e.touches[0].clientX; startW = pl.offsetWidth;
    function move(ev){
      var w = startW + (ev.touches[0].clientX - startX);
      if (w >= 260 && w <= 460) { pl.style.width = w + 'px'; }
    }
    function up(){
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', up);
    }
    document.addEventListener('touchmove', move);
    document.addEventListener('touchend', up);
  });
})();
/* 手机端: 播放器 X 按钮缩小成图标 */
var pclose=document.getElementById('efPClose');
if(pclose){ pclose.addEventListener('click',function(e){ e.stopPropagation(); var pl=document.getElementById('efPlayer'); if(pl){ pl.classList.add('mini'); } if(window.parent!==window){ window.parent.postMessage({type:'efPlayerClose'},'*'); } }); }

/* ===== 跨页音乐: 非 / 页面用 iframe 加载主页播放器(音频不中断) ===== */
(function(){
  try {
    var isEmbed = location.hash === '#ef-player';
    if (isEmbed) {
      // iframe 嵌入模式(旧版兼容):只显示播放器
      document.documentElement.style.cssText += ';background:#0a0a0c !important';
      function embedMode(){
        document.body.style.cssText += ';background:#0a0a0c !important;margin:0;padding:0';
        Array.prototype.forEach.call(document.body.children, function(el){
          var tag = el.tagName;
          if (el.id !== 'efPlayer' && tag !== 'SCRIPT' && tag !== 'AUDIO' && tag !== 'IFRAME' && tag !== 'LINK' && tag !== 'STYLE') {
            el.style.display = 'none';
          }
        });
        var p = document.getElementById('efPlayer');
        if (p) p.style.cssText += ';position:static;transform:none;margin:0;left:auto;right:auto;top:auto;bottom:auto;width:100%;max-width:none';
      }
      embedMode();
    }
  } catch(e) {}
})();
