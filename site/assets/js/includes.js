// Lightweight HTML partial loader & nav highlighter
(function(){
  // Resolve absolute path to /site/ directory so partials load from any subfolder
  function getSiteBase(){
    try{
      const path = location.pathname.replace(/\\/g,'/');
      const idx = path.toLowerCase().lastIndexOf('/site/');
      if(idx !== -1){
        return path.slice(0, idx + 6); // include trailing '/site/'
      }
    }catch(_){}
    return '/site/';
  }

  async function loadPartial(selector, url){
    const el = document.querySelector(selector);
    if(!el) return;
    try{
      const res = await fetch(url, { cache: 'no-cache' });
      const html = await res.text();
      el.outerHTML = html; // replace placeholder with partial root
    }catch(err){
      console.warn('Partial load failed:', url, err);
    }
  }

  function activateNav(){
    const path = location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll('[data-partial="header"] [data-nav]');
    navLinks.forEach(a => {
      const key = a.getAttribute('data-nav');
      const href = a.getAttribute('href') || '';
      const isActive = href && path.endsWith(href.replace(/^.*\//,''));
      if(isActive || (key==='home' && /index\.html?$/.test(path))){
        a.classList.add('border-b-2','border-brand-primary');
        a.setAttribute('aria-current','page');
      }
    });
  }

  function wireHeaderMenu(){
    const header = document.querySelector('[data-partial="header"]');
    if(!header) return;
    const btn = header.querySelector('[data-menu-btn]');
    const menu = header.querySelector('[data-menu]');
    if(btn && menu){ btn.addEventListener('click', ()=> menu.classList.toggle('hidden')); }
  }

  document.addEventListener('DOMContentLoaded', async ()=>{
    const base = getSiteBase();
    await loadPartial('#__header', base + 'partials/header.html');
    await loadPartial('#__footer', base + 'partials/footer.html');
    wireHeaderMenu();
    activateNav();
  });
})();