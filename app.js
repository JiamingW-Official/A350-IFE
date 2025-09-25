// app.js — complete, unabridged, with banner-cleanup and full handlers
document.addEventListener('DOMContentLoaded', function () {
  try {
    var MUSIC_BASE = "music/";
    var IMAGE_BASE = "images/";

    // i18n
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
      // toolbar back label if exists
      var tbBack = $id('tbBack'); if (tbBack) tbBack.textContent = (I18N[lang] || I18N.en).ui.back;
    }

    // Library (2 albums full track lists)
    var LIB = {
      artangels: {
        id: "artangels",
        artist: "Grimes",
        artistImg: IMAGE_BASE + "grimes_cover.jpg",
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

    // Helper: try image candidates sequentially
    function tryImageSources(imgEl, candidates) {
      if (!imgEl || !candidates || !candidates.length) return;
      var i = 0;
      imgEl.onerror = function () {
        if (i < candidates.length) {
          imgEl.src = candidates[i++];
        }
      };
      // set first available
      imgEl.src = candidates[i++] || '';
    }

    /* ---------- CLEANUP: remove stray toolbar controls INSIDE BANNER ---------- */
    function cleanBannerControls() {
      var banner = $id('banner') || document.querySelector('.banner') || document.querySelector('.album-banner');
      if (!banner) return;

      // common suspicious selectors (small overlay widgets)
      var overlaySelectors = [
        '.tb-play', '.tb-back', '.tb-title', '.banner-local-play', '.local-back',
        '.banner-controls', '#bannerToolbar', '.banner-toolbar', '.toolbar-overlay',
        '.mini-btn', '.mini-toolbar', '.overlay-button', '.small-button', '.banner-small'
      ];

      // remove by selector when node is small or matches toolbar-like classes
      overlaySelectors.forEach(function (sel) {
        try {
          var list = banner.querySelectorAll(sel);
          list.forEach(function (n) {
            try {
              var rect = n.getBoundingClientRect ? n.getBoundingClientRect() : { width: 0, height: 0 };
              var small = (rect.width < 180 && rect.height < 90);
              var cls = (n.className && String(n.className).toLowerCase()) || '';
              var likely = cls.indexOf('tb-') !== -1 || cls.indexOf('toolbar') !== -1 || cls.indexOf('mini') !== -1 || cls.indexOf('overlay') !== -1;
              if (small || likely) {
                n.parentNode && n.parentNode.removeChild(n);
              }
            } catch (e) { }
          });
        } catch (e) { }
      });

      // remove small nodes whose text equals Album or localized back
      var textCandidates = [ (I18N[lang] || I18N.en).ui.back, 'Album', 'album' ];
      var nodes = banner.querySelectorAll('*');
      nodes.forEach(function (el) {
        try {
          if (!el || !el.textContent) return;
          var txt = el.textContent.trim();
          if (!txt) return;
          var r = el.getBoundingClientRect ? el.getBoundingClientRect() : { width: 9999, height: 9999 };
          var small = (r.width < 200 && r.height < 80);
          if (small && textCandidates.indexOf(txt) !== -1) {
            el.parentNode && el.parentNode.removeChild(el);
          }
        } catch (e) { }
      });

      // lastly remove role=button small elements inside banner
      var roleBtns = banner.querySelectorAll('[role="button"]');
      roleBtns.forEach(function (n) {
        try {
          var rect = n.getBoundingClientRect ? n.getBoundingClientRect() : { width: 0, height: 0 };
          if (rect.width < 180 && rect.height < 80) n.parentNode && n.parentNode.removeChild(n);
        } catch (e) { }
      });
    }

    /* ---------- render music selection (album grid) ---------- */
    function renderMusicSelection() {
      var grid = $id('albumGrid'); if (!grid) return; grid.innerHTML = '';
      albumIds.forEach(function (id) {
        var a = LIB[id];
        var title = (a.title && (a.title[lang] || a.title['zh-CN'] || a.title.en)) || '';
        var blurb = (a.blurb && (a.blurb[lang] || a.blurb['zh-CN'] || a.blurb.en)) || '';
        var card = document.createElement('div'); card.className = 'album-card'; card.dataset.album = id;
        var img = document.createElement('img'); img.alt = title;
        var cands = [a.cover, IMAGE_BASE + id + '_cover.jpg', IMAGE_BASE + id + '.jpg', IMAGE_BASE + 'art_angles_cover.jpg', IMAGE_BASE + 'paradigmes_cover.jpg', IMAGE_BASE + 'grimes_cover.jpg', IMAGE_BASE + 'lafemme_cover.jpg'];
        tryImageSources(img, cands);
        var info = document.createElement('div'); info.className = 'album-info';
        var tdiv = document.createElement('div'); tdiv.className = 'title'; tdiv.textContent = title;
        var meta = document.createElement('div'); meta.className = 'meta'; meta.textContent = a.artist + ' • ' + (a.year || '');
        var bl = document.createElement('div'); bl.className = 'blurb'; bl.textContent = blurb;
        info.appendChild(tdiv); info.appendChild(meta); info.appendChild(bl);
        card.appendChild(img); card.appendChild(info);
        grid.appendChild(card);
      });
    }

    /* ---------- floating album toolbar (top of album page) ---------- */
    function ensureAlbumToolbar() {
      var tb = $id('albumToolbar');
      if (tb) return tb;
      tb = document.createElement('div');
      tb.id = 'albumToolbar';
      tb.style.position = 'fixed';
      tb.style.left = '12px';
      tb.style.right = '12px';
      tb.style.top = '98px';
      tb.style.zIndex = '2200';
      tb.style.display = 'flex';
      tb.style.alignItems = 'center';
      tb.style.gap = '18px';
      tb.style.padding = '12px 18px';
      tb.style.borderRadius = '12px';
      tb.style.backdropFilter = 'blur(18px) saturate(1.2)';
      tb.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))';
      tb.style.boxShadow = '0 8px 30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.02)';
      tb.style.transition = 'opacity .18s ease, transform .18s ease';
      tb.style.pointerEvents = 'auto';
      tb.innerHTML = [
        '<div class="tb-play" id="tbPlay" title="Play/Pause" style="width:64px;height:64px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:linear-gradient(180deg,#19d267,#06b56b);box-shadow:0 8px 24px rgba(6,10,14,0.6)"><svg viewBox="0 0 24 24" id="tbPlayIcon" width="28" height="28" fill="#052517"><path d="M8 5v14l11-7z"/></svg></div>',
        '<div class="tb-title" id="tbTitle" style="font-weight:900;font-size:28px;color:#fff;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-left:6px"></div>',
        '<div class="tb-back" id="tbBack" style="width:auto;padding:10px 16px;border-radius:10px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.04);font-weight:700;color:#fff">返回</div>'
      ].join('');
      document.body.appendChild(tb);

      // Behavior
      tb.querySelector('#tbPlay').addEventListener('click', function (ev) {
        ev.stopPropagation();
        if (!audio.src) {
          var f = firstPlayableIndex(curAlbum);
          if (f !== -1) { playIdx(f); updateLyricsForIndex(f); }
          return;
        }
        if (audio.paused) { audio.play().then(function () { setPauseIcon(); }).catch(function () { setPlayIcon(); }); } else { audio.pause(); setPlayIcon(); }
      });

      tb.querySelector('#tbBack').addEventListener('click', function (ev) {
        ev.stopPropagation();
        // go back to music selection (not main home)
        var panelMusic = $id('panel-music');
        if (panelMusic) {
          var ms = $id('music-selection');
          if (ms) { ms.style.display = 'block'; ms.classList.add('visible'); }
          var mg = panelMusic.querySelector('.music-grid');
          if (mg) mg.style.display = 'none';
          panelMusic.classList.add('visible');
        }
        hideAlbumToolbar();
      });

      return tb;
    }

    function positionAlbumToolbar() {
      var tb = $id('albumToolbar'); if (!tb) return;
      var panel = $id('panel-music'); if (!panel || !panel.classList.contains('visible')) { hideAlbumToolbar(); return; }
      var leftCol = panel.querySelector('.music-left');
      if (!leftCol) { hideAlbumToolbar(); return; }
      var rect = leftCol.getBoundingClientRect();
      var left = Math.max(12, rect.left);
      var width = Math.max(320, rect.width);
      tb.style.left = left + 'px';
      tb.style.width = width + 'px';
      var topBase = document.querySelector('header') ? (document.querySelector('header').getBoundingClientRect().bottom + 12) : 12;
      tb.style.top = topBase + 'px';
    }

    var toolbarRaf = null;
    window.addEventListener('resize', function () { if (toolbarRaf) cancelAnimationFrame(toolbarRaf); toolbarRaf = requestAnimationFrame(positionAlbumToolbar); });
    window.addEventListener('scroll', function () { if (toolbarRaf) cancelAnimationFrame(toolbarRaf); toolbarRaf = requestAnimationFrame(positionAlbumToolbar); });

    function showAlbumToolbar(titleText) {
      var tb = ensureAlbumToolbar();
      var tbTitle = tb.querySelector('#tbTitle');
      var back = tb.querySelector('#tbBack');
      if (tbTitle) tbTitle.textContent = titleText || '';
      if (back) back.textContent = (I18N[lang] || I18N.en).ui.back;
      tb.style.opacity = '1'; tb.style.transform = 'translateY(0px)';
      positionAlbumToolbar();
      // push down the left columns content slightly so toolbar doesn't overlap banner content
      var panel = $id('panel-music');
      if (panel) {
        var left = panel.querySelector('.music-left');
        if (left) left.style.paddingTop = '88px'; // ensure content pushed below toolbar
      }
    }
    function hideAlbumToolbar() {
      var tb = $id('albumToolbar'); if (tb) { tb.style.opacity = '0'; tb.style.transform = 'translateY(-6px)'; }
      var panel = $id('panel-music');
      if (panel) {
        var left = panel.querySelector('.music-left');
        if (left) left.style.paddingTop = ''; // reset
      }
    }

    /* ---------- open music album (populate banner + tracks) ---------- */
    function openMusicAlbum(albumId) {
      if (!albumId) return;
      curAlbum = albumId;

      // Pre-clean banner
      cleanBannerControls();

      var panel = $id('panel-music');
      if (panel) {
        var panels = document.querySelectorAll('.panel');
        for (var i = 0; i < panels.length; i++) panels[i].classList.remove('visible');
        panel.classList.add('visible');
      }
      var home = $id('home'); if (home) home.style.display = 'none';

      var a = LIB[curAlbum]; if (!a) return;
      var title = (a.title && (a.title[lang] || a.title['zh-CN'] || a.title.en)) || '';
      var blurb = (a.blurb && (a.blurb[lang] || a.blurb['zh-CN'] || a.blurb.en)) || '';
      var notes = (a.notes && (a.notes[lang] || a.notes['zh-CN'] || a.notes.en)) || a.notes || '';

      var toolbarTitle = $id('toolbarTitle'); if (toolbarTitle) toolbarTitle.textContent = title;
      var banner = $id('bannerCover') || document.querySelector('#bannerCover') || document.querySelector('.banner-left img') || document.querySelector('.album-banner img');
      if (banner && banner.tagName === 'IMG') {
        var cands = [a.cover, IMAGE_BASE + a.id + '_cover.jpg', IMAGE_BASE + a.id + '.jpg', IMAGE_BASE + 'paradigmes_cover.jpg', IMAGE_BASE + 'art_angles_cover.jpg', IMAGE_BASE + 'grimes_cover.jpg', IMAGE_BASE + 'lafemme_cover.jpg'];
        tryImageSources(banner, cands);
      } else {
        // if banner is not an <img> but a container with background, set css background
        var bannerCont = $id('banner') || document.querySelector('.album-banner');
        if (bannerCont) {
          bannerCont.style.backgroundImage = 'url("' + (a.cover || '') + '")';
          bannerCont.style.backgroundSize = 'cover';
        }
      }

      var bannerSub = $id('bannerSub'); if (bannerSub) bannerSub.textContent = a.artist + ' • ' + (a.year || '');
      var bannerBlurb = $id('bannerBlurb'); if (bannerBlurb) bannerBlurb.textContent = blurb;
      var ai = $id('artistImg'); if (ai) {
        var acands = [a.artistImg, IMAGE_BASE + a.id + '_artist.jpg', IMAGE_BASE + a.id + '.jpg', IMAGE_BASE + 'lafemme_cover.jpg', IMAGE_BASE + 'grimes_cover.jpg'];
        tryImageSources(ai, acands);
      }
      var artistName = $id('artistName'); if (artistName) artistName.textContent = a.artist;
      var artistBioEl = $id('artistBio'); if (artistBioEl) artistBioEl.textContent = (a.artistBio && (a.artistBio[lang] || a.artistBio['zh-CN'] || a.artistBio.en)) || a.artistBio || '';
      var albumNotes = $id('albumNotes'); if (albumNotes) albumNotes.textContent = notes;

      // Hide small overlay nodes in banner if any remain
      cleanBannerControls();

      var ms = $id('music-selection'); if (ms) ms.style.display = 'none';
      var mg = panel ? panel.querySelector('.music-grid') : null; if (mg) mg.style.display = '';

      renderTracks();

      // show floating toolbar (top)
      showAlbumToolbar(title);

      // extract color glow
      var tryImg = banner && banner.tagName === 'IMG' ? banner : (ai && ai.tagName === 'IMG' ? ai : null);
      if (tryImg) {
        tryImg.onload = function () {
          extractDominantColor(tryImg, function (color) {
            if (color) {
              try { document.documentElement.style.setProperty('--banner-glow', 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',0.22)'); } catch (e) { }
            }
            positionAlbumToolbar();
          });
        };
        if (tryImg.complete) {
          extractDominantColor(tryImg, function (color) {
            if (color) {
              try { document.documentElement.style.setProperty('--banner-glow', 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',0.22)'); } catch (e) { }
            }
            positionAlbumToolbar();
          });
        }
      } else {
        positionAlbumToolbar();
      }
    }

    /* ---------- render tracks list ---------- */
    function renderTracks() {
      var box = $id('trackList'); if (!box) return; box.innerHTML = '';
      var a = LIB[curAlbum]; if (!a) return;
      a.tracks.forEach(function (trk, i) {
        var r = document.createElement('div'); r.className = 'row'; r.dataset.idx = i;
        var titleText = trk.t || '';
        var albumTitle = (a.title && (a.title[lang] || a.title['zh-CN'] || a.title.en)) || '';
        var lenText = trk.len || '—';
        var leftSvg = '<div class="row-btn" data-idx="' + i + '" title="Play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>';
        var mid = '<div style="flex:1"><div class="title">' + titleText + '</div><div class="meta">' + a.artist + ' • ' + albumTitle + '</div></div>';
        var right = '<div style="width:80px;text-align:right">' + lenText + '</div>';
        r.innerHTML = leftSvg + mid + right;
        // click row to play
        r.addEventListener('click', function (ev) {
          if (ev.target && ev.target.closest('.row-btn')) return; // click on small button will be handled separately
          document.querySelectorAll('.row').forEach(function (el) { el.classList.remove('active'); });
          r.classList.add('active');
          playIdx(i); updateLyricsForIndex(i);
        }, false);
        // row-btn click (play single track)
        var rowBtn = r.querySelector('.row-btn');
        if (rowBtn) {
          rowBtn.addEventListener('click', function (ev) { ev.stopPropagation(); playIdx(i); updateLyricsForIndex(i); });
        }
        box.appendChild(r);
      });
    }

    /* ---------- audio playback handling ---------- */
    var audio = new Audio(); audio.preload = 'metadata';
    audio.crossOrigin = 'anonymous';

    function firstPlayableIndex(albumId) { var a = LIB[albumId]; if (!a) return -1; for (var i = 0; i < a.tracks.length; i++) if (a.tracks[i].src) return i; return -1; }
    function nextPlayableIndex(albumId, from) { var a = LIB[albumId]; if (!a) return from; var n = a.tracks.length; for (var k = 1; k <= n; k++) { var idx = (from + k) % n; if (a.tracks[idx].src) return idx; } return from; }
    function prevPlayableIndex(albumId, from) { var a = LIB[albumId]; if (!a) return from; var n = a.tracks.length; for (var k = 1; k <= n; k++) { var idx = (from - k + n) % n; if (a.tracks[idx].src) return idx; } return from; }

    function setPlayIcon() { var el = $id('iconPlay'); if (el) el.innerHTML = '<path d="M8 5v14l11-7z"/>'; var tbIcon = $id('tbPlayIcon'); if (tbIcon) tbIcon.innerHTML = '<path d="M8 5v14l11-7z"/>'; }
    function setPauseIcon() { var el = $id('iconPlay'); if (el) el.innerHTML = '<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>'; var tbIcon = $id('tbPlayIcon'); if (tbIcon) tbIcon.innerHTML = '<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>'; }

    function playIdx(i) {
      var album = LIB[curAlbum]; if (!album || !album.tracks || !album.tracks[i]) return;
      var t = album.tracks[i];
      if (!t || !t.src) { var n = nextPlayableIndex(curAlbum, i); if (n === i) return; return playIdx(n); }
      try {
        audio.src = t.src;
        audio.play().then(function () { setPauseIcon(); }).catch(function () { setPlayIcon(); });
      } catch (err) { console.warn('Audio play error', err); }
      var npTitleEl = $id('npTitle'), npMetaEl = $id('npMeta'), npArtEl = $id('npArt');
      if (npTitleEl) npTitleEl.textContent = t.t;
      if (npMetaEl) npMetaEl.textContent = album.artist + ' • ' + ((album.title && (album.title[lang] || album.title['zh-CN'] || album.title.en)) || '');
      if (npArtEl) npArtEl.style.backgroundImage = 'url("' + (album.cover || '') + '")';
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

    function updateProgressUI() {
      var rail = $id('rail'), bar = $id('bar');
      if (!rail || !bar) return;
      var total = audio.duration || 0;
      var current = audio.currentTime || 0;
      var railRect = rail.getBoundingClientRect();
      var innerW = Math.max(24, railRect.width - 24);
      var p = (total > 0) ? (current / total) : 0;
      var px = Math.max(0, Math.min(innerW, Math.round(p * innerW)));
      bar.style.width = px + 'px';
      // ensure thumb aligns: if there is a thumb element make its center at 12 + px
      var seekThumb = rail.querySelector('.thumb');
      if (seekThumb) {
        seekThumb.style.left = (12 + px) + 'px';
      }
    }

    function pointerToRatio(e, el) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] && e.touches[0].clientX));
      var px = Math.max(12, Math.min(r.width - 12, x - r.left));
      return (px - 12) / Math.max(1, (r.width - 24));
    }

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

    var volRail = $id('volRail');
    if (volRail) {
      volRail.addEventListener('pointerdown', function (e) {
        try { volRail.setPointerCapture(e.pointerId); } catch (_) { }
        var r0 = pointerToRatio(e, volRail);
        audio.volume = r0; var volBar = $id('volBar'), volThumb = $id('volThumb');
        if (volBar) volBar.style.width = (r0 * 100) + '%';
        if (volThumb) volThumb.style.left = (r0 * (volRail.getBoundingClientRect().width - 16) + 8) + 'px';
        var move = function (ev) { var r = pointerToRatio(ev, volRail); audio.volume = r; if (volBar) volBar.style.width = (r * 100) + '%'; if (volThumb) volThumb.style.left = (r * (volRail.getBoundingClientRect().width - 16) + 8) + 'px'; };
        var up = function () { try { volRail.releasePointerCapture(e.pointerId); } catch (_) { } window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
        window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
      });
      volRail.addEventListener('click', function (e) {
        var r = pointerToRatio(e, volRail);
        audio.volume = r; var volBar = $id('volBar'), volThumb = $id('volThumb');
        if (volBar) volBar.style.width = (r * 100) + '%'; if (volThumb) volThumb.style.left = (r * (volRail.getBoundingClientRect().width - 16) + 8) + 'px';
      });
    }

    /* ---------- lyrics loading ---------- */
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

    /* ---------- dominant color extractor ---------- */
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

    /* ---------- language modal ---------- */
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

    /* ---------- UI: click handlers for header buttons ---------- */
    function closeAllPanels() {
      var panels = document.querySelectorAll('.panel');
      for (var i = 0; i < panels.length; i++) panels[i].classList.remove('visible');
      var home = document.getElementById('home');
      if (home) home.style.display = 'grid';
      var ms = document.getElementById('music-selection');
      if (ms) ms.style.display = 'none';
      var pm = document.getElementById('panel-music'); if (pm) {
        var mg = pm.querySelector('.music-grid'); if (mg) mg.style.display = 'none';
      }
      hideAlbumToolbar();
    }

    var btnHomeEl = document.getElementById('btnHome');
    if (btnHomeEl) {
      btnHomeEl.addEventListener('click', function (ev) { ev.stopPropagation(); closeAllPanels(); });
    }
    var btnBeltEl = document.getElementById('btnBelt');
    if (btnBeltEl) {
      btnBeltEl.addEventListener('click', function (ev) { ev.stopPropagation(); alert((I18N && I18N[lang] ? I18N[lang].ui.seatbeltOn : 'Seatbelt On')); });
    }
    var userBtnEl = document.getElementById('userBtn');
    if (userBtnEl) {
      userBtnEl.addEventListener('click', function (ev) { ev.stopPropagation(); alert('Profile (占位)'); });
    }
    var btnLangEl = document.getElementById('btnLang');
    if (btnLangEl) {
      btnLangEl.addEventListener('click', function (ev) { ev.stopPropagation(); var ls = document.getElementById('langScreen'); if (!ls) return; ls.style.display = (ls.style.display === 'grid' || ls.style.display === 'flex') ? 'none' : 'grid'; });
    }

    /* ---------- delegated body click handler ---------- */
    document.body.addEventListener('click', function (e) {
      // tile click (open modules)
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

      // album card click -> open album
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

      // row btn click (play)
      var rowBtn = e.target.closest('.row-btn');
      if (rowBtn && rowBtn.dataset && rowBtn.dataset.idx !== undefined) { var idx = parseInt(rowBtn.dataset.idx, 10); playIdx(idx); updateLyricsForIndex(idx); return; }

      // generic controls: pill, btn, icon-btn, badge, lang-btn
      var btn = e.target.closest('.pill, .btn, button, .icon-btn, .badge, .lang-btn, .play-pill');
      if (btn) {
        var id = btn.id || (btn.dataset && btn.dataset.action);
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

      // click outside lang modal to close
      var langScreen = $id('langScreen');
      if (langScreen && (e.target === langScreen)) { langScreen.style.display = 'none'; return; }
    }, true);

    /* ---------- flight remaining countdown ---------- */
    var FIVE_H_FORTY_MS = (5 * 3600 + 40 * 60) * 1000;
    var arrive = new Date(Date.now() + FIVE_H_FORTY_MS);
    function updateFlight() {
      var now = new Date(); var total = Math.max(0, arrive - now); var secs = Math.floor(total / 1000);
      var hours = Math.floor(secs / 3600); var mins = Math.floor((secs % 3600) / 60); var s = secs % 60;
      var center = $id('remain');
      if (center) { if (hours > 0) center.textContent = hours + ':' + String(mins).padStart(2, '0'); else center.textContent = mins + ':' + String(s).padStart(2, '0'); }
    }
    updateFlight(); setInterval(updateFlight, 1000);

    // set initial volume UI
    setTimeout(function () {
      try {
        var vol = audio.volume || 0.6;
        var vb = $id('volBar'), vt = $id('volThumb'), vr = $id('volRail');
        if (vb) vb.style.width = (vol * 100) + '%';
        if (vt && vr) vt.style.left = (vol * (vr.getBoundingClientRect().width - 16) + 8) + 'px';
      } catch (e) { }
    }, 200);

    // initial cleanup
    setTimeout(function () { cleanBannerControls(); }, 150);

    // init view
    renderMusicSelection();
    var homeEl = $id('home'); if (homeEl) homeEl.style.display = 'grid';
    var playerEl = $id('player'); if (playerEl) playerEl.style.display = '';

    applyLang(lang);

  } catch (err) {
    console.error('Initialization error', err);
  }
});