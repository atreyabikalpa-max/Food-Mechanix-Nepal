const {JSDOM,VirtualConsole}=require('jsdom');
const fs=require('fs');const path=require('path');const assert=require('node:assert/strict');
const base=path.resolve(__dirname,'../_site');const data=JSON.parse(fs.readFileSync(base+'/data/articles.json'));
async function page(file='index.html',query='',fail=false){
 const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(fs.readFileSync(base+'/'+file,'utf8'),{url:'https://example.github.io/fmn/'+file+query,runScripts:'outside-only',virtualConsole:vc});
 dom.window.fetch=async url=>{if(fail)throw Error('network unavailable');return {ok:true,json:async()=>JSON.parse(fs.readFileSync(path.join(base,url),'utf8'))}};dom.window.eval(fs.readFileSync(base+'/assets/js/app.js','utf8'));await new Promise(r=>setTimeout(r,25));assert.deepEqual(errors,[]);return dom;
}
(async()=>{
 let dom=await page(),d=dom.window.document;
 assert.ok(d.querySelector('.hero-card'));assert.equal(d.querySelectorAll('.story-item').length,12);assert.ok(!d.body.textContent.includes("TODAY'S LEAD STORY"));assert.equal(d.querySelector('.nav-link.selected').textContent,'Home');
 const ids=[...d.querySelectorAll('.hero-card h2 a,.side-item,.story-item h3 a')].map(a=>a.getAttribute('href'));assert.equal(new Set(ids).size,ids.length);
 d.querySelector('#search-toggle').click();assert.equal(d.querySelector('#search-bar').hidden,false);d.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape'}));assert.equal(d.querySelector('#search-bar').hidden,true);d.querySelector('#menu-toggle').click();assert.ok(d.querySelector('.nav').classList.contains('nav-open'));dom.window.close();
 for(const region of ['Nepal','World']){dom=await page('index.html','?region='+region);d=dom.window.document;assert.equal(d.querySelectorAll('.nav-link.selected').length,1);assert.equal(d.querySelector('.nav-link.selected').textContent,region==='Nepal'?'Nepal Focus':'Global News');assert.equal(d.querySelectorAll('.story-item').length,Math.min(12,data.articles.filter(a=>a.region===region).length));dom.window.close();}
 dom=await page('index.html','?q=rice');d=dom.window.document;assert.ok(d.querySelector('.listing-intro h1').textContent.includes('rice'));assert.ok(d.querySelectorAll('.story-item').length>0);dom.window.close();
 dom=await page('index.html','?q=%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E');d=dom.window.document;assert.equal(d.querySelector('.listing-intro h1 img'),null);assert.ok(d.querySelector('.empty-results'));dom.window.close();
 dom=await page('index.html','?category=All');d=dom.window.document;assert.equal(d.querySelectorAll('.story-item').length,12);d.querySelector('#show-more').click();assert.equal(d.querySelectorAll('.story-item').length,24);d.querySelector('#show-more').click();assert.equal(d.querySelectorAll('.story-item').length,data.articles.length);assert.equal(d.querySelector('#show-more'),null);dom.window.close();
 const first=data.articles[0];dom=await page('stories/'+first.id+'.html');d=dom.window.document;assert.equal(d.querySelector('.article-main h1').textContent,first.title);assert.equal(d.querySelector('.source-link').href,first.sourceUrl);assert.ok(d.querySelector('.article-actions a').href.includes('foodmechanixnepal%40gmail.com')||d.querySelector('.article-actions a').href.includes('foodmechanixnepal@gmail.com'));d.querySelector('#share-story').click();await new Promise(r=>setTimeout(r,5));assert.ok(d.querySelector('#share-status').textContent.includes('/fmn/stories/'));dom.window.close();
 dom=await page('article.html','?id='+first.id);assert.equal(dom.window.document.querySelector('.article-main h1').textContent,first.title);dom.window.close();
 dom=await page('article.html','?id=missing');assert.equal(dom.window.document.querySelector('main h1').textContent,'Story not found');dom.window.close();
 dom=await page('index.html','',true);assert.ok(dom.window.document.querySelector('[data-prerendered]'));assert.ok(dom.window.document.body.textContent.includes('Showing the saved edition'));dom.window.close();
 dom=await page('contact.html');assert.equal(dom.window.document.querySelector('main h1').textContent,'Contact & corrections');dom.window.close();
 console.log('DOM checks passed: home, unique lead/sidebar/latest links, region selection, search, escaped input, pagination, article source, share fallback, legacy URL, missing story, offline saved edition, menu/Escape, contact.');
})().catch(e=>{console.error(e);process.exitCode=1});
