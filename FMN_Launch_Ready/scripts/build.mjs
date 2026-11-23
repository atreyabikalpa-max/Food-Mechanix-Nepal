import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {categories} from './update-news.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function validateArticles(data){
 if(!Array.isArray(data.articles))throw Error('articles.json must contain an articles array');
 const ids=new Set(),urls=new Set();
 for(const a of data.articles){
  if(!/^[-a-zA-Z0-9_]{1,100}$/.test(a.id||'')||ids.has(a.id))throw Error('Invalid or duplicate article ID: '+a.id);ids.add(a.id);
  for(const k of ['title','excerpt','summary','source','sourceUrl','publishedAt','image','imageCredit'])if(typeof a[k]!=='string'||!a[k].trim())throw Error(`Missing ${k} in ${a.id}`);
  const u=new URL(a.sourceUrl);if(!['https:','http:'].includes(u.protocol)||u.username||u.password||urls.has(u.href))throw Error('Invalid/duplicate source URL: '+a.id);urls.add(u.href);
  if(!Number.isFinite(+new Date(a.publishedAt))||+new Date(a.publishedAt)>Date.now()+86400000)throw Error('Invalid publication date: '+a.id);
  if(!categories.includes(a.category)||!['World','Nepal'].includes(a.region)||a.status!=='published')throw Error('Invalid classification: '+a.id);
  if(!/^assets\/images\/[-a-zA-Z0-9_./]+$/.test(a.image)||a.image.includes('..'))throw Error('Image must be a safe local path: '+a.id);
  if(!['illustration','photo'].includes(a.imageType))throw Error('Image type must be illustration or photo: '+a.id);
  if(a.imageType==='photo'&&!a.imageLicense)throw Error('Owned/licensed photo needs imageLicense: '+a.id);
 }
 return data.articles;
}
const date=iso=>new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Kathmandu'}).format(new Date(iso));
function brief(a){return `<article data-prerendered class="container policy-page"><div class="eyebrow">${esc(a.category)} · ${esc(a.jurisdiction||a.region)}</div><h1>${esc(a.title)}</h1><p>${esc(a.excerpt)}</p><p>${esc(a.source)} · <time datetime="${esc(a.publishedAt)}">${date(a.publishedAt)}</time></p><figure class="article-figure"><img src="${esc(a.image)}" alt="${a.imageType==='photo'?'Editorial photograph':'Illustration'} for ${esc(a.category)}"><figcaption>${esc(a.imageCredit)}</figcaption></figure><h2>News brief</h2><p>${esc(a.summary)}</p><p>This is a source-attributed digest. Read the original publisher’s report for full details and current information.</p><a class="source-link" href="${esc(a.sourceUrl)}" rel="noopener noreferrer" target="_blank">Read original at ${esc(a.source)} ↗</a><p><a href="mailto:foodmechanixnepal@gmail.com?subject=${encodeURIComponent('Correction: '+a.title)}">Report a correction</a></p></article>`;}
function archive(list){return `<section data-prerendered class="container policy-page"><div class="intro-label">THE FOOD JOURNAL</div><h1>Food industry news</h1><p>Source-linked briefs from Nepal and around the world.</p><div class="archive-list">${list.map(a=>`<article><div class="eyebrow">${esc(a.category)} · ${esc(a.region)}</div><h2><a href="stories/${a.id}.html">${esc(a.title)}</a></h2><p>${esc(a.excerpt)}</p><small>${esc(a.source)} · ${date(a.publishedAt)}</small></article>`).join('')||'<p>No reports are published yet. Check back after the next feed update.</p>'}</div></section>`;}
const policies={
 'about.html':{title:'About & editorial policy',body:`<p>Food Mechanix Nepal’s Food Journal helps readers follow food safety, farming, food business, policy and innovation in Nepal and worldwide.</p><h2>How we publish</h2><p>We curate short, dated briefs from named publishers and official sources. Each brief links to the original report. This is a news digest; attribution does not mean that FMN independently verified every claim. The original publication date is shown, including when an older story remains on the homepage.</p><p>Our importer checks approved RSS feeds every six hours when GitHub Actions is active. Feeds, publishers and scheduled runs can be delayed. The website shows the last check and retains the latest available edition.</p><h2>Editorial review</h2><p>Third-party reports involving recalls, illness, contamination, allegations and other sensitive claims are held for an editor. Official US FDA notices may appear as attributed US notices, without implying that a product is distributed in Nepal. Readers should follow the relevant official notice for exact affected products and current guidance.</p><h2>AI and images</h2><p>Some summaries may be assisted by AI, as labeled on the article. AI is used only to condense the supplied excerpt; it is not independent fact-checking. Bundled food images are AI-generated illustrations, not photographs of the reported events. Owned or licensed editorial photographs, when added, carry a separate credit.</p><h2>Corrections and independence</h2><p>We correct or withdraw misleading entries after review. Send the article link and supporting evidence to <a href="mailto:foodmechanixnepal@gmail.com">foodmechanixnepal@gmail.com</a>. Imported publisher text, photography and trademarks remain the property of their owners. Advertising or sponsored material should be clearly identified.</p>`},
 'contact.html':{title:'Contact & corrections',body:`<p>For editorial enquiries, corrections, image credits or permission concerns, contact Food Mechanix Nepal.</p><div class="contact-box"><strong>Email the newsroom</strong><br><a href="mailto:foodmechanixnepal@gmail.com">foodmechanixnepal@gmail.com</a></div><h2>Report a correction</h2><p>Include the FMN article link, the detail you believe is incorrect, and a link or document supporting the correction. For a rights concern, identify the work and your connection to it.</p><a class="source-link" href="mailto:foodmechanixnepal@gmail.com?subject=FMN%20editorial%20enquiry">Write to Food Mechanix Nepal ↗</a><h2>News sources</h2><p>Full reporting is available at the original publisher linked in each brief. For current food recall details, use the original official notice.</p>`},
 'privacy.html':{title:'Privacy',body:`<p>This edition does not include visitor accounts, advertising trackers, analytics scripts or a contact form. News search runs in your browser against the published article index. Search terms appear in the page URL and may be included in hosting requests or shared links.</p><h2>Hosting and external services</h2><p>The website is intended for GitHub Pages. The hosting provider processes connection information needed to deliver pages, such as IP addresses and request metadata. Fonts are loaded from Google Fonts, which receives requests from your browser. Linked publishers have their own privacy practices.</p><h2>Messages and sharing</h2><p>Email links open your email application. Information you send to foodmechanixnepal@gmail.com is used to respond to your enquiry or correction. The share button uses your device’s share menu or copies the article link when supported. This site does not store those shares.</p><h2>Changes and contact</h2><p>This notice describes the included website. Review it if you add analytics, forms, advertising or other services. Questions can be sent to <a href="mailto:foodmechanixnepal@gmail.com">foodmechanixnepal@gmail.com</a>.</p>`}
};
function setMain(html,body){return html.replace(/<main id="app"[^>]*>[\s\S]*?<\/main>/,`<main id="app" tabindex="-1">${body}</main>`);}
function title(html,t){return html.replace(/<title>[\s\S]*?<\/title>/,`<title>${esc(t)} | Food Mechanix Nepal</title>`);}
export async function build({directory=root,siteUrl=process.env.SITE_URL||''}={}){
 const site=JSON.parse(await fs.readFile(path.join(directory,'data/site.json'),'utf8'));
 if(!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(site.email||''))throw Error('Set a valid public contact email in data/site.json');
 const data=JSON.parse(await fs.readFile(path.join(directory,'data/articles.json'),'utf8'));
 const list=validateArticles(data).sort((a,b)=>+new Date(b.publishedAt)-+new Date(a.publishedAt));
 for(const a of list)await fs.access(path.join(directory,a.image));
 let base='';if(siteUrl){const u=new URL(siteUrl);if(u.protocol!=='https:'&&u.hostname!=='localhost')throw Error('SITE_URL must use HTTPS');base=u.href.replace(/\/?$/,'/');}
 const output=path.join(directory,'_site');await fs.rm(output,{recursive:true,force:true});await fs.mkdir(path.join(output,'stories'),{recursive:true});await fs.mkdir(path.join(output,'data'),{recursive:true});
 await fs.cp(path.join(directory,'assets'),path.join(output,'assets'),{recursive:true});
 for(const n of ['articles.json','status.json','site.json'])await fs.copyFile(path.join(directory,'data',n),path.join(output,'data',n));
 const raw=await fs.readFile(path.join(directory,'index.html'),'utf8');
 let shell=raw.replace('<main id="app"','<div class="container feed-status" id="feed-status" role="status">Source-attributed news · original publication dates shown below.</div><main id="app"');
 function meta(html,url,description){let tags=`<meta property="og:site_name" content="Food Mechanix Nepal"><meta property="og:description" content="${esc(description)}"><meta name="twitter:card" content="summary_large_image">`;if(base)tags+=`<link rel="canonical" href="${esc(new URL(url,base).href)}"><meta property="og:url" content="${esc(new URL(url,base).href)}"><meta property="og:image" content="${esc(new URL('assets/images/fmn-logo.png',base).href)}">`;return html.replace('</head>',tags+'</head>');}
 await fs.writeFile(path.join(output,'index.html'),meta(setMain(shell,archive(list)),'','Food industry news from Nepal and worldwide.'));
 const articleShell=await fs.readFile(path.join(directory,'article.html'),'utf8');
 await fs.writeFile(path.join(output,'article.html'),articleShell);
 for(const a of list){
  let html=articleShell.replace('<head>','<head><base href="../">').replace('<body>','<body data-story-id="'+a.id+'">');
  html=title(setMain(html,brief(a)),a.title).replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${esc(a.excerpt)}">`);
  html=meta(html,`stories/${a.id}.html`,a.excerpt).replace('</head>',`<meta property="og:title" content="${esc(a.title)}"><meta property="og:type" content="article"></head>`);
  await fs.writeFile(path.join(output,'stories',a.id+'.html'),html);
 }
 for(const [file,p] of Object.entries(policies)){let html=shell.replace('<body>','<body data-page="static">').replace(/<div class="container feed-status"[^>]*>[\s\S]*?<\/div>/,'');html=title(setMain(html,`<article class="container policy-page"><div class="intro-label">FOOD MECHANIX NEPAL</div><h1>${esc(p.title)}</h1>${p.body}</article>`),p.title);await fs.writeFile(path.join(output,file),meta(html,file,p.title));}
 let archivePage=shell.replace('<body>','<body data-page="static">');await fs.writeFile(path.join(output,'archive.html'),title(setMain(archivePage,archive(list)),'News archive'));
 const notFound=title(setMain(shell.replace('<body>','<body data-page="static">'),'<section class="container error"><h1>Page not found</h1><p>The address may have changed.</p><a href="./">Return to the newsroom</a></section>'),'Page not found').replace('<head>',base?`<head><base href="${esc(base)}">`:'<head>');
 await fs.writeFile(path.join(output,'404.html'),notFound);await fs.writeFile(path.join(output,'.nojekyll'),'');
 // Relative URLs in RSS remain usable in previews; production workflow supplies the real Pages URL.
 const absolute=url=>base?new URL(url,base).href:url;
 await fs.writeFile(path.join(output,'feed.xml'),`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Food Mechanix Nepal</title><link>${esc(absolute(''))}</link><description>Source-attributed food industry briefs</description>${list.slice(0,50).map(a=>`<item><title>${esc(a.title)}</title><link>${esc(absolute('stories/'+a.id+'.html'))}</link><guid isPermaLink="false">${esc(a.id)}</guid><pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate><description>${esc(a.excerpt+' Source: '+a.source+'. '+a.sourceUrl)}</description></item>`).join('')}</channel></rss>`);
 if(base){const pages=['','about.html','contact.html','privacy.html','archive.html',...list.map(a=>'stories/'+a.id+'.html')];await fs.writeFile(path.join(output,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(p=>`<url><loc>${esc(absolute(p))}</loc></url>`).join('')}</urlset>`);}
 // GitHub project sites share an origin; robots.txt at a project path is not an origin-wide policy.
 // Compile the public contact address from one editable configuration file.
 const htmlFiles=[...['index.html','article.html','about.html','contact.html','privacy.html','archive.html','404.html'],...list.map(a=>'stories/'+a.id+'.html')];
 for(const f of htmlFiles){const file=path.join(output,f);const content=await fs.readFile(file,'utf8');await fs.writeFile(file,content.replaceAll('foodmechanixnepal@gmail.com',site.email));}
 const appFile=path.join(output,'assets/js/app.js');await fs.writeFile(appFile,(await fs.readFile(appFile,'utf8')).replaceAll('foodmechanixnepal@gmail.com',site.email));
 console.log(`Built ${list.length} static story pages, homepage, archive, policies, RSS${base?' and sitemap':''}.`);
 return {output,count:list.length};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))try{await build();}catch(e){console.error(e.message);process.exitCode=1;}
