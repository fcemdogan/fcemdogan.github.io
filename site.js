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

/* Wikimedia Commons recordings: Chopin (Peter Johnston, CC0) and Beethoven
   (Juan Felipe Arjona, CC BY 2.5). Browsers may block audible autoplay until interaction. */
const pianoButton=q("#piano-toggle"),trackSelect=q("#music-track"),musicCredit=q("#music-credit");
const pianoTracks={
 chopin:{
  mp3:"https://upload.wikimedia.org/wikipedia/commons/transcoded/0/04/Chopin_Nocturne_No._2_in_E_Flat_Major%2C_Op._9.ogg/Chopin_Nocturne_No._2_in_E_Flat_Major%2C_Op._9.ogg.mp3",
  ogg:"https://upload.wikimedia.org/wikipedia/commons/0/04/Chopin_Nocturne_No._2_in_E_Flat_Major%2C_Op._9.ogg",
  description:"Frédéric Chopin, Nocturne No. 2 in E-flat major, Op. 9",
  performer:"Peter Johnston",license:"CC0",licenseUrl:"https://creativecommons.org/publicdomain/zero/1.0/",
  page:"https://commons.wikimedia.org/wiki/File:Chopin_Nocturne_No._2_in_E_Flat_Major,_Op._9.ogg"
 },
 beethoven:{
  mp3:"https://upload.wikimedia.org/wikipedia/commons/transcoded/f/f0/Moonlight.ogg/Moonlight.ogg.mp3",
  ogg:"https://upload.wikimedia.org/wikipedia/commons/f/f0/Moonlight.ogg",
  description:"Ludwig van Beethoven, Moonlight Sonata, 1st movement",
  performer:"Juan Felipe Arjona",license:"CC BY 2.5",licenseUrl:"https://creativecommons.org/licenses/by/2.5/",
  page:"https://commons.wikimedia.org/wiki/File:Moonlight.ogg"
 }
};
const pianoAudio=new Audio();pianoAudio.loop=true;pianoAudio.volume=.18;pianoAudio.preload="metadata";
pianoAudio.setAttribute("playsinline","");
let alternateAudio=false,wantsMusic=true,pausedByVisitor=false,startOnGesture=false,autoAttempted=false;
const currentTrack=()=>pianoTracks[trackSelect.value]||pianoTracks.chopin;
const musicState=(state)=>{
 pianoButton.setAttribute("aria-pressed",String(state==="playing"));
 const label=q("#piano-status");
 if(state==="playing"){label.textContent="PIANO ON";pianoButton.setAttribute("aria-label","Pause relaxing piano music");}
 else if(state==="loading"){label.textContent="LOADING…";pianoButton.setAttribute("aria-label","Relaxing piano is loading");}
 else if(state==="error"){label.textContent="MUSIC ERROR";pianoButton.setAttribute("aria-label","Piano recording unavailable");}
 else{label.textContent="PLAY PIANO";pianoButton.setAttribute("aria-label","Play relaxing Chopin or Beethoven piano");}
};
function loadTrack(restarting=false){
 const t=currentTrack();
 if(!restarting){alternateAudio=false;pianoAudio.pause();}
 const useOriginal=alternateAudio&&pianoAudio.canPlayType("audio/ogg");
 pianoAudio.src=useOriginal?t.ogg:t.mp3;
 pianoAudio.load();
 if(musicCredit)musicCredit.innerHTML="Music: "+t.description+" · "+t.performer+
  ' · <a href="'+t.page+'" target="_blank" rel="noopener noreferrer">recording ↗</a>'+
  ' (<a href="'+t.licenseUrl+'" target="_blank" rel="noopener noreferrer">'+t.license+"</a>) · Wikimedia Commons";
 musicState("paused");
}
async function attemptPianoPlayback(){
 if(!wantsMusic)return;
 try{
  musicState("loading");
  await pianoAudio.play();
  musicState("playing");
  startOnGesture=false;
 }catch(err){
  console.info("Piano sound requires a user gesture or a working audio connection:",err);
  startOnGesture=true;
  musicState("paused");
 }
}
pianoButton.addEventListener("click",()=>{
 if(!pianoAudio.paused){
  pausedByVisitor=true;wantsMusic=false;startOnGesture=false;
  pianoAudio.pause();musicState("paused");
 }else{
  pausedByVisitor=false;wantsMusic=true;attemptPianoPlayback();
 }
});
trackSelect.addEventListener("change",()=>{
 const shouldPlay=wantsMusic&&!pausedByVisitor;
 loadTrack();
 if(shouldPlay)attemptPianoPlayback();
});
pianoAudio.addEventListener("playing",()=>musicState("playing"));
pianoAudio.addEventListener("pause",()=>{if(pianoAudio.paused)musicState("paused")});
pianoAudio.addEventListener("error",()=>{
 if(!alternateAudio&&pianoAudio.canPlayType("audio/ogg")){
  alternateAudio=true;loadTrack(true);
  if(wantsMusic)attemptPianoPlayback();
 }else{
  musicState("error");
 }
});
/* A browser gesture can unblock an earlier automatic-play attempt.
   This listener is removed after the first attempt or when music is explicitly paused. */
function resumeMusicFromGesture(){
 if(!startOnGesture||pausedByVisitor)return;
 startOnGesture=false;
 attemptPianoPlayback();
}
document.addEventListener("pointerdown",resumeMusicFromGesture,{passive:true});
document.addEventListener("keydown",resumeMusicFromGesture);
loadTrack();
if(!autoAttempted){autoAttempted=true;attemptPianoPlayback();}

})();
