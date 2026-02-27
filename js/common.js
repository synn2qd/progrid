(function(){
  // Gate protected pages
  if (window.ProGridGate) window.ProGridGate.check();

  // Page load intro
  window.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("loaded");
  });

  // Reveal on scroll
  const io = new IntersectionObserver((entries)=>{
    for (const e of entries){
      if (e.isIntersecting){
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el=>io.observe(el));

  // Grid drift (subtle)
  const grid = document.querySelector(".grid-bg");
  if (grid){
    let x=0,y=0;
    window.addEventListener("mousemove", (ev)=>{
      const dx = (ev.clientX / window.innerWidth - 0.5);
      const dy = (ev.clientY / window.innerHeight - 0.5);
      x = dx * 10;
      y = dy * 10;
      grid.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }, { passive: true });
  }

  // Rails: arrows + drag
  document.querySelectorAll("[data-railwrap]").forEach(wrap=>{
    const rail = wrap.querySelector(".rail");
    const prev = wrap.querySelector("[data-railprev]");
    const next = wrap.querySelector("[data-railnext]");
    if (!rail) return;

    const step = ()=> Math.max(300, Math.round(rail.clientWidth*0.82));
    const scrollBy = (dx)=> rail.scrollBy({ left: dx, behavior: "smooth" });

    prev && prev.addEventListener("click", (e)=>{ e.preventDefault(); scrollBy(-step()); });
    next && next.addEventListener("click", (e)=>{ e.preventDefault(); scrollBy(step()); });

    const sync = ()=>{
      const max = rail.scrollWidth - rail.clientWidth - 2;
      if (prev) prev.disabled = rail.scrollLeft <= 2;
      if (next) next.disabled = rail.scrollLeft >= max;
    };
    rail.addEventListener("scroll", sync, { passive:true });
    window.addEventListener("resize", sync);
    sync();

    // Drag scroll (mouse)
    let down=false, startX=0, startLeft=0;
    rail.addEventListener("mousedown",(e)=>{
      down=true; startX=e.pageX; startLeft=rail.scrollLeft;
      rail.style.cursor="grabbing";
    });
    window.addEventListener("mouseup",()=>{ down=false; rail.style.cursor=""; });
    window.addEventListener("mousemove",(e)=>{
      if(!down) return;
      const dx = (e.pageX - startX);
      rail.scrollLeft = startLeft - dx;
    }, { passive:false });
  });

  // Cursor glow (locked under cursor) + boost on hoverables
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);

  const hoverablesSelector = "a,button,.btn,.rail-btn,.thumb";
  window.addEventListener("mousemove",(e)=>{
    glow.style.left = e.clientX + "px";
    glow.style.top  = e.clientY + "px";
  }, { passive:true });

  const setBoost = (on)=> glow.classList.toggle("boost", !!on);
  document.addEventListener("mouseover",(e)=>{
    if (e.target && e.target.closest && e.target.closest(hoverablesSelector)) setBoost(true);
  });
  document.addEventListener("mouseout",(e)=>{
    if (e.target && e.target.closest && e.target.closest(hoverablesSelector)) setBoost(false);
  });
  document.addEventListener("mousedown",()=>{
    glow.animate([{transform:"translate(-50%,-50%) scale(1)"},{transform:"translate(-50%,-50%) scale(1.06)"},{transform:"translate(-50%,-50%) scale(1)"}],
      {duration:220, easing:"cubic-bezier(.2,.8,.2,1)"});
  });
})();
