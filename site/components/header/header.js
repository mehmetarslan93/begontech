// Header component bootstrapper - scoped and independent
(function(){
  function initHeader(root){
    if(!root) return;
    const toggleBtn = root.querySelector('[data-header-toggle]');
    const menu      = root.querySelector('[data-header-menu]');
    if(toggleBtn && menu){
      toggleBtn.addEventListener('click', ()=>{
        menu.classList.toggle('hidden');
      });
    }

    // Shrink on scroll (optional)
    const nav = root.querySelector('nav');
    let last = window.scrollY;
    window.addEventListener('scroll', ()=>{
      const y = window.scrollY;
      if(!nav) return;
      if(y > 16 && !nav.classList.contains('py-2')){
        nav.classList.remove('py-4');
        nav.classList.add('py-2');
      } else if(y <= 16 && !nav.classList.contains('py-4')){
        nav.classList.remove('py-2');
        nav.classList.add('py-4');
      }
      last = y;
    }, { passive:true });
  }

  // Auto-init for any header template dropped in DOM
  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('header[data-header]').forEach(initHeader);
  });

  // expose global for manual init if needed
  window.BegonHeader = { init: initHeader };
})();