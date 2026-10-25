(() => {
  'use strict';
  const config=window.SAPAGO_CONFIG||{};
  const isReady=Boolean(config.publicKey?.trim());
  const dialog=document.createElement('dialog');
  dialog.className='demo-dialog';
  dialog.setAttribute('aria-labelledby','demo-dialog-title');
  document.body.append(dialog);
  function close(){dialog.close();document.body.classList.remove('demo-modal-open');}
  function show(content,extraClass=''){
    dialog.className='demo-dialog '+extraClass;
    dialog.innerHTML='<button class="demo-dialog-close" aria-label="Tutup">×</button>'+content;
    dialog.querySelector('.demo-dialog-close').addEventListener('click',close);
    dialog.showModal();document.body.classList.add('demo-modal-open');
  }
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}});
  dialog.addEventListener('close',()=>document.body.classList.remove('demo-modal-open'));
  function openForm(catalog=false){
    show(`<h2 id="demo-dialog-title">${catalog?'Download Katalog':'Konsultasi Sekarang & Dapatkan Diskon 10%'}</h2>
      <form class="demo-form"><label for="demo-name">Nama Lengkap</label><input id="demo-name" name="name" placeholder="Nama Lengkap" autocomplete="name">
      <label for="demo-phone">No. Handphone *</label><input id="demo-phone" name="phone" type="tel" placeholder="No. Handphone" autocomplete="tel" required pattern="[+0-9 ()-]{10,20}">
      <label for="demo-business">Nama Usaha/Bisnis *</label><input id="demo-business" name="business" placeholder="Nama Usaha/Bisnis" required>
      <label class="demo-consent"><input type="checkbox" name="consent">Saya bersedia menerima informasi terkait kebutuhan bedding usaha saya.</label>
      <button type="submit">Submit</button><small>Mode demo lokal. Data form tidak dikirim ke Substories. ${catalog?'Pada website asli, permintaan katalog dilanjutkan melalui WhatsApp.':''}</small></form>`);
    dialog.querySelector('form').addEventListener('submit',e=>{
      e.preventDefault();
      show(`<h2 id="demo-dialog-title">Terima kasih!</h2><p>${catalog?'Permintaan katalog':'Permintaan konsultasi'} berhasil disimulasikan.</p><p>Ini adalah demo lokal Sapago x Substories. Tidak ada data yang dikirim atau pesan WhatsApp yang dibuat.</p><button class="demo-action">Kembali ke website</button>`);
      dialog.querySelector('.demo-action').addEventListener('click',close);
    });
  }
  document.querySelectorAll('button[id$="_btn"]').forEach(button=>button.addEventListener('click',()=>openForm(/katalog/i.test(button.textContent))));
  document.querySelectorAll('.whatsapp_footer a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();openForm();}));
  // Original FAQ copy and answers remain in the page.
  document.querySelectorAll('.hl-faq-child-heading').forEach((heading,i)=>{
    const panel=heading.nextElementSibling;
    panel.id='demo-faq-'+i;panel.hidden=true;
    heading.setAttribute('role','button');heading.tabIndex=0;heading.setAttribute('aria-controls',panel.id);heading.setAttribute('aria-expanded','false');
    const toggle=()=>{const open=heading.getAttribute('aria-expanded')!=='true';heading.setAttribute('aria-expanded',String(open));panel.hidden=!open;panel.classList.toggle('demo-expanded',open);};
    heading.addEventListener('click',toggle);
    heading.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();toggle();}});
  });
  const mobileMenu=document.createElement('nav');mobileMenu.className='demo-mobile-panel';mobileMenu.setAttribute('aria-label','Menu mobile');
  mobileMenu.innerHTML='<button class="demo-dialog-close" aria-label="Tutup menu">×</button>'+Array.from(document.querySelectorAll('.mega-menu-link')).map(a=>a.outerHTML).join('');
  document.body.append(mobileMenu);
  const toggleMenu=open=>{mobileMenu.classList.toggle('open',open);document.querySelectorAll('.nav-menu-mobile').forEach(b=>b.setAttribute('aria-expanded',String(open)));};
  mobileMenu.querySelector('button').addEventListener('click',()=>toggleMenu(false));
  mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>toggleMenu(false)));
  document.querySelectorAll('.nav-menu-mobile').forEach(button=>{button.setAttribute('aria-expanded','false');button.addEventListener('click',()=>toggleMenu(true));button.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();toggleMenu(true);}});});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')toggleMenu(false);});
  // Image sliders: reuse every original slide, remove only the loop clones.
  document.querySelectorAll('.carousel').forEach((carousel,carouselIndex)=>{
    const track=carousel.querySelector('.carousel__slides');
    track.querySelectorAll('[class*="carousel__slide-cloned"]').forEach(s=>s.remove());
    const slides=Array.from(track.children).filter(s=>s.classList.contains('carousel__slide'));
    let index=0;let startX=0;
    const update=()=>{track.style.transform=`translateX(-${index*100}%)`;slides.forEach((s,i)=>{s.classList.toggle('carousel__slide-current',i===index);s.setAttribute('aria-hidden',String(i!==index));});};
    slides.forEach((s,i)=>{s.removeAttribute('target');s.setAttribute('aria-label',`Galeri ${carouselIndex+1}, foto ${i+1}`);s.addEventListener('click',e=>e.preventDefault());});
    const move=delta=>{index=(index+delta+slides.length)%slides.length;update();};
    track.style.removeProperty('display');update();
    if(!carousel.querySelector('.carousel__arrow')){
      const arrows=document.createElement('div');arrows.className='carousel__arrow';
      arrows.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>';carousel.append(arrows);
    }
    carousel.querySelectorAll('.carousel__arrow svg').forEach((arrow,i)=>{
      arrow.setAttribute('role','button');arrow.setAttribute('tabindex','0');arrow.setAttribute('aria-hidden','false');arrow.setAttribute('aria-label',i?'Foto berikutnya':'Foto sebelumnya');
      arrow.addEventListener('click',()=>move(i?1:-1));arrow.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();move(i?1:-1);}});
    });
    carousel.addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX;},{passive:true});
    carousel.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>40)move(dx<0?1:-1);},{passive:true});
  });
  document.querySelectorAll('.read-more-button').forEach(b=>b.addEventListener('click',()=>{
    const item=b.closest('.testimonial-item');
    show('<h2 id="demo-dialog-title">'+item.querySelector('.profile-name').textContent+'</h2><p>'+item.querySelector('.testimonial-content-text').textContent+'</p><p>'+item.querySelector('.profile-caption').textContent+'</p>');
  }));
  const testimonial=document.querySelector('.testimonial-carousel');
  if(testimonial){
    const items=[...testimonial.querySelectorAll('.testimonial-item')];let index=0;
    const update=()=>{const mobile=matchMedia('(max-width:767px)').matches;items.forEach((item,i)=>item.style.display=mobile&&i!==index?'none':'');testimonial.querySelectorAll('.carousel__pagination').forEach((b,i)=>{b.setAttribute('aria-current',String(i===index));b.classList.toggle('carousel__pagination-active',i===index);b.classList.toggle('carousel__pagination-inactive',i!==index);});};
    testimonial.querySelectorAll('.carousel__pagination').forEach((b,i)=>b.addEventListener('click',()=>{index=i;update();}));
    testimonial.querySelectorAll('.carousel__arrow svg').forEach((b,i)=>{b.setAttribute('role','button');b.setAttribute('aria-label',i?'Testimonial berikutnya':'Testimonial sebelumnya');b.setAttribute('aria-hidden','false');b.tabIndex=0;const move=()=>{index=(index+(i?1:-1)+items.length)%items.length;update();};b.addEventListener('click',move);b.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();move();}});});
    window.addEventListener('resize',update);update();
  }
  // Official SapaGo embed activates only with this client's public key.
  document.querySelectorAll('.wa_float_button').forEach(b=>b.classList.add('demo-replaced'));
  if(isReady){
    const script=document.createElement('script');script.src=config.scriptUrl;script.async=true;
    script.dataset.apiKey=config.publicKey;script.dataset.apiUrl=config.apiUrl;script.dataset.widgetUrl=config.widgetUrl;
    script.addEventListener('error',()=>{console.error('Widget Sapago gagal dimuat. Periksa koneksi dan konfigurasi.');mountPlaceholder(true);});
    document.body.append(script);
  }else mountPlaceholder(false);
  function mountPlaceholder(failed){
    const launcher=document.createElement('button');launcher.className='demo-widget-launcher';launcher.setAttribute('aria-label','Sapago untuk Substories');
    launcher.innerHTML='<span class="demo-widget-label">Sapago × Substories</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2v-9.5A8.5 8.5 0 0 1 10.5 4h2A8.5 8.5 0 0 1 21 11.5Z"/><path d="M7 10h9M7 14h6"/></svg>';
    launcher.addEventListener('click',()=>show(`<h2 id="demo-dialog-title">Sapago × Substories</h2><p>${failed?'Widget Sapago belum berhasil dimuat.':'Website demo sudah siap untuk widget Sapago.'}</p><p>${failed?'Periksa koneksi, URL embed, dan public key.':'Aktivasi chat menunggu public widget key khusus Substories.'}</p><p>Konfigurasi tersedia di <code>dist/sapago.config.js</code>.</p>`,'demo-widget-note'));
    document.body.append(launcher);
  }
})();
