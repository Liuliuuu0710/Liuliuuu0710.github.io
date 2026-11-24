(function(){
  var nav=document.querySelector('.masthead .nav');
  if(!nav)return;
  var links=Array.from(nav.querySelectorAll('a'));
  var sections=links.map(function(link){return document.querySelector(link.hash)});
  var marker=document.createElement('span');marker.className='nav-indicator';marker.setAttribute('aria-hidden','true');nav.prepend(marker);
  function select(index){
    var link=links[index];if(!link)return;
    links.forEach(function(item){if(item===link)item.setAttribute('aria-current','location');else item.removeAttribute('aria-current')});
    marker.style.width=link.offsetWidth+'px';marker.style.height=link.offsetHeight+'px';marker.style.transform='translate3d('+link.offsetLeft+'px,'+link.offsetTop+'px,0)';
  }
  function update(){
    var header=document.querySelector('.masthead').getBoundingClientRect();
    var threshold=header.bottom+Math.max(48,(innerHeight-header.bottom)*.32);
    var active=0;
    sections.forEach(function(section,index){if(section&&section.getBoundingClientRect().top<=threshold)active=index});
    var end=sections[sections.length-1];
    if(end&&end.getBoundingClientRect().bottom<=innerHeight&&end.getBoundingClientRect().top<innerHeight*.75)active=links.length-1;
    select(active);
  }
  var queued=false;
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;update()})}
  window.addEventListener('scroll',schedule,{passive:true});
  document.addEventListener('scroll',schedule,{passive:true,capture:true});
  window.addEventListener('resize',schedule);
  window.addEventListener('hashchange',schedule);
  window.addEventListener('pageshow',schedule);
  if(window.visualViewport){visualViewport.addEventListener('resize',schedule);visualViewport.addEventListener('scroll',schedule)}
  if(window.ResizeObserver){var observer=new ResizeObserver(schedule);observer.observe(nav);sections.forEach(function(section){if(section)observer.observe(section)})}
  links.forEach(function(link,index){link.addEventListener('click',function(){select(index)})});
  if(document.fonts)document.fonts.ready.then(schedule);
  update();
})();
