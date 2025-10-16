// Lightweight HTML partial loader & nav highlighter
(function(){
  // Resolve absolute path so partials load from web root regardless of current page path
  function getSiteBase(){
    // Always use web root. With Live Server mount ["/", "./site"],
    // '/partials/header.html' maps to 'site/partials/header.html'.
    return '/';
  }

  async function loadPartial(selector, url){
        const el = document.querySelector(selector);
        if(!el) return;
        const loader = document.getElementById('pageLoader');
        // Fade out current content
        el.classList.add('fade-transition');
        el.classList.remove('fade-out');
        el.offsetWidth;
        el.classList.add('fade-out');
        setTimeout(async () => {
          // Show loader overlay
          if(loader){
            loader.style.display = 'flex';
            loader.style.opacity = '1';
            loader.style.pointerEvents = 'auto';
          }
          try{
            const res = await fetch(url, { cache: 'no-cache' });
            const html = await res.text();
            // Create a temp element to hold new content
            const temp = document.createElement('div');
            temp.innerHTML = html;
            const newEl = temp.firstElementChild;
            if(newEl){
              newEl.classList.add('fade-transition','fade-out');
              el.replaceWith(newEl);
              setTimeout(() => {
                // Hide loader and fade in new content
                if(loader){
                  loader.style.opacity = '0';
                  loader.style.pointerEvents = 'none';
                  setTimeout(()=>{ loader.style.display = 'none'; }, 500);
                }
                newEl.classList.remove('fade-out');
              }, 500); // Increased duration for loader visibility
            }
          }catch(err){
            if(loader){ loader.style.display = 'none'; }
            console.warn('Partial load failed:', url, err);
          }
        }, 500); // Increased initial delay for fade-out
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
    // Use event delegation for robustness
    document.body.addEventListener('click', function(e){
      const btn = e.target.closest('[data-menu-btn]');
      if(btn){
        const header = btn.closest('[data-partial="header"]');
        if(header){
          const menu = header.querySelector('[data-menu]');
          if(menu){
            menu.classList.toggle('hidden');
          }
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', async ()=>{
      const base = getSiteBase();
      const loader = document.getElementById('pageLoader');
      const minLoaderTime = 1000; // Minimum loader display time in ms
      // Hide main content initially
      const mainContent = document.querySelector('main, .main-content, .container');
      if(mainContent){
        mainContent.style.opacity = '0';
        mainContent.style.pointerEvents = 'none';
      }
      let loaderShownAt = Date.now();
      if(loader){
        loader.style.display = 'flex';
        loader.style.opacity = '1';
        loader.style.pointerEvents = 'auto';
      }
      // Load header and footer in parallel
      await Promise.all([
        loadPartial('#__header', base + 'partials/header.html'),
        loadPartial('#__footer', base + 'partials/footer.html')
      ]);
      wireHeaderMenu();
      activateNav();
      // Ensure loader stays visible for at least minLoaderTime
      const elapsed = Date.now() - loaderShownAt;
      const remaining = Math.max(0, minLoaderTime - elapsed);
      setTimeout(() => {
        if(loader){
          loader.style.opacity = '0';
          loader.style.pointerEvents = 'none';
          setTimeout(()=>{ loader.style.display = 'none'; }, 500);
        }
        if(mainContent){
          mainContent.style.opacity = '1';
          mainContent.style.pointerEvents = '';
        }
      }, remaining);
  });
})();