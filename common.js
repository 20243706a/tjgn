var q=new URLSearchParams(location.search),role=q.has('admin')?'c':'f',key=q.get('admin')||'',$=function(i){return document.getElementById(i)};
function esc(t){return (t==null?'':String(t)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}
function strip(x){return x.replace(/^[^\s]+\s/,'')}
var pend={},tm;
function patch(o){Object.assign(pend,o);clearTimeout(tm);tm=setTimeout(flush,250)}
function flush(){var b=JSON.stringify(pend);pend={};fetch('/api/patch?k='+encodeURIComponent(key),{method:'POST',headers:{'content-type':'application/json'},body:b,keepalive:true})}
function connect(onmsg){var first=true,es=new EventSource('/api/events?r='+role+'&k='+encodeURIComponent(key));es.onmessage=function(e){onmsg(JSON.parse(e.data),first);first=false};es.onerror=function(){if(es.readyState===2)$('app').innerHTML='<h1>연결이 끊겼어</h1><p class="sub">새로고침해 줘.</p>'}}
var FOOT='<p class="foot">전문 상담을 대신하지 않아요. 스스로를 해치고 싶은 생각이 들면 자살예방상담전화 109(24시간)로 연락해 줘.</p>';

var QS=['그 일에서 제일 마음에 걸리는 건 뭐야?','그 일이 있었을 때 몸은 어땠어? 어디가 먼저 반응했어?','그때 가장 하고 싶었던 말은 뭐였어?','같은 일이 다른 사람한테 일어났다면 뭐라고 말해주고 싶어?','비슷한 기분이 들었을 때 뭐가 도움이 됐어?','지금 제일 무겁게 느껴지는 걸 하나만 꺼낸다면?'];
var FN=['있었던 일','그때 기분','기분의 크기','생각해 보기','필요한 것','오늘 해볼 것','정리'];
(function(){var b=document.getElementById('fs'),de=document.documentElement,rq=de.requestFullscreen||de.webkitRequestFullscreen;
var sa=navigator.standalone||(window.matchMedia&&matchMedia('(display-mode: standalone)').matches);
if(!b||!rq||sa)return;b.hidden=false;document.body.classList.add('fsb');
function on(){return document.fullscreenElement||document.webkitFullscreenElement}
function upd(){b.textContent=on()?'전체화면 끄기':'전체화면'}upd();
b.onclick=function(){if(on())(document.exitFullscreen||document.webkitExitFullscreen).call(document);else rq.call(de)};
document.addEventListener('fullscreenchange',upd);document.addEventListener('webkitfullscreenchange',upd)})();
