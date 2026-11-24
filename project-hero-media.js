(function(){
 var reduce=matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('.project-hero-demo').forEach(function(figure){
  var videos=Array.from(figure.querySelectorAll('video')),button=figure.querySelector('button');
  var en=document.documentElement.lang==='en',manualPaused=false,visible=false;
  videos.forEach(function(video){video.muted=true});
  function playing(){return videos.some(function(video){return !video.paused})}
  function paint(){var active=playing();button.textContent=active?(en?'Pause':'暂停'):(en?'Play':'播放');button.setAttribute('aria-label',active?(en?'Pause project preview':'暂停项目短片'):(en?'Play project preview':'播放项目短片'))}
  function pause(){videos.forEach(function(video){video.pause()})}
  function start(){videos.forEach(function(video){var result=video.play();if(result)result.catch(paint)})}
  button.addEventListener('click',function(){if(playing()){manualPaused=true;pause()}else{manualPaused=false;start()}});
  videos.forEach(function(video){video.addEventListener('play',paint);video.addEventListener('pause',paint);video.addEventListener('error',paint)});
  function auto(){if(visible&&!document.hidden&&!reduce.matches&&!manualPaused)start();else pause()}
  if('IntersectionObserver' in window){new IntersectionObserver(function(entries){visible=entries[0].isIntersecting;auto()},{threshold:.15}).observe(figure)}else{visible=true;auto()}
  document.addEventListener('visibilitychange',auto);reduce.addEventListener('change',auto);paint();
 });
})();
