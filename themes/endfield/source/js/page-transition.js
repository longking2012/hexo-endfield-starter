/* 7. 页面切换转场动画 (PJAX: 不重新加载, 只替换 #content, 平滑过渡) */
(function(){
  "use strict";
  var content=document.getElementById("content");
  if(!content) return;

  var transitioning=false;
  var lastUrl=location.href;

  function isInternal(a){
    if(!a || a.target==="_blank") return false;
    if(a.hasAttribute("download")) return false;
    var href=a.getAttribute("href");
    if(!href || href.charAt(0)==="#" || href.indexOf("javascript:")===0 ||
       href.indexOf("mailto:")===0 || href.indexOf("tel:")===0) return false;
    if(/^(https?:)?\/\//i.test(href)){
      try{ return new URL(href,location.href).origin===location.origin; }catch(e){ return false; }
    }
    return true;
  }

  function fadeOut(done){
    content.style.transition="opacity .16s ease, transform .16s ease";
    content.style.opacity="0";
    content.style.transform="translateY(8px)";
    setTimeout(done,170);
  }
  function fadeIn(){
    content.style.transition="opacity .28s cubic-bezier(.2,.7,.3,1), transform .28s cubic-bezier(.2,.7,.3,1)";
    content.style.opacity="1";
    content.style.transform="translateY(0)";
  }

  function load(url, push){
    if(transitioning) return;
    transitioning=true;
    fadeOut(function(){
      fetch(url,{headers:{"X-Requested-With":"fetch"}}).then(function(r){
        if(!r.ok) throw new Error("HTTP "+r.status);
        return r.text();
      }).then(function(html){
        var doc=new DOMParser().parseFromString(html,"text/html");
        var nc=doc.getElementById("content");
        if(!nc) throw new Error("no #content");
        content.innerHTML=nc.innerHTML;
        document.title=doc.title;
        if(push){ history.pushState({url:url},"",url); }
        else { history.replaceState({url:url},"",url); }
        lastUrl=url;
        window.scrollTo(0,0);
        requestAnimationFrame(fadeIn);
        setTimeout(function(){ transitioning=false; },300);
        document.dispatchEvent(new CustomEvent("page:transitioned",{detail:{url:url}}));
        // 重新执行内容里可能的内联脚本
        Array.prototype.forEach.call(content.querySelectorAll("script"),function(old){
          var ns=document.createElement("script");
          Array.prototype.forEach.call(old.attributes,function(at){ ns.setAttribute(at.name,at.value); });
          ns.text=old.text; old.parentNode.replaceChild(ns,old);
        });
      }).catch(function(){
        transitioning=false;
        location.href=url;   // 失败整页跳转
      });
    });
  }

  document.addEventListener("click",function(e){
    var a=e.target.closest("a");
    if(!isInternal(a)) return;
    if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey) return;
    if(transitioning) return;
    e.preventDefault();
    load(a.href,true);
  });

  window.addEventListener("popstate",function(e){
    if(e.state && e.state.url && e.state.url!==lastUrl){
      load(e.state.url,false);
    }
  });
})();
