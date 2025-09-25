// app.js - 完整版
document.addEventListener('DOMContentLoaded', function () {
  try {
    var MUSIC_BASE = "music/";
    var IMAGE_BASE = "images/";

    // i18n map (6 languages order)
    var I18N = {
      "zh-CN": {
        brand: "JW Airlines", dest: "目的地： Paris CDG",
        tiles: { music: ["音乐", "专辑与歌单"], movies: ["电影", "播放器与片库"], shopping: ["购物", "免税店"], dining: ["用餐", "餐食与倒计时"], flight: ["我的飞行", "地图与信息"] },
        ui: { remain: "剩余", seatbeltOn: "系好安全带", crew: "呼叫乘务", about: "专辑简介", lyrics: "歌词", playAll: "播放全部", home: "主页", back: "返回" }
      },
      "zh-TW": {
        brand: "JW Airlines", dest: "目的地： Paris CDG",
        tiles: { music: ["音樂", "專輯與歌單"], movies: ["電影", "播放器與片庫"], shopping: ["購物", "免稅店"], dining: ["用餐", "餐食與倒計時"], flight: ["我的飛行", "地圖與資訊"] },
        ui: { remain: "剩餘", seatbeltOn: "繫好安全帶", crew: "呼叫乘務", about: "專輯簡介", lyrics: "歌詞", playAll: "播放全部", home: "主頁", back: "返回" }
      },
      "es": {
        brand: "JW Airlines", dest: "Destino: Paris CDG",
        tiles: { music: ["Música", "Álbumes y listas"], movies: ["Películas", "Reproductor y biblioteca"], shopping: ["Compras", "Duty-Free"], dining: ["Comida", "Menú y cuenta atrás"], flight: ["Mi vuelo", "Mapa e info"] },
        ui: { remain: "Restante", seatbeltOn: "Abróchese el cinturón", crew: "Llamar tripulación", about: "Acerca del álbum", lyrics: "Letras", playAll: "Reproducir todo", home: "Inicio", back: "Volver" }
      },
      "ru": {
        brand: "JW Airlines", dest: "Пункт назначения: Paris CDG",
        tiles: { music: ["Музыка", "Альбомы и плейлисты"], movies: ["Фильмы", "Плеер и библиотека"], shopping: ["Покупки", "Duty-Free"], dining: ["Питание", "Меню и таймер"], flight: ["Мой рейс", "Карта и информация"] },
        ui: { remain: "Осталось", seatbeltOn: "Пристегните ремень", crew: "Вызвать экипаж", about: "О альбоме", lyrics: "Текст", playAll: "Воспроизвести всё", home: "Главная", back: "Назад" }
      },
      "fr": {
        brand: "JW Airlines", dest: "Destination : Paris CDG",
        tiles: { music: ["Musique", "Albums et playlists"], movies: ["Films", "Lecteur et bibliothèque"], shopping: ["Shopping", "Duty-Free"], dining: ["Restauration", "Repas & compte à rebours"], flight: ["Mon vol", "Carte et infos"] },
        ui: { remain: "Restant", seatbeltOn: "Bouclez votre ceinture", crew: "Appeler l'équipage", about: "À propos de l'album", lyrics: "Paroles", playAll: "Tout jouer", home: "Accueil", back: "Retour" }
      },
      "en": {
        brand: "JW Airlines", dest: "Destination: Paris CDG",
        tiles: { music: ["Music", "Albums & Playlists"], movies: ["Movies", "Player & Library"], shopping: ["Shopping", "Duty-Free"], dining: ["Dining", "Meal & Countdown"], flight: ["My Flight", "Map & Info"] },
        ui: { remain: "Remaining", seatbeltOn: "Seatbelt On", crew: "Call Crew", about: "About this album", lyrics: "Lyrics", playAll: "Play All", home: "Home", back: "Back" }
      }
    };

    var LANG_ORDER = ["zh-CN", "zh-TW", "es", "ru", "fr", "en"];
    var lang = localStorage.getItem("ife_lang") || "zh-CN";
    if (!I18N[lang]) lang = "zh-CN";

    function $id(id) { return document.getElementById(id); }
    function setText(id, text) { var el = $id(id); if (el) el.textContent = text; }

    function applyLang(sel) {
      if (sel) lang = sel;
      if (!I18N[lang]) lang = "zh-CN";
      localStorage.setItem("ife_lang", lang);
      var t = I18N[lang];
      setText("brandTitle", t.brand);
      setText("destText", t.dest);
      setText("tileMusic", t.tiles.music[0]); setText("tileMusicSub", t.tiles.music[1]);
      setText("tileMovies", t.tiles.movies[0]); setText("tileMoviesSub", t.tiles.movies[1]);
      setText("tileShopping", t.tiles.shopping[0]); setText("tileShoppingSub", t.tiles.shopping[1]);
      setText("tileDining", t.tiles.dining[0]); setText("tileDiningSub", t.tiles.dining[1]);
      setText("tileFlight", t.tiles.flight[0]); setText("tileFlightSub", t.tiles.flight[1]);
      var playAllBtn = $id("musicPlayAll"); if (playAllBtn) playAllBtn.title = t.ui.playAll;
      var belt = $id("btnBelt"); if (belt) belt.textContent = t.ui.seatbeltOn;
      var albumAboutTitle = $id("albumNotesTitle"); if (albumAboutTitle) albumAboutTitle.textContent = t.ui.about;
      var lyricsH = $id("lyricsH"); if (lyricsH) lyricsH.textContent = t.ui.lyrics;
      // return button text (toolbar)
      var tb = document.querySelector('.toolbar-back'); if (tb) tb.textContent = t.ui.back;
    }

    // Library (2 albums)
    var LIB = {
      artangels: {
        id: "artangels",
        artist: "Grimes",
        artistImg: IMAGE_BASE + "grimes_artist.jpg",
        title: { "en": "Art Angels", "zh-CN": "Art Angels", "zh-TW": "Art Angels", "fr": "Art Angels" },
        cover: IMAGE_BASE + "art_angles_cover.jpg",
        blurb: { "en": "Grimes’ hyperpop opus blending industrial punch with bubblegum hooks.", "zh-CN": "Grimes 的超流行专辑，工业能量与泡泡旋律的融合。", "zh-TW": "Grimes 的超流行專輯，工業能量與泡泡旋律的融合。", "fr": "Album hyperpop de Grimes mêlant puissance industrielle et refrains sucrés." },
        notes: { "zh-CN": "《Art Angels》（2015）与《Paradigmes》（2021）两张专辑呈现两种语汇：前者以工业重拍与甜美旋律拉开舞台帷幕；后者则以冷潮与黑梦色彩敞开夜行叙事。", "en": "Art Angels (2015) and Paradigmes (2021) show two vocabularies: industrial punch and sweet melodies vs. coldwave night drives." },
        year: 2015,
        tracks: [
          { t: "laughing and not being normal", len: "1:48", src: MUSIC_BASE + "Grimes - laughing and not being normal.mp3" },
          { t: "California", len: "3:16", src: MUSIC_BASE + "Grimes - California.mp3" },
          { t: "SCREAM (feat. Aristophanes)", len: "2:06", src: MUSIC_BASE + "Grimes - SCREAM.mp3" },
          { t: "Flesh without Blood", len: "4:24", src: MUSIC_BASE + "Grimes - Flesh without Blood.mp3" },
          { t: "Belly of the Beat", len: "3:26", src: MUSIC_BASE + "Grimes - Belly of the Beat.mp3" },
          { t: "Kill V. Maim", len: "4:06", src: MUSIC_BASE + "Grimes - Kill V. Maim.mp3" },
          { t: "Artangels", len: "4:06", src: MUSIC_BASE + "Grimes - Artangels.mp3" },
          { t: "Easily", len: "3:03", src: MUSIC_BASE + "Grimes - Easily.mp3" },
          { t: "Pin", len: "3:31", src: MUSIC_BASE + "Grimes - Pin.mp3" },
          { t: "REALiTi (album version)", len: "5:06", src: MUSIC_BASE + "Grimes - Realiti.mp3" },
          { t: "World Princess Part II", len: "5:07", src: MUSIC_BASE + "Grimes - World Princess Part II.mp3" },
          { t: "Venus Fly (feat. Janelle Monáe)", len: "3:45", src: MUSIC_BASE + "Grimes - Venus Fly.mp3" },
          { t: "Life in the Vivid Dream", len: "1:29", src: MUSIC_BASE + "Grimes - Life in the Vivid Dream.mp3" },
          { t: "Butterfly", len: "4:13", src: MUSIC_BASE + "Grimes - Butterfly.mp3" }
        ],
        artistBio: { "zh-CN": "Grimes — 加拿大艺术家，科幻感与 DIY 狂热混合，将失真、J-pop 光泽与舞台剧性整合。", "en": "Grimes — Canadian artist mixing sci-fi textures with DIY intensity." }
      },
      paradigmes: {
        id: "paradigmes",
        artist: "La Femme",
        artistImg: IMAGE_BASE + "lafemme_cover.jpg",
        title: { "en": "Paradigmes", "zh-CN": "Paradigmes", "zh-TW": "Paradigmes", "fr": "Paradigmes" },
        cover: IMAGE_BASE + "paradigmes_cover.jpg",
        blurb: { "en": "French surf-coldwave shapeshifting into a cinematic night drive.", "zh-CN": "法国冷潮与冲浪气质的混融，像一段夜色里的电影公路。", "fr": "Mélange de coldwave et surf français comme une route nocturne cinématographique." },
        notes: { "zh-CN": "La Femme 的《Paradigmes》（2021）以霓虹冲浪浪得林荫大道的暗影；对照《Art Angels》的甜刀锋，它像午夜磁带般翻涌。", "en": "Paradigmes (2021) by La Femme brings neon surf and coldwave shadows." },
        year: 2021,
        tracks: [
          { t: "Paradigmes Introduction", len: "—", src: MUSIC_BASE + "Paradigmes Introduction.mp3" },
          { t: "Paradigme", len: "—", src: MUSIC_BASE + "La Femme - Paradigme.mp3" },
          { t: "Le sang de mon prochain", len: "—", src: MUSIC_BASE + "La Femme - Le Sang De Mon Prochain.mp3" },
          { t: "Cool Colorado", len: "—", src: MUSIC_BASE + "La Femme - Cool Colorado.mp3" },
          { t: "Foreigner", len: "—", src: MUSIC_BASE + "La Femme - Foreigner.mp3" },
          { t: "Nouvelle-Orléans", len: "—", src: MUSIC_BASE + "La Femme - Nouvelle-Orleans.mp3" },
          { t: "Disconnexion", len: "—", src: MUSIC_BASE + "La Femme - Disconnexion.mp3" },
          { t: "Pasadena", len: "—", src: MUSIC_BASE + "La Femme - Pasadena.mp3" }
        ],
        artistBio: { "zh-CN": "La Femme — 法国乐队，冷潮与冲浪的混搭。", "en": "La Femme — French band mixing coldwave and surf." }
      }
    };

    var albumIds = Object.keys(LIB);
    var curAlbum = albumIds[0];
    var curIdx = 0;

    function slug(s) {
      return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }
    function fmtSeconds(s) {
      s = Math.floor(s || 0);
      var m = Math.floor(s / 60), sec = s % 60;
      return m + ':' + (sec < 10 ? '0' : '') + sec;
    }

    /* ---------- render album selection grid ---------- */
    function renderMusicSelection() {
      var grid = $id('albumGrid'); if (!grid) return; grid.innerHTML = '';
      albumIds.forEach(function (id) {
        var a = LIB[id];
        var title = (a.title && (a.title[lang] || a.title['zh-CN'] || a.title.en)) || '';
        var blurb = (a.blurb && (a.blurb[lang] || a.blurb['zh-CN'] || a.blurb.en)) || '';
        var card = document.createElement('div'); card.className = 'album-card'; card.dataset.album = id;
        var imgHtml = '<img src="' + a.cover + '" alt="">';
        var infoHtml = '<div class="album-info"><div class="title">' + title + '</div><div class="meta">' + a.artist + ' • ' + (a.year || '') + '</div><div class="blurb">' + blurb + '</div></div>';
        card.innerHTML = imgHtml + infoHtml;
        grid.appendChild(card);
      });
    }

    /* ---------- album view open ---------- */
    function openMusicAlbum(albumId) {
      if (!albumId) return;
      curAlbum = albumId;
      // hide all other panels, show music panel
      var panel = $id('panel-music');
      if (panel) {
        var panels = document.querySelectorAll('.panel');
        for (var i = 0; i < panels.length; i++) panels[i].classList.remove('visible');
        panel.classList.add('visible');
      }
      // hide home grid
      var home = $id('home'); if (home) home.style.display = 'none';

      var a = LIB[curAlbum]; if (!a) return;
      var title = (a.title && (a.title[lang] || a.title['zh-CN'] || a.title.en)) || '';
      var blurb = (a.blurb && (a.blurb[lang] || a.blurb['zh-CN'] || a.blurb.en)) || '';
      var notes = (a.notes && (a.notes[lang] || a.notes['zh-CN'] || a.notes.en)) || a.notes || '';

      // update banner elements
      var toolbarTitle = $id('toolbarTitle'); if (toolbarTitle) toolbarTitle.textContent = title;
      var banner = $id('bannerCover'); if (banner) banner.src = a.cover;
      var bannerSub = $id('bannerSub'); if (bannerSub) bannerSub.textContent = a.artist + ' • ' + (a.year || '');
      var bannerBlurb = $id('bannerBlurb'); if (bannerBlurb) bannerBlurb.textContent = blurb;
      var ai = $id('artistImg'); if (ai) ai.src = a.artistImg || '';
      var artistName = $id('artistName'); if (artistName) artistName.textContent = a.artist;
      var artistBioEl = $id('artistBio'); if (artistBioEl) artistBioEl.textContent = (a.artistBio && (a.artistBio[lang] || a.artistBio['zh-CN'] || a.artistBio.en)) || a.artistBio || '';
      var albumNotes = $id('albumNotes'); if (albumNotes) albumNotes.textContent = notes;

      // show music-selection container collapsed + show music-grid inside panel
      var ms = $id('music-selection'); if (ms) ms.style.display = 'none';
      var mg = (panel ? panel.querySelector('.music-grid') : null); if (mg) mg.style.display = '';

      // ensure toolbar exists and visible (only inside left column)
      ensureAlbumToolbar(true);

      // render tracks list
      renderTracks();

      // after cover loads, try to get dominant color and set glow var
      if (banner) {
        banner.onload = function () {
          extractDominantColor(banner, function (color) {
            if (color) {
              try { document.documentElement.style.setProperty('--banner-glow', 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',0.14)'); } catch (e) { }
            }
          });
        };
      }
    }

    function renderTracks() {
      var box = $id('trackList'); if (!box) return; box.innerHTML = '';
      var a = LIB[curAlbum]; if (!a) return;
      a.tracks.forEach(function (trk, i) {
        var r = document.createElement('div'); r.className = 'row';
        var titleText = trk.t || '';
        var albumTitle = (a.title && (a.title[lang] || a.title['zh-CN'] || a.title.en)) || '';
        var lenText = trk.len || '—';
        var leftSvg = '<div class="row-btn" data-idx="' + i + '" title="Play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>';
        var mid = '<div><div class="title">' + titleText + '</div><div class="meta">' + a.artist + ' • ' + albumTitle + '</div></div>';
        var right = '<div style="text-align:right">' + lenText + '</div>';
        r.innerHTML = leftSvg + mid + right;
        box.appendChild(r);
      });
    }

    /* ---------- audio setup ---------- */
    var audio = new Audio(); audio.preload = 'metadata';

    function firstPlayableIndex(albumId) { var a = LIB[albumId]; if (!a) return -1; for (var i = 0; i < a.tracks.length; i++) if (a.tracks[i].src) return i; return -1; }
    function nextPlayableIndex(albumId, from) { var a = LIB[albumId]; if (!a) return from; var n = a.tracks.length; for (var k = 1; k <= n; k++) { var idx = (from + k) % n; if (a.tracks[idx].src) return idx; } return from; }
    function prevPlayableIndex(albumId, from) { var a = LIB[albumId]; if (!a) return from; var n = a.tracks.length; for (var k = 1; k <= n; k++) { var idx = (from - k + n) % n; if (a.tracks[idx].src) return idx; } return from; }

    function setPlayIcon() { var el = $id('iconPlay'); if (el) el.innerHTML = '<path d="M8 5v14l11-7z"/>'; }
    function setPauseIcon() { var el = $id('iconPlay'); if (el) el.innerHTML = '<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>'; }

    function playIdx(i) {
      var album = LIB[curAlbum]; if (!album || !album.tracks || !album.tracks[i]) return;
      var t = album.tracks[i];
      if (!t || !t.src) { var n = nextPlayableIndex(curAlbum, i); if (n === i) return; return playIdx(n); }
      try { audio.src = t.src; audio.play().then(function () { setPauseIcon(); }).catch(function () { setPlayIcon(); }); } catch (err) { console.warn('Audio play error', err); }
      var npTitleEl = $id('npTitle'), npMetaEl = $id('npMeta'), npArtEl = $id('npArt');
      if (npTitleEl) npTitleEl.textContent = t.t;
      if (npMetaEl) npMetaEl.textContent = album.artist + ' • ' + ((album.title && (album.title[lang] || album.title['zh-CN'] || album.title.en)) || '');
      if (npArtEl) npArtEl.style.backgroundImage = 'url("' + album.cover + '")';
      curIdx = i;
    }

    audio.addEventListener('loadedmetadata', function () {
      var d = Math.floor(audio.duration || 0);
      var durEl = $id('dur'); if (durEl) durEl.textContent = fmtSeconds(d);
      updateProgressUI();
    });

    audio.addEventListener('timeupdate', function () {
      updateProgressUI();
      var curEl = $id('cur'); if (curEl) curEl.textContent = fmtSeconds(Math.floor(audio.currentTime || 0));
    });

    audio.addEventListener('ended', function () { var n = nextPlayableIndex(curAlbum, curIdx); if (n !== curIdx) { playIdx(n); updateLyricsForIndex(n); } else { setPlayIcon(); } });
    audio.addEventListener('error', function (ev) { console.warn('Audio element error', ev); });

    /* ---------- progress & volume UI handling (no visible thumb dot) ---------- */
    function updateProgressUI() {
      var rail = $id('rail'), bar = $id('bar');
      if (!rail || !bar) return;
      var total = audio.duration || 0;
      var current = audio.currentTime || 0;
      var railRect = rail.getBoundingClientRect();
      var innerW = Math.max(24, railRect.width - 24);
      var p = (total > 0) ? (current / total) : 0;
      var px = Math.max(0, Math.min(innerW, Math.round(p * innerW)));
      // set bar width as px (pixel-perfect) so dot-free bar exactly follows audio time
      bar.style.width = px + 'px';
    }

    function pointerToRatio(e, el) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] && e.touches[0].clientX));
      var px = Math.max(12, Math.min(r.width - 12, x - r.left));
      return (px - 12) / Math.max(1, (r.width - 24));
    }

    // rail drag
    var railEl = $id('rail');
    if (railEl) {
      railEl.addEventListener('pointerdown', function (e) {
        try { railEl.setPointerCapture(e.pointerId); } catch (_) { }
        function ratioFromEvent(ev) {
          var r = railEl.getBoundingClientRect();
          var clientX = (ev.clientX !== undefined ? ev.clientX : (ev.touches && ev.touches[0] && ev.touches[0].clientX));
          var px = Math.max(12, Math.min(r.width - 12, clientX - r.left));
          return (px - 12) / Math.max(1, (r.width - 24));
        }
        var r0 = ratioFromEvent(e);
        if (isFinite(audio.duration)) audio.currentTime = r0 * audio.duration;
        var move = function (ev) { var rr = ratioFromEvent(ev); if (isFinite(audio.duration)) audio.currentTime = rr * audio.duration; };
        var up = function () { try { railEl.releasePointerCapture(e.pointerId); } catch (_) { } window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
      });
    }

    // volume drag (no visible thumb but interactive)
    var volRail = $id('volRail');
    if (volRail) {
      volRail.addEventListener('pointerdown', function (e) {
        try { volRail.setPointerCapture(e.pointerId); } catch (_) { }
        var r0 = pointerToRatio(e, volRail);
        audio.volume = r0; var volBar = $id('volBar');
        if (volBar) volBar.style.width = (r0 * 100) + '%';
        var move = function (ev) { var r = pointerToRatio(ev, volRail); audio.volume = r; if (volBar) volBar.style.width = (r * 100) + '%'; };
        var up = function () { try { volRail.releasePointerCapture(e.pointerId); } catch (_) { } window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
        window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
      });
      volRail.addEventListener('click', function (e) {
        var r = pointerToRatio(e, volRail);
        audio.volume = r; var volBar = $id('volBar');
        if (volBar) volBar.style.width = (r * 100) + '%';
      });
    }

    /* ---------- lyrics loader ---------- */
    function updateLyricsForIndex(i) {
      var a = LIB[curAlbum]; var t = a && a.tracks && a.tracks[i];
      if (!t) { var lb = $id('lyricsBody'); if (lb) lb.textContent = '—'; return; }
      var lyricsTitle = $id('lyricsH'); if (lyricsTitle) lyricsTitle.textContent = (I18N[lang] || I18N.en).ui.lyrics;
      loadLyrics(curAlbum, t.t).then(function (txt) { var body = $id('lyricsBody'); if (body) body.textContent = (txt || '').replace(/\r?\n/g, '\n'); });
    }
    function loadLyrics(albumId, title) {
      var file = 'lyrics/' + albumId + '/' + slug(title) + '.txt';
      return fetch(file, { cache: 'no-store' }).then(function (r) { if (r.ok) return r.text(); return ''; }).catch(function () { return ''; });
    }

    /* ---------- simple color extraction (dominant pixel) ---------- */
    function extractDominantColor(imgEl, cb) {
      try {
        var img = new Image(); img.crossOrigin = 'anonymous'; img.src = imgEl.src;
        img.onload = function () {
          try {
            var w = 40, h = 40;
            var canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
            var ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, w, h);
            var data = ctx.getImageData(0, 0, w, h).data;
            var r = 0, g = 0, b = 0, count = 0;
            for (var i = 0; i < data.length; i += 4) {
              var alpha = data[i + 3]; if (alpha < 125) continue;
              r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
            }
            if (count === 0) return cb(null);
            r = Math.round(r / count); g = Math.round(g / count); b = Math.round(b / count);
            return cb({ r: r, g: g, b: b });
          } catch (err) { return cb(null); }
        };
        img.onerror = function () { return cb(null); };
      } catch (e) { return cb(null); }
    }

    /* ---------- keyboard shortcuts ---------- */
    window.addEventListener('keydown', function (e) {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.code === 'Space') { e.preventDefault(); var btn = $id('playPause'); if (btn) btn.click(); }
      if (e.code === 'ArrowRight') { e.preventDefault(); var n = $id('btnNext'); if (n) n.click(); }
      if (e.code === 'ArrowLeft') { e.preventDefault(); var p = $id('btnPrev'); if (p) p.click(); }
    });

    /* ---------- language modal setup ---------- */
    function ensureLangModal() {
      var screen = $id('langScreen'); var listEl = $id('langList');
      if (listEl) {
        listEl.innerHTML = '';
        for (var i = 0; i < LANG_ORDER.length; i++) {
          var code = LANG_ORDER[i];
          var mapNames = { "zh-CN": "简体中文", "zh-TW": "繁體中文", "es": "Español", "ru": "Русский", "fr": "Français", "en": "English" };
          var btn = document.createElement('button'); btn.className = 'lang-btn'; btn.dataset.lang = code; btn.textContent = mapNames[code] || code;
          listEl.appendChild(btn);
        }
      }
    }
    ensureLangModal();

    /* ---------- panels open/close ---------- */
    function closeAllPanels() {
      var panels = document.querySelectorAll('.panel');
      for (var i = 0; i < panels.length; i++) panels[i].classList.remove('visible');
      var home = document.getElementById('home');
      if (home) home.style.display = 'grid';
      var ms = document.getElementById('music-selection');
      if (ms) ms.style.display = 'block';
      var pm = document.getElementById('panel-music'); if (pm) {
        var mg = pm.querySelector('.music-grid'); if (mg) mg.style.display = 'none';
      }
      ensureAlbumToolbar(false);
    }

    var btnHomeEl = document.getElementById('btnHome');
    if (btnHomeEl) {
      btnHomeEl.addEventListener('click', function (ev) { ev.stopPropagation(); closeAllPanels(); });
    }
    var btnBeltEl = document.getElementById('btnBelt');
    if (btnBeltEl) {
      btnBeltEl.addEventListener('click', function (ev) { ev.stopPropagation(); alert((I18N[lang] || I18N[lang]).ui.seatbeltOn); });
    }
    var userBtnEl = document.getElementById('userBtn');
    if (userBtnEl) {
      userBtnEl.addEventListener('click', function (ev) { ev.stopPropagation(); alert('Profile (占位)'); });
    }
    var btnLangEl = document.getElementById('btnLang');
    if (btnLangEl) {
      btnLangEl.addEventListener('click', function (ev) { ev.stopPropagation(); var ls = document.getElementById('langScreen'); if (!ls) return; ls.style.display = (ls.style.display === 'grid' || ls.style.display === 'flex') ? 'none' : 'grid'; });
    }

    /* ---------- delegated click handler ---------- */
    document.body.addEventListener('click', function (e) {
      var tile = e.target.closest('.tile');
      if (tile && tile.dataset && tile.dataset.open) {
        var key = tile.dataset.open;
        if (key === 'music') {
          renderMusicSelection();
          var panelMusic = document.getElementById('panel-music');
          if (panelMusic) {
            var allPanels = document.querySelectorAll('.panel'); for (var i = 0; i < allPanels.length; i++) allPanels[i].classList.remove('visible');
            panelMusic.classList.add('visible');
            var homeEl = document.getElementById('home'); if (homeEl) homeEl.style.display = 'none';
            var ms = document.getElementById('music-selection'); if (ms) { ms.style.display = 'block'; ms.classList.add('visible'); }
            var mg = panelMusic.querySelector('.music-grid'); if (mg) mg.style.display = 'none';
          } else {
            var grid = document.getElementById('albumGrid'); if (grid) grid.style.display = 'block';
            var homeE = document.getElementById('home'); if (homeE) homeE.style.display = 'none';
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        var panel = document.getElementById('panel-' + key);
        if (panel) {
          var panels2 = document.querySelectorAll('.panel');
          for (var pi = 0; pi < panels2.length; pi++) panels2[pi].classList.remove('visible');
          panel.classList.add('visible');
          var h = document.getElementById('home'); if (h) h.style.display = 'none';
        } else {
          alert('模块“' + key + '”尚未实现（placeholder）。');
        }
        return;
      }

      var albumCard = e.target.closest('.album-card');
      if (albumCard && albumCard.dataset && albumCard.dataset.album) { 
        var albumId = albumCard.dataset.album;
        var panelMusic2 = document.getElementById('panel-music');
        var ms2 = document.getElementById('music-selection');
        var mg2 = panelMusic2 ? panelMusic2.querySelector('.music-grid') : null;
        if (ms2) ms2.style.display = 'none';
        if (mg2) mg2.style.display = '';
        openMusicAlbum(albumId); 
        if (panelMusic2) panelMusic2.scrollTop = 0;
        return;
      }

      var rowBtn = e.target.closest('.row-btn');
      if (rowBtn && rowBtn.dataset && rowBtn.dataset.idx !== undefined) { var idx = parseInt(rowBtn.dataset.idx, 10); playIdx(idx); updateLyricsForIndex(idx); return; }

      var btn = e.target.closest('.pill, .btn, button, .icon-btn, .badge, .lang-btn, .toolbar-back, .toolbar-play');
      if (btn) {
        var id = btn.id || (btn.dataset && btn.dataset.action);
        // toolbar back
        if (btn.classList && btn.classList.contains('toolbar-back')) { // go back to music selection (not entire home)
          renderMusicSelection();
          var panelMusic3 = document.getElementById('panel-music');
          if (panelMusic3) {
            var panels3 = document.querySelectorAll('.panel'); for (var i = 0; i < panels3.length; i++) panels3[i].classList.remove('visible');
            panelMusic3.classList.add('visible');
          }
          var ms3 = document.getElementById('music-selection'); if (ms3) ms3.style.display = 'block';
          ensureAlbumToolbar(false);
          return;
        }
        // toolbar play
        if (btn.classList && btn.classList.contains('toolbar-play')) {
          if (!audio.src) { var f = firstPlayableIndex(curAlbum); if (f !== -1) { playIdx(f); updateLyricsForIndex(f); return; } }
          if (audio.paused) { audio.play().then(function () { setPauseIcon(); }).catch(function () { setPlayIcon(); }); } else { audio.pause(); setPlayIcon(); }
          return;
        }

        if (id === 'musicBack') { closeAllPanels(); return; }
        if (id === 'musicPlayAll' || btn.classList.contains('play-pill')) { var first = firstPlayableIndex(curAlbum); if (first !== -1) { playIdx(first); updateLyricsForIndex(first); } return; }
        if (id === 'btnPrev') { curIdx = prevPlayableIndex(curAlbum, curIdx); playIdx(curIdx); updateLyricsForIndex(curIdx); return; }
        if (id === 'btnNext') { curIdx = nextPlayableIndex(curAlbum, curIdx); playIdx(curIdx); updateLyricsForIndex(curIdx); return; }
        if (id === 'playPause') {
          if (!audio.src) { var f = firstPlayableIndex(curAlbum); if (f !== -1) { playIdx(f); updateLyricsForIndex(f); return; } }
          if (audio.paused) { audio.play().then(function () { setPauseIcon(); }).catch(function () { setPlayIcon(); }); } else { audio.pause(); setPlayIcon(); }
          return;
        }
        if (id === 'btnHome') { closeAllPanels(); return; }
        if (id === 'btnCall') { alert((I18N[lang] || I18N.en).ui.crew); return; }
        if (btn.classList.contains('lang-btn') && btn.dataset && btn.dataset.lang) {
          var chosen = btn.dataset.lang;
          applyLang(chosen);
          renderMusicSelection();
          var pm = document.getElementById('panel-music');
          if (pm && pm.classList.contains('visible')) openMusicAlbum(curAlbum);
          var ls2 = document.getElementById('langScreen'); if (ls2) ls2.style.display = 'none';
          return;
        }
      }
    }, true);

    /* ---------- flight remaining countdown (5:40 starting) ---------- */
    var FIVE_H_FORTY_MS = (5 * 3600 + 40 * 60) * 1000;
    var arrive = new Date(Date.now() + FIVE_H_FORTY_MS);
    function updateFlight() {
      var now = new Date(); var total = Math.max(0, arrive - now); var secs = Math.floor(total / 1000);
      var hours = Math.floor(secs / 3600); var mins = Math.floor((secs % 3600) / 60); var s = secs % 60;
      var center = $id('remain');
      if (center) { if (hours > 0) center.textContent = hours + ':' + String(mins).padStart(2, '0'); else center.textContent = mins + ':' + String(s).padStart(2, '0'); }
    }
    updateFlight(); setInterval(updateFlight, 1000);

    /* ---------- initial volume UI ---------- */
    setTimeout(function () {
      try {
        var vol = audio.volume || 0.6;
        var vb = $id('volBar');
        if (vb) vb.style.width = (vol * 100) + '%';
      } catch (e) { }
    }, 200);

    /* ---------- album toolbar creation / control ---------- */
    function ensureAlbumToolbar(show) {
      // toolbar element expected inside left column (music-left)
      var leftCol = document.querySelector('.music-left');
      if (!leftCol) return;
      var toolbar = document.querySelector('.album-toolbar');
      if (!toolbar) {
        toolbar = document.createElement('div'); toolbar.className = 'album-toolbar';
        // create play, title, back nodes
        var play = document.createElement('div'); play.className = 'toolbar-play'; play.setAttribute('role','button'); play.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
        var title = document.createElement('div'); title.className = 'toolbar-title'; title.id = 'toolbarTitle'; title.textContent = '';
        var back = document.createElement('div'); back.className = 'toolbar-back'; back.textContent = (I18N[lang]||I18N['zh-CN']).ui.back;
        // append
        toolbar.appendChild(play);
        toolbar.appendChild(title);
        toolbar.appendChild(back);
        // insert toolbar at top of leftCol before banner (so it's visually above)
        leftCol.insertBefore(toolbar, leftCol.firstChild);
        // attach events
        play.addEventListener('click', function (ev) { ev.stopPropagation(); playClickHandler(); });
        back.addEventListener('click', function (ev) { ev.stopPropagation(); back.click(); }); // reuse delegated handler via .toolbar-back class
      }
      // show / hide
      toolbar.style.display = show ? 'flex' : 'none';

      // ensure banner moved downward so its top doesn't get overlapped
      var banner = document.querySelector('.album-banner');
      if (banner) {
        if (show) banner.style.marginTop = '18px';
        else banner.style.marginTop = '0';
      }
    }

    function playClickHandler() {
      if (!audio.src) { var f = firstPlayableIndex(curAlbum); if (f !== -1) { playIdx(f); updateLyricsForIndex(f); return; } }
      if (audio.paused) { audio.play().then(function () { setPauseIcon(); }).catch(function () { setPlayIcon(); }); } else { audio.pause(); setPlayIcon(); }
    }

    /* ---------- init view ---------- */
    renderMusicSelection();
    var homeEl = $id('home'); if (homeEl) homeEl.style.display = 'grid';
    var playerEl = $id('player'); if (playerEl) playerEl.style.display = '';

    applyLang(lang);
    ensureAlbumToolbar(false);

  } catch (err) {
    console.error('Initialization error', err);
  }
});