import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { load } from 'cheerio';
const exec=promisify(execFile);
const root=new URL('../',import.meta.url);
const original=await fs.readFile(new URL('source/original.html',root),'utf8');
const $=load(original);
// Preserve the server-rendered page; replace the hosted application with a local runtime.
$('script, noscript, link[as="script"],link[rel="preconnect"],link[rel="dns-prefetch"]').remove();
const rendered=load(await fs.readFile(new URL('qa/original-rendered.html',root),'utf8'));
for(const href of new Set(rendered('link[rel=stylesheet]').map((i,e)=>rendered(e).attr('href')).get().filter(u=>u.includes('/_preview/')))) $('head').append(`<link rel="stylesheet" href="${href}">`);
$('title').text('Sapago x Substories Demo');
$('html').attr('lang','id');
$('head').append('<meta name="robots" content="noindex,nofollow"><link rel="stylesheet" href="/demo.css">');
$('body').append('<script src="/sapago.config.js"></script><script src="/demo.js" defer></script>');
const assets=new Map();
const canonical=url=>url.replace(/\/r_\d+\//,'/r_1200/');
function reserve(raw){
 let url=raw.replaceAll('&amp;','&');
 if(!/^https?:\/\//.test(url))return raw;
 url=canonical(url).replace('://asset.cdn.filesafe.space/','://assets.cdn.filesafe.space/').replace('://assets.cdn.filesafe.sace/','://assets.cdn.filesafe.space/').replace('://assets.cdn.filesaf.space/','://assets.cdn.filesafe.space/');
 if(!assets.has(url)){
  let ext=new URL(url).pathname.match(/\.(png|jpe?g|webp|svg|gif|ico|woff2?|ttf|css|pdf)$/i)?.[1]||'bin';
  if(url.includes('images.leadconnectorhq.com/image/f_webp'))ext='webp';
  if(url.includes('fonts.googleapis.com'))ext='css';
  assets.set(url,{url,path:`assets/${createHash('sha256').update(url).digest('hex').slice(0,16)}.${ext}`});
 }
 return '/'+assets.get(url).path;
}
function rewriteCSS(s){return s.replaceAll('url(ace/2o81UT6IaGFzTq4Dhp2l/media/69523b0073a5e01f538b9637.pn)', 'url(https://assets.cdn.filesafe.space/2o81UT6IaGFzTq4Dhp2l/media/69523b0073a5e01f538b9637.png)').replace(/url\(\s*(['"]?)(https?:\/\/[^)'"\s]+)\1\s*\)/g,(_,q,url)=>`url("${reserve(url)}")`);}
$('[src],[srcset],link[href]').each((i,el)=>{
 const e=$(el);
 if(el.name==='link' && !['stylesheet','icon','preload'].includes(e.attr('rel')))return;
 for(const attr of ['src','href']){
  const u=e.attr(attr);
  if(u&&/^https?:/.test(u)&&(attr==='src'||el.name==='link'))e.attr(attr,reserve(u));
 }
 const set=e.attr('srcset');
 if(set)e.attr('srcset',set.split(/,\s+(?=https?:)/).map(x=>{const [u,...rest]=x.split(/\s+/);return [reserve(u),...rest].join(' ')}).join(', '));
});
$('style').each((i,e)=>$(e).text(rewriteCSS($(e).text())));
$('[style]').each((i,e)=>$(e).attr('style',rewriteCSS($(e).attr('style'))));
await fs.mkdir(new URL('dist/assets/',root),{recursive:true});
const done=new Set();let failures=[];
while(true){
 const pending=[...assets.values()].filter(a=>!done.has(a.url));
 if(!pending.length)break;
 let ix=0;
 await Promise.all(Array.from({length:6},async()=>{
  while(ix<pending.length){
   const item=pending[ix++];done.add(item.url);
   const file=new URL('dist/'+item.path,root);
   try{
    await exec('curl',['-fLsS','--retry','2','--max-time','45','-A','Mozilla/5.0',item.url,'-o',fileURLToPath(file)],{maxBuffer:1024*1024});
    if(item.path.endsWith('.css')){
     const css=await fs.readFile(file,'utf8');await fs.writeFile(file,rewriteCSS(css));
    }
    item.bytes=(await fs.stat(file)).size;
   }catch(e){failures.push({url:item.url,error:e.message.slice(0,300)});}
  }
 }));
 console.log(`Assets processed: ${done.size}; failures: ${failures.length}`);
}
if(failures.length){console.log(JSON.stringify(failures,null,2));process.exitCode=1;}
await fs.writeFile(new URL('dist/index.html',root),$.html());
await fs.writeFile(new URL('source/asset-manifest.json',root),JSON.stringify({source:'https://business.substories.co.id/',capturedAt:new Date().toISOString(),assets:[...assets.values()],failures},null,2));
console.log('Saved local clone:',assets.size,'assets; sections:',$('.c-section').length);
