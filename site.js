(()=>{"use strict";
const q=s=>document.querySelector(s);const facultyPhoto=document.querySelector(".portrait img");if(facultyPhoto)facultyPhoto.addEventListener("error",()=>{const fallback=facultyPhoto.dataset.fallbackSrc;if(fallback&&facultyPhoto.src!==fallback){facultyPhoto.src=fallback;return;}facultyPhoto.style.display="none";facultyPhoto.closest(".portrait").setAttribute("title","University portrait unavailable. See the official HKÜ profile.");});let pubs=[],courses=[];const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
async function load(path,backup){for(const x of [path,backup])try{let r=await fetch(x,{cache:"no-store"});if(!r.ok)continue;let j=await r.json(),a=Array.isArray(j)?j:j.items;if(Array.isArray(a)&&a.length)return a}catch(e){console.warn(x,e)}return []}

function pubView(){
 const term=q("#pubsearch").value.toLocaleLowerCase().trim(), chosenYear=q("#yearfilter").value;
 const matched=pubs.filter(p=>(chosenYear==="all"||String(p.year)===chosenYear)&&
  (String(p.title)+" "+String(p.journal)+" "+String(p.authors||"")).toLocaleLowerCase().includes(term));
 const annual=new Map();
 for(const p of pubs)annual.set(p.year,(annual.get(p.year)||0)+1);
 const years=[...annual.keys()].sort((a,b)=>b-a),max=Math.max(1,...annual.values());
 q("#pub-metrics").innerHTML=
  '<div class="pub-metric"><span>LISTED PUBLICATIONS</span><strong>'+pubs.length+'</strong><small>DOI-linked academic records</small></div>'+
  '<div class="pub-metric"><span>PUBLICATION YEARS</span><strong>'+years.length+'</strong><small>Years represented in this list</small></div>'+
  '<div class="pub-metric"><span>MOST RECENT YEAR</span><strong>'+(years[0]||"—")+'</strong><small>Latest year in these records</small></div>';
 q("#pub-year-bars").innerHTML=years.map(year=>{
  const count=annual.get(year),width=Math.max(9,Math.round(count/max*100));
  return '<button class="pub-year-row'+(chosenYear===String(year)?' is-active':'')+
   '" type="button" data-pub-year="'+year+'" aria-pressed="'+String(chosenYear===String(year))+
   '" aria-label="Filter to '+year+', '+count+' listed works"><span class="pub-bar-label">'+year+'</span>'+
   '<span class="pub-bar-track"><span class="pub-bar-fill" style="width:'+width+'%"></span></span>'+
   '<span class="pub-bar-count">'+count+'</span></button>';
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

/* Piano performances from Wikimedia Commons: Chopin (CC0, Peter Johnston) and
   Beethoven (CC BY 2.5, Juan Felipe Arjona). MP3 transcoded by Wikimedia Commons.
   Play at low volume and loop. Autoplay is attempted but may be browser-blocked. */
const pianoButton=q("#piano-toggle");
const trackSelect=q("#music-track");
const musicCredit=q("#music-credit");
const pianoTracks={
 chopin:{
  url:"https://upload.wikimedia.org/wikipedia/commons/transcoded/0/04/Chopin_Nocturne_No._2_in_E_Flat_Major%2C_Op._9.ogg/Chopin_Nocturne_No._2_in_E_Flat_Major%2C_Op._9.ogg.mp3",
  description:"Frédéric Chopin, Nocturne in E-flat major, Op. 9 No. 2",
  performer:"Peter Johnston",license:"CC0",
  page:"https://commons.wikimedia.org/wiki/File:Chopin_Nocturne_No._2_in_E_Flat_Major,_Op._9.ogg",
  licenseUrl:"https://creativecommons.org/publicdomain/zero/1.0/"
 },
 beethoven:{
  url:"https://upload.wikimedia.org/wikipedia/commons/transcoded/f/f0/Moonlight.ogg/Moonlight.ogg.mp3",
  description:"Ludwig van Beethoven, Moonlight Sonata, 1st movement",
  performer:"Juan Felipe Arjona",license:"CC BY 2.5",
  page:"https://commons.wikimedia.org/wiki/File:Moonlight.ogg",
  licenseUrl:"https://creativecommons.org/licenses/by/2.5/"
 }
};
const classicalAudio=new Audio();
classicalAudio.loop=true;
classicalAudio.volume=.16;
classicalAudio.preload="none";
classicalAudio.setAttribute("playsinline","");
let attemptedAutoPlay=false;
function updateMusicUI(status){
 const playing=status==="playing";
 pianoButton.setAttribute("aria-pressed",String(playing));
 pianoButton.setAttribute("aria-label",playing?"Pause background classical piano":"Play background classical piano");
 q("#piano-status").textContent=status==="loading"?"LOADING…":status==="error"?"TRY AGAIN":playing?"PIANO ON":"PIANO OFF";
}
function chooseMusic(){
 const track=pianoTracks[trackSelect.value]||pianoTracks.chopin;
 classicalAudio.pause();
 classicalAudio.src=track.url;
 classicalAudio.load();
 musicCredit.innerHTML="Music: "+track.description+" · performance by "+track.performer+
  ' · <a href="'+track.page+'" target="_blank" rel="noopener noreferrer">recording ↗</a> '+
  '(<a href="'+track.licenseUrl+'" target="_blank" rel="noopener noreferrer">'+track.license+"</a>) · Wikimedia Commons";
 updateMusicUI("paused");
 return track;
}
async function playClassicalPiano(){
 try{
  updateMusicUI("loading");
  await classicalAudio.play();
  updateMusicUI("playing");
 }catch(err){
  console.info("Background piano requires visitor interaction or network access:",err);
  updateMusicUI("paused");
 }
}
function pauseClassicalPiano(){
 classicalAudio.pause();
 updateMusicUI("paused");
}
pianoButton.addEventListener("click",()=>{
 if(!classicalAudio.paused){pauseClassicalPiano()}else{playClassicalPiano()}
});
trackSelect.addEventListener("change",()=>{
 const wasPlaying=!classicalAudio.paused;
 chooseMusic();
 if(wasPlaying)playClassicalPiano();
});
classicalAudio.addEventListener("error",()=>updateMusicUI("error"));
classicalAudio.addEventListener("playing",()=>updateMusicUI("playing"));
classicalAudio.addEventListener("pause",()=>{if(classicalAudio.paused)updateMusicUI("paused")});
chooseMusic();
/* Attempt a quiet automatic start because the site owner requested it.
   Modern browsers often block audible autoplay; the visible control remains usable. */
if(!attemptedAutoPlay){
 attemptedAutoPlay=true;
 playClassicalPiano();
}

})();
