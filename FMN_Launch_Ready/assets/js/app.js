/* Food Mechanix Nepal — static newsroom. No API keys or private credentials in the browser. */
(() => {
  'use strict';
  const app = document.getElementById('app');
  const params = new URLSearchParams(location.search);
  const onArticle = /article\.html$/i.test(location.pathname) || !!document.body.dataset.storyId;
  const staticPage = document.body.dataset.page === 'static';
  const storyId = document.body.dataset.storyId || params.get('id');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const safeLink = value => { try {const u = new URL(value);return ['https:','http:'].includes(u.protocol)?u.href:'#'} catch {return '#'} };
  const date = iso => { const d = new Date(iso); return Number.isNaN(+d) ? 'Date unavailable' : new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'Asia/Kathmandu'}).format(d) };
  const href = a => `stories/${encodeURIComponent(a.id)}.html`;
  const pic = a => /^assets\/images\/[-a-zA-Z0-9_./]+$/.test(a.image || '') && !a.image.includes('..') ? a.image : (a.category === 'Agriculture' || a.region==='Nepal' ? 'assets/images/nepal-market.webp' : a.category === 'Food Safety' ? 'assets/images/food-processing.webp' : a.category === 'Food Business' ? 'assets/images/restaurant-kitchen.webp' : 'assets/images/grain-and-bread.webp');
  function storyCard(a) { return `<article class="story-item"><a class="story-image" href="${href(a)}"><span class="image-label">${a.imageType==='photo'?'EDITORIAL PHOTO':'ILLUSTRATION'}</span><img loading="lazy" src="${esc(pic(a))}" alt="Illustrative food-industry image for ${esc(a.category)}"></a><div class="eyebrow">${esc(a.category)} <span class="bullet"></span>${esc(a.region)}</div><h3><a href="${href(a)}">${esc(a.title)}</a></h3><p>${esc(a.excerpt)}</p><div class="meta"><span>${esc(a.source)}</span><span class="dot"></span><span>${date(a.publishedAt)}</span></div></article>` }
  function heroAside(a) { return `<a href="${href(a)}" class="side-item"><img loading="lazy" src="${esc(pic(a))}" alt="Illustrative food industry photograph"><div><div class="eyebrow">${esc(a.category)}</div><h3>${esc(a.title)}</h3><div class="meta">${esc(a.source)} <span class="dot"></span>${date(a.publishedAt)}</div></div></a>` }
  function head(title, italic, kicker, link) { return `<div class="section-head"><div><div class="section-kicker">${esc(kicker)}</div><h2>${esc(title)} <em>${esc(italic)}</em></h2></div>${link ? `<a href="${link}">EXPLORE ALL <span>↗</span></a>` : ''}</div>` }
  function renderHome(list) {
    const items = list.slice().sort((a,b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
    const primary = items[0];
    const secondary = items.slice(1,4);
    const latest = items.slice(4,10);
    const nepal = items.filter(a=>a.region==='Nepal'); const nep = nepal[0];
    app.innerHTML = `<section class="container front-intro"><div><div class="intro-label">NEPAL'S FOOD INDUSTRY NEWS DESK</div><h1>Food news.<br><em>Fresh perspectives.</em></h1></div><p>Your briefing on what matters in food — from local farms and markets to food safety, hospitality, and innovation worldwide.</p></section>
    <section class="container hero"><article class="hero-card"><a class="hero-image" href="${href(primary)}"><img src="${esc(pic(primary))}" alt="Illustrative image of food industry news"><span class="image-label hero-image-label">${primary.imageType==='photo'?'EDITORIAL PHOTO':'ILLUSTRATION'}</span><span class="hero-tag">LEAD STORY · ${date(primary.publishedAt)}</span></a><div class="hero-info"><div class="eyebrow">${esc(primary.category)}<span class="bullet"></span>${esc(primary.region)} NEWS</div><h2><a href="${href(primary)}">${esc(primary.title)}</a></h2><p>${esc(primary.excerpt)}</p><div class="meta">${esc(primary.source)} <span class="dot"></span> ${date(primary.publishedAt)} <span class="dot"></span> SOURCE-ATTRIBUTED BRIEF</div></div></article>
    <aside class="hero-side"><div class="side-heading"><span>MORE FROM THE NEWSROOM</span><span>${secondary.length} STORIES</span></div>${secondary.map(heroAside).join('')}</aside></section>
    ${latest.length ? `<section class="stories container" id="latest">${head('Latest from', 'the food world.', 'THE LATEST DISPATCHES','./?category=All')}<div class="story-grid">${latest.map(storyCard).join('')}</div></section>` : ''}
    ${nep ? `<section class="nepal-band"><div class="container nepal-inner"><div><div class="nepal-kicker">FROM OUR BACKYARD / NEPAL</div><h2>A closer look<br>at <em>Nepal's food story.</em></h2><p>Local producers, agriculture, markets and policy — the developments shaping Nepal's food economy, in one dedicated section.</p><a class="outline-link" href="./?region=Nepal">EXPLORE NEPAL COVERAGE ↗</a></div><a class="nepal-feature" href="${href(nep)}"><img loading="lazy" src="${esc(pic(nep))}" alt="Illustrative image associated with Nepal food news"><div class="nepal-caption"><span>NEPAL FOCUS / ${date(nep.publishedAt)}</span><b>${esc(nep.title)}</b></div></a></div></section>` : ''}
    ${items.length>10 ? `<section class="container stories">${head('More stories,', 'more insight.', 'INSIDE THE INDUSTRY', './?category=All')}<div class="story-grid">${items.slice(10,16).map(storyCard).join('')}</div></section>` : ''}
    <section class="container topics">${head('Explore by', 'sector.', 'DISCOVER THE FOOD JOURNAL','')}<div class="topic-links">${[['Food Safety','01 / QUALITY'],['Agriculture','02 / PRODUCTION'],['Food Business','03 / MARKETS'],['Food Innovation','04 / FUTURE'],['Food Policy','05 / REGULATION']].map(([c,k])=>`<a class="topic" href="./?category=${encodeURIComponent(c)}"><span>${k}</span><strong>${c}</strong><i>↗</i></a>`).join('')}</div></section><div class="container small-note">Editorial images are illustrative, not photographs of specific news events.</div>`;
    const breaking=document.getElementById('breaking-text');if(breaking)breaking.textContent=primary.title;
    const link=document.getElementById('breaking-link');if(link){link.href=href(primary);link.innerHTML='READ STORY ↗';}
  }
  function renderListing(list) {
    const cat=params.get('category'), region=params.get('region'), query=(params.get('q')||'').trim().toLowerCase();
    const matches=list.filter(a => (!cat||cat==='All'||a.category===cat) && (!region||a.region===region) && (!query||[a.title,a.excerpt,a.source,a.category,a.region].join(' ').toLowerCase().includes(query))).sort((a,b)=>+new Date(b.publishedAt)-+new Date(a.publishedAt));
    const title = query?`Search: “${esc(params.get('q'))}”`:cat&&cat!=='All'?esc(cat)+' news':region==='Nepal'?'Nepal food watch':region==='World'?'Global food news':'All food news';
    document.title = `${title.replace(/&[a-z]+;/g,'')} | Food Mechanix Nepal`;
    app.innerHTML = `<div class="container listing-intro"><div class="intro-label">THE FOOD JOURNAL / ALL COVERAGE</div><h1>${title}</h1><p>${matches.length} source-attributed news ${matches.length===1?'brief':'briefs'} available.</p></div><section class="container listing-grid"><div class="story-grid" id="results">${matches.slice(0,12).map(storyCard).join('')}</div>${matches.length>12?'<div class="more-wrap"><button id="show-more" class="more">LOAD MORE STORIES ↓</button></div>':''}${!matches.length?'<div class="empty-results"><h3>No matching news yet.</h3><p>Try another food topic or explore all headlines.</p><a href="./">← Back to the homepage</a></div>':''}</section>`;
    let count=12;const more=document.getElementById('show-more');if(more)more.addEventListener('click',()=>{count+=12;document.getElementById('results').innerHTML=matches.slice(0,count).map(storyCard).join('');if(count>=matches.length)more.remove()});
  }
  function renderArticle(list) {
    const a=list.find(x=>x.id===storyId);
    if(!a){app.innerHTML='<div class="container error"><h1>Story not found</h1><p>This brief may have been removed or the link is incorrect.</p><a href="./">Return to the newsroom ↗</a></div>';return;}
    document.title=a.title+' | Food Mechanix Nepal';
    const related=list.filter(x=>x.id!==a.id&&(x.category===a.category||x.region===a.region)).slice(0,4);
    const summary=a.summary||a.excerpt;
    app.innerHTML=`<div class="container article-wrap"><div class="breadcrumb"><a href="./">Home</a><span>/</span><a href="./?category=${encodeURIComponent(a.category)}">${esc(a.category)}</a><span>/</span>News brief</div><div class="article-layout"><article class="article-main"><div class="eyebrow">${esc(a.category)} <span class="bullet"></span>${esc(a.jurisdiction || a.region)} NEWS</div><h1>${esc(a.title)}</h1><p class="standfirst">${esc(a.excerpt)}</p><div class="article-author"><div class="avatar">FMN</div><div><b>Food Mechanix Nepal · News Desk</b><small>Based on ${esc(a.source)} · ${date(a.publishedAt)} · ${a.aiAssisted?'AI-assisted summary':'Source-attributed brief'}</small></div></div><figure class="article-figure"><img src="${esc(pic(a))}" alt="Illustrative editorial image of ${esc(a.category)}"><figcaption>${esc(a.imageCredit || 'Illustrative editorial image; not the actual reported event.')}</figcaption></figure><div class="article-actions"><button type="button" id="share-story">Share story</button><a href="mailto:foodmechanixnepal@gmail.com?subject=${encodeURIComponent('Correction: '+a.title)}">Report a correction</a><span id="share-status" role="status"></span></div><div class="article-copy"><h2>News brief</h2><p>${esc(summary)}</p><div class="source-note"><b>Editorial note:</b> This is a short, attributed summary for discovery and context, not a reproduction of the original report or independent verification by FMN. For exact details, corrections, and current advice (especially food recalls), check the original publisher.</div><h2>Read the full report</h2><p>The original article contains the full reporting and source context. It opens on the publisher’s website.</p><a class="source-link" href="${esc(safeLink(a.sourceUrl))}" rel="noopener noreferrer external" target="_blank">READ ORIGINAL ON ${esc(a.source.toUpperCase())} ↗</a></div></article><aside class="article-aside"><div class="aside-heading">RELATED FOOD STORIES</div>${related.map(x=>`<a href="${href(x)}" class="related"><span class="eyebrow">${esc(x.category)}</span><h3>${esc(x.title)}</h3><small>${esc(x.source)} · ${date(x.publishedAt)}</small></a>`).join('')}<div class="side-info"><h3>Facts before feeds.</h3><p>FMN's automated newsroom imports and summarizes trusted publishers while keeping the original source visible. AI-assisted summaries do not equal independent fact-checking.</p></div></aside></div></div>`;
    document.getElementById('share-story').addEventListener('click',async()=>{const url=new URL(href(a),document.baseURI).href;const status=document.getElementById('share-status');try{if(navigator.share)await navigator.share({title:a.title,url});else if(navigator.clipboard){await navigator.clipboard.writeText(url);status.textContent='Link copied';}else status.textContent=url;}catch(e){if(e.name!=='AbortError')status.textContent=url;}});
  }
  function setup() {
    document.getElementById('year').textContent=new Date().getFullYear();
    const d=document.getElementById('today-date');if(d)d.textContent=new Intl.DateTimeFormat('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Kathmandu'}).format(new Date());
    const searchToggle=document.getElementById('search-toggle'), searchBar=document.getElementById('search-bar'), menu=document.getElementById('menu-toggle'),nav=document.querySelector('.nav');
    searchToggle.addEventListener('click',()=>{searchBar.hidden=!searchBar.hidden;searchToggle.setAttribute('aria-expanded',String(!searchBar.hidden));if(!searchBar.hidden)document.getElementById('search-input').focus()});
    menu.addEventListener('click',()=>{nav.classList.toggle('nav-open');menu.setAttribute('aria-expanded',String(nav.classList.contains('nav-open')))});
    document.getElementById('search-form').addEventListener('submit',e=>{e.preventDefault();const s=document.getElementById('search-input').value.trim();if(s)location.href=`./?q=${encodeURIComponent(s)}`});
    const region=params.get('region'),category=params.get('category');
    document.querySelectorAll('.nav-link').forEach(link=>{const u=new URL(link.href);const selected=!onArticle&&!staticPage&&!params.has('q')&&(region?u.searchParams.get('region')===region:category&&category!=='All'?u.searchParams.get('category')===category:!u.search);link.classList.toggle('selected',selected);if(selected)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){searchBar.hidden=true;searchToggle.setAttribute('aria-expanded','false');nav.classList.remove('nav-open');menu.setAttribute('aria-expanded','false');}});
  }
  setup();
  if(staticPage)return;
  const banner=document.getElementById('feed-status');
  if(banner)fetch('data/status.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(s=>{
    const checked=s.checkedAt?new Date(s.checkedAt):null;
    const stamp=checked&&!Number.isNaN(+checked)?new Intl.DateTimeFormat('en-GB',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Kathmandu'}).format(checked)+' NPT':null;
    const stale=!checked||Date.now()-+checked>18*3600000;
    banner.textContent=s.state==='error'?'News updates are delayed. Showing the last available reports.':s.state==='not-run'?'Source-linked news briefs. Automatic updates begin after deployment.':stale?'Last feed check: '+(stamp||'unavailable')+'. Updates may be delayed.':'Feeds checked '+stamp+(s.state==='partial'?' · Some sources are temporarily unavailable.':'');
    banner.classList.toggle('status-delayed',stale||s.state==='error');
  }).catch(()=>{banner.textContent='Feed update status is unavailable. Article dates are shown on every story.';});
  fetch('data/articles.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw new Error('No article data');return r.json()}).then(data=>{
    const list=Array.isArray(data.articles)?data.articles.filter(a=>a.status==='published'&&/^[-a-zA-Z0-9_]+$/.test(a.id||'')&&a.title&&a.source&&a.sourceUrl&&Number.isFinite(+new Date(a.publishedAt))):[];
    if(!list.length && !onArticle){app.innerHTML='<div class="container error"><h1>No headlines published yet</h1><p>The next scheduled news import will populate this newsroom.</p></div>';return}
    if(onArticle)renderArticle(list);else if(params.has('category')||params.has('region')||params.has('q'))renderListing(list);else renderHome(list);
  }).catch(e=>{console.error(e);if(app.querySelector('[data-prerendered]')){const note=document.createElement('p');note.className='container source-note';note.textContent='Live index unavailable. Showing the saved edition.';app.prepend(note);return;}app.innerHTML='<div class="container error"><h1>News feed is temporarily unavailable</h1><p>Could not load the story index. Please try reloading this page.</p><a href="./">Retry ↗</a></div>'});
})();
