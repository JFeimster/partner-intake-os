const header=document.querySelector("[data-header]");
const menu=document.querySelector(".menu-toggle");
const nav=document.querySelector(".nav-links");
addEventListener("scroll",()=>header.classList.toggle("scrolled",scrollY>18),{passive:true});
menu?.addEventListener("click",()=>{const open=menu.getAttribute("aria-expanded")==="true";menu.setAttribute("aria-expanded",String(!open));nav.classList.toggle("open",!open)});
nav?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menu?.setAttribute("aria-expanded","false")}));

const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));

const countIO=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,target=+el.dataset.count,start=performance.now(),dur=1000;function tick(now){const p=Math.min((now-start)/dur,1);el.textContent=Math.round(target*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick);countIO.unobserve(el)}),{threshold:.7});
document.querySelectorAll("[data-count]").forEach(el=>countIO.observe(el));

if(matchMedia("(pointer:fine)").matches){
  const glow=document.querySelector(".cursor-glow");
  addEventListener("pointermove",e=>{glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px"},{passive:true});
  document.querySelectorAll(".magnetic").forEach(btn=>{
    btn.addEventListener("pointermove",e=>{const r=btn.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;btn.style.transform=`translate(${x*.08}px,${y*.12}px)`});
    btn.addEventListener("pointerleave",()=>btn.style.transform="");
  });
}
document.querySelectorAll(".placeholder-link").forEach(a=>a.addEventListener("click",e=>e.preventDefault()));
