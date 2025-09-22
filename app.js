/* ===== Paths ===== */
const MUSIC_BASE = "music/";
const IMAGE_BASE = "images/";

/* ===== I18N ===== */
const I18N = {
  "zh-CN": {
    brand:"JW Airlines", dest:"目的地：Paris CDG",
    tiles:{ music:["音乐","专辑与歌单"], movies:["电影","播放器与片库"], shopping:["购物","免税店"], dining:["用餐","餐食与倒计时"], flight:["我的飞行","地图与信息"]},
    ui:{ remain:"剩余", seatbeltOn:"系好安全带", crew:"呼叫乘务", lyrics:"歌词", study:"专辑研究" }
  },
  en:{ brand:"JW Airlines", dest:"Destination: Paris CDG",
    tiles:{ music:["Music","Albums & Playlists"], movies:["Movies","Player & Library"], shopping:["Shopping","Duty-Free"], dining:["Dining","Meal & Countdown"], flight:["My Flight","Map & Info"]},
    ui:{ remain:"Remaining", seatbeltOn:"Seatbelt On", crew:"Call Crew", lyrics:"Lyrics", study:"Album Study" }
  },
  es:{ brand:"JW Airlines", dest:"Destino: París CDG",
    tiles:{ music:["Música","Álbumes y listas"], movies:["Cine","Reproductor y biblioteca"], shopping:["Compras","Duty-Free"], dining:["Comidas","Menú y cuenta atrás"], flight:["Mi Vuelo","Mapa e información"]},
    ui:{ remain:"Restante", seatbeltOn:"Cinturón abrochado", crew:"Llamar tripulación", lyrics:"Letras", study:"Estudio del álbum" }
  },
  ru:{ brand:"JW Airlines", dest:"Назначение: Париж CDG",
    tiles:{ music:["Музыка","Альбомы и плейлисты"], movies:["Фильмы","Плеер и библиотека"], shopping:["Покупки","Дьюти-фри"], dining:["Питание","Меню и таймер"], flight:["Мой рейс","Карта и инфо"]},
    ui:{ remain:"Осталось", seatbeltOn:"Ремни пристёгнуты", crew:"Вызвать бортпроводника", lyrics:"Тексты", study:"Обзор альбомов" }
  }
};

let lang = localStorage.getItem("ife_lang") || "en";
const $ = id => document.getElementById(id);
const setText = (id, txt)=>{ const el=$(id); if(el) el.textContent = txt; };

/* ===== Apply language ===== */
function applyLang(){
  const t = I18N[lang] || I18N.en;
  document.documentElement.lang = lang;
  setText("brandTitle", t.brand); setText("destText", t.dest);
  setText("tileMusic", t.tiles.music[0]); setText("tileMusicSub", t.tiles.music[1]);
  setText("tileMovies", t.tiles.movies[0]); setText("tileMoviesSub", t.tiles.movies[1]);
  setText("tileShopping", t.tiles.shopping[0]); setText("tileShoppingSub", t.tiles.shopping[1]);
  setText("tileDining", t.tiles.dining[0]); setText("tileDiningSub", t.tiles.dining[1]);
  setText("tileFlight", t.tiles.flight[0]); setText("tileFlightSub", t.tiles.flight[1]);
  setText("musicTitle", t.tiles.music[0]);
  setText("remainLabel", t.ui.remain);
  setText("belt", t.ui.seatbeltOn);
  setText("diningTitle", t.tiles.dining[0]);
}
$("btnLang").addEventListener("click", ()=> $("langScreen").style.display="grid");
$("langScreen").addEventListener("click", e => { if(e.target.classList.contains("lang-screen")) e.currentTarget.style.display="none"; });
document.querySelectorAll(".lang-btn").forEach(b=>b.addEventListener("click",()=>{
  lang = b.dataset.lang; localStorage.setItem("ife_lang", lang);
  $("langScreen").style.display="none"; applyLang(); renderAlbumCards(); refreshAlbumTexts();
}));

/* ===== Navigation ===== */
function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("visible"));
  $(id).classList.add("visible");
}
$("btnHome").addEventListener("click", ()=>showScreen("home"));
document.querySelectorAll(".tile").forEach(t=>t.addEventListener("click",()=> {
  const key = t.dataset.open;
  if(key==="music"){ initMusicView(); showScreen("panel-music"); showMusicHome(); }
  else showScreen("panel-"+key);
}));
$("btnCall").addEventListener("click", ()=>alert((I18N[lang]||I18N.en).ui.crew));

/* ===== Library ===== */
const LIB = {
  artangels:{
    id:"artangels", artist:"Grimes",
    cover: IMAGE_BASE+"art_angles_cover.jpg",
    artistBio:{
      en:"Canadian producer-singer Grimes stitches synth-pop, industrial sandpaper and bubblegum hooks into a neon maximalism that’s playful yet razor-edged.",
      "zh-CN":"加拿大制作人/歌手 Grimes 将合成流行、工业质感与泡泡旋律缝合成霓虹般的极繁声音：俏皮、锋利、具未来感。",
      es:"La productora-cantante canadiense Grimes une synth-pop, toques industriales y ganchos azucarados en un maximalismo neón, juguetón y afilado.",
      ru:"Канадская певица и продюсер Grimes смешивает синти-поп, индустриальный шорох и поп-хуки в неоновый максимализм — игривый и острый."
    },
    study:{
      en:"‘Art Angels’ reboots Grimes as a pop auteur: candy-bright melodies drive hyperactive beats, while knives of guitar and noise keep it feral.",
      "zh-CN":"《Art Angels》把 Grimes 重启为流行作者型歌手：糖感旋律搭载高能节拍，吉他与噪声像刀锋，保持野性与速度。",
      es:"‘Art Angels’ relanza a Grimes como autora pop: melodías brillantes sobre ritmos hiperactivos; guitarras y ruido afilan el borde salvaje.",
      ru:"‘Art Angels’ перезапускает Grimes как поп-автора: яркие мелодии и гиперактивные биты, гитары и шум придают дикость."
    },
    title:{en:"Art Angels"},
    tracks:[
      { t:"laughing and not being normal", len:"1:48", src: MUSIC_BASE+"Grimes - laughing and not being normal.mp3" },
      { t:"California", len:"3:16", src: MUSIC_BASE+"Grimes - California.mp3" },
      { t:"SCREAM (feat. Aristophanes)", len:"2:06", src: MUSIC_BASE+"Grimes - SCREAM.mp3" },
      { t:"Flesh without Blood", len:"4:24", src: MUSIC_BASE+"Grimes - Flesh without Blood.mp3" },
      { t:"Belly of the Beat", len:"3:26", src: MUSIC_BASE+"Grimes - Belly of the Beat.mp3" },
      { t:"Kill V. Maim", len:"4:06", src: MUSIC_BASE+"Grimes - Kill V. Maim.mp3" },
      { t:"Artangels", len:"4:06", src: MUSIC_BASE+"Grimes - Artangels.mp3" },
      { t:"Easily", len:"3:03", src: MUSIC_BASE+"Grimes - Easily.mp3" },
      { t:"Pin", len:"3:31", src: MUSIC_BASE+"Grimes - Pin.mp3" },
      { t:"REALiTi (album version)", len:"5:06", src: MUSIC_BASE+"Grimes - Realiti.mp3" },
      { t:"World Princess Part II", len:"5:07", src: MUSIC_BASE+"Grimes - World Princess Part II.mp3" },
      { t:"Venus Fly (feat. Janelle Monáe)", len:"3:45", src: MUSIC_BASE+"Grimes - Venus Fly.mp3" },
      { t:"Life in the Vivid Dream", len:"1:29", src: MUSIC_BASE+"Grimes - Life in the Vivid Dream.mp3" },
      { t:"Butterfly", len:"4:13", src: MUSIC_BASE+"Grimes - Butterfly.mp3" }
    ]
  },
  paradigmes:{
    id:"paradigmes", artist:"La Femme",
    cover: IMAGE_BASE+"paradigmes_cover.jpg",
    artistBio:{
      en:"La Femme bend surf twang and coldwave chill into noirish road-movie vignettes — a French carousel of organs, drum machines and dead-pan romance.",
      "zh-CN":"La Femme 把冲浪音色与冷潮气质折叠成通往夜色的公路片：风琴、鼓机与冷调浪漫交替旋转，法式而迷离。",
      es:"La Femme tuerce surf y coldwave hacia un viaje nocturno: órganos, cajas de ritmo y romance hierático en carrusel francés.",
      ru:"La Femme сгибают серф-тванг и колдвейв в ночное роуд-кино: органы, драм-машины и невозмутимая романтика."
    },
    study:{
      en:"‘Paradigmes’ cruises like a cinematic night drive: yé-yé vocals, surf riffs and icy synths blur into stylish melancholy — retro but sharply modern.",
      "zh-CN":"《Paradigmes》像一场电影化的夜驾：yé-yé 腔、人声与冲浪吉他、冰冷合成器交叠成时髦的忧郁；复古却锋利现代。",
      es:"‘Paradigmes’ avanza como un paseo nocturno: voces yé-yé, riffs surf y sintes fríos se difuminan en melancolía chic — retro y actual.",
      ru:"‘Paradigmes’ катит как ночная поездка: yé-yé вокал, серф-рифы и холодные синты сплавлены в стильную меланхолию — ретро и современность."
    },
    title:{en:"Paradigmes"},
    tracks:[
      { t:"Paradigmes Introduction", len:"—", src:MUSIC_BASE+"Paradigmes Introduction.mp3" },
      { t:"Paradigme", len:"—", src:MUSIC_BASE+"La Femme - Paradigme.mp3" },
      { t:"Le sang de mon prochain", len:"—", src:MUSIC_BASE+"La Femme - Le Sang De Mon Prochain.mp3" },
      { t:"Cool Colorado", len:"—", src:MUSIC_BASE+"La Femme - Cool Colorado.mp3" },
      { t:"Foreigner", len:"—", src:MUSIC_BASE+"La Femme - Foreigner.mp3" },
      { t:"Nouvelle-Orléans", len:"—", src:MUSIC_BASE+"La Femme - Nouvelle-Orleans.mp3" },
      { t:"Disconnexion", len:"—", src:MUSIC_BASE+"La Femme - Disconnexion.mp3" },
      { t:"Pasadena", len:"—", src:MUSIC_BASE+"La Femme - Pasadena.mp3" }
    ]
  }
};
const albumIds = ["artangels","paradigmes"];
let curAlbum = "artangels", curIdx = 0;

/* ===== Utilities ===== */
function slug(s){
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
}
async function loadLyrics(albumId, title){
  const file = `lyrics/${albumId}/${slug(title)}.txt`;
  try{ const r = await fetch(file,{cache:"no-store"}); if(r.ok) return await r.text(); }catch(_){}
  return "";
}

/* ===== Music home ===== */
function renderAlbumCards(){
  const grid = $("albumCards"); grid.innerHTML = "";
  albumIds.forEach(id=>{
    const a=LIB[id];
    const card=document.createElement("div"); card.className="album-card";
    card.innerHTML=`
      <div class="cover" style="background-image:url('${a.cover}')"></div>
      <div class="meta">
        <div class="title">${a.title.en}</div>
        <div class="artist">${a.artist}</div>
        <div class="desc">${(a.study[lang]||a.study.en).slice(0,120)}...</div>
      </div>`;
    card.addEventListener("click", ()=>openPlaylistView(id));
    grid.appendChild(card);
  });
}
function initMusicView(){ renderAlbumCards(); showMusicHome(); }
function showMusicHome(){ $("musicHome").classList.remove("hidden"); $("musicPlay").classList.add("hidden"); }

/* ===== Music play ===== */
function refreshAlbumTexts(){
  const a=LIB[curAlbum]; if(!a) return;
  setText("albumTitle", a.title.en);
  setText("bannerName", a.title.en);
  setText("bannerDesc", (a.study[lang]||a.study.en)); // banner 简短介绍
  $("albumBanner").style.backgroundImage = `url('${a.cover}')`;

  $("artistPhoto").style.backgroundImage = `url('${a.cover}')`;
  setText("artistName", a.artist);
  setText("artistBio", a.artistBio[lang]||a.artistBio.en);

  setText("albumStudyTitle", (I18N[lang]||I18N.en).ui.study);
  // 综合两张专辑的 150 字左右研究
  const aa = LIB.artangels, pd = LIB.paradigmes;
  const studyCombined = {
    "zh-CN":"两张专辑像两种速度：Grimes 的《Art Angels》以高能节拍与糖感旋律把锋利与甜美缝在一起；La Femme 的《Paradigmes》则放低心跳，用冲浪吉他与冷潮合成器把旅途拍成夜色电影。前者锐利张扬，后者时髦含蓄，在一起像把公路从白昼驶到凌晨。",
    en:"The pair reads like two speeds of pop: ‘Art Angels’ fires sugar-rush hooks over hyperactive beats, while ‘Paradigmes’ slows the pulse, blending surf guitars and coldwave synths into a chic night-drive. One is sharp and vivid; the other sleek and restrained — a road trip from daylight to 3 AM.",
    es:"Dos velocidades del pop: ‘Art Angels’ enciende ganchos azucarados sobre ritmos hiperactivos; ‘Paradigmes’ baja el pulso y mezcla guitarras surf con sintes fríos en un paseo nocturno. Una es afilada y brillante; la otra, elegante y contenida.",
    ru:"Две скорости поп-музыки: ‘Art Angels’ — сахарные хуки и гиперактивные биты; ‘Paradigmes’ — серф-гитары и холодные синты для ночной поездки. Первая острая и яркая, вторая — стильная и сдержанная."
  };
  setText("albumStudy", studyCombined[lang]||studyCombined.en);
}
function openPlaylistView(albumId){
  curAlbum = albumId;
  refreshAlbumTexts();
  renderTracks();
  const first = firstPlayableIndex(curAlbum);
  updateLyricsForIndex(first!==-1?first:0);
  $("musicHome").classList.add("hidden");
  $("musicPlay").classList.remove("hidden");
  showScreen("panel-music");
}
$("musicBack").addEventListener("click", ()=>{ showMusicHome(); });
$("btnPlayAlbum").addEventListener("click", ()=>{
  const first = firstPlayableIndex(curAlbum);
  if(first!==-1){ playIdx(first); updateLyricsForIndex(first); }
});

/* Track list */
function renderTracks(){
  const box=$("trackList"); box.innerHTML="";
  const a=LIB[curAlbum];
  a.tracks.forEach((trk,i)=>{
    const row=document.createElement("div"); row.className="row";
    row.innerHTML = `
      <div class="row-btn" data-idx="${i}" title="Play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
      <div>
        <div class="title">${trk.t}</div>
        <div class="meta">${a.artist} • ${a.title.en}</div>
      </div>
      <div style="text-align:right">${trk.len||"—"}</div>`;
    row.querySelector(".row-btn").addEventListener("click", ()=>{
      playIdx(i); updateLyricsForIndex(i);
    });
    box.appendChild(row);
  });
}

/* ===== Player ===== */
const audio = new Audio();
const bar=$("bar"), curT=$("cur"), durT=$("dur"), rail=$("rail"), volBar=$("volBar"), volRail=$("volRail"),
      npTitle=$("npTitle"), npMeta=$("npMeta"), npArt=$("npArt");

$("btnPrev").onclick=()=>{ curIdx=prevPlayableIndex(curAlbum,curIdx); playIdx(curIdx); updateLyricsForIndex(curIdx); };
$("btnNext").onclick=()=>{ curIdx=nextPlayableIndex(curAlbum,curIdx); playIdx(curIdx); updateLyricsForIndex(curIdx); };
$("playPause").onclick=()=>{
  if(!audio.src){ const first=firstPlayableIndex(curAlbum); if(first!==-1){ playIdx(first); updateLyricsForIndex(first); return; } }
  if(audio.paused){ audio.play().then(setPauseIcon).catch(()=>{});} else { audio.pause(); setPlayIcon(); }
};
function setPauseIcon(){ $("iconPlay").innerHTML='<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>'; }
function setPlayIcon(){ $("iconPlay").innerHTML='<path d="M8 5v14l11-7z"/>'; }

function playIdx(i){
  const a=LIB[curAlbum]; const t=a.tracks[i]; curIdx=i;
  if(!t || !t.src){ const n=nextPlayableIndex(curAlbum,i); if(n!==i){ curIdx=n; return playIdx(n);} return; }
  audio.src = t.src; audio.play().then(setPauseIcon).catch(()=>{});
  npTitle.textContent=t.t; npMeta.textContent=`${a.artist} • ${a.title.en}`;
  npArt.style.backgroundImage=`url('${a.cover}')`;
}
function firstPlayableIndex(albumId){ const a=LIB[albumId]; for(let i=0;i<a.tracks.length;i++) if(a.tracks[i].src) return i; return -1; }
function nextPlayableIndex(albumId,from){ const a=LIB[albumId], n=a.tracks.length; for(let k=1;k<=n;k++){ const i=(from+k)%n; if(a.tracks[i].src) return i; } return from; }
function prevPlayableIndex(albumId,from){ const a=LIB[albumId], n=a.tracks.length; for(let k=1;k<=n;k++){ const i=(from-k+n)%n; if(a.tracks[i].src) return i; } return from; }

audio.addEventListener("loadedmetadata", ()=>{ durT.textContent=fmt(audio.duration); });
audio.addEventListener("timeupdate", ()=>{
  if(!isFinite(audio.duration)) return;
  const p=audio.currentTime/audio.duration;
  bar.style.width=(p*100)+"%";
  curT.textContent=fmt(audio.currentTime);
});
audio.addEventListener("ended", ()=>{ const n=nextPlayableIndex(curAlbum,curIdx); if(n!==curIdx){ curIdx=n; playIdx(n); updateLyricsForIndex(n);} else setPlayIcon(); });
audio.addEventListener("error", ()=>{ const n=nextPlayableIndex(curAlbum,curIdx); if(n!==curIdx){ curIdx=n; playIdx(n); updateLyricsForIndex(n);} });

rail.onclick=(e)=>{ const r=rail.getBoundingClientRect(); const ratio=(e.clientX-r.left)/r.width; if(isFinite(audio.duration)) audio.currentTime=(audio.duration||0)*Math.max(0,Math.min(1,ratio)); };
volRail.onclick=(e)=>{ const r=volRail.getBoundingClientRect(); const ratio=(e.clientX-r.left)/r.width; audio.volume=Math.max(0,Math.min(1,ratio)); volBar.style.width=(audio.volume*100)+"%"; };

/* ===== Lyrics ===== */
async function updateLyricsForIndex(i){
  const a=LIB[curAlbum]; const t=a?.tracks?.[i]; if(!t){ $("lyricsBody").textContent="—"; return; }
  setText("lyricsHeading", (I18N[lang]||I18N.en).ui.lyrics + " — " + t.t);
  const txt = await loadLyrics(a.id, t.t);
  // 直接把原文件换行呈现（CSS: white-space: pre-wrap）
  $("lyricsBody").textContent = txt || "Lyrics unavailable.";
}

/* ===== Flight remaining ===== */
const depart=new Date(); depart.setHours(22,30,0,0);
const arrive=new Date(depart.getTime()+7.5*3600*1000);
function fmt(s){ s=Math.floor(s||0); const m=Math.floor(s/60), ss=s%60; return m+":"+(ss<10?"0":"")+ss; }
function fmtH(s){ s=Math.floor(s); const h=Math.floor(s/3600), m=Math.floor((s%3600)/60), ss=s%60; return `${h}h ${m}m ${ss}s`; }
function updateFlight(){
  const now=new Date(); const total=arrive-depart;
  const pct=Math.max(0,Math.min(1,(now-depart)/total));
  const remainMs=Math.max(0,total*(1-pct));
  setText("remain", fmtH(remainMs/1000));
}
setInterval(updateFlight, 1000);

/* ===== Init ===== */
function showMusicHome(){ $("musicHome").classList.remove("hidden"); $("musicPlay").classList.add("hidden"); }
function init(){
  applyLang();
  showScreen("home");
  initMusicView();
  updateFlight();
}
init();