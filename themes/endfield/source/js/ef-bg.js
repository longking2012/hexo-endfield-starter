/* 终末地地形背景: <img> + object-fit 铺满 + 多设备缩放(2K/4K/手机) + AREA 标记 + 地名卡 */
(function(){
  var MAN = window.__EF_MANIFEST;
  if(!MAN) return;
  var KEYS = Object.keys(MAN);
  var pick;
  try{
    var s = sessionStorage.getItem("__ef_bg");
    pick = (s && MAN[s]) ? s : KEYS[Math.floor(Math.random()*KEYS.length)];
  }catch(e){ pick = KEYS[Math.floor(Math.random()*KEYS.length)]; }
  var cur = MAN[pick];
  var body = document.body;
  body.classList.add("ef-theme");

  /* ===== 多设备缩放配置(全图统一, 来自助手调参模板) =====
     按访客屏幕宽度自动选档, 应用对应 scale/位移, 并叠加 AREA 标记 */
  var DEV_CFG = {
    "4k":   {scale:2.8531, tx:704.35, ty:379.13, areas:[{x:64.923,y:26.246,text:"AREA"}]},
    "2k":   {scale:2.8531, tx:766.70, ty:405.20, areas:[{x:52.155,y:49.960,text:"AREA"}]},
    "phone":{scale:6.1159, tx:240.04, ty:242.43, areas:[{x:40.219,y:49.444,text:"AREA"}]}
  };
  function pickDev(){
    var w = window.innerWidth;
    if(w >= 3000) return "4k";
    if(w >= 1600) return "2k";
    return "phone";
  }
  var curDev = pickDev();

  // 注入 AREA 标记样式(十字 + 文字)
  var st = document.createElement("style");
  st.textContent = "";
  document.head.appendChild(st);

  function applyDevice(){
    var cfg = DEV_CFG[curDev] || DEV_CFG["2k"];
    if(img) img.style.transform = "translate(" + cfg.tx + "px," + cfg.ty + "px) scale(" + cfg.scale + ")";
  }

  // <img> 背景层
  var img = document.createElement("img");
  img.className = "ef-bg";
  img.alt = "";
  img.setAttribute("aria-hidden", "true");
  img.draggable = false;
  body.insertBefore(img, body.firstChild);
  function setBg(k){
    img.src = "/images/contour-" + k + ".svg";
  }
  setBg(pick);
  applyDevice();
  window.addEventListener("resize", function(){
    var nd = pickDev();
    if(nd !== curDev){ curDev = nd; }
    applyDevice();
  });

  function bing(lon, lat, lvl){
    return "https://www.bing.com/maps?q=" + lat.toFixed(4) + "," + lon.toFixed(4)
         + "&lvl=" + (lvl || 12);
  }
  function render(){
    var c = document.createElement("div");
    c.className = "ef-index"; if(window.innerWidth<=768){ c.classList.add("mini"); }
    c.innerHTML =
      "<div class=\"ef-index-h\">SOUTHLAND \u00b7 " + pick.toUpperCase() + "</div>"
      + "<a class=\"ef-index-t\" href=\"" + bing(cur.lon0,cur.lat0,12) + "\" target=\"_blank\" rel=\"noopener\">"
        + cur.title + " <span class=\"ef-geo\">N" + cur.lat0.toFixed(2) + "\u00b0 E" + cur.lon0.toFixed(2) + "\u00b0</span></a>"
      + "<div class=\"ef-index-c\">" + Math.round(cur["min"]) + "\u2013" + Math.round(cur["max"]) + "m"
        + " &nbsp;\u00b7&nbsp; " + cur.marks.length + " \u5904\u5730\u6807</div>"
      + "<div class=\"ef-index-r\"><a class=\"ef-map\" href=\"" + bing(cur.lon0,cur.lat0,10) + "\" "
        + "target=\"_blank\" rel=\"noopener\">\u2197 \u6253\u5f00\u5730\u56fe</a>"
      + "<button class=\"ef-next\" type=\"button\">\u25b6 \u4e0b\u4e00\u5f20</button></div>"
      + "<button class=\"ef-i-close\" type=\"button\" aria-label=\"\u7f29\u5c0f\">\u2715</button>";
    c.querySelector(".ef-i-close").addEventListener("click", function(ev){
      ev.stopPropagation();
      if(window.innerWidth<=768){ c.classList.add("mini"); }
    });
    c.querySelector(".ef-next").addEventListener("click", function(ev){
      ev.stopPropagation();
      var i = KEYS.indexOf(pick);
      pick = KEYS[(i+1) % KEYS.length];
      cur = MAN[pick];
      setBg(pick);
      applyDevice();
      try{ sessionStorage.setItem("__ef_bg", pick); }catch(e){}
      c.outerHTML = "";
      render();
    });
    document.body.appendChild(c);
  }
  render();
})();
