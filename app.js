/* =========================
   JW Airlines IFE — app.js
   ========================= */

/* 路径基准 */
const MUSIC_BASE  = "music/";
const IMAGE_BASE  = "images/";
const LYRICS_BASE = "lyrics/";

/* ---------- I18N（四语言，中文为“简体中文”） ---------- */
const I18N = {
  "zh-CN": {
    brand: "JW Airlines",
    dest: "目的地：Paris CDG",
    tiles: {
      music: ["音乐", "专辑与歌单"],
      movies: ["电影", "播放器与片库"],
      shopping: ["购物", "免税店"],
      dining: ["用餐", "餐食与倒计时"],
      flight: ["我的飞行", "地图与信息"],
    },
    ui: {
      remain: "剩余",
      seatbeltOn: "系好安全带",
      seatbeltOff: "安全带关闭",
      crew: "呼叫乘务",
      about: "专辑简介",
      lyrics: "歌词（按所选语言显示，有文件自动加载）"
    },
  },
  en: {
    brand: "JW Airlines",
    dest: "Destination: Paris CDG",
    tiles: {
      music: ["Music", "Albums & Playlists"],
      movies: ["Movies", "Player & Library"],
      shopping: ["Shopping", "Duty-Free"],
      dining: ["Dining", "Meal & Countdown"],
      flight: ["My Flight", "Map & Info"],
    },
    ui: {
      remain: "Remaining",
      seatbeltOn: "Seatbelt On",
      seatbeltOff: "Seatbelt Off",
      crew: "Call Crew",
      about: "About this album",
      lyrics: "Lyrics (auto-loaded in selected language)"
    },
  },
  es: {
    brand: "JW Airlines",
    dest: "Destino: París CDG",
    tiles: {
      music: ["Música", "Álbumes y listas"],
      movies: ["Cine", "Reproductor y biblioteca"],
      shopping: ["Compras", "Duty-Free"],
      dining: ["Comidas", "Menú y cuenta atrás"],
      flight: ["Mi Vuelo", "Mapa e información"],
    },
    ui: {
      remain: "Restante",
      seatbeltOn: "Cinturón abrochado",
      seatbeltOff: "Cinturón desabrochado",
      crew: "Llamar tripulación",
      about: "Sobre este álbum",
      lyrics: "Letras (cargadas automáticamente en el idioma seleccionado)"
    },
  },
  ru: {
    brand: "JW Airlines",
    dest: "Назначение: Париж CDG",
    tiles: {
      music: ["Музыка", "Альбомы и плейлисты"],
      movies: ["Фильмы", "Плеер и библиотека"],
      shopping: ["Покупки", "Дьюти-фри"],
      dining: ["Питание", "Меню и таймер"],
      flight: ["Мой рейс", "Карта и инфо"],
    },
    ui: {
      remain: "Осталось",
      seatbeltOn: "Ремни пристёгнуты",
      seatbeltOff: "Ремни отстёгнуты",
      crew: "Вызвать бортпроводника",
      about: "Об альбоме",
      lyrics: "Тексты (автозагрузка на выбранном языке)"
    },
  },
};

let lang = localStorage.getItem("ife_lang") || document.documentElement.lang || "en";
const $ = (id)=>document.getElementById(id);
const setText = (id, txt)=>{ const el=$(id); if(el) el.textContent = txt; };

function applyLang(){
  const t = I18N[lang] || I18N.en;
  document.documentElement.lang = lang;
  setText("brandTitle", t.brand);
  setText("destText",  t.dest);
  setText("tileMusic", t.tiles.music[0]);      setText("tileMusicSub", t.tiles.music[1]);
  setText("tileMovies",t.tiles.movies[0]);     setText("tileMoviesSub",t.tiles.movies[1]);
  setText("tileShopping",t.tiles.shopping[0]); setText("tileShoppingSub",t.tiles.shopping[1]);
  setText("tileDining", t.tiles.dining[0]);    setText("tileDiningSub", t.tiles.dining[1]);
  setText("tileFlight", t.tiles.flight[0]);    setText("tileFlightSub", t.tiles.flight[1]);
  setText("musicTitle", t.tiles.music[0]);
  setText("remainLabel", t.ui.remain);
  setText("belt", t.ui.seatbeltOn);
  setText("aboutTitle", t.ui.about);
  setText("lyricsTitle", t.ui.lyrics);
}

function openLangSwitcher(){ $("langScreen").style.display="grid"; }
function chooseLang(code){
  lang = code; localStorage.setItem("ife_lang", code);
  $("langScreen").style.display="none";
  applyLang(); renderAlbumCards(); refreshAlbumHeader(); updateLyricsForIndex(curIdx);
}
$("langScreen").addEventListener("click", e => { if(e.target.classList.contains("lang-screen")) e.currentTarget.style.display="none"; });
document.querySelectorAll(".lang-btn").forEach(b=>b.addEventListener("click",()=>chooseLang(b.dataset.lang)));

function hidePanels(){ document.querySelectorAll(".panel").forEach(p=>p.classList.remove("visible")); $("home").style.display="none"; const mg=$("movieGrid"); if(mg) mg.style.display="grid"; }
function goHome(){ hidePanels(); $("home").style.display="grid"; showPlayer(true); return true; }
function openSection(key){
  hidePanels();
  const p=$("panel-"+key); if(!p) return false;
  if(key==="music")  initMusicView();
  if(key==="movies") renderMovies();
  showPlayer(key!=="movies");
  p.classList.add("visible");
  return true;
}
$("btnHome").addEventListener("click", goHome);
$("btnLang").addEventListener("click", openLangSwitcher);
$("btnCall").addEventListener("click", ()=> alert((I18N[lang]||I18N.en).ui.crew));
document.querySelectorAll(".tile").forEach(t=>t.addEventListener("click",()=>openSection(t.dataset.open)));

/* ---------- Music Library ---------- */
const LIB = {
  artangels: {
    artist:"Grimes",
    title:{ en:"Art Angels" },
    cover: IMAGE_BASE + "art_angles_cover.jpg",
    blurb:{
      en:"Grimes’ hyperpop opus blending industrial punch with bubblegum hooks.",
      "zh-CN":"Grimes 的超流行专辑，工业能量与泡泡旋律的融合。",
      es:"La obra hyperpop de Grimes que mezcla energía industrial y ganchos pop.",
      ru:"Гиперпоп-альбом Grimes: смесь индустриальной энергии и поп-мелодий."
    },
    tracks:[
      { t:"laughing and not being normal",  len:"1:48", src:MUSIC_BASE+"Grimes - laughing and not being normal.mp3" },
      { t:"California",                     len:"3:16", src:MUSIC_BASE+"Grimes - California.mp3" },
      { t:"SCREAM (feat. Aristophanes)",    len:"2:06", src:MUSIC_BASE+"Grimes - SCREAM.mp3" },
      { t:"Flesh without Blood",            len:"4:24", src:MUSIC_BASE+"Grimes - Flesh without Blood.mp3" },
      { t:"Belly of the Beat",              len:"3:26", src:MUSIC_BASE+"Grimes - Belly of the Beat.mp3" },
      { t:"Kill V. Maim",                   len:"4:06", src:MUSIC_BASE+"Grimes - Kill V. Maim.mp3" },
      { t:"Artangels",                      len:"4:06", src:MUSIC_BASE+"Grimes - Artangels.mp3" },
      { t:"Easily",                         len:"3:03", src:MUSIC_BASE+"Grimes - Easily.mp3" },
      { t:"Pin",                            len:"3:31", src:MUSIC_BASE+"Grimes - Pin.mp3" },
      { t:"REALiTi (album version)",        len:"5:06", src:MUSIC_BASE+"Grimes - Realiti.mp3" },
      { t:"World Princess Part II",         len:"5:07", src:MUSIC_BASE+"Grimes - World Princess Part II.mp3" },
      { t:"Venus Fly (feat. Janelle Monáe)",len:"3:45", src:MUSIC_BASE+"Grimes - Venus Fly.mp3" },
      { t:"Life in the Vivid Dream",        len:"1:29", src:MUSIC_BASE+"Grimes - Life in the Vivid Dream.mp3" },
      { t:"Butterfly",                      len:"4:13", src:MUSIC_BASE+"Grimes - Butterfly.mp3" }
    ]
  },
  paradigmes: {
    artist:"La Femme",
    title:{ en:"Paradigmes" },
    cover: IMAGE_BASE + "paradigmes_cover.jpg",
    blurb:{
      en:"French surf-coldwave shapeshifting into a cinematic night drive.",
      "zh-CN":"法国冷潮与冲浪气质的混融，像一段夜色里的电影公路。",
      es:"Coldwave-surf francesa que muta hacia un viaje nocturno cinematográfico.",
      ru:"Французский колдвейв/серф, превращающийся в ночное кинематографичное путешествие."
    },
    tracks:[
      { t:"Paradigmes Introduction", len:"—", src:MUSIC_BASE+"Paradigmes Introduction.mp3" },
      { t:"Paradigme",               len:"—", src:MUSIC_BASE+"La Femme - Paradigme.mp3" },
      { t:"Le sang de mon prochain", len:"—", src:MUSIC_BASE+"La Femme - Le Sang De Mon Prochain.mp3" },
      { t:"Cool Colorado",           len:"—", src:MUSIC_BASE+"La Femme - Cool Colorado.mp3" },
      { t:"Foreigner",               len:"—", src:MUSIC_BASE+"La Femme - Foreigner.mp3" },
      { t:"Nouvelle-Orléans",        len:"—", src:MUSIC_BASE+"La Femme - Nouvelle-Orleans.mp3" },
      { t:"Disconnexion",            len:"—", src:MUSIC_BASE+"La Femme - Disconnexion.mp3" },
      { t:"Pasadena",                len:"—", src:MUSIC_BASE+"La Femme - Pasadena.mp3" }
    ]
  }
};
const albumIds = ["artangels","paradigmes"];
let curAlbum = albumIds[0], curIdx = 0;

/* ---------- Lyrics loading (from /lyrics/) ---------- */
function slug(s){ return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,''); }
async function loadLyrics(albumId, title){
  const s = slug(title);
  const candidates = [
    `${LYRICS_BASE}${albumId}/${s}.${lang}.txt`,
    `${LYRICS_BASE}${albumId}/${s}.${lang}.lrc`,
    `${LYRICS_BASE}${albumId}/${s}.${lang}.json`,
  ];
  for(const url of candidates){
    try{
      const r = await fetch(url, {cache:'no-store'});
      if(!r.ok) continue;
      if(url.endsWith('.json')){ const j=await r.json(); return j.text||""; }
      return await r.text();
    }catch{ /* ignore */ }
  }
  return "";
}

/* ---------- Music UI ---------- */
function renderAlbumCards(){
  const grid=$("albumCards"); if(!grid) return; grid.innerHTML="";
  albumIds.forEach(id=>{
    const a=LIB[id];
    const card=document.createElement("div"); card.className="album-card";
    card.innerHTML=`
      <div class="cover" style="background-image:url('${a.cover}')"></div>
      <div class="meta">
        <div class="title">${a.title.en}</div>
        <div class="artist">${a.artist}</div>
        <div class="desc">${a.blurb?.[lang]||a.blurb?.en||""}</div>
      </div>`;
    card.onclick=()=>openPlaylistView(id);
    grid.appendChild(card);
  });
}
function showMusicHome(){ $("musicHome").classList.remove("hidden"); $("musicPlay").classList.add("hidden"); }
function showMusicPlay(){ $("musicHome").classList.add("hidden"); $("musicPlay").classList.remove("hidden"); }
function refreshAlbumHeader(){
  const a=LIB[curAlbum]; if(!a) return;
  $("playCover").style.backgroundImage=`url('${a.cover}')`;
  setText("playAlbumName", a.title.en);
  setText("playArtist", a.artist);
  setText("albumDesc", a.blurb?.[lang]||a.blurb?.en||"");
}
function openPlaylistView(albumId){
  curAlbum = albumId; refreshAlbumHeader();
  renderTracks();
  const first = firstPlayableIndex(curAlbum);
  updateLyricsForIndex(first!==-1?first:0);
  showMusicPlay();
}
$("musicBack").addEventListener("click", showMusicHome);

function renderTracks(){
  const box=$("trackList"); if(!box) return; box.innerHTML="";
  const a=LIB[curAlbum];
  a.tracks.forEach((trk,i)=>{
    const r=document.createElement("div"); r.className="row";
    r.innerHTML=`
      <div class="row-btn" data-idx="${i}" title="Play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
      <div>
        <div class="title">${trk.t}</div>
        <div class="meta" style="font-size:var(--tiny);color:var(--muted)">${a.artist} • ${a.title.en}</div>
      </div>
      <div style="text-align:right">${trk.len||"—"}</div>`;
    box.appendChild(r);
  });
  box.querySelectorAll(".row-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const i=+btn.dataset.idx; showMusicPlay(); playIdx(i); updateLyricsForIndex(i); flash(btn);
    });
  });
}

/* ---------- Player ---------- */
const audio=new Audio();
const bar=$("bar"), curT=$("cur"), durT=$("dur"), rail=$("rail"), volBar=$("volBar"), volRail=$("volRail"),
      npTitle=$("npTitle"), npMeta=$("npMeta"), npArt=$("npArt");

function flash(el){ el.classList.add("btn-ping"); setTimeout(()=>el.classList.remove("btn-ping"),180); }
["btnPrev","btnNext","playPause"].forEach(id=>$(id).addEventListener("mousedown",e=>flash(e.currentTarget)));

$("btnPrev").onclick=()=>{ curIdx=prevPlayableIndex(curAlbum,curIdx); playIdx(curIdx); updateLyricsForIndex(curIdx); };
$("btnNext").onclick=()=>{ curIdx=nextPlayableIndex(curAlbum,curIdx); playIdx(curIdx); updateLyricsForIndex(curIdx); };
$("playPause").onclick=()=>{
  if(!audio.src){ const first=firstPlayableIndex(curAlbum); if(first!==-1){ playIdx(first); updateLyricsForIndex(first); return; } }
  if(audio.paused){ audio.play().then(setPauseIcon).catch(()=>{});} else { audio.pause(); setPlayIcon(); }
};
function setPauseIcon(){ $("iconPlay").innerHTML='<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>'; }
function setPlayIcon(){ $("iconPlay").innerHTML='<path d="M8 5v14l11-7z"/>'; }

function playIdx(i){
  curIdx=i; const album=LIB[curAlbum]; const t=album.tracks[i];
  if(!t||!t.src){ const n=nextPlayableIndex(curAlbum,i); if(n===i) return; curIdx=n; return playIdx(n); }
  audio.src=t.src; audio.play().then(setPauseIcon).catch(()=>{});
  npTitle.textContent=t.t; npMeta.textContent=`${album.artist} • ${album.title.en}`;
  npArt.style.backgroundImage=`url('${album.cover}')`;
}
function firstPlayableIndex(albumId){ const a=LIB[albumId]; if(!a) return -1; for(let i=0;i<a.tracks.length;i++){ if(a.tracks[i].src) return i; } return -1; }
function nextPlayableIndex(albumId,from){ const a=LIB[albumId]; if(!a) return from; const n=a.tracks.length; for(let k=1;k<=n;k++){ const idx=(from+k)%n; if(a.tracks[idx].src) return idx; } return from; }
function prevPlayableIndex(albumId,from){ const a=LIB[albumId]; if(!a) return from; const n=a.tracks.length; for(let k=1;k<=n;k++){ const idx=(from-k+n)%n; if(a.tracks[idx].src) return idx; } return from; }

audio.addEventListener("loadedmetadata", ()=>{ durT.textContent=fmt(audio.duration); });
audio.addEventListener("timeupdate", ()=>{
  if(!isFinite(audio.duration)) return;
  const p=audio.currentTime/audio.duration;
  bar.style.width=(p*100)+"%";
  curT.textContent=fmt(audio.currentTime);
});
audio.addEventListener("ended", ()=>{ const n=nextPlayableIndex(curAlbum,curIdx); if(n!==curIdx){ curIdx=n; playIdx(n); updateLyricsForIndex(n);} else { setPlayIcon(); }});
audio.addEventListener("error", ()=>{ const n=nextPlayableIndex(curAlbum,curIdx); if(n!==curIdx){ curIdx=n; playIdx(n); updateLyricsForIndex(n);} });

rail.onclick=(e)=>{ const r=rail.getBoundingClientRect(); const ratio=(e.clientX-r.left)/r.width; if(isFinite(audio.duration)) audio.currentTime=(audio.duration||0)*Math.max(0,Math.min(1,ratio)); };
volRail.onclick=(e)=>{ const r=volRail.getBoundingClientRect(); const ratio=(e.clientX-r.left)/r.width; audio.volume=Math.max(0,Math.min(1,ratio)); volBar.style.width=(audio.volume*100)+"%"; };

/* ---------- Lyrics right panel ---------- */
async function updateLyricsForIndex(i){
  const a=LIB[curAlbum]; const t=a?.tracks?.[i]; if(!t){ $("lyricsBody").textContent="—"; return; }
  setText("lyricsTitle", `${(I18N[lang]||I18N.en).ui.lyrics} — ${t.t}`);
  const txt = await loadLyrics(curAlbum, t.t);
  $("lyricsBody").textContent = txt || "Lyrics unavailable.";
}
function refreshAlbumHeader(){ const a=LIB[curAlbum]; if(!a) return; $("playCover").style.backgroundImage=`url('${a.cover}')`; setText("playAlbumName", a.title.en); setText("playArtist", a.artist); setText("albumDesc", a.blurb?.[lang]||a.blurb?.en||""); }

/* ---------- Movies ---------- */
const MOVIES=[{id:"m1",title:{en:"Night Flight to Paris","zh-CN":"夜航巴黎",es:"Vuelo nocturno a París",ru:"Ночной рейс в Париж"},desc:{en:"Overnight transatlantic selection.","zh-CN":"跨洋红眼航班精选影片。",es:"Selección trasatlántica nocturna.",ru:"Ночная трансатлантическая подборка."},src:""}];
function renderMovies(){
  const grid=$("movieGrid"); grid.innerHTML="";
  MOVIES.forEach(m=>{ const el=document.createElement("div"); el.className="poster"; el.textContent=m.title[lang]||m.title.en; el.onclick=()=>openMovie(m); grid.appendChild(el); });
}
function openMovie(m){
  openSection("movies"); $("movieGrid").style.display="none"; showPlayer(false);
  $("video").src=m.src||""; setText("movieTitle", m.title[lang]||m.title.en); setText("movieDesc", m.desc[lang]||m.desc.en);
  if(!audio.paused){ audio.pause(); setPlayIcon(); }
}

/* ---------- Flight countdown ---------- */
const depart=new Date(); depart.setHours(22,30,0,0);
const arrive=new Date(depart.getTime()+7.5*3600*1000);
function fmt(s){ s=Math.floor(s||0); const m=Math.floor(s/60), ss=s%60; return m+":"+(ss<10?"0":"")+ss; }
function fmtH(s){ s=Math.floor(s); const h=Math.floor(s/3600), m=Math.floor((s%3600)/60), ss=s%60; return `${h}h ${m}m ${ss}s`; }
function updateFlight(){
  const now=new Date(); const total=arrive-depart; const pct=Math.max(0,Math.min(1,(now-depart)/total)); const remainMs=Math.max(0,total*(1-pct));
  setText("remain", fmtH(remainMs/1000));
  const eta=$("eta"); if(eta) eta.textContent=`ETA: ${new Date(arrive).toLocaleString()}`;
  const path=$("route"), plane=$("plane");
  if(path&&plane&&path.getTotalLength){ const len=path.getTotalLength(), pos=path.getPointAtLength(len*pct), pos2=path.getPointAtLength(Math.max(0,len*pct-1)); const ang=Math.atan2(pos.y-pos2.y,pos.x-pos2.x)*180/Math.PI; plane.setAttribute("transform",`translate(${pos.x},${pos.y}) rotate(${ang})`); }
}
setInterval(updateFlight,1000);

/* ---------- Init ---------- */
function initMusicView(){ showMusicHome(); renderAlbumCards(); }
function showPlayer(v){ $("player").classList.toggle("hidden", !v); }

function init(){
  applyLang();
  initMusicView();
  renderMovies();
  
  goHome();
  updateFlight();
}
init();
