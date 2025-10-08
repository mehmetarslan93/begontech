// Simple scraper to fetch Akuvox teknik-bilgi page and extract PDF links into productData.js
// Usage: node scripts/scrape_akuvox_datasheets.js

const https = require('https');
const fs = require('fs');
const path = require('path');

const TARGET_URL = 'https://www.akuvoxinterkom.com/teknik-bilgi';
const OUT_JS = path.resolve(__dirname, '..', 'site', 'assets', 'js', 'productData.js');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // handle redirect
          fetch(res.headers.location).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`Request failed: ${res.statusCode}`));
          return;
        }
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
      })
      .on('error', reject);
  });
}

function absoluteUrl(href) {
  if (!href) return href;
  if (href.startsWith('http://') || href.startsWith('https://')) return href;
  return new URL(href, 'https://www.akuvoxinterkom.com').toString();
}

function extractLinks(html) {
  // Very lenient regex to find anchor tags to PDFs
  const links = [];
  const re = /<a\s+[^>]*href=["']([^"']+\.pdf)["'][^>]*>(.*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    const href = absoluteUrl(m[1]);
    const text = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (!href.toLowerCase().includes('/dosyalar/') && !href.toLowerCase().includes('/uploads/') && !href.toLowerCase().endsWith('.pdf')) {
      continue;
    }
    links.push({ href, text });
  }
  // De-duplicate by href
  const dedup = Object.values(
    links.reduce((acc, it) => {
      acc[it.href] = it;
      return acc;
    }, {})
  );
  return dedup;
}

function guessModelFrom(text, href) {
  const bases = [];
  const candidates = [];
  const s = `${text} ${href}`.toUpperCase();
  // find tokens like R29, R29C, X915, X915S, X912K, S535, S539, R49G, DB01, E161, E18, E20, E21, A01, A02, A05, A08, EC33, SR01, CRM11, CRP11
  const tokenRe = /\b([A-Z]{1,3}\d{1,4}[A-Z]?|R\d{2}[A-Z]?|X\d{3}[A-Z]?|S\d{3}|DB\d{2}|E\d{2,3}|A\d{2}|EC\d{2}|SR\d{2}|CR[MP]\d{2})\b/g;
  let tm;
  while ((tm = tokenRe.exec(s))) {
    const t = tm[1];
    candidates.push(t);
  }
  // Prefer specific known patterns ordering by length desc so X916S over X916
  candidates.sort((a, b) => b.length - a.length);
  // Some PDFs include model like 'akuvox-x916s-datasheet-v2.0.pdf'
  if (candidates.length) return candidates[0];
  // Fallback: filename without ext
  try {
    const file = path.basename(new URL(href).pathname).replace(/\.[^/.]+$/, '');
    return file.toUpperCase().replace(/[^A-Z0-9]/g, '');
  } catch {
    return null;
  }
}

function generateDescription(model) {
  const m = (model || '').toUpperCase();
  if (!m) return '';
  // Heuristic descriptions in Turkish
  if (/^(X9|S5)/.test(m)) {
    return 'Yüksek dayanıklılık, çoklu kimlik doğrulama ve PoE desteği sunan gelişmiş IP kapı önü paneli.';
  }
  if (/^R2\d/.test(m) || /^R29/.test(m) || /^X91/.test(m)) {
    return 'IP görüntülü diafon; kart, şifre ve mobil uygulama ile kapı erişimi sağlayan modern kapı önü paneli.';
  }
  if (/R49G/.test(m) || /^C3\d\d/.test(m) || /^X93\d/.test(m) || /^S56\d/.test(m)) {
    return 'Daire içi monitör; yüksek kaliteli ekran ve kolay arayüz ile görüntülü görüşme ve kapı kontrolü sağlar.';
  }
  if (/^A0|^A\d{2}/.test(m) || /^EC\d+/.test(m) || /^SR\d+/.test(m) || /^CR(M|P)\d+/.test(m)) {
    return 'Erişim kontrol cihazı; kart, PIN, BLE vb. yöntemlerle güvenli geçiş yönetimi sunar.';
  }
  if (/^DB\d+/.test(m) || /^E(18|20|21|161)/.test(m)) {
    return 'IP kapı zili; net görüntü ve ses ile ziyaretçi yönetimi sağlar.';
  }
  return 'Ürünün ayrıntılı teknik özellikleri için teknik dökümanı inceleyin.';
}

function buildProductData(links) {
  const data = {};
  for (const { href, text } of links) {
    const model = guessModelFrom(text, href);
    if (!model) continue;
    const key = model.toUpperCase().replace(/\s+/g, '');
    if (!data[key]) data[key] = {};
    // prefer keeping the first name if already set
    if (!data[key].name) {
      const name = text && /Akuvox/i.test(text) ? text.replace(/\s*Datasheet\s*/i, '').trim() : `Akuvox ${key}`;
      data[key].name = name;
    }
    data[key].description = data[key].description || generateDescription(key);
    data[key].datasheet = href;
  }
  return data;
}

function writeProductDataJS(obj) {
  const content = 'const productData = ' + JSON.stringify(obj, null, 2) + ';\n';
  fs.mkdirSync(path.dirname(OUT_JS), { recursive: true });
  fs.writeFileSync(OUT_JS, content, 'utf8');
  return OUT_JS;
}

(async () => {
  try {
    const html = await fetch(TARGET_URL);
    const links = extractLinks(html);
    const data = buildProductData(links);
    const out = writeProductDataJS(data);
    console.log(`Generated ${out} with ${Object.keys(data).length} entries.`);
  } catch (err) {
    console.error('Failed to scrape datasheets:', err);
    process.exit(1);
  }
})();
