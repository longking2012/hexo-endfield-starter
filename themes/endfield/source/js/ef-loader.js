/* 终末地进站加载界面: logo + 进度条 + 实时资源显示 + 完成淡出 */
(function(){
  var loader = document.getElementById('efLoader');
  if(!loader) return;
  var bar = document.getElementById('efBar');
  var pct = document.getElementById('efPct');
  var p = 0, done = false, timer = null;

  /* 资源显示行: 实时滚动显示正在加载的文件名 */
  var resEl = document.createElement('div');
  resEl.className = 'ef-loader-res';
  resEl.textContent = 'INITIALIZING';
  var inner = loader.querySelector('.ef-loader-inner') || loader;
  inner.appendChild(resEl);
  var lastRes = '';

  function tickRes(){
    if(done) return;
    try{
      var rs = performance.getEntriesByType('resource');
      if(rs.length){
        var f = rs[rs.length - 1].name.split('/').pop().split('?')[0];
        if(f && f !== lastRes){ lastRes = f; resEl.textContent = 'LOADING  ' + f; }
      }
    }catch(e){}
    requestAnimationFrame(tickRes);
  }
  if(window.requestAnimationFrame) requestAnimationFrame(tickRes);

  function set(v){
    v = Math.max(0, Math.min(100, Math.round(v)));
    if(bar) bar.style.width = v + '%';
    if(pct) pct.textContent = v + '%';
  }
  function finish(){
    if(done) return;
    done = true;
    set(100);
    resEl.textContent = 'READY';
    setTimeout(function(){ loader.classList.add('done'); }, 350);
  }

  /* 加载期间渐近 90%(表示忙碌), 真正完成要等 window.load(所有资源加载完) */
  timer = setInterval(function(){
    p += (90 - p) * 0.06 + 0.3;
    set(p);
  }, 100);

  window.addEventListener('load', function(){
    clearInterval(timer);
    var fin = setInterval(function(){
      p += 10; set(p);
      if(p >= 100){ clearInterval(fin); finish(); }
    }, 45);
  });

  setTimeout(function(){
    if(!done){ clearInterval(timer); finish(); }
  }, 9000);
})();
