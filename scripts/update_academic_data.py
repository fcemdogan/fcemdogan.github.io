#!/usr/bin/env python3
"""Update published papers from verified OpenAlex ORCID authorship and teaching from HKÜ.

This process retains previous records when sources fail; no Scopus/Scholar scraping.
"""
import json, os, re, sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parent.parent
DATA=ROOT/"data"
ORCID="0000-0002-2398-1484"
HKU="https://profil.hku.edu.tr/akademik/firat-cem-dogan/"
HEADERS={"User-Agent":"FiratCemDoganAcademicSite/1.0 (metadata verification; contact fcem.dogan@hku.edu.tr)"}
MAP={"davranışsal finans":"Behavioral Finance","makro iktisat":"Macroeconomics","iktisat ii":"Economics II","bankacılık teorileri":"Banking Theories","ekonomi ve finans okuryazarlığı":"Economics and Financial Literacy","politik iktisat":"Political Economy","iktisat i":"Economics I","mikro iktisat":"Microeconomics","sosyal sorumluluk projeleri":"Social Responsibility Projects","kurumsal iktisat":"Institutional Economics","fakirlik ekonomisi teori ve politika":"Economics of Poverty: Theory and Policy","bölüşüm teorisi":"Theory of Distribution"}
def fetch(url):
    with urlopen(Request(url,headers=HEADERS),timeout=25) as r:return r.read().decode("utf-8")
def read(file):
    return json.loads(Path(file).read_text(encoding="utf-8"))
def write(file, items, source):
    if not items:return
    path=Path(file)
    old=read(path) if path.exists() else {}
    if old.get("items")==items:
        print("Unchanged:",path)
        return
    payload={"updated":datetime.now(timezone.utc).strftime("%Y-%m-%d"),"source":source,"items":items}
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("Updated:",path,len(items))
def doi_norm(d):
    s=re.sub(r"^https?://(?:dx\.)?doi\.org/","",str(d or ""),flags=re.I)
    return s if re.fullmatch(r"10\.\d{4,9}/[^\s]+",s) else None
def works():
    qs={"filter":"authorships.author.orcid:"+ORCID,"per_page":"100","sort":"publication_date:desc"}
    if os.environ.get("OPENALEX_API_KEY"):qs["api_key"]=os.environ["OPENALEX_API_KEY"]
    raw=json.loads(fetch("https://api.openalex.org/works?"+urlencode(qs)))
    rows=[]
    for w in raw.get("results",[]):
        matched=any(str((a.get("author") or {}).get("orcid") or "").endswith(ORCID) for a in (w.get("authorships") or []))
        d=doi_norm(w.get("doi"));title=w.get("title");year=w.get("publication_year")
        if not matched or not d or not title or not isinstance(year,int):continue
        if w.get("type") not in {"article","book","book-chapter","review","proceedings-article","preprint"}:continue
        journal=((w.get("primary_location") or {}).get("source") or {}).get("display_name") or w.get("type","")
        author=", ".join((a.get("author") or {}).get("display_name","") for a in (w.get("authorships") or [])[:8])
        rows.append({"year":year,"title":title,"journal":journal,"authors":author,"doi":d})
    return rows
def refresh_publications():
    base=read(ROOT/"publications.json")
    old=read(DATA/"live-publications.json")["items"]
    index={}
    for item in base+old:
        doi=doi_norm(item.get("doi"))
        if doi:index[doi.lower()]=item
    try:
        fresh=works()
        print("OpenAlex verified results:",len(fresh))
        for p in fresh:index.setdefault(p["doi"].lower(),p)
    except Exception as e:
        print("OpenAlex unavailable; retain existing:",e,file=sys.stderr)
    a=sorted(index.values(),key=lambda p:(-p["year"],p["title"].casefold()))
    if len(a)<10:raise RuntimeError("Insufficient publications, leaving existing data intact")
    write(DATA/"live-publications.json",a,"Verified DOIs + OpenAlex ORCID matching")
def teaching(html):
    soup=BeautifulSoup(html,"html.parser")
    for table in soup.select("table"):
        heads=[x.get_text(" ",strip=True).lower() for x in table.select("th")]
        if not all(x in heads for x in ("ders","düzey","yıl")):continue
        lookup={name:i for i,name in enumerate(heads)}
        arr=[]
        for row in table.select("tr"):
            cols=[x.get_text(" ",strip=True) for x in row.select("td")]
            if len(cols)<len(heads):continue
            title=cols[lookup["ders"]];level=cols[lookup["düzey"]];year=cols[lookup["yıl"]]
            if not re.fullmatch(r"20\d\d\s*[-–]\s*20\d\d",year):continue
            if level not in {"Lisans","Yüksek Lisans","Doktora"}:continue
            level_en={"Lisans":"Undergraduate","Yüksek Lisans":"Graduate","Doktora":"Doctoral"}[level]
            arr.append({"title_en":MAP.get(title.lower(),title),"title_tr":title,"level_en":level_en,"level_tr":level,"academic_year":re.sub(r"\s*[-–]\s*","–",year)})
        if len(arr)>=5:return arr
    return []
def refresh_courses():
    try:
        rows=teaching(fetch(HKU))
        if len(rows)<5:raise ValueError("HKÜ teaching table not found; keep existing")
        write(DATA/"live-courses.json",rows,"HKÜ official faculty profile (YÖKSİS records)")
    except Exception as e:
        print("HKÜ course refresh unavailable; keeping baseline:",e,file=sys.stderr)
if __name__=="__main__":
    if "--validate-only" in sys.argv:
        for f in (DATA/"live-courses.json",DATA/"live-publications.json"):
            a=read(f)["items"]; assert isinstance(a,list) and len(a)>=10,(f,len(a))
            print("Valid:",f,len(a))
    else:
        refresh_publications()
        refresh_courses()
