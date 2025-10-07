// Blog dynamic rendering
(async function () {
  const grid = document.querySelector('[data-blog-grid]');
  if (!grid) return;

  try {
    const res = await fetch('./blog/posts.json');
    const posts = await res.json();

    posts.forEach((p) => {
      const card = document.createElement('article');
      card.className = 'bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg';
      card.innerHTML = `
  <a href="./blog/detail.html?slug=${p.slug}" class="block group relative">
          <div class="relative">
            <img src="${p.image}" alt="${p.title}" class="w-full h-48 object-cover group-hover:opacity-95 transition" />
            <div class="absolute inset-x-0 top-0 flex justify-between p-2">
              <span class="bg-white/80 backdrop-blur text-gray-800 text-[11px] font-semibold px-2 py-1 rounded shadow-sm inline-flex items-center gap-1">
                <i class="fa fa-calendar text-xs"></i>
                <time datetime="${p.dateISO || ''}">${p.date || ''}</time>
              </span>
            </div>
          </div>
        </a>
        <div class="p-5 flex-1 flex flex-col">
          <h2 class="text-xl font-semibold text-gray-900">${p.title}</h2>
          <p class="mt-2 text-gray-600 text-sm">${p.excerpt}</p>
          <div class="mt-4">
            <a href="./blog/detail.html?slug=${p.slug}" class="inline-flex items-center gap-2 text-brand-primary font-semibold hover:text-brand-secondary transition">
              Devamını oku <i class="fa fa-long-arrow-right"></i>
            </a>
          </div>
        </div>`;

      // Image fallback: if primary fails, try alternate path (handling Turkish ı character)
      const img = card.querySelector('img');
      img.addEventListener('error', () => {
        if (p.imageAlt && img.dataset.fallback !== '1') {
          img.dataset.fallback = '1';
          img.src = p.imageAlt;
        }
      });
      grid.appendChild(card);
    });
  } catch (e) {
    console.error('Blog posts failed to load', e);
  }
})();
