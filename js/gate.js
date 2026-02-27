(function(){
  const PASS = "lockedin";
  function navType(){
    try{
      const n = performance.getEntriesByType("navigation")[0];
      return n ? n.type : "navigate";
    }catch(e){ return "navigate"; }
  }
  function clearOnReload(){
    if (navType() === "reload") sessionStorage.removeItem("pg_auth");
  }
  function isAuthed(){ return sessionStorage.getItem("pg_auth") === "1"; }

  window.ProGridGate = {
    pass: PASS,
    set(){ sessionStorage.setItem("pg_auth","1"); },
    clear(){ sessionStorage.removeItem("pg_auth"); },
    check(){
      clearOnReload();
      const path = (location.pathname || "").toLowerCase();
      // allow index and adminpanel without gate
      if (path.endsWith("/index.html") || path.endsWith("/") || path.includes("/adminpanel")) return true;
      if (!isAuthed()){
        location.replace("index.html");
        return false;
      }
      return true;
    }
  };
})();
