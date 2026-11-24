(function(){
'use strict';
var preference=matchMedia('(prefers-reduced-motion: reduce)'),running=new Set(),observers=[];
function play(el,frames,delay,duration){if(!el||preference.matches||!el.animate)return;var a=el.animate(frames,{duration:duration||520,delay:delay||0,easing:'cubic-bezier(.22,.75,.25,1)',fill:'backwards'});running.add(a);a.onfinish=a.oncancel=function(){running.delete(a)};return a}
function rise(el,delay){play(el,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],delay,520)}
function observeOnce(nodes,fn){if(!('IntersectionObserver' in window))return;var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){observer.unobserve(entry.target);if(!preference.matches)fn(entry.target)}})},{threshold:.08});nodes.forEach(function(el){observer.observe(el)});observers.push(observer)}
function intro(){if(preference.matches)return;
 var hero=document.querySelector('.hero-intro-layout');if(hero){['.eyebrow','h1','.intro-role','.intro-story','.hero-portrait'].forEach(function(s,i){rise(hero.querySelector(s),i*65)});
 play(hero.querySelector('.human-side'),[{backgroundSize:'0% 2px'},{backgroundSize:'100% 2px'}],390,650);
 var wave=hero.querySelector('.hello-wave');play(wave,[{transform:'rotate(0)'},{transform:'rotate(14deg)',offset:.25},{transform:'rotate(-8deg)',offset:.55},{transform:'rotate(5deg)',offset:.8},{transform:'rotate(0)'}],220,700);
 }
 var detail=document.querySelector('.detail-hero');if(detail){Array.from(detail.children).forEach(function(el,i){rise(el,i*60)})}
}
function start(){if(preference.matches)return;intro();
 observeOnce(Array.from(document.querySelectorAll('.journey-bridge')),function(el){
 rise(el.querySelector('.journey-end'),0);play(el.querySelector('.journey-connector'),[{transform:'scaleX(0)',transformOrigin:'left'},{transform:'scaleX(1)',transformOrigin:'left'}],130,500);rise(el.querySelector('.journey-end:last-child'),260);
 play(el.querySelector('.journey-pixel'),[{opacity:0},{opacity:1,offset:.34},{opacity:.3,offset:.52},{opacity:1}],440,480)
 });
 observeOnce(Array.from(document.querySelectorAll('.detail-section')),function(el){var h=el.querySelector('h2');if(!location.hash||location.hash!=='#'+el.id)rise(h,0)});
 observeOnce(Array.from(document.querySelectorAll('.diagram')),function(el){var children=el.querySelectorAll('.steps>li,.flow>div,.devices>.device');Array.from(children).slice(0,6).forEach(function(child,i){rise(child,i*65)})});
 if((document.body.dataset.case==='cindy'||document.body.dataset.case==='porchlight')){
  // Observe each short block separately so long case studies stay readable.
  observeOnce(Array.from(document.querySelectorAll('.workstream-group>h3,.workstream-intro,.work-case h4,.work-case-deck')),function(el){rise(el,0)});
  observeOnce(Array.from(document.querySelectorAll('.work-case-facts>div,.validation-checks>div,.evidence-ledger>div,.reflection-lessons>li')),function(el){
   var index=Array.from(el.parentNode.children).indexOf(el);rise(el,Math.min(index%3,2)*55)
  });
  document.querySelectorAll('.workstream-extra,.supporting-work').forEach(function(el){el.addEventListener('toggle',function(){if(el.open&&!preference.matches)rise(el.querySelector('dl'),0)})});
 }

}
if(document.documentElement.classList.contains('intro-pending')){var gate=new MutationObserver(function(){if(!document.documentElement.classList.contains('intro-pending')){gate.disconnect();start()}});gate.observe(document.documentElement,{attributes:true,attributeFilter:['class']})}else start();
preference.addEventListener('change',function(e){if(e.matches){running.forEach(function(a){a.cancel()});observers.forEach(function(o){o.disconnect()})}});
})();
