(() => {
  const esc = value => String(value ?? '').replace(/[&<>\"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[char]));
  const instagramUrl = 'https://www.instagram.com/maristelaackerdoces/';
  const adminCategories = ['Bolos', 'Doces', 'Kits Festa', 'Sobremesas', 'Kits e Cestas'];

  const fallbackProducts = [
    { category:'Bolos', name:'Bolo de Chocolate', description:'Massa fofinha, brigadeiro cremoso e cobertura de chocolate.', price:55, unit:'A partir de', minQuantity:1, image:'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85', available:true },
    { category:'Bolos', name:'Bolo de Morango', description:'Creme de ninho, morangos frescos e massa branca.', price:65, unit:'A partir de', minQuantity:1, image:'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=900&q=85', available:true },
    { category:'Doces', name:'Brigadeiros Gourmet', description:'Brigadeiros artesanais, feitos na hora e super cremosos.', price:75, unit:'100 unidades', minQuantity:1, image:'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=900&q=85', available:true },
    { category:'Doces', name:'Beijinho de Coco', description:'O clássico beijinho com coco e muito carinho.', price:75, unit:'100 unidades', minQuantity:1, image:'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=85', available:true },
    { category:'Kits Festa', name:'Kit Festa Especial', description:'Bolo + docinhos para deixar sua comemoração ainda mais gostosa.', price:149, unit:'Kit', minQuantity:1, image:'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=900&q=85', available:true },
    { category:'Bolos', name:'Bolo de Ninho', description:'Massa branca, creme de leite ninho e acabamento delicado.', price:65, unit:'A partir de', minQuantity:1, image:'https://images.unsplash.com/photo-1602351447937-745cb720612f?auto=format&fit=crop&w=900&q=85', available:true }
  ];

  const getProducts = () => {
    let products = [];
    try { products = JSON.parse(localStorage.getItem('maristela-products') || '[]'); } catch (_) {}
    return (products.length ? products : fallbackProducts).filter(p => p.available !== false);
  };

  const generatePremiumPdf = () => {
    const products = getProducts();
    if (!products.length) { alert('Não há produtos disponíveis para gerar o cardápio.'); return; }
    const groups = {};
    products.forEach(p => (groups[p.category] ||= []).push(p));
    const categoryCount = Object.keys(groups).length;
    const cards = Object.entries(groups).map(([category, items], index) => `
      <section class="category ${index ? '' : 'first-category'}">
        <div class="category-heading"><span class="category-number">${String(index + 1).padStart(2, '0')}</span><div><div class="category-kicker">NOSSO CARDÁPIO</div><h2>${esc(category)}</h2></div><span class="category-line"></span></div>
        <div class="products-grid">
          ${items.map(p => `<article class="product"><div class="photo-wrap"><img src="${esc(p.image)}" alt="${esc(p.name)}" onerror="this.style.display='none'"></div><div class="product-body"><div class="product-top"><h3>${esc(p.name)}</h3><span class="price">R$ ${Number(p.price || 0).toFixed(2).replace('.', ',')}</span></div><p>${esc(p.description)}</p><div class="product-meta"><span>${esc(p.unit || '')}</span>${Number(p.minQuantity) > 1 ? `<span>Pedido mínimo: ${Number(p.minQuantity)}</span>` : ''}</div></div></article>`).join('')}
        </div>
      </section>`).join('');

    const w = window.open('', '_blank', 'width=960,height=1100');
    if (!w) { alert('O navegador bloqueou a janela do PDF. Permita pop-ups para este site e tente novamente.'); return; }
    w.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Cardápio | Doces e Delícias da Maristela</title><style>
      @page{size:A4;margin:0}*{box-sizing:border-box}html,body{margin:0;padding:0}body{font-family:Arial,Helvetica,sans-serif;color:#382a2a;background:#f7f2ed;-webkit-print-color-adjust:exact;print-color-adjust:exact}
      .page{width:210mm;min-height:297mm;padding:15mm 15mm 12mm;position:relative;margin:0 auto;background:#fbf8f4}.cover{min-height:68mm;padding:10mm 4mm 9mm;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;border-bottom:1px solid #dfd1cb;position:relative;overflow:hidden}.cover:before,.cover:after{content:'';position:absolute;border:1px solid #d9b9b5;border-radius:50%;opacity:.55}.cover:before{width:85mm;height:85mm;top:-53mm;left:-34mm}.cover:after{width:70mm;height:70mm;right:-30mm;bottom:-45mm}.brand-mark{width:22mm;height:22mm;border:1px solid #a45c64;border-radius:50%;display:grid;place-items:center;color:#a45c64;font:italic 700 28px Georgia,serif;margin-bottom:5mm;background:#fffdfa}.eyebrow{font-size:7.5px;letter-spacing:3px;font-weight:700;color:#a45c64;margin-bottom:3mm}.cover h1{font:600 27px Georgia,serif;line-height:1.08;margin:0;color:#382a2a;max-width:150mm}.cover .subtitle{font:10px Arial,sans-serif;color:#766866;margin:4mm 0 5mm}.contact-row{display:flex;gap:7mm;font-size:8px;color:#766866}.contact-row b{color:#a45c64}.summary{display:flex;justify-content:center;gap:16mm;padding:5mm 0;border-bottom:1px solid #eadfd9}.summary strong{display:block;text-align:center;font:600 15px Georgia,serif;color:#a45c64}.summary span{display:block;font-size:7px;text-transform:uppercase;letter-spacing:1.2px;color:#81726f;margin-top:1mm}.category{margin-top:8mm;break-inside:avoid}.category-heading{display:flex;align-items:center;gap:3mm;margin-bottom:4mm}.category-number{font:italic 700 15px Georgia,serif;color:#c58a8c}.category-kicker{font-size:6.5px;letter-spacing:1.8px;color:#a45c64;font-weight:700;margin-bottom:1mm}.category h2{font:600 18px Georgia,serif;margin:0;color:#382a2a}.category-line{height:1px;background:#dfd1cb;flex:1;margin-left:2mm}.products-grid{display:grid;grid-template-columns:1fr 1fr;gap:3.5mm}.product{display:flex;gap:3mm;padding:3mm;background:#fffdfa;border:1px solid #e8ddd7;border-radius:3mm;break-inside:avoid;min-height:34mm}.photo-wrap{width:30mm;height:30mm;flex:0 0 30mm;border-radius:2.2mm;overflow:hidden;background:#eee5df}.photo-wrap img{width:100%;height:100%;object-fit:cover}.product-body{min-width:0;display:flex;flex-direction:column}.product-top{display:flex;justify-content:space-between;gap:2mm;align-items:flex-start}.product h3{font:700 10.5px Arial,sans-serif;margin:0;color:#3f3030;line-height:1.25}.price{font:700 10px Arial,sans-serif;color:#a45c64;white-space:nowrap}.product p{font-size:7.5px;line-height:1.4;color:#766866;margin:2mm 0;flex:1}.product-meta{display:flex;gap:2mm;flex-wrap:wrap}.product-meta span{font-size:6.5px;color:#766866;background:#f3e8e4;border-radius:10px;padding:1.2mm 2mm}.footer{margin-top:9mm;padding-top:5mm;border-top:1px solid #dfd1cb;text-align:center;color:#766866;font-size:7.5px;line-height:1.55}.footer .brand{font:600 12px Georgia,serif;color:#382a2a;margin-bottom:1mm}.footer b{color:#a45c64}.note{margin-top:2mm;font-size:6.5px;color:#958582}@media print{.page{margin:0;box-shadow:none}}@media screen{body{padding:20px}.page{box-shadow:0 10px 40px rgba(50,30,25,.12)}}
    </style></head><body><main class="page"><header class="cover"><div class="brand-mark">M</div><div class="eyebrow">VITORINO · PARANÁ</div><h1>Doces e Delícias<br>da Maristela</h1><div class="subtitle">Bolos, doces e sobremesas feitos com carinho.</div><div class="contact-row"><span><b>WhatsApp</b> +55 (46) 93300-1791</span><span><b>Instagram</b> @maristelaackerdoces</span></div></header><div class="summary"><div><strong>${products.length}</strong><span>opções disponíveis</span></div><div><strong>${categoryCount}</strong><span>categorias</span></div><div><strong>♥</strong><span>feito artesanalmente</span></div></div>${cards}<footer class="footer"><div class="brand">Doces e Delícias da Maristela</div><div><b>Encomendas e informações:</b> +55 (46) 93300-1791 · @maristelaackerdoces</div><div class="note">Valores e disponibilidade podem ser atualizados. Consulte as opções e detalhes pelo WhatsApp.</div></footer></main></body></html>`);
    w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 1000);
  };

  window.generateMaristelaPdf = generatePremiumPdf;

  const updateInstagram = () => document.querySelectorAll('a[href*="instagram.com"]').forEach(link => { link.href = instagramUrl; });
  const updateCategory = () => document.querySelectorAll('.admin-modal label').forEach(label => {
    if (!label.textContent.trim().startsWith('Categoria')) return;
    const input = label.querySelector('input');
    if (!input || label.querySelector('.admin-category-select')) return;
    const select = document.createElement('select'); select.className = 'admin-category-select'; select.required = true;
    adminCategories.forEach(category => { const option = document.createElement('option'); option.value = category; option.textContent = category; select.appendChild(option); });
    select.value = input.value || 'Bolos'; input.style.setProperty('display','none','important'); input.setAttribute('aria-hidden','true'); label.insertBefore(select,input);
    select.addEventListener('change', () => { input.value=select.value; input.dispatchEvent(new Event('input',{bubbles:true})); input.dispatchEvent(new Event('change',{bubbles:true})); });
  });

  const bind = () => {
    updateInstagram();
    updateCategory();
    const actions = document.querySelector('.admin-modal .admin-form-actions');
    if (actions && !actions.querySelector('.pdf-menu-button')) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'pdf-menu-button';
      button.textContent = 'Gerar cardápio PDF';
      button.onclick = () => window.generateMaristelaPdf();
      actions.insertBefore(button, actions.firstChild);
    }
  };

  new MutationObserver(bind).observe(document.body,{childList:true,subtree:true});
  bind();
  setInterval(bind, 500);
})();
