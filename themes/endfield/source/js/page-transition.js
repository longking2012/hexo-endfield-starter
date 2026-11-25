/* 7. 页面切换转场动画 (View Transitions API, 交叉滑动过渡, 60fps 流畅) */
(function(){
  "use strict";
  var content=document.getElementById("content");
  if(!content) return;

  var transitioning=false;
  var lastUrl=location.href;
  var supportsVT=typeof document.startViewTransition==="function";

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

  function runScripts(scope){
    Array.prototype.forEach.call(scope.querySelectorAll("script"),function(old){
      var ns=document.createElement("script");
      Array.prototype.forEach.call(old.attributes,function(at){ ns.setAttribute(at.name,at.value); });
      ns.text=old.text; old.parentNode.replaceChild(ns,old);
    });
  }

  function load(url, push){
    if(transitioning) return;
    transitioning=true;
    fetch(url,{headers:{"X-Requested-With":"fetch"}}).then(function(r){
      if(!r.ok) throw new Error("HTTP "+r.status);
      return r.text();
    }).then(function(html){
      var doc=new DOMParser().parseFromString(html,"text/html");
      var nc=doc.getElementById("content");
      if(!nc) throw new Error("no #content");
      var swap=function(){
        content.innerHTML=nc.innerHTML;
        document.title=doc.title;
        if(push){ history.pushState({url:url},"",url); }
        else { history.replaceState({url:url},"",url); }
        lastUrl=url;
        window.scrollTo(0,0);
        runScripts(content);
        document.dispatchEvent(new CustomEvent("page:transitioned",{detail:{url:url}}));
      };
      if(supportsVT){
        var vt=document.startViewTransition(swap);
        vt.finished.then(function(){ transitioning=false; })
           .catch(function(){ transitioning=false; });
      } else {
        swap();
        transitioning=false;
      }
    }).catch(function(){
      transitioning=false;
      location.href=url;
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
