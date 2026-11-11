/* Profile visitor statistics powered by GoatCounter once analytics-config.json is connected.
   No fabricated counts; date windows follow Europe/Istanbul. */
(()=>{
"use strict";
const ids={daily:"visitors-daily",weekly:"visitors-weekly",monthly:"visitors-monthly"};
const status=document.getElementById("visitor-status");
const values=Object.fromEntries(Object.entries(ids).map(([k,id])=>[k,document.getElementById(id)]));
if(!status||Object.values(values).some(v=>!v))return;
const setStatus=s=>status.textContent=s;
function istanbulDate(){
 const p=new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Istanbul",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());
 const get=k=>p.find(x=>x.type===k)?.value;
 return {y:+get("year"),m:+get("month"),d:+get("day")};
}
const fmt=(y,m,d)=>[y,String(m).padStart(2,"0"),String(d).padStart(2,"0")].join("-");
function dates(){
 const {y,m,d}=istanbulDate(),day=new Date(Date.UTC(y,m-1,d));
 const offset=(day.getUTCDay()+6)%7;
 const monday=new Date(day.getTime()-offset*86400000);
 return {daily:fmt(y,m,d),weekly:fmt(monday.getUTCFullYear(),monday.getUTCMonth()+1,monday.getUTCDate()),monthly:fmt(y,m,1)};
}
function validCode(code){return typeof code==="string"&&/^[a-z0-9][a-z0-9-]{1,62}$/.test(code)}
async function countFor(site,path,start){
 const url="https://"+site+".goatcounter.com/counter/"+encodeURIComponent(path)+".json?start="+encodeURIComponent(start);
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),10000);
 try{
  const response=await fetch(url,{cache:"no-store",mode:"cors",signal:controller.signal});
  if(!response.ok)throw Error("Analytics response "+response.status);
  const json=await response.json();
  const n=typeof json.count==="number"?json.count:Number(String(json.count??"").replace(/[^\d]/g,""));
  if(!Number.isFinite(n)||n<0)throw Error("Invalid visit count");
  return n.toLocaleString("en-US");
 }finally{clearTimeout(timeout)}
}
function installTracker(site){
 if(document.querySelector("script[data-goatcounter]"))return;
 const script=document.createElement("script");
 script.async=true;script.src="https://gc.zgo.at/count.js";
 script.dataset.goatcounter="https://"+site+".goatcounter.com/count";
 document.head.appendChild(script);
}
async function init(){
 try{
  const response=await fetch("./analytics-config.json",{cache:"no-store"});
  if(!response.ok)throw Error("Visitor configuration not found");
  const cfg=await response.json();
  if(cfg.provider!=="goatcounter"||cfg.enabled!==true||!validCode(cfg.siteCode)){
   setStatus("Live statistics will appear once tracking is connected.");
   return;
  }
  /* The public counter must also be enabled in GoatCounter settings. */
  installTracker(cfg.siteCode);
  setStatus("Loading live visit counts…");
  const periods=dates(),path=cfg.path==="TOTAL"?"TOTAL":"/";
  const stats=await Promise.allSettled(Object.keys(ids).map(k=>countFor(cfg.siteCode,path,periods[k])));
  let ok=0;Object.keys(ids).forEach((k,i)=>{
   if(stats[i].status==="fulfilled"){values[k].textContent=stats[i].value;ok++}
   else values[k].textContent="—";
  });
  setStatus(ok===3?"Live site visits · Istanbul time · updated periodically":ok?"Some visit counts are temporarily unavailable.":"Visitor numbers are temporarily unavailable.");
 }catch(e){
  console.warn("Visitor analytics:",e);
  setStatus("Visitor statistics are temporarily unavailable.");
 }
}
init();
})();
