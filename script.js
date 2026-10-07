const recommendations={energy:{title:"활력 관리 중심 MATCH",copy:"현재 목표라면 생활패턴을 먼저 확인하고 기본 영양소 후보를 우선 비교하는 방식이 좋아요."},fitness:{title:"운동·회복 중심 MATCH",copy:"운동 빈도와 식단을 함께 확인한 뒤 회복과 일상 영양을 보완하는 후보를 비교해보세요."},daily:{title:"일상 건강 중심 MATCH",copy:"식사와 생활습관에서 부족할 수 있는 부분을 먼저 확인하고 필요한 범위만 선택하는 방식입니다."},balance:{title:"기본 영양 중심 MATCH",copy:"현재 식단을 기준으로 부족한 부분을 확인하고 꼭 필요한 제품부터 비교하는 방식입니다."}};

const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
const progress=$(".scroll-progress");
const cursorDot=$(".cursor-dot");
const cursorRing=$(".cursor-ring");

window.addEventListener("scroll",()=>{
  const max=document.documentElement.scrollHeight-window.innerHeight;
  progress.style.width=(window.scrollY/Math.max(max,1))*100+"%";
});

if(window.matchMedia("(pointer:fine)").matches){
  let mx=0,my=0,rx=0,ry=0;
  window.addEventListener("pointermove",e=>{mx=e.clientX;my=e.clientY;cursorDot.style.left=mx+"px";cursorDot.style.top=my+"px"});
  const loop=()=>{rx+=(mx-rx)*.16;ry+=(my-ry)*.16;cursorRing.style.left=rx+"px";cursorRing.style.top=ry+"px";requestAnimationFrame(loop)};loop();
  $$("a,button,.tilt-card,select").forEach(el=>{
    el.addEventListener("mouseenter",()=>cursorRing.classList.add("hover"));
    el.addEventListener("mouseleave",()=>cursorRing.classList.remove("hover"));
  });
}

$$(".magnetic").forEach(el=>{
  el.addEventListener("pointermove",e=>{
    const r=el.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;
    el.style.transform="translate("+x*.12+"px,"+y*.12+"px)";
  });
  el.addEventListener("pointerleave",()=>el.style.transform="");
});

$$(".tilt-card").forEach(card=>{
  card.addEventListener("pointermove",e=>{
    if(window.innerWidth<801)return;
    const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    card.style.transform="perspective(800px) rotateX("+(-y*8)+"deg) rotateY("+(x*10)+"deg) translateY(-5px)";
  });
  card.addEventListener("pointerleave",()=>card.style.transform="");
});

const heroArt=$("#heroArt");
if(heroArt){
  heroArt.addEventListener("pointermove",e=>{
    if(window.innerWidth<801)return;
    const r=heroArt.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    heroArt.style.transform="rotateX("+(-y*3)+"deg) rotateY("+(x*4)+"deg)";
  });
  heroArt.addEventListener("pointerleave",()=>heroArt.style.transform="");
}

const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")});
},{threshold:.12});
$$(".reveal").forEach((el,i)=>{el.style.transitionDelay=(i%3)*80+"ms";observer.observe(el)});

const btn=$("#matchBtn"),answer=$("#answer"),progressPanel=$("#panelProgress");
function updateProgress(){progressPanel.style.width="45%";setTimeout(()=>progressPanel.style.width="100%",120)}
$("#goal").addEventListener("change",updateProgress);
$("#budget").addEventListener("change",updateProgress);

btn.addEventListener("click",()=>{
  const goal=$("#goal").value,budget=$("#budget").value,r=recommendations[goal];
  const score={energy:92,fitness:96,daily:89,balance:94}[goal];
  $("#heroScore").textContent=score+"%";
  $("#heroRecScore").textContent=score+"%";
  answer.innerHTML="<strong>✦ AI MATCH SAMPLE · "+score+"% MATCH</strong><br><b>"+r.title+"</b><br>"+r.copy+"<br><small>선택 예산: 월 "+budget+"만원 이하 · 실제 서비스에서는 검증된 제품 데이터와 개인 정보를 반영합니다.</small>";
  answer.animate([{opacity:0,transform:"translateY(12px) scale(.98)"},{opacity:1,transform:"translateY(0) scale(1)"}],{duration:450,easing:"cubic-bezier(.2,.8,.2,1)"});
});

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click",e=>{
    const target=document.querySelector(a.getAttribute("href"));
    if(target){e.preventDefault();target.scrollIntoView({behavior:"smooth",block:"start"})}
  });
});