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

const commentForm=$("#commentForm");
if(commentForm){
  const commentInput=$("#commentInput");
  const commentCount=$("#commentCount");
  const commentStatus=$("#commentStatus");
  const commentFrame=$("#commentResponse");
  const commentSubmit=$("#commentSubmit");
  let waitingForResponse=false;

  commentInput.addEventListener("input",()=>{
    commentCount.textContent=commentInput.value.length+" / 200";
  });
  commentForm.querySelector('input[name="pageUrl"]').value=window.location.href;

  commentForm.addEventListener("submit",()=>{
    const value=commentInput.value.trim();
    if(!value){
      commentStatus.textContent="의견을 한 글자 이상 입력해주세요.";
      commentInput.focus();
      return;
    }
    commentInput.value=value;
    commentForm.querySelector('input[name="pageUrl"]').value=window.location.href;
    waitingForResponse=true;
    commentSubmit.disabled=true;
    commentSubmit.textContent="전송 중...";
    commentStatus.textContent="의견을 전송하고 있습니다.";
  });

  commentFrame.addEventListener("load",()=>{
    if(!waitingForResponse)return;
    waitingForResponse=false;
    commentStatus.textContent="전송 요청을 보냈습니다. 스프레드시트에서 등록 여부를 확인해주세요.";
    commentForm.reset();
    commentCount.textContent="0 / 200";
    commentSubmit.disabled=false;
    commentSubmit.innerHTML='의견 보내기 <span>→</span>';
  });
}

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click",e=>{
    const target=document.querySelector(a.getAttribute("href"));
    if(target){e.preventDefault();target.scrollIntoView({behavior:"smooth",block:"start"})}
  });
});
/* pill cursor interaction */
(function(){
  if(!window.matchMedia("(pointer:fine)").matches)return;
  const pill=document.createElement("div");
  pill.className="pill-cursor";
  document.body.appendChild(pill);
  let x=innerWidth/2,y=innerHeight/2,px=x,py=y;
  addEventListener("pointermove",e=>{x=e.clientX;y=e.clientY});
  function move(){px+=(x-px)*.22;py+=(y-py)*.22;pill.style.left=px+"px";pill.style.top=py+"px";requestAnimationFrame(move)} move();
  document.querySelectorAll("a,button,select,.magnetic,.tilt-card").forEach(el=>{
    el.addEventListener("mouseenter",()=>pill.classList.add("is-hover"));
    el.addEventListener("mouseleave",()=>pill.classList.remove("is-hover"));
  });
  addEventListener("pointerdown",e=>{
    if(e.button!==0)return;
    pill.classList.remove("is-pressed");void pill.offsetWidth;pill.classList.add("is-pressed");
    for(let i=0;i<4;i++){
      const p=document.createElement("div");p.className="pill-pop";
      p.style.left=e.clientX+"px";p.style.top=e.clientY+"px";p.style.setProperty("--angle",(i*90-45)+"deg");
      document.body.appendChild(p);setTimeout(()=>p.remove(),700);
    }
  });
})();
