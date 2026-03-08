/* ================================
   SIDEBAR TAB NAVIGATION
================================ */

const sections = document.querySelectorAll(".content-section");
const links = document.querySelectorAll(".sidebar a");

links.forEach(link => {

  link.addEventListener("click", function(e){

    e.preventDefault();

    const targetId = this.getAttribute("href").replace("#","");

    // Remove active from all
    sections.forEach(sec => sec.classList.remove("active"));
    links.forEach(l => l.classList.remove("active"));

    // Show selected
    const target = document.getElementById(targetId);
    if(target){
      target.classList.add("active");
      this.classList.add("active");
    }

  });

});


/* ================================
   DOT GRID HERO (LIGHTWEIGHT VERSION)
================================ */

const canvas = document.getElementById("dotCanvas");

if(canvas && window.innerWidth >= 768){

  const ctx = canvas.getContext("2d");

  const DOT_SIZE = 3;
  const GAP = 15;
  const PROXIMITY = 130;

  const BASE_COLOR = "#271E37";
  const ACTIVE_COLOR = "#5227FF";

  function hexToRgb(hex){
    const m=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if(!m) return {r:0,g:0,b:0};
    return {
      r:parseInt(m[1],16),
      g:parseInt(m[2],16),
      b:parseInt(m[3],16)
    };
  }

  const baseRgb = hexToRgb(BASE_COLOR);
  const activeRgb = hexToRgb(ACTIVE_COLOR);

  let w,h,dots=[];
  let mouse={x:-999,y:-999};

  function resize(){

    const dpr = window.devicePixelRatio || 1;

    w = canvas.offsetWidth;
    h = canvas.offsetHeight;

    canvas.width = w*dpr;
    canvas.height = h*dpr;

    canvas.style.width = w+"px";
    canvas.style.height = h+"px";

    ctx.setTransform(dpr,0,0,dpr,0,0);

    dots=[];

    for(let y=GAP/2;y<h;y+=GAP){
      for(let x=GAP/2;x<w;x+=GAP){
        dots.push({x,y});
      }
    }
  }

  window.addEventListener("resize",resize);
  resize();

  canvas.addEventListener("mousemove",e=>{
    const rect=canvas.getBoundingClientRect();
    mouse.x=e.clientX-rect.left;
    mouse.y=e.clientY-rect.top;
  });

  canvas.addEventListener("mouseleave",()=>{
    mouse.x=-999; mouse.y=-999;
  });

  function animate(){

    ctx.clearRect(0,0,w,h);

    dots.forEach(d=>{

      const dx=d.x-mouse.x;
      const dy=d.y-mouse.y;
      const dist=Math.hypot(dx,dy);

      let fill=BASE_COLOR;

      if(dist<PROXIMITY){

        const n=1-dist/PROXIMITY;
        const t=n*n*n;

        const r=Math.round(baseRgb.r+(activeRgb.r-baseRgb.r)*t);
        const g=Math.round(baseRgb.g+(activeRgb.g-baseRgb.g)*t);
        const b=Math.round(baseRgb.b+(activeRgb.b-baseRgb.b)*t);

        fill=`rgb(${r},${g},${b})`;
      }

      ctx.beginPath();
      ctx.arc(d.x,d.y,DOT_SIZE,0,Math.PI*2);
      ctx.fillStyle=fill;
      ctx.fill();

    });

    requestAnimationFrame(animate);
  }

  animate();

}

// Handle deep links like pages/mutual-fund.html#equity
document.addEventListener("DOMContentLoaded", function(){

  const hash = window.location.hash.replace("#", "");
  const allSections = document.querySelectorAll(".content-section");
  const allLinks = document.querySelectorAll(".sidebar a");

  function activateSection(sectionId, shouldScroll){
    allSections.forEach(sec => sec.classList.remove("active"));
    allLinks.forEach(link => link.classList.remove("active"));

    const section = document.getElementById(sectionId);
    const link = document.querySelector(`.sidebar a[href="#${sectionId}"]`);

    if (section) {
      section.classList.add("active");

      if (shouldScroll) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }

    if (link) {
      link.classList.add("active");
    }
  }

  if (hash && document.getElementById(hash)) {
    activateSection(hash, true);
  } else {
    // Default view should show Equity section without requiring a click.
    activateSection("equity", false);
  }

});

/* ================================
   BENEFIT CARDS CLICK TO REVEAL
================================ */

const benefitCards = document.querySelectorAll(".benefit-card");

benefitCards.forEach(card => {
  card.addEventListener("click", function(){
    const alreadyOpen = this.classList.contains("is-open");

    // Keep only one description open at a time.
    benefitCards.forEach(item => item.classList.remove("is-open"));

    if (!alreadyOpen) {
      this.classList.add("is-open");
    }
  });
});

