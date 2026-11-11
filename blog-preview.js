(()=>{"use strict";
const target=document.getElementById("blog-preview");
if(!target)return;
const el=(tag,name,text)=>{const n=document.createElement(tag);if(name)n.className=name;if(text!==undefined)n.textContent=text;return n};
fetch("./blogs.json",{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("Blog collection unavailable");return r.json()}).then(json=>{
 const posts=Array.isArray(json.posts)?json.posts.filter(x=>x&&typeof x.slug==="string"&&/^[a-z0-9-]+$/.test(x.slug)&&typeof x.title==="string"):[];
 posts.sort((a,b)=>String(b.date||"").localeCompare(String(a.date||"")));
 target.replaceChildren();
 if(!posts.length){
  const section=el("div","blog-empty-state");
  section.append(el("span","blog-empty-eyebrow","A SPACE FOR IDEAS"));
  section.append(el("h3","","The first essay is coming soon."));
  section.append(el("p","","Academic perspectives, research reflections and economic commentary will live here."));
  const link=el("a","blog-empty-link","VISIT BLOGS ↗");link.href="blogs.html";section.append(link);
  target.append(section);return;
 }
 for(const p of posts.slice(0,3)){
  const article=el("article","blog-story");
  article.append(el("span","blog-story-cat",p.category||"ACADEMIC NOTE"));
  const heading=el("h3");const anchor=el("a",null,p.title);
  anchor.href="blogs.html?post="+encodeURIComponent(p.slug);heading.append(anchor);article.append(heading);
  article.append(el("p","blog-story-excerpt",p.excerpt||""));
  const link=el("a","blog-story-read","READ ARTICLE ↗");link.href=anchor.href;article.append(link);
  target.append(article);
 }
}).catch(err=>{console.warn("Blog preview:",err);target.textContent="Blog posts are temporarily unavailable."});
})();