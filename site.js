(()=>{"use strict";
const q=s=>document.querySelector(s);const facultyPhoto=document.querySelector(".portrait img");if(facultyPhoto)facultyPhoto.addEventListener("error",()=>{const fallback=facultyPhoto.dataset.fallbackSrc;if(fallback&&facultyPhoto.src!==fallback){facultyPhoto.src=fallback;return;}facultyPhoto.style.display="none";facultyPhoto.closest(".portrait").setAttribute("title","University portrait unavailable. See the official HKÜ profile.");});let pubs=[],courses=[];const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
async function load(path,backup){for(const x of [path,backup])try{let r=await fetch(x,{cache:"no-store"});if(!r.ok)continue;let j=await r.json(),a=Array.isArray(j)?j:j.items;if(Array.isArray(a)&&a.length)return a}catch(e){console.warn(x,e)}return []}

function pubView(){
 const term=q("#pubsearch").value.toLocaleLowerCase().trim(), chosenYear=q("#yearfilter").value;
 const matched=pubs.filter(p=>(chosenYear==="all"||String(p.year)===chosenYear)&&
  (String(p.title)+" "+String(p.journal)+" "+String(p.authors||"")).toLocaleLowerCase().includes(term));
 const annual=new Map();
 for(const p of pubs)annual.set(p.year,(annual.get(p.year)||0)+1);
 const years=[...annual.keys()].sort((a,b)=>a-b),max=Math.max(1,...annual.values());
 const latestYear=years.length?years[years.length-1]:"—";
 q("#pub-metrics").innerHTML=
  '<div class="pub-metric"><span>LISTED PUBLICATIONS</span><strong>'+pubs.length+'</strong><small>DOI-linked academic records</small></div>'+
  '<div class="pub-metric"><span>PUBLICATION YEARS</span><strong>'+years.length+'</strong><small>Years represented in this list</small></div>'+
  '<div class="pub-metric"><span>MOST RECENT YEAR</span><strong>'+latestYear+'</strong><small>Latest year in these records</small></div>';
 q("#pub-year-bars").innerHTML=years.map(year=>{
  const count=annual.get(year),height=Math.max(22,Math.round(count/max*168)),active=chosenYear===String(year);
  return '<button class="pub-year-col'+(active?' is-active':'')+'" type="button" data-pub-year="'+year+
   '" aria-pressed="'+String(active)+'" title="Show '+count+' publication'+(count===1?'':'s')+' from '+year+
   '"><span class="pub-year-value">'+String(count).padStart(2,"0")+'</span>'+
   '<span class="pub-year-pillar-wrap"><span class="pub-year-pillar" style="height:'+height+'px">'+
   '<span class="pub-pillar-shine"></span></span></span>'+
   '<span class="pub-year-label">'+year+'</span></button>';
 }).join("");
 const grouped=new Map();for(const p of matched){if(!grouped.has(p.year))grouped.set(p.year,[]);grouped.get(p.year).push(p);}
 q("#publication-list").innerHTML=[...grouped.entries()].map(([year,items])=>
  '<section class="pub-era" aria-label="Publications from '+year+'">'+
   '<div class="pub-era-heading"><strong>'+year+'</strong><span>'+items.length+' '+(items.length===1?'WORK':'WORKS')+'</span></div>'+
   '<div class="pub-era-items">'+items.map(p=>{
    const doi=/^10\.\d{4,9}\/\S+$/.test(p.doi||"")?"https://doi.org/"+encodeURI(p.doi):null;
    return '<article class="pub-card"><div class="pub-card-meta"><span class="pub-kind">JOURNAL ARTICLE</span><span>'+esc(p.journal||"Journal")+'</span></div>'+
     '<h3>'+esc(p.title)+'</h3><p>'+esc(p.authors||"")+'</p>'+
     (doi?'<a class="pub-doi" target="_blank" rel="noopener noreferrer" href="'+doi+'">VIEW PUBLICATION <span aria-hidden="true">↗</span></a>':'')+
     '</article>';
   }).join("")+'</div></section>'
 ).join("")||'<p class="placeholder">No matching publications found. Try another search or year.</p>';
 q("#pubstatus").textContent=matched.length+" of "+pubs.length+
  " listed works shown · visual summaries use the records available on this site";
}
q("#pub-year-bars").addEventListener("click",e=>{
 const target=e.target.closest("button[data-pub-year]");
 if(!target)return;
 const yr=target.dataset.pubYear,selector=q("#yearfilter");
 selector.value=selector.value===yr?"all":yr;
 pubView();
});
function courseView(){let y=q("#courseyear").value,a=courses.filter(c=>y==="all"||c.academic_year===y);q("#course-list").innerHTML=a.map((c,i)=>'<div class="course"><span>'+String(i+1).padStart(2,"0")+'</span><div><strong>'+esc(c.title_en||c.title_tr)+'</strong><small>'+esc(c.level_en||c.level_tr)+'</small></div><span class="course-year">'+esc(c.academic_year)+'</span></div>').join("")||'<p class="placeholder">No courses found.</p>';q("#course-count").innerHTML=courses.length+"<span>.</span>";q("#coursestatus").textContent=a.length+" teaching records shown · HKÜ"}
(async()=>{pubs=(await load("./data/live-publications.json","./publications.json")).filter(p=>p.title&&Number.isInteger(p.year)).sort((a,b)=>b.year-a.year);let years=[...new Set(pubs.map(p=>p.year))].sort((a,b)=>b-a);q("#yearfilter").innerHTML='<option value="all">ALL YEARS</option>'+years.map(y=>'<option value="'+y+'">'+y+'</option>').join("");pubView();courses=await load("./data/live-courses.json","./courses.json");let yrs=[...new Set(courses.map(c=>c.academic_year))].sort().reverse();q("#courseyear").innerHTML='<option value="all">ALL ACADEMIC YEARS</option>'+yrs.map(y=>'<option value="'+esc(y)+'">'+esc(y)+'</option>').join("");courseView()})();
q("#pubsearch").addEventListener("input",pubView);q("#yearfilter").addEventListener("change",pubView);q("#courseyear").addEventListener("change",courseView);
let menu=q("#menu");q("#menubtn").addEventListener("click",()=>{let o=menu.classList.toggle("open");q("#menubtn").setAttribute("aria-expanded",String(o))});menu.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{menu.classList.remove("open");q("#menubtn").setAttribute("aria-expanded","false")}));

const musicButton=q("#piano-toggle"), musicSelect=q("#music-track");
const musicPanel=q("#music-player"), musicVideo=q("#music-video"), musicSource=q("#music-source");
if(musicButton && musicSelect && musicPanel && musicVideo && musicSource){
 function showMusic(){
  const track=musicSelect.selectedOptions[0];
  const params=new URLSearchParams({autoplay:"1",playsinline:"1",loop:"1",playlist:track.value});
  if(track.dataset.start)params.set("start",track.dataset.start);
  const frame=document.createElement("iframe");
  frame.src="https://www.youtube-nocookie.com/embed/"+track.value+"?"+params;
  frame.title="YouTube music player: "+track.textContent;
  frame.allow="autoplay; encrypted-media; picture-in-picture; fullscreen";
  frame.referrerPolicy="strict-origin-when-cross-origin";
  musicSource.href="https://www.youtube.com/watch?v="+track.value+(track.dataset.start?"&t="+track.dataset.start+"s":"");
  musicVideo.replaceChildren(frame);
  musicPanel.hidden=false;
  musicButton.setAttribute("aria-expanded","true");
 }
 function closeMusic(){
  musicVideo.replaceChildren();
  musicPanel.hidden=true;
  musicButton.setAttribute("aria-expanded","false");
  musicButton.focus();
 }
 musicButton.addEventListener("click",()=>musicPanel.hidden?showMusic():closeMusic());
 musicSelect.addEventListener("change",()=>{if(!musicPanel.hidden)showMusic()});
 q("#music-close").addEventListener("click",closeMusic);
}
})();
