(()=>{
"use strict";
const list=document.getElementById("blog-directory");
const detail=document.getElementById("blog-article");
if(!list||!detail)return;
const posts=[];const path=new URL(location.href).searchParams.get("post");
const formatDate=d=>{const x=new Date(String(d)+"T12:00:00Z");return Number.isNaN(x.getTime())?String(d):x.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"})};
const elt=(tag,cls,txt)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(txt!==undefined)x.textContent=txt;return x};
function renderList(){
 list.textContent="";
 if(!posts.length){
  const empty=elt("div","blog-empty-state");
  empty.append(elt("span","blog-empty-eyebrow","THE WRITING DESK"));
  empty.append(elt("h2","","New ideas are on the way."));
  empty.append(elt("p","","This space will feature original essays, research notes and reflections on economics and public policy."));
  list.append(empty);return;
 }
 posts.forEach(p=>{
  const card=elt("article","blog-story");
  card.append(elt("span","blog-story-cat",p.category||"ACADEMIC NOTE"));
  const h=elt("h2");const a=elt("a",null,p.title);a.href="blogs.html?post="+encodeURIComponent(p.slug);h.append(a);card.append(h);
  card.append(elt("p","blog-story-excerpt",p.excerpt||""));
  const footer=elt("div","blog-story-footer");
  footer.append(elt("span",null,formatDate(p.date)));
  const read=elt("a",null,"READ ARTICLE ↗");read.href=a.href;footer.append(read);card.append(footer);
  list.append(card);
 });
}
function renderArticle(p){
 list.hidden=true;detail.hidden=false;
 document.title=p.title+" — Fırat Cem Doğan";
 document.getElementById("blog-article-meta").textContent=(p.category||"ACADEMIC NOTE").toUpperCase()+" · "+formatDate(p.date);
 document.getElementById("blog-article-title").textContent=p.title;
 document.getElementById("blog-article-excerpt").textContent=p.excerpt||"";
 const body=document.getElementById("blog-article-body");body.textContent="";
 for(const paragraph of Array.isArray(p.content)?p.content:[]){
  if(typeof paragraph==="string"){body.append(elt("p",null,paragraph));continue;}
  if(!paragraph||typeof paragraph.text!=="string")continue;
  if(paragraph.type==="heading")body.append(elt("h3",null,paragraph.text));
  else if(paragraph.type==="quote")body.append(elt("blockquote",null,paragraph.text));
  else body.append(elt("p",null,paragraph.text));
 }
}
fetch("./blogs.json",{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("Blogs unavailable");return r.json()}).then(data=>{
 const entries=Array.isArray(data.posts)?data.posts:[];
 for(const item of entries)if(item&&typeof item.slug==="string"&&typeof item.title==="string"&&/^[a-z0-9-]+$/.test(item.slug))posts.push(item);
 posts.sort((a,b)=>String(b.date||"").localeCompare(String(a.date||"")));
 if(path){const p=posts.find(x=>x.slug===path);if(p){renderArticle(p);return}}
 renderList();
}).catch(err=>{console.warn(err);list.textContent="Blog articles are temporarily unavailable."});
})();