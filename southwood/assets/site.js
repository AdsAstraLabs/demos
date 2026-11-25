(function(){
var d=document,h=d.documentElement;
/* menu */
var b=d.querySelector('.menu-btn'),n=d.getElementById('nav');
if(b&&n){b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o);b.firstChild.textContent=o?'Close':'Menu'});
n.addEventListener('click',function(e){if(e.target.tagName==='A'){n.classList.remove('open');b.setAttribute('aria-expanded','false');b.firstChild.textContent='Menu'}})}
/* rope follows scroll */
var rope=d.querySelector('.rope i');
function rp(){var m=h.scrollHeight-innerHeight;var p=m>0?Math.min(1,Math.max(.04,scrollY/m)):1;rope.style.setProperty('--p',p);rope.parentNode.style.setProperty('--p',p)}
addEventListener('scroll',rp,{passive:true});rp();
/* reveal */
var rv=[].slice.call(d.querySelectorAll('.reveal'));
rv.forEach(function(e,i){e.style.setProperty('--i',i%7)});
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.12});rv.forEach(function(e){io.observe(e)})}else{h.classList.add('show-all')}
setTimeout(function(){h.classList.add('show-all')},2500);
/* count up */
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
function run(el){var to=+el.dataset.to,dec=+el.dataset.dec||0,pre=el.dataset.pre||'',suf=el.dataset.suf||'',fin=el.textContent;
if(reduce){return}var t0=null;function f(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/1100),e=1-Math.pow(1-k,3);
if(el.dataset.suf===',000,000'){el.textContent=pre+Math.round(to*e)+(k<1?'':suf)}else{el.textContent=pre+(to*e).toFixed(dec)+(k<1&&suf==='/7'?'/7':suf)}
if(k<1)requestAnimationFrame(f);else el.textContent=fin}requestAnimationFrame(f)}
var cs=[].slice.call(d.querySelectorAll('.count'));
if('IntersectionObserver' in window){var io2=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){run(x.target);io2.unobserve(x.target)}})},{threshold:.6});cs.forEach(function(e){io2.observe(e)})}
/* hero video fallback: keep poster if it fails */
var v=d.querySelector('.hero-video');
if(v){v.addEventListener('error',function(){v.style.display='none'});var p=v.play&&v.play();if(p&&p.catch)p.catch(function(){})}
})();
