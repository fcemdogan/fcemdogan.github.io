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

/* Original generative ambient piano — no embedded copyrighted recording.
   Starts only when the visitor activates the button (browser autoplay policies). */
const pianoButton=q("#piano-toggle");
let pianoContext=null,pianoTimer=null,pianoMaster=null,pianoDelay=null,pianoBeat=0,pianoNext=0;
let pianoPlaying=false;
const pianoTempo=68,pianoBeatSeconds=60/pianoTempo;
const pianoChords=[
 [48,52,55,59],[45,48,52,55],[41,45,48,52],[43,47,50,55],
 [48,52,55,59],[45,48,52,57],[41,45,48,52],[43,47,50,53]
];
const pianoMelody=[
 72,null,76,79,76,72,71,null,69,null,72,76,74,71,69,null,
 72,76,79,76,72,null,69,72,67,72,76,72,71,null,67,null
];
function playPianoNote(midi,when,velocity=.22,length=2.8){
 const ctx=pianoContext;if(!ctx||!pianoMaster)return;
 const hz=440*Math.pow(2,(midi-69)/12),env=ctx.createGain();
 env.gain.setValueAtTime(.0001,when);
 env.gain.exponentialRampToValueAtTime(Math.max(.001,velocity),when+.014);
 env.gain.exponentialRampToValueAtTime(.0001,when+length);
 env.connect(pianoMaster);if(pianoDelay)env.connect(pianoDelay);
 for(const [ratio,weight,type] of [[1,.64,"sine"],[2,.26,"sine"],[3,.11,"triangle"]]){
  const osc=ctx.createOscillator(),harmonic=ctx.createGain();
  osc.type=type;osc.frequency.setValueAtTime(hz*ratio,when);
  harmonic.gain.value=weight;osc.connect(harmonic);harmonic.connect(env);
  osc.start(when);osc.stop(when+length+.05);
  osc.onended=()=>{osc.disconnect();harmonic.disconnect()};
 }
 setTimeout(()=>{try{env.disconnect()}catch(e){}},Math.ceil((length+2)*1000));
}
function schedulePianoBeat(index,when){
 const bar=Math.floor(index/4)%8,position=index%4,chord=pianoChords[bar];
 if(position===0){playPianoNote(chord[0]-12,when,.18,3.7);playPianoNote(chord[1],when+.18,.105,3.4);}
 if(position===2){playPianoNote(chord[2],when,.09,2.7);playPianoNote(chord[3],when+.18,.075,2.4);}
 const note=pianoMelody[index%pianoMelody.length];
 if(note!==null)playPianoNote(note,when+.08,.115,2.25);
}
function pianoTick(){
 if(!pianoPlaying||!pianoContext)return;
 while(pianoNext<pianoContext.currentTime+1.1){
  schedulePianoBeat(pianoBeat,pianoNext);
  pianoBeat++;pianoNext+=pianoBeatSeconds;
 }
}
async function togglePiano(){
 if(pianoPlaying){
  pianoPlaying=false;
  if(pianoTimer){clearInterval(pianoTimer);pianoTimer=null}
  const old=pianoContext;pianoContext=null;pianoMaster=null;pianoDelay=null;
  if(old)try{await old.close()}catch(e){}
  pianoButton.setAttribute("aria-pressed","false");
  pianoButton.setAttribute("aria-label","Enable relaxing piano music");
  q("#piano-status").textContent="PIANO OFF";
  return;
 }
 const AudioCtor=window.AudioContext||window.webkitAudioContext;
 if(!AudioCtor){q("#piano-status").textContent="UNAVAILABLE";return}
 try{
  const ctx=new AudioCtor();pianoContext=ctx;
  await ctx.resume();
  pianoMaster=ctx.createGain();pianoMaster.gain.value=.26;pianoMaster.connect(ctx.destination);
  pianoDelay=ctx.createDelay(.7);pianoDelay.delayTime.value=.32;
  const feedback=ctx.createGain();feedback.gain.value=.12;
  const wet=ctx.createGain();wet.gain.value=.2;
  pianoDelay.connect(feedback);feedback.connect(pianoDelay);
  pianoDelay.connect(wet);wet.connect(pianoMaster);
  pianoBeat=0;pianoNext=ctx.currentTime+.06;
  pianoPlaying=true;
  pianoTick();pianoTimer=setInterval(pianoTick,180);
  pianoButton.setAttribute("aria-pressed","true");
  pianoButton.setAttribute("aria-label","Disable relaxing piano music");
  q("#piano-status").textContent="PIANO ON";
 }catch(err){
  console.warn("Unable to start audio:",err);
  pianoPlaying=false;
  q("#piano-status").textContent="AUDIO ERROR";
 }
}
if(pianoButton)pianoButton.addEventListener("click",togglePiano);

})();
