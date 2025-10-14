// app.js — 完整版本（替换现有文件）
// 功能要点：
// - i18n 与语言记忆
// - 专辑选择页与专辑详情页（toolbar 仅在专辑详情页显示）
// - 流畅的播放控制（键盘左右、播放/暂停、下一首、上一首）
// - 正确的行高亮（同步播放），并确保不会跳过索引
// - 修复因通过按钮模拟 click 导致的“跳过一个”的问题（直接调用函数）
// - 行内播放按钮（svg）强制为白色
// - 列表滚动 / 高度行为微调，尽量避免底部额外空白
// - 兼容你现有 HTML 结构（如 id: panel-music, albumGrid, music-selection, trackList 等）

document.addEventListener('DOMContentLoaded', function () {
  try {
    const MUSIC_BASE = "music/";
    const IMAGE_BASE = "images/";

    // i18n map (保持之前版本)
    const I18N = {
      "zh-CN": {
        brand: "JW Airlines", dest: "目的地： 旧金山 SFO",
        tiles: { music: ["音乐", "专辑与歌单"], movies: ["电影", "播放器与片库"], shopping: ["购物", "免税店"], dining: ["用餐", "餐食与倒计时"], flight: ["我的飞行", "地图与信息"] },
        ui: { remain: "剩余", seatbeltOn: "系好安全带", crew: "呼叫乘务", about: "专辑简介", lyrics: "歌词", playAll: "播放全部", home: "主页", back: "返回" }
      },
      "zh-TW": {
        brand: "JW Airlines", dest: "目的地： 舊金山 SFO",
        tiles: { music: ["音樂", "專輯與歌單"], movies: ["電影", "播放器與片庫"], shopping: ["購物", "免稅店"], dining: ["用餐", "餐食與倒計時"], flight: ["我的飛行", "地圖與資訊"] },
        ui: { remain: "剩餘", seatbeltOn: "繫好安全帶", crew: "呼叫乘務", about: "專輯簡介", lyrics: "歌詞", playAll: "播放全部", home: "主頁", back: "返回" }
      },
      "es": {
        brand: "JW Airlines", dest: "Destino: San Francisco SFO",
        tiles: { music: ["Música", "Álbumes y listas"], movies: ["Películas", "Reproductor y biblioteca"], shopping: ["Compras", "Duty-Free"], dining: ["Comida", "Menú y cuenta atrás"], flight: ["Mi vuelo", "Mapa e info"] },
        ui: { remain: "Restante", seatbeltOn: "Abróchese el cinturón", crew: "Llamar tripulación", about: "Acerca del álbum", lyrics: "Letras", playAll: "Reproducir todo", home: "Inicio", back: "Volver" }
      },
      "ru": {
        brand: "JW Airlines", dest: "Пункт назначения: Сан‑Франциско SFO",
        tiles: { music: ["Музыка", "Альбомы и плейлисты"], movies: ["Фильмы", "Плеер и библиотека"], shopping: ["Покупки", "Duty-Free"], dining: ["Питание", "Меню и таймер"], flight: ["Мой рейс", "Карта и информация"] },
        ui: { remain: "Осталось", seatbeltOn: "Пристегните ремень", crew: "Вызвать экипаж", about: "О альбоме", lyrics: "Текст", playAll: "Воспроизвести всё", home: "Главная", back: "Назад" }
      },
      "fr": {
        brand: "JW Airlines", dest: "Destination : San Francisco SFO",
        tiles: { music: ["Musique", "Albums et playlists"], movies: ["Films", "Lecteur et bibliothèque"], shopping: ["Shopping", "Duty-Free"], dining: ["Restauration", "Repas & compte à rebours"], flight: ["Mon vol", "Carte et infos"] },
        ui: { remain: "Restant", seatbeltOn: "Bouclez votre ceinture", crew: "Appeler l'équipage", about: "À propos de l'album", lyrics: "Paroles", playAll: "Tout jouer", home: "Accueil", back: "Retour" }
      },
      "en": {
        brand: "JW Airlines", dest: "Destination: San Francisco SFO",
        tiles: { music: ["Music", "Albums & Playlists"], movies: ["Movies", "Player & Library"], shopping: ["Shopping", "Duty-Free"], dining: ["Dining", "Meal & Countdown"], flight: ["My Flight", "Map & Info"] },
        ui: { remain: "Remaining", seatbeltOn: "Seatbelt On", crew: "Call Crew", about: "About this album", lyrics: "Lyrics", playAll: "Play All", home: "Home", back: "Back" }
      }
    };


    // Dining i18n labels
    const DINING_I18N = {
      "zh-CN": { title: "用餐", sub: "头等舱品鉴菜单", wine: "酒精饮品",
        course: { starter: "前菜", main: "主菜", soup: "热汤", bread: "面包篮", dessert: "甜点", cheese: "奶酪", icecream: "冰淇淋" },
        drinks: { non: "非酒精饮品", juice: "果汁", mocktail: "无酒精鸡尾酒", soft: "软饮", tea: "茶", coffee: "咖啡" },
        alcoholHeadings: { champagne: "香槟", white: "白葡萄酒", red: "红葡萄酒", dessert: "甜型酒", fortified: "加强酒" },
        tags: { vegan: "Vegan", gf: "无麸质", halal: "清真", spicy: "辣度" }, kcal: "千卡" },
      "zh-TW": { title: "用餐", sub: "頭等艙品嚐菜單", wine: "酒精飲品",
        course: { starter: "前菜", main: "主菜", soup: "熱湯", bread: "麵包籃", dessert: "甜點", cheese: "起司", icecream: "冰淇淋" },
        drinks: { non: "非酒精飲品", juice: "果汁", mocktail: "無酒精雞尾酒", soft: "軟飲", tea: "茶", coffee: "咖啡" },
        alcoholHeadings: { champagne: "香檳", white: "白酒", red: "紅酒", dessert: "甜酒", fortified: "加烈酒" },
        tags: { vegan: "Vegan", gf: "無麩質", halal: "清真", spicy: "辣" }, kcal: "千卡" },
      en: { title: "Dining", sub: "First Class Tasting Menu", wine: "Alcohol",
        course: { starter: "Starters", main: "Mains", soup: "Soup", bread: "Bread Basket", dessert: "Dessert", cheese: "Cheese", icecream: "Ice Cream" },
        drinks: { non: "Non‑alcoholic", juice: "Juice", mocktail: "Mocktail", soft: "Soft Drinks", tea: "Tea", coffee: "Coffee" },
        alcoholHeadings: { champagne: "Champagne", white: "White", red: "Red", dessert: "Dessert", fortified: "Fortified" },
        tags: { vegan: "Vegan", gf: "Gluten‑free", halal: "Halal", spicy: "Spicy" }, kcal: "kcal" },
      fr: { title: "Restauration", sub: "Menu Dégustation Première Classe", wine: "Alcools",
        course: { starter: "Entrées", main: "Plats", soup: "Soupe", bread: "Panier de pain", dessert: "Dessert", cheese: "Fromages", icecream: "Glace" },
        drinks: { non: "Sans alcool", juice: "Jus", mocktail: "Mocktail", soft: "Boissons fraîches", tea: "Thé", coffee: "Café" },
        alcoholHeadings: { champagne: "Champagne", white: "Blanc", red: "Rouge", dessert: "Liquoreux", fortified: "Vins mutés" },
        tags: { vegan: "Vegan", gf: "Sans gluten", halal: "Halal", spicy: "Épicé" }, kcal: "kcal" },
      es: { title: "Gastronomía", sub: "Menú Degustación Primera Clase", wine: "Alcohol",
        course: { starter: "Entrantes", main: "Principales", soup: "Sopa", bread: "Panera", dessert: "Postre", cheese: "Quesos", icecream: "Helado" },
        drinks: { non: "Sin alcohol", juice: "Zumos", mocktail: "Cócteles sin alcohol", soft: "Refrescos", tea: "Té", coffee: "Café" },
        alcoholHeadings: { champagne: "Champagne", white: "Blanco", red: "Tinto", dessert: "Dulce", fortified: "Generoso" },
        tags: { vegan: "Vegano", gf: "Sin gluten", halal: "Halal", spicy: "Picante" }, kcal: "kcal" },
      ru: { title: "Питание", sub: "Дегустационное меню Первого класса", wine: "Алкоголь",
        course: { starter: "Закуски", main: "Горячие блюда", soup: "Суп", bread: "Хлебная корзина", dessert: "Десерт", cheese: "Сыры", icecream: "Мороженое" },
        drinks: { non: "Безалкогольные", juice: "Соки", mocktail: "Безалк. коктейли", soft: "Газированные напитки", tea: "Чай", coffee: "Кофе" },
        alcoholHeadings: { champagne: "Шампанское", white: "Белые", red: "Красные", dessert: "Десертные", fortified: "Креплёные" },
        tags: { vegan: "Веган", gf: "Без глютена", halal: "Халяль", spicy: "Острое" }, kcal: "ккал" }
    };

    // Dining data model
    const DINING = {
      starters: [
        { t: { en: "Oscietra caviar service", "zh-CN": "奥西特拉鱼子酱礼遇", fr: "Service de caviar Oscietra" }, kcal: 210, tags: ["gf"], d: { en: "Traditional garnish: blinis, crème fraîche, chives" } },
        { t: { en: "Langoustine carpaccio", "zh-CN": "挪威海螯虾薄片", fr: "Carpaccio de langoustine" }, kcal: 180, tags: ["gf"], d: { en: "Citrus gel, basil oil, sea salt" } },
        { t: { en: "Heirloom tomato tart", "zh-CN": "传家宝蕃茄塔", fr: "Tarte à la tomate ancienne" }, kcal: 240, tags: ["vegan"], d: { en: "Black olive tapenade, micro basil" } }
      ],
      mains: [
        { t: { en: "A5 wagyu tenderloin", "zh-CN": "A5 和牛菲力", fr: "Filet de wagyu A5" }, kcal: 640, tags: ["gf", "halal"], d: { en: "Truffle jus, Paris mash" } },
        { t: { en: "Glacier cod à la plancha", "zh-CN": "铁板冰岛鳕鱼", fr: "Cabillaud à la plancha" }, kcal: 520, tags: ["gf"], d: { en: "Charred leek, champagne beurre blanc" } },
        { t: { en: "Sichuan mapo tofu couture", "zh-CN": "川味麻婆豆腐·高定", fr: "Mapo tofu couture" }, kcal: 430, tags: ["vegan", "spicy"], d: { en: "Green peppercorn, smoked chili oil" } }
      ],
      soup: [
        { t: { en: "Porcini cappuccino", "zh-CN": "牛肝菌卡布奇诺", fr: "Cappuccino de cèpes" }, kcal: 120, tags: ["gf"], d: { en: "Foam of parmesan, chive dust" } },
        { t: { en: "Lobster bisque", "zh-CN": "龙虾浓汤", fr: "Bisque de homard" }, kcal: 210, tags: ["gf"], d: { en: "Cognac cream" } },
        { t: { en: "Garden pea velouté", "zh-CN": "花园青豆浓汤", fr: "Velouté de petits pois" }, kcal: 160, tags: ["vegan", "gf"], d: { en: "Mint emulsion" } }
      ],
      bread: [
        { t: { en: "Warm bakery selection", "zh-CN": "暖心法棍拼篮", fr: "Assortiment de pains chauds" }, kcal: 280, tags: [], d: { en: "EVOO, cultured butter" } }
      ],
      dessert: [
        { t: { en: "Mille‑feuille ‘cloud’", "zh-CN": "千层云酥", fr: "Mille‑feuille nuage" }, kcal: 390, tags: [], d: { en: "Vanilla diplomat, caramel lace" } },
        { t: { en: "Single‑origin chocolate soufflé", "zh-CN": "单一产地巧克力舒芙蕾", fr: "Soufflé chocolat grand cru" }, kcal: 420, tags: [], d: { en: "Crème anglaise" } },
        { t: { en: "Yuzu pavlova", "zh-CN": "柚子帕芙洛娃", fr: "Pavlova au yuzu" }, kcal: 310, tags: ["gf"], d: { en: "Lemon verbena cream" } }
      ],
      cheese: [
        { t: { en: "Fromage trolley", "zh-CN": "法式奶酪推车", fr: "Chariot de fromages" }, kcal: 350, tags: [], d: { en: "Comté 24m, Roquefort, Époisses" } }
      ],
      icecream: [
        { t: { en: "Seasonal ice cream & sorbet", "zh-CN": "当季冰淇淋与雪葩", fr: "Glaces & sorbets de saison" }, kcal: 260, tags: [], d: { en: "Vanilla Tahiti, Matcha, Raspberry" } }
      ],
      wine: {
        sparkling: [
          { name: "Krug Grande Cuvée 171ème", meta: "Champagne, France" },
          { name: "Dom Pérignon Vintage", meta: "Champagne, France" },
          { name: "Louis Roederer Cristal", meta: "Champagne, France" }
        ],
        white: [
          { name: "Domaine Leflaive Puligny‑Montrachet", meta: "Burgundy, France" },
          { name: "Cloudy Bay Sauvignon Blanc", meta: "Marlborough, NZ" },
          { name: "Riesling Grosses Gewächs", meta: "Mosel, Germany" }
        ],
        red: [
          { name: "Château Margaux", meta: "Bordeaux, France" },
          { name: "Screaming Eagle Cabernet Sauvignon", meta: "Napa Valley, USA" },
          { name: "Sassicaia Bolgheri", meta: "Tuscany, Italy" }
        ],
        dessert: [
          { name: "Château d'Yquem Sauternes", meta: "Bordeaux, France" },
          { name: "Tokaji Aszú 6 Puttonyos", meta: "Hungary" }
        ],
        fortified: [
          { name: "Taylor's Very Old Tawny", meta: "Porto, Portugal" },
          { name: "González Byass Apóstoles Palo Cortado", meta: "Jerez, Spain" }
        ]
      },
      beverages: {
        juice: [
          { t: { 'zh-CN': '鲜橙汁', 'zh-TW': '鮮橙汁', en: 'Fresh orange juice', fr: 'Jus d’orange frais', es: 'Zumo de naranja fresco', ru: 'Свежевыжатый апельсиновый сок' }, meta: { en:'100% squeezed', 'zh-CN':'100% 鲜榨' } },
          { t: { 'zh-CN': '苹果汁', 'zh-TW': '蘋果汁', en: 'Apple juice', fr: 'Jus de pomme', es: 'Zumo de manzana', ru: 'Яблочный сок' }, meta: { en:'Cloudy' } },
          { t: { 'zh-CN': '西瓜汁', 'zh-TW': '西瓜汁', en: 'Watermelon juice', fr: 'Jus de pastèque', es: 'Zumo de sandía', ru: 'Арбузный сок' }, meta: { en:'Chilled' } }
        ],
        mocktail: [
          { t: { 'zh-CN':'无酒精莫吉托', 'zh-TW':'無酒精莫希托', en:'Nojito', fr:'Nojito', es:'Nojito', ru:'Ноджито' }, meta: { en:'Mint, lime, soda', 'zh-CN':'薄荷 青柠 苏打' } },
          { t: { 'zh-CN':'柚子思普利兹', 'zh-TW':'柚子氣泡飲', en:'Yuzu Spritz', fr:'Spritz au yuzu', es:'Spritz de yuzu', ru:'Юдзу Спритц' }, meta: { en:'Yuzu, tonic' } },
          { t: { 'zh-CN':'姜味骡子', 'zh-TW':'薑味騾子', en:'Ginger Mule', fr:'Mule au gingembre', es:'Mule de jengibre', ru:'Имбирный Мул' }, meta: { en:'Ginger beer, lime' } }
        ],
        soft: [
          { t: { 'zh-CN':'可口可乐', 'zh-TW':'可口可樂', en:'Coca‑Cola', fr:'Coca‑Cola', es:'Coca‑Cola', ru:'Coca‑Cola' }, meta: { en:'Classic' } },
          { t: { 'zh-CN':'零度可乐', 'zh-TW':'零度可樂', en:'Coca‑Cola Zero', fr:'Coca‑Cola Zéro', es:'Coca‑Cola Zero', ru:'Coca‑Cola Zero' }, meta: { en:'Zero sugar' } },
          { t: { 'zh-CN':'芬达（橙味）', 'zh-TW':'芬達（柳橙）', en:'Fanta Orange', fr:'Fanta Orange', es:'Fanta Naranja', ru:'Fanta Апельсин' } },
          { t: { 'zh-CN':'雪碧', 'zh-TW':'雪碧', en:'Sprite', fr:'Sprite', es:'Sprite', ru:'Sprite' } },
          { t: { 'zh-CN':'矿泉水 / 气泡水', 'zh-TW':'礦泉水 / 氣泡水', en:'Still / Sparkling Water', fr:'Eau plate / gazeuse', es:'Agua sin gas / con gas', ru:'Вода негаз/газ' }, meta: { en:'Acqua Panna / San Pellegrino' } }
        ],
        tea: [
          { t: { 'zh-CN':'大红袍', 'zh-TW':'大紅袍', en:'Da Hong Pao', fr:'Da Hong Pao', es:'Da Hong Pao', ru:'Да Хун Пао' }, meta: { en:'Rock oolong — Wuyi, China' } },
          { t: { 'zh-CN':'玉露', 'zh-TW':'玉露', en:'Gyokuro', fr:'Gyokuro', es:'Gyokuro', ru:'Гёкуро' }, meta: { en:'Shade‑grown green — Uji, Japan' } },
          { t: { 'zh-CN':'大吉岭头采', 'zh-TW':'大吉嶺頭採', en:'Darjeeling First Flush', fr:'Darjeeling First Flush', es:'Darjeeling First Flush', ru:'Дарджилинг Первый сбор' }, meta:{ en:'Single‑estate — India' } },
          { t: { 'zh-CN':'茉莉银针', 'zh-TW':'茉莉銀針', en:'Jasmine Silver Needle', fr:'Aiguilles d’argent au jasmin', es:'Agujas de plata al jazmín', ru:'Жасмин Серебряная игла' }, meta:{ en:'Fuding, China' } }
        ],
        coffee: [
          { t: { 'zh-CN':'单品意式浓缩', 'zh-TW':'單品濃縮', en:'Single‑origin espresso', fr:'Espresso mono‑origine', es:'Espresso monoorigen', ru:'Эспрессо моносорт' }, meta:{ en:'Ethiopia / Colombia rotation' } },
          { t: { 'zh-CN':'V60 手冲', 'zh-TW':'V60 手沖', en:'V60 hand‑brew', fr:'V60 filtre', es:'V60 de filtro', ru:'V60 пуровер' }, meta:{ en:'Seasonal roaster selection' } },
          { t: { 'zh-CN':'阿芙佳朵', 'zh-TW':'阿芙佳朵', en:'Affogato', fr:'Affogato', es:'Affogato', ru:'Аффогато' }, meta:{ en:'Vanilla gelato, espresso' } },
          { t: { 'zh-CN':'馥芮白 / 卡布奇诺', 'zh-TW':'馥芮白 / 卡布奇諾', en:'Flat White / Cappuccino', fr:'Flat White / Cappuccino', es:'Flat White / Cappuccino', ru:'Флэт уайт / Капучино' }, meta:{ en:'Oat milk available' } }
        ]
      }
    };

    function tagBadge(code) {
      const map = { vegan: 'vegan', gf: 'gf', halal: 'halal', spicy: 'spicy' };
      return map[code] || '';
    }

    function tPick(map) {
      if (!map) return '';
      if (map[lang]) return map[lang];
      // Prefer English as universal fallback; for zh-TW prefer zh-CN first
      if (lang === 'zh-TW' && map['zh-CN']) return map['zh-CN'];
      if (map.en) return map.en;
      return map['zh-CN'] || map['fr'] || map['es'] || map['ru'] || '';
    }

    function renderDining() {
      const root = $id('panel-dining'); if (!root) return;
      const L = DINING_I18N[lang] || DINING_I18N.en;
      setText('diningTitle', L.title); setText('diningSub', L.sub);
      setText('alcoholTitle', L.wine); setText('nonAlcoholTitle', L.drinks.non || L.drinks.soft);
      const box = $id('diningMenu'); if (box) box.innerHTML = '';

      const sections = [
        ['starter', DINING.starters], ['soup', DINING.soup], ['main', DINING.mains], ['bread', DINING.bread], ['dessert', DINING.dessert], ['cheese', DINING.cheese], ['icecream', DINING.icecream]
      ];
      sections.forEach(([key, arr]) => {
        const sec = document.createElement('div'); sec.className = 'menu-section'; sec.dataset.anchor = key;
        const h = document.createElement('h4'); h.textContent = L.course[key] || key; sec.appendChild(h);
        arr.forEach(d => {
          const row = document.createElement('div'); row.className = 'dish';
          const left = document.createElement('div');
          const title = document.createElement('div'); title.className = 'dish-title'; title.textContent = tPick(d.t);
          const meta = document.createElement('div'); meta.className = 'dish-meta'; meta.textContent = tPick(d.d);
          const tags = document.createElement('div'); tags.className = 'tags';
          (d.tags||[]).forEach(code => { const span = document.createElement('span'); span.className = 'tag ' + tagBadge(code); span.textContent = (L.tags[code]||code); tags.appendChild(span); });
          left.appendChild(title); left.appendChild(meta); left.appendChild(tags);
          const right = document.createElement('div'); right.innerHTML = '<span class="kcal">' + (d.kcal||0) + '</span> ' + L.kcal;
          row.appendChild(left); row.appendChild(right);
          sec.appendChild(row);
        });
        if (box) box.appendChild(sec);
      });


      // quick chips (recreate to ensure language reflects immediately)
      const chips = $id('diningChips'); if (chips) {
        chips.innerHTML = '';

        const chipMap = [
          ['starter', L.course.starter], ['soup', L.course.soup], ['main', L.course.main], ['dessert', L.course.dessert], ['cheese', L.course.cheese], ['icecream', L.course.icecream],
          ['wine', L.wine], ['juice', L.drinks.juice], ['mocktail', L.drinks.mocktail], ['soft', L.drinks.soft], ['tea', L.drinks.tea], ['coffee', L.drinks.coffee]
        ];
        chipMap.forEach(([key, label]) => {
          const c = document.createElement('button'); c.className = 'chip'; c.textContent = label;
          c.addEventListener('click', () => {
            const target = document.querySelector('[data-anchor="' + key + '"]');
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
          chips.appendChild(c);
        });
      }

      // wine & beverages list
      const wineBox = $id('wineList'); if (wineBox) wineBox.innerHTML='';
      function addGroup(title, items, anchorKey){
        const g = document.createElement('div');
        if (anchorKey) g.dataset.anchor = anchorKey;
        const h = document.createElement('h4'); h.textContent = title; g.appendChild(h);
        (items||[]).forEach(w => { const name = w.t ? tPick(w.t) : (w.name||''); const meta = w.meta ? (typeof w.meta==='string'? w.meta : tPick(w.meta)) : ''; const it = document.createElement('div'); it.className='wine-item'; it.innerHTML = '<div class="name">'+name+'</div><div class="meta">'+meta+'</div>'; g.appendChild(it); });
        wineBox && wineBox.appendChild(g);
      }
      const W = DINING.wine; const B = DINING.beverages;
      addGroup(L.alcoholHeadings.champagne, W.sparkling, 'wine');
      addGroup(L.alcoholHeadings.white, W.white);
      addGroup(L.alcoholHeadings.red, W.red);
      addGroup(L.alcoholHeadings.dessert, W.dessert);
      addGroup(L.alcoholHeadings.fortified, W.fortified);
      // right column non-alcoholic
      const nonBox = $id('nonAlcoholList'); if (nonBox) nonBox.innerHTML = '';
      function addNon(title, items, anchorKey){
        const g = document.createElement('div');
        if (anchorKey) g.dataset.anchor = anchorKey;
        const h = document.createElement('h4'); h.textContent = title; g.appendChild(h);
        (items||[]).forEach(w => { const name = w.t ? tPick(w.t) : (w.name||''); const meta = w.meta ? (typeof w.meta==='string'? w.meta : tPick(w.meta)) : ''; const it = document.createElement('div'); it.className='wine-item'; it.innerHTML = '<div class="name">'+name+'</div><div class="meta">'+meta+'</div>'; g.appendChild(it); });
        nonBox && nonBox.appendChild(g);
      }
      addNon(L.drinks.juice || 'Juice', B.juice, 'juice');
      addNon(L.drinks.mocktail || 'Mocktail', B.mocktail, 'mocktail');
      addNon(L.drinks.soft, B.soft, 'soft');
      addNon(L.drinks.tea, B.tea, 'tea');
      addNon(L.drinks.coffee, B.coffee, 'coffee');
    }

    const LANG_ORDER = ["zh-CN", "zh-TW", "es", "ru", "fr", "en"];
    let lang = localStorage.getItem("ife_lang") || "zh-CN";
    if (!I18N[lang]) lang = "zh-CN";

    // small DOM helpers
    const $id = id => document.getElementById(id);
    const setText = (id, txt) => { const el = $id(id); if (el) el.textContent = txt; };

    function applyLang(sel) {
      if (sel) lang = sel;
      if (!I18N[lang]) lang = "zh-CN";
      localStorage.setItem("ife_lang", lang);
      const t = I18N[lang];
      setText("brandTitle", t.brand);
      setText("destText", t.dest);
      // update hero city label localized
      const heroCity = $id('heroCity');
      if (heroCity) {
        const cityMap = { 'zh-CN':'旧金山', 'zh-TW':'舊金山', en:'SAN FRANCISCO', fr:'SAN FRANCISCO', es:'SAN FRANCISCO', ru:'САН-ФРАНЦИСКО' };
        heroCity.textContent = cityMap[lang] || cityMap.en;
        // auto-fit: expand font-size until ~90% width is used, within reasonable bounds
        try {
          const parent = heroCity.parentElement; if (parent) {
            const widthFactor = (lang === 'ru') ? 0.88 : 0.90; // slightly smaller target for Russian
            const maxWidth = parent.getBoundingClientRect().width * widthFactor;
            let size = 64 * (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--text-scale'))||1);
            if (lang === 'ru') size *= 0.96; // nudge down a touch for Russian glyph widths
            const min = 28, max = 140; // px bounds
            heroCity.style.whiteSpace = 'nowrap'; // keep one line if possible
            heroCity.style.display = 'block';
            for (let step = 0; step < 20; step++) {
              heroCity.style.fontSize = size + 'px';
              const used = heroCity.getBoundingClientRect().width;
              if (used >= maxWidth || size >= max) break;
              size = Math.min(max, Math.min(size + Math.max(2, (maxWidth - used) / 10), size * 1.12));
            }
            if (size < min) heroCity.style.fontSize = min + 'px';
            // if still overflowed (some languages too long), allow two-line fallback with slightly smaller size
            if (heroCity.getBoundingClientRect().width > maxWidth) {
              heroCity.style.whiteSpace = 'normal';
              heroCity.style.wordBreak = 'break-word';
              heroCity.style.hyphens = 'auto';
              heroCity.style.fontSize = Math.max(min, size * 0.92) + 'px';
            }
          }
        } catch(_) {}
      }
      setText("tileMusic", t.tiles.music[0]); setText("tileMusicSub", t.tiles.music[1]);
      setText("tileMovies", t.tiles.movies[0]); setText("tileMoviesSub", t.tiles.movies[1]);
      setText("tileShopping", t.tiles.shopping[0]); setText("tileShoppingSub", t.tiles.shopping[1]);
      setText("tileDining", t.tiles.dining[0]); setText("tileDiningSub", t.tiles.dining[1]);
      setText("tileFlight", t.tiles.flight[0]); setText("tileFlightSub", t.tiles.flight[1]);
      const belt = $id("btnBelt"); if (belt) belt.textContent = t.ui.seatbeltOn;
      const albumNotesTitle = $id("albumNotesTitle"); if (albumNotesTitle) albumNotesTitle.textContent = t.ui.about;
      const lyricsH = $id("lyricsH"); if (lyricsH) lyricsH.textContent = t.ui.lyrics;
      const tbBack = $id('tbBack'); if (tbBack) tbBack.textContent = (I18N[lang] || I18N.en).ui.back;
      // update hero city localized...
      // refresh dining in-place if open
      const diningPanel = $id('panel-dining');
      if (diningPanel && diningPanel.classList.contains('visible')) {
        renderDining();
      }
    }
    /* ---------- Flight map (Leaflet) ---------- */
    function renderFlight() {
      const panel = $id('panel-flight'); if (!panel) return;
      const mapEl = $id('flightMap'); if (!mapEl) return;
      // init or reuse map
      if (!window._leafletMap) {
        const m = L.map(mapEl, { zoomControl: true, attributionControl: false });
        const esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 12 });
        esri.addTo(m);
        window._leafletMap = m;
      } else {
        mapEl.innerHTML = '';
        window._leafletMap = L.map(mapEl, { zoomControl: true, attributionControl: false });
        const esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 12 });
        esri.addTo(window._leafletMap);
      }
      const map = window._leafletMap;

      const jfk = [40.6413, -73.7781]; // JFK
      const sfo = [37.6213, -122.3790]; // SFO

      // compute great-circle polyline points
      function toRad(d){return d*Math.PI/180}
      function toDeg(r){return r*180/Math.PI}
      function interpolateGreatCircle(a,b,steps){
        const [lat1,lon1]=a.map(toRad), [lat2,lon2]=b.map(toRad);
        const d = 2*Math.asin(Math.sqrt(Math.sin((lat2-lat1)/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin((lon2-lon1)/2)**2));
        const points=[]; if (d===0) return [a,b];
        for(let i=0;i<=steps;i++){
          const f=i/steps; const A=Math.sin((1-f)*d)/Math.sin(d); const B=Math.sin(f*d)/Math.sin(d);
          const x=A*Math.cos(lat1)*Math.cos(lon1)+B*Math.cos(lat2)*Math.cos(lon2);
          const y=A*Math.cos(lat1)*Math.sin(lon1)+B*Math.cos(lat2)*Math.sin(lon2);
          const z=A*Math.sin(lat1)+B*Math.sin(lat2);
          const lat=Math.atan2(z,Math.sqrt(x*x+y*y)); const lon=Math.atan2(y,x);
          points.push([toDeg(lat),toDeg(lon)]);
        }
        return points;
      }

      const route = interpolateGreatCircle(jfk, sfo, 128);
      const split = Math.round(route.length/3);
      const flown = route.slice(0, split+1);
      const unflown = route.slice(split);
      L.polyline(flown, { color: '#7dd3af', weight: 5, opacity: 0.95 }).addTo(map);
      L.polyline(unflown, { color: 'rgba(45,120,200,0.8)', weight: 4, opacity: 0.9 }).addTo(map);
      const line = L.polyline(route, { opacity:0 });
      map.fitBounds(line.getBounds(), { padding: [20,20] });

      // progress marker at 1/3
      const idx = Math.round(route.length/3);
      const pos = route[idx];
      function bearing(a,b){
        const toRad=x=>x*Math.PI/180, toDeg=x=>x*180/Math.PI;
        const lat1=toRad(a[0]), lat2=toRad(b[0]), dLon=toRad(b[1]-a[1]);
        const y=Math.sin(dLon)*Math.cos(lat2), x=Math.cos(lat1)*Math.sin(lat2)-Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
        return (toDeg(Math.atan2(y,x))+360)%360;
      }
      const brg = bearing(route[idx-1], route[idx+1]);
      const svg = `<svg width="50" height="50" viewBox="0 0 64 64" fill="#ffd67a" xmlns="http://www.w3.org/2000/svg"><path d="M6 30l20-6 0-14 4-4 4 4 0 14 20 6 0 4-20-2 0 10 6 6 0 4-10-4-10 4 0-4 6-6 0-10-20 2z"/></svg>`;
      const aircraftIcon = L.divIcon({ className: 'ac-icon', html: `<div style="transform:rotate(${brg}deg)">${svg}</div>`, iconSize:[60,60], iconAnchor:[30,30] });
      L.marker(pos, { icon: aircraftIcon, rotationAngle:brg }).addTo(map);

      // info panel
      const distNm = haversineNm(jfk, sfo);
      const covered = Math.round(distNm/3);
      const remain = distNm - covered;
      // assume TAS ~ 470 kt at cruise, OAT ~ -56°C @ FL380
      const gs = 470; const etaH = remain/gs; // hours
      const depLocal = new Date();
      const elapsedH = covered/gs; // rough flight time elapsed
      const etaDate = new Date(depLocal.getTime() + etaH*3600*1000);
      const locTime = new Date();
      const page1=$id('fiPage1'), page2=$id('fiPage2'), page3=$id('fiPage3');
      function fillGrid(el, rows){
        if (!el) return; el.innerHTML='';
        rows.forEach(([k,v])=>{
          const l=document.createElement('div'); l.className='label'; l.textContent=k;
          const val=document.createElement('div'); val.className='value'; val.textContent=v;
          // 确保标签在第一列，值在第二列
          l.style.gridColumn = '1';
          val.style.gridColumn = '2';
          el.appendChild(l); el.appendChild(val);
        });
      }
      fillGrid(page1,[ ['Attitude (roll/pitch)','2°/1°'], ['Altitude','FL380'], ['Mach','0.85'], ['Ground speed',gs+' kt'], ['OAT','−56 °C'] ]);
      fillGrid(page2,[ ['Departure time (local)',depLocal.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})], ['Time aloft',elapsedH.toFixed(1)+' hours'], ['Local time',locTime.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})], ['Estimated time remaining',etaH.toFixed(1)+' hours'], ['Estimated arrival (local)',etaDate.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})] ]);
      fillGrid(page3,[ ['Distance',distNm+' nm'], ['Covered',covered+' nm'], ['Remaining',remain+' nm'], ['Terminal/Baggage','T2 / Carousel B3'] ]);
      
      // Flight info pages populated successfully
      const conn = $id('sfoConn'); if (conn) {
        conn.innerHTML = '';
        const destinations = [
          {city: 'Honolulu', code: 'HNL'}, {city: 'Los Angeles', code: 'LAX'}, {city: 'Seattle', code: 'SEA'},
          {city: 'Vancouver', code: 'YVR'}, {city: 'Chicago', code: 'ORD'}, {city: 'Dallas', code: 'DFW'},
          {city: 'Phoenix', code: 'PHX'}, {city: 'Washington', code: 'IAD'}, {city: 'Boston', code: 'BOS'},
          {city: 'Miami', code: 'MIA'}, {city: 'Atlanta', code: 'ATL'}, {city: 'Denver', code: 'DEN'},
          {city: 'Minneapolis', code: 'MSP'}, {city: 'Detroit', code: 'DTW'}, {city: 'Toronto', code: 'YYZ'},
          {city: 'Montreal', code: 'YUL'}, {city: 'San Jose', code: 'SJD'}, {city: 'Austin', code: 'AUS'},
          {city: 'San Diego', code: 'SAN'}, {city: 'Portland', code: 'PDX'}, {city: 'Orange County', code: 'SNA'},
          {city: 'Fort Myers', code: 'RSW'}, {city: 'Tampa', code: 'TPA'}, {city: 'Nashville', code: 'BNA'},
          {city: 'Philadelphia', code: 'PHL'}, {city: 'Newark', code: 'EWR'}, {city: 'New York', code: 'JFK'},
          {city: 'Dallas Love', code: 'DAL'}, {city: 'St. Louis', code: 'STL'}, {city: 'Cleveland', code: 'CLE'}
        ];
        
        function randFlight(){ return 'JW' + (600 + Math.floor(Math.random()*400)); }
        function randGate(){ const letters='BCDEFG'; return letters[Math.floor(Math.random()*letters.length)]+((Math.floor(Math.random()*9))+1); }
        function randTime(baseHour, baseMin) {
          // 基础时间 ±20分钟随机
          const totalMinutes = baseHour * 60 + baseMin;
          const randomOffset = Math.floor(Math.random() * 41) - 20; // -20到+20分钟
          const finalMinutes = totalMinutes + randomOffset;
          const hr = Math.floor(finalMinutes / 60) % 24;
          const min = finalMinutes % 60;
          return `${hr.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}`;
        }
        
        // 生成30个航班，时间从20:00开始，每20分钟一个基础时间点
        for (let i=0;i<30;i++){
          const baseHour = 20 + Math.floor(i * 20 / 60);
          const baseMin = (i * 20) % 60;
          const dest = destinations[i % destinations.length];
          const status = ['On Time','Delayed','Cancelled'][Math.floor(Math.random()*3)];
          const row = document.createElement('div'); row.className = 'board-row';
          row.innerHTML = `<div>${randFlight()}</div><div>${dest.city} ${dest.code}</div><div>${randTime(baseHour, baseMin)}</div><div>${randGate()}</div><div class="status">${status}</div>`;
          conn.appendChild(row);
        }
      }

      // title/meta with weather placeholder
      setText('fltTitle', 'FL380 • JFK → SFO');
      // fetch simple SFO weather (placeholder static for now)
      setText('fltMeta', 'SFO Weather: 18°C / 64°F • Wind 12 kt');

      // controls (iOS‑style zoom)
      const zi=$id('zoomIn'), zo=$id('zoomOut');
      if (zi) zi.onclick=()=> map.zoomIn();
      if (zo) zo.onclick=()=> map.zoomOut();
      // flight info vertical carousel (three pages: 0, 1, 2)
      const track = $id('fiTrack');
      let currentPage = 0;
      const totalPages = 3;
      
      function setPage(pageIndex) {
        // 确保页面索引在有效范围内
        if (pageIndex < 0) pageIndex = totalPages - 1;
        if (pageIndex >= totalPages) pageIndex = 0;
        
        currentPage = pageIndex;
        if (track) {
          // 使用像素值而不是百分比，每个页面240px
          const translateY = -currentPage * 240;
          track.style.transform = `translateY(${translateY}px)`;
          // Flight info page switching: currentPage, translateY
        }
      }
      
      // 确保数据已填充后再初始化
      setTimeout(function() {
        setPage(0);
      }, 100);
      
      // auto-rotate every 6 seconds (reset on render)
      if (window._fiTimer) { 
        clearInterval(window._fiTimer); 
      }
      window._fiTimer = setInterval(function() {
        const nextPage = (currentPage + 1) % totalPages;
        setPage(nextPage);
      }, 6000);
      const compass=$id('compass'); if (compass) compass.textContent='N';
      const attH=$id('attH'); if (attH) attH.style.transform='translateY(0)';
      // ticker text
      const ticker=$id('tickerInner'); if (ticker) ticker.innerHTML = `<span>Flight: JW620 JFK → SFO</span><span>Ground speed: ${gs} kt</span><span>Estimated arrival: ${etaDate.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span><span>Altitude: FL380</span><span>Mach: 0.85</span><span>Outside air temp: −56°C</span>`;

      // 200nm ticks
      // no nm tick marks per user request
    }

    function haversineNm(a,b){
      const R=6371e3; // meters
      function toRad(d){return d*Math.PI/180}
      const [lat1,lon1]=[toRad(a[0]),toRad(a[1])];
      const [lat2,lon2]=[toRad(b[0]),toRad(b[1])];
      const dlat=lat2-lat1, dlon=lon2-lon1;
      const h= Math.sin(dlat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dlon/2)**2;
      const d=2*Math.asin(Math.sqrt(h));
      return Math.round((R*d)/1852); // meters to nautical miles
    }

    // Library (kept from your last version, durations present where available)
    const LIB = {
      artangels: {
        id: "artangels",
        artist: "Grimes",
        artistImg: IMAGE_BASE + "grimes_cover.jpg",
        title: { "en": "Art Angels", "zh-CN": "Art Angels", "zh-TW": "Art Angels", "fr": "Art Angels" },
        cover: IMAGE_BASE + "art_angles_cover.jpg",
        blurb: { "en": "Grimes’ hyperpop opus blending industrial punch with bubblegum hooks.", "zh-CN": "Grimes 的超流行专辑，工业能量与泡泡旋律的融合。", "fr": "Album hyperpop de Grimes mêlant puissance industrielle et refrains sucrés." },
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
          { t: "Realiti", len: "5:06", src: MUSIC_BASE + "Grimes - Realiti.mp3" },
          { t: "World Princess Part II", len: "5:07", src: MUSIC_BASE + "Grimes - World Princess Part II.mp3" },
          { t: "Venus Fly (feat. Janelle Monáe)", len: "3:45", src: MUSIC_BASE + "Grimes - Venus Fly.mp3" },
          { t: "Life in the Vivid Dream", len: "1:29", src: MUSIC_BASE + "Grimes - Life in the Vivid Dream.mp3" },
          { t: "Butterfly", len: "4:13", src: MUSIC_BASE + "Grimes - Butterfly.mp3" }
        ],
        artistBio: { "zh-CN": "Grimes — 加拿大艺术家，科幻感与 DIY 狂热混合。", "en": "Grimes — Canadian artist mixing sci-fi textures with DIY intensity." }
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
          // user said Paradigmes Introduction 已删除 —— 确保我们在列表中不引用它
          { t: "Paradigme", len: "3:12", src: MUSIC_BASE + "La Femme - Paradigme.mp3" },
          { t: "Le sang de mon prochain", len: "4:00", src: MUSIC_BASE + "La Femme - Le Sang De Mon Prochain.mp3" },
          { t: "Cool Colorado", len: "3:38", src: MUSIC_BASE + "La Femme - Cool Colorado.mp3" },
          { t: "Foreigner", len: "3:50", src: MUSIC_BASE + "La Femme - Foreigner.mp3" },
          { t: "Nouvelle-Orléans", len: "4:02", src: MUSIC_BASE + "La Femme - Nouvelle-Orleans.mp3" },
          { t: "Disconnexion", len: "3:46", src: MUSIC_BASE + "La Femme - Disconnexion.mp3" },
          { t: "Pasadena", len: "3:20", src: MUSIC_BASE + "La Femme - Pasadena.mp3" }
        ],
        artistBio: { "zh-CN": "La Femme — 法国乐队，冷潮与冲浪的混搭。", "en": "La Femme — French band mixing coldwave and surf." }
      }
    };

    // state
    const albumIds = Object.keys(LIB);
    let curAlbum = albumIds[0];
    let curIdx = 0;

    function slug(s) {
      return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }
    function fmtSeconds(s) {
      s = Math.floor(s || 0);
      const m = Math.floor(s / 60), sec = s % 60;
      return m + ':' + (sec < 10 ? '0' : '') + sec;
    }

    // try image candidates
    function tryImageSources(imgEl, candidates) {
      if (!imgEl || !candidates || !candidates.length) return;
      let i = 0;
      imgEl.onerror = function () {
        if (i < candidates.length) imgEl.src = candidates[i++];
      };
      imgEl.src = candidates[i++] || '';
    }

    /* ---------- CLEANUP: remove stray toolbar controls INSIDE BANNER ---------- */
    function cleanBannerControls() {
      const banner = document.querySelector('.album-banner') || document.querySelector('#banner') || document.querySelector('.banner');
      if (!banner) return;

      const overlaySelectors = [
        '.tb-play', '.tb-back', '.tb-title', '.banner-local-play', '.local-back',
        '.banner-controls', '#bannerToolbar', '.banner-toolbar', '.toolbar-overlay',
        '.mini-btn', '.mini-toolbar', '.overlay-button', '.small-button', '.banner-small'
      ];

      overlaySelectors.forEach(sel => {
        try {
          const nodes = banner.querySelectorAll(sel);
          nodes.forEach(n => {
            try {
              const rect = n.getBoundingClientRect ? n.getBoundingClientRect() : { width: 0, height: 0 };
              const small = (rect.width < 180 && rect.height < 90);
              const cls = (n.className && String(n.className).toLowerCase()) || '';
              const likely = cls.indexOf('tb-') !== -1 || cls.indexOf('toolbar') !== -1 || cls.indexOf('mini') !== -1 || cls.indexOf('overlay') !== -1;
              if (small || likely) n.parentNode && n.parentNode.removeChild(n);
            } catch (e) { /* ignore */ }
          });
        } catch (e) { /* ignore */ }
      });

      const textCandidates = [ (I18N[lang] || I18N.en).ui.back, 'Album', 'album' ];
      const nodes = banner.querySelectorAll('*');
      nodes.forEach(el => {
        try {
          if (!el || !el.textContent) return;
          const txt = el.textContent.trim();
          if (!txt) return;
          const r = el.getBoundingClientRect ? el.getBoundingClientRect() : { width: 9999, height: 9999 };
          const small = (r.width < 200 && r.height < 80);
          if (small && textCandidates.indexOf(txt) !== -1) el.parentNode && el.parentNode.removeChild(el);
        } catch (e) { /* ignore */ }
      });

      const roleBtns = banner.querySelectorAll('[role="button"]');
      roleBtns.forEach(n => {
        try {
          const rect = n.getBoundingClientRect ? n.getBoundingClientRect() : { width: 0, height: 0 };
          if (rect.width < 180 && rect.height < 80) n.parentNode && n.parentNode.removeChild(n);
        } catch (e) { /* ignore */ }
      });
    }

    /* ---------- render album selection grid ---------- */
    function renderMusicSelection() {
      const grid = $id('albumGrid');
      if (!grid) return;
      grid.innerHTML = '';
      albumIds.forEach(id => {
        const a = LIB[id];
        const title = (a.title && (a.title[lang] || a.title['zh-CN'] || a.title.en)) || '';
        const blurb = (a.blurb && (a.blurb[lang] || a.blurb['zh-CN'] || a.blurb.en)) || '';
        const card = document.createElement('div'); card.className = 'album-card'; card.dataset.album = id;
        const img = document.createElement('img'); img.alt = title;
        const cands = [a.cover, IMAGE_BASE + id + '_cover.jpg', IMAGE_BASE + id + '.jpg', IMAGE_BASE + 'art_angles_cover.jpg', IMAGE_BASE + 'paradigmes_cover.jpg', IMAGE_BASE + 'grimes_cover.jpg', IMAGE_BASE + 'lafemme_cover.jpg'];
        tryImageSources(img, cands);
        const info = document.createElement('div'); info.className = 'album-info';
        const tdiv = document.createElement('div'); tdiv.className = 'title'; tdiv.textContent = title;
        const meta = document.createElement('div'); meta.className = 'meta'; meta.textContent = a.artist + ' • ' + (a.year || '');
        const bl = document.createElement('div'); bl.className = 'blurb'; bl.textContent = blurb;
        info.appendChild(tdiv); info.appendChild(meta); info.appendChild(bl);
        card.appendChild(img); card.appendChild(info);
        grid.appendChild(card);
      });
    }

    /* ---------- album toolbar (floating) ---------- */
    function ensureAlbumToolbar() {
      let tb = $id('albumToolbar');
      if (tb) return tb;

      tb = document.createElement('div');
      tb.id = 'albumToolbar';
      // basic structure — styling mostly in CSS; keep inline minimal but ensure behaviors
      tb.innerHTML = [
        '<div class="tb-play" id="tbPlay" title="Play/Pause" aria-label="play-pill"><svg viewBox="0 0 24 24" id="tbPlayIcon" width="26" height="26" fill="#052517"><path d="M8 5v14l11-7z"/></svg></div>',
        '<div class="tb-title" id="tbTitle" aria-hidden="false" style="flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-left:8px"></div>',
        '<div class="tb-back" id="tbBack" aria-label="back" style="margin-left:12px;padding:10px 16px;border-radius:12px;cursor:pointer"></div>'
      ].join('');
      document.body.appendChild(tb);

      // behavior
      tb.querySelector('#tbPlay').addEventListener('click', function (ev) {
        ev.stopPropagation();
        if (!audio.src) {
          const f = firstPlayableIndex(curAlbum);
          if (f !== -1) { playIdx(f); updateLyricsForIndex(f); highlightRow(f, true); }
          return;
        }
        if (audio.paused) {
          audio.play().then(() => setPauseIcon()).catch(() => setPlayIcon());
        } else {
          audio.pause(); setPlayIcon();
        }
      });

      tb.querySelector('#tbBack').addEventListener('click', function (ev) {
        ev.stopPropagation();
        // go back to album selection
        const panelMusic = $id('panel-music');
        if (panelMusic) {
          const ms = $id('music-selection');
          if (ms) { ms.style.display = 'block'; ms.classList.add('visible'); }
          const mg = panelMusic.querySelector('.music-grid');
          if (mg) mg.style.display = 'none';
          // hide toolbar
          hideAlbumToolbar();
        }
      });

      return tb;
    }

    function positionAlbumToolbar() {
      const tb = $id('albumToolbar'); if (!tb) return;
      const panel = $id('panel-music'); if (!panel || !panel.classList.contains('visible')) { hideAlbumToolbar(); return; }
      const leftCol = panel.querySelector('.music-left');
      if (!leftCol) { hideAlbumToolbar(); return; }
      const rect = leftCol.getBoundingClientRect();
      const left = Math.max(12, rect.left);
      const width = Math.max(320, rect.width);
      tb.style.left = left + 'px';
      tb.style.width = width + 'px';
      const topBase = document.querySelector('header') ? (document.querySelector('header').getBoundingClientRect().bottom + 12) : 12;
      tb.style.top = topBase + 'px';
    }

    let toolbarRaf = null;
    window.addEventListener('resize', () => { if (toolbarRaf) cancelAnimationFrame(toolbarRaf); toolbarRaf = requestAnimationFrame(positionAlbumToolbar); });
    window.addEventListener('scroll', () => { if (toolbarRaf) cancelAnimationFrame(toolbarRaf); toolbarRaf = requestAnimationFrame(positionAlbumToolbar); });

    function showAlbumToolbar(titleText) {
      const tb = ensureAlbumToolbar();
      const tbTitle = tb.querySelector('#tbTitle');
      const back = tb.querySelector('#tbBack');
      if (tbTitle) tbTitle.textContent = titleText || '';
      if (back) back.textContent = (I18N[lang] || I18N.en).ui.back;
      tb.style.opacity = '1'; tb.style.transform = 'translateY(0px)'; tb.style.pointerEvents = 'auto';
      positionAlbumToolbar();
      // push down left column content to avoid overlap by toolbar
      const panel = $id('panel-music');
      if (panel) {
        const left = panel.querySelector('.music-left');
        if (left) left.style.paddingTop = '88px';
      }
    }
    function hideAlbumToolbar() {
      const tb = $id('albumToolbar'); if (tb) { tb.style.opacity = '0'; tb.style.transform = 'translateY(-6px)'; tb.style.pointerEvents = 'none'; }
      const panel = $id('panel-music');
      if (panel) {
        const left = panel.querySelector('.music-left');
        if (left) left.style.paddingTop = '';
      }
    }

    /* ---------- open album ---------- */
    function openMusicAlbum(albumId) {
      if (!albumId) return;
      curAlbum = albumId;

      cleanBannerControls();

      const panel = $id('panel-music');
      if (panel) {
        const panels = document.querySelectorAll('.panel');
        panels.forEach(p => p.classList.remove('visible'));
        panel.classList.add('visible');
      }
      const home = $id('home'); if (home) home.style.display = 'none';

      const a = LIB[curAlbum]; if (!a) return;
      const title = (a.title && (a.title[lang] || a.title['zh-CN'] || a.title.en)) || '';
      const blurb = (a.blurb && (a.blurb[lang] || a.blurb['zh-CN'] || a.blurb.en)) || '';
      const notes = (a.notes && (a.notes[lang] || a.notes['zh-CN'] || a.notes.en)) || a.notes || '';

      const toolbarTitle = $id('toolbarTitle'); if (toolbarTitle) toolbarTitle.textContent = title;
      const banner = $id('bannerCover') || document.querySelector('.banner-left img') || document.querySelector('.album-banner img');
      if (banner && banner.tagName === 'IMG') {
        const cands = [a.cover, IMAGE_BASE + a.id + '_cover.jpg', IMAGE_BASE + a.id + '.jpg', IMAGE_BASE + 'paradigmes_cover.jpg', IMAGE_BASE + 'art_angles_cover.jpg', IMAGE_BASE + 'grimes_cover.jpg', IMAGE_BASE + 'lafemme_cover.jpg'];
        tryImageSources(banner, cands);
      } else {
        const bannerCont = $id('banner') || document.querySelector('.album-banner');
        if (bannerCont) {
          bannerCont.style.backgroundImage = 'url("' + (a.cover || '') + '")';
          bannerCont.style.backgroundSize = 'cover';
        }
      }

      const bannerSub = $id('bannerSub'); if (bannerSub) bannerSub.textContent = a.artist + ' • ' + (a.year || '');
      const bannerBlurb = $id('bannerBlurb'); if (bannerBlurb) bannerBlurb.textContent = blurb;
      const ai = $id('artistImg'); if (ai) {
        const acands = [a.artistImg, IMAGE_BASE + a.id + '_artist.jpg', IMAGE_BASE + a.id + '.jpg', IMAGE_BASE + 'lafemme_cover.jpg', IMAGE_BASE + 'grimes_cover.jpg'];
        tryImageSources(ai, acands);
      }
      const artistName = $id('artistName'); if (artistName) artistName.textContent = a.artist;
      const artistBioEl = $id('artistBio'); if (artistBioEl) artistBioEl.textContent = (a.artistBio && (a.artistBio[lang] || a.artistBio['zh-CN'] || a.artistBio.en)) || a.artistBio || '';
      const albumNotes = $id('albumNotes'); if (albumNotes) albumNotes.textContent = notes;

      cleanBannerControls();

      const ms = $id('music-selection'); if (ms) ms.style.display = 'none';
      const mg = panel ? panel.querySelector('.music-grid') : null; if (mg) mg.style.display = '';

      renderTracks();

      // show floating toolbar (top)
      showAlbumToolbar(title);

      // attempt to extract color and position toolbar
      const tryImg = banner && banner.tagName === 'IMG' ? banner : (ai && ai.tagName === 'IMG' ? ai : null);
      if (tryImg) {
        try {
          extractDominantColor(tryImg, color => {
            if (color) {
              try { document.documentElement.style.setProperty('--banner-glow', `rgba(${color.r},${color.g},${color.b},0.22)`); } catch (e) { }
            }
            positionAlbumToolbar();
          });
        } catch (e) { positionAlbumToolbar(); }
      } else {
        positionAlbumToolbar();
      }
    }

    /* ---------- TRACK LIST RENDER & BEHAVIOR ---------- */
    function renderTracks() {
      const box = $id('trackList'); if (!box) return;
      // left column controls scroll via .left-scroll; avoid nested scrollbars here
      box.style.overflowY = '';
      box.style.paddingBottom = '0';
      box.innerHTML = '';
      const a = LIB[curAlbum]; if (!a) return;

      // ensure consistent row heights: create rows uniformly
      a.tracks.forEach((trk, i) => {
        const r = document.createElement('div');
        r.className = 'row';
        r.dataset.idx = i;

        // columns: play-circle / text / duration
        const left = document.createElement('div'); left.className = 'row-left';
        const rowBtn = document.createElement('div');
        rowBtn.className = 'row-btn';
        rowBtn.dataset.idx = i;
        rowBtn.title = 'Play';
        // svg play circle; force white fill for list-play buttons
        rowBtn.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="#ffffff" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
        left.appendChild(rowBtn);

        const mid = document.createElement('div'); mid.className = 'row-mid';
        const titleDiv = document.createElement('div'); titleDiv.className = 'title'; titleDiv.textContent = trk.t || '';
        const metaDiv = document.createElement('div'); metaDiv.className = 'meta'; metaDiv.textContent = LIB[curAlbum].artist + ' • ' + ((LIB[curAlbum].title && (LIB[curAlbum].title[lang] || LIB[curAlbum].title['zh-CN'] || LIB[curAlbum].title.en)) || '');
        mid.appendChild(titleDiv); mid.appendChild(metaDiv);

        const right = document.createElement('div'); right.className = 'row-right'; right.textContent = trk.len || '—';

        // assemble row
        // Use CSS grid on .row to place these three columns; we keep markup simple
        r.appendChild(left); r.appendChild(mid); r.appendChild(right);

        // click handlers
        r.addEventListener('click', function (ev) {
          // if clicking the row-btn, that event is handled separately (prevent double)
          if (ev.target && ev.target.closest('.row-btn')) return;
          // play and highlight
          playIdx(i);
          updateLyricsForIndex(i);
          highlightRow(i, true);
        });

        // play button
        rowBtn.addEventListener('click', function (ev) {
          ev.stopPropagation();
          playIdx(i);
          updateLyricsForIndex(i);
          highlightRow(i, true);
        });

        box.appendChild(r);
      });

      // remove trailing space: ensure scroll height fits content — handled by CSS, but we reset any extra padding
      // if content shorter than container, we don't want to allow "overscroll" blank area — rely on CSS overscroll-behavior
      // ensure initially highlight curIdx if playing
      highlightRow(curIdx, false);
    }

    /* ---------- audio logic ---------- */
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.crossOrigin = 'anonymous';

    function firstPlayableIndex(albumId) {
      const a = LIB[albumId]; if (!a) return -1;
      for (let i = 0; i < a.tracks.length; i++) if (a.tracks[i].src) return i;
      return -1;
    }
    function nextPlayableIndex(albumId, from) {
      const a = LIB[albumId]; if (!a) return from;
      const n = a.tracks.length;
      for (let k = 1; k <= n; k++) {
        const idx = (from + k) % n;
        if (a.tracks[idx].src) return idx;
      }
      return from;
    }
    function prevPlayableIndex(albumId, from) {
      const a = LIB[albumId]; if (!a) return from;
      const n = a.tracks.length;
      for (let k = 1; k <= n; k++) {
        const idx = (from - k + n) % n;
        if (a.tracks[idx].src) return idx;
      }
      return from;
    }

    function setPlayIcon() {
      const el = $id('iconPlay'); if (el) el.innerHTML = '<path d="M8 5v14l11-7z"/>';
      const tbIcon = $id('tbPlayIcon'); if (tbIcon) tbIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
    }
    function setPauseIcon() {
      const el = $id('iconPlay'); if (el) el.innerHTML = '<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>';
      const tbIcon = $id('tbPlayIcon'); if (tbIcon) tbIcon.innerHTML = '<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>';
    }

    function playIdx(i) {
      const album = LIB[curAlbum]; if (!album || !album.tracks || !album.tracks[i]) return;
      const t = album.tracks[i];
      if (!t || !t.src) {
        const n = nextPlayableIndex(curAlbum, i);
        if (n === i) return;
        return playIdx(n);
      }
      try {
        audio.src = t.src;
        // keep current index in state before playing
        curIdx = i;
        audio.play().then(() => setPauseIcon()).catch(() => setPlayIcon());
      } catch (err) { console.warn('Audio play error', err); }
      const npTitleEl = $id('npTitle'), npMetaEl = $id('npMeta'), npArtEl = $id('npArt');
      if (npTitleEl) npTitleEl.textContent = t.t;
      // toggle marquee when overflow occurs
      if (npTitleEl) {
        npTitleEl.classList.remove('marquee');
        try {
          const needs = npTitleEl.scrollWidth > npTitleEl.clientWidth + 2;
          if (needs) npTitleEl.classList.add('marquee');
        } catch (_) {}
      }
      if (npMetaEl) npMetaEl.textContent = album.artist + ' • ' + ((album.title && (album.title[lang] || album.title['zh-CN'] || album.title.en)) || '');
      if (npArtEl) npArtEl.style.backgroundImage = 'url("' + (album.cover || '') + '")';
      highlightRow(i, true);
    }

    audio.addEventListener('loadedmetadata', function () {
      const d = Math.floor(audio.duration || 0);
      const durEl = $id('dur'); if (durEl) durEl.textContent = fmtSeconds(d);
      updateProgressUI();
    });

    audio.addEventListener('timeupdate', function () {
      updateProgressUI();
      const curEl = $id('cur'); if (curEl) curEl.textContent = fmtSeconds(Math.floor(audio.currentTime || 0));
    });

    audio.addEventListener('ended', function () {
      const n = nextPlayableIndex(curAlbum, curIdx);
      if (n !== curIdx) { curIdx = n; playIdx(n); updateLyricsForIndex(n); highlightRow(n, true); } else { setPlayIcon(); }
    });

    audio.addEventListener('error', function (ev) { console.warn('Audio element error', ev); });

    function updateProgressUI() {
      const rail = $id('rail'), bar = $id('bar');
      if (!rail || !bar) return;
      const total = audio.duration || 0;
      const current = audio.currentTime || 0;
      const railRect = rail.getBoundingClientRect();
      const innerW = Math.max(24, railRect.width - 24);
      const p = (total > 0) ? (current / total) : 0;
      const px = Math.max(0, Math.min(innerW, Math.round(p * innerW)));
      bar.style.width = px + 'px';
      // sync thumb if visible
      const seekThumb = rail.querySelector('.thumb');
      if (seekThumb) seekThumb.style.left = (12 + px) + 'px';
    }

    // pointer -> ratio for rail and volume
    function pointerToRatio(e, el) {
      const r = el.getBoundingClientRect();
      const x = (e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] && e.touches[0].clientX));
      const px = Math.max(12, Math.min(r.width - 12, x - r.left));
      return (px - 12) / Math.max(1, (r.width - 24));
    }

    const railEl = $id('rail');
    if (railEl) {
      railEl.addEventListener('pointerdown', function (e) {
        try { railEl.setPointerCapture(e.pointerId); } catch (_) { }
        function ratioFromEvent(ev) {
          const r = railEl.getBoundingClientRect();
          const clientX = (ev.clientX !== undefined ? ev.clientX : (ev.touches && ev.touches[0] && ev.touches[0].clientX));
          const px = Math.max(12, Math.min(r.width - 12, clientX - r.left));
          return (px - 12) / Math.max(1, (r.width - 24));
        }
        const r0 = ratioFromEvent(e);
        if (isFinite(audio.duration)) audio.currentTime = r0 * audio.duration;
        const move = function (ev) { const rr = ratioFromEvent(ev); if (isFinite(audio.duration)) audio.currentTime = rr * audio.duration; };
        const up = function () { try { railEl.releasePointerCapture(e.pointerId); } catch (_) { } window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
        window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
      });
    }

    const volRail = $id('volRail');
    if (volRail) {
      volRail.addEventListener('pointerdown', function (e) {
        try { volRail.setPointerCapture(e.pointerId); } catch (_) { }
        const r0 = pointerToRatio(e, volRail);
        audio.volume = r0; const volBar = $id('volBar'), volThumb = $id('volThumb');
        if (volBar) volBar.style.width = (r0 * 100) + '%';
        if (volThumb) volThumb.style.left = (r0 * (volRail.getBoundingClientRect().width - 16) + 8) + 'px';
        const move = function (ev) { const r = pointerToRatio(ev, volRail); audio.volume = r; if (volBar) volBar.style.width = (r * 100) + '%'; if (volThumb) volThumb.style.left = (r * (volRail.getBoundingClientRect().width - 16) + 8) + 'px'; };
        const up = function () { try { volRail.releasePointerCapture(e.pointerId); } catch (_) { } window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
        window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
      });
      volRail.addEventListener('click', function (e) {
        const r = pointerToRatio(e, volRail);
        audio.volume = r; const volBar = $id('volBar'), volThumb = $id('volThumb');
        if (volBar) volBar.style.width = (r * 100) + '%'; if (volThumb) volThumb.style.left = (r * (volRail.getBoundingClientRect().width - 16) + 8) + 'px';
      });
    }

    /* ---------- lyrics (non-blocking) ---------- */
    function updateLyricsForIndex(i) {
      const a = LIB[curAlbum]; const t = a && a.tracks && a.tracks[i];
      if (!t) { const lb = $id('lyricsBody'); if (lb) lb.textContent = '—'; return; }
      const lyricsTitle = $id('lyricsH'); if (lyricsTitle) lyricsTitle.textContent = (I18N[lang] || I18N.en).ui.lyrics;
      loadLyrics(curAlbum, t.t).then(txt => { const body = $id('lyricsBody'); if (body) body.textContent = (txt || '').replace(/\r?\n/g, '\n'); });
    }
    function loadLyrics(albumId, title) {
      const file = 'lyrics/' + albumId + '/' + slug(title) + '.txt';
      return fetch(file, { cache: 'no-store' }).then(r => { if (r.ok) return r.text(); return ''; }).catch(() => '');
    }

    /* ---------- dominant color extraction (small canvas) ---------- */
    function extractDominantColor(imgEl, cb) {
      try {
        const img = new Image(); img.crossOrigin = 'anonymous'; img.src = imgEl.src;
        img.onload = function () {
          try {
            const w = 40, h = 40;
            const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, w, h);
            const data = ctx.getImageData(0, 0, w, h).data;
            let r = 0, g = 0, b = 0, count = 0;
            for (let i = 0; i < data.length; i += 4) {
              const alpha = data[i + 3]; if (alpha < 125) continue;
              r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
            }
            if (count === 0) return cb(null);
            r = Math.round(r / count); g = Math.round(g / count); b = Math.round(b / count);
            return cb({ r, g, b });
          } catch (err) { return cb(null); }
        };
        img.onerror = function () { return cb(null); };
      } catch (e) { return cb(null); }
    }

    /* ---------- keyboard shortcuts — fixed to avoid skipping behavior ---------- */
    window.addEventListener('keydown', function (e) {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.code === 'Space') {
        e.preventDefault();
        const btn = $id('playPause');
        if (btn) { // emulate play/pause logic directly
          if (!audio.src) {
            const f = firstPlayableIndex(curAlbum);
            if (f !== -1) { playIdx(f); updateLyricsForIndex(f); highlightRow(f, true); return; }
          }
          if (audio.paused) audio.play().then(() => setPauseIcon()).catch(() => setPlayIcon()); else { audio.pause(); setPlayIcon(); }
        }
        return;
      }
      if (e.code === 'ArrowRight') {
        e.preventDefault();
        // move one track forward (no click simulation)
        const n = nextPlayableIndex(curAlbum, curIdx);
        if (n !== undefined && n !== null) {
          curIdx = n;
          playIdx(curIdx);
          updateLyricsForIndex(curIdx);
          highlightRow(curIdx, true);
        }
        return;
      }
      if (e.code === 'ArrowLeft') {
        e.preventDefault();
        const p = prevPlayableIndex(curAlbum, curIdx);
        if (p !== undefined && p !== null) {
          curIdx = p;
          playIdx(curIdx);
          updateLyricsForIndex(curIdx);
          highlightRow(curIdx, true);
        }
        return;
      }
    });

    /* ---------- language modal ---------- */
    function ensureLangModal() {
      const screen = $id('langScreen'); const listEl = $id('langList');
      if (listEl) {
        listEl.innerHTML = '';
        const mapNames = { "zh-CN": "简体中文", "zh-TW": "繁體中文", "es": "Español", "ru": "Русский", "fr": "Français", "en": "English" };
        for (let i = 0; i < LANG_ORDER.length; i++) {
          const code = LANG_ORDER[i];
          const btn = document.createElement('button');
          btn.className = 'lang-btn';
          btn.dataset.lang = code;
          btn.textContent = mapNames[code] || code;
          listEl.appendChild(btn);
        }
      }
    }
    ensureLangModal();

    /* ---------- header / control handlers ---------- */
    function closeAllPanels() {
      const panels = document.querySelectorAll('.panel');
      panels.forEach(p => { p.classList.remove('visible'); p.style.display = 'none'; p.setAttribute('aria-hidden', 'true'); });
      const home = $id('home');
      if (home) home.style.display = 'grid';
      const ms = $id('music-selection'); if (ms) ms.style.display = 'none';
      const pm = $id('panel-music'); if (pm) {
        const mg = pm.querySelector('.music-grid'); if (mg) mg.style.display = 'none';
      }
      hideAlbumToolbar();
    }

    const btnHomeEl = $id('btnHome');
    if (btnHomeEl) btnHomeEl.addEventListener('click', ev => { ev.stopPropagation(); closeAllPanels(); });

    const btnBeltEl = $id('btnBelt');
    if (btnBeltEl) btnBeltEl.addEventListener('click', ev => { ev.stopPropagation(); alert((I18N[lang] || I18N.en).ui.seatbeltOn); });

    const userBtnEl = $id('userBtn');
    if (userBtnEl) userBtnEl.addEventListener('click', ev => { ev.stopPropagation(); alert('Profile (占位)'); });

    const btnLangEl = $id('btnLang');
    if (btnLangEl) {
      btnLangEl.addEventListener('click', ev => {
        ev.stopPropagation();
        const ls = $id('langScreen'); if (!ls) return;
        ls.style.display = (ls.style.display === 'grid' || ls.style.display === 'flex') ? 'none' : 'grid';
      });
    }

    /* ---------- delegated body click (tiles, album cards, row-btn, lang-btn) ---------- */
    document.body.addEventListener('click', function (e) {
      // tiles open modules
      const tile = e.target.closest('.tile');
      if (tile && tile.dataset && tile.dataset.open) {
        const key = tile.dataset.open;
        if (key === 'music') {
          renderMusicSelection();
          const panelMusic = $id('panel-music');
          if (panelMusic) {
            const allPanels = document.querySelectorAll('.panel'); allPanels.forEach(p => { p.classList.remove('visible'); p.style.display = 'none'; p.setAttribute('aria-hidden', 'true'); });
            panelMusic.classList.add('visible'); panelMusic.style.display = 'block'; panelMusic.setAttribute('aria-hidden', 'false');
            const homeEl = $id('home'); if (homeEl) homeEl.style.display = 'none';
            const ms = $id('music-selection'); if (ms) { ms.style.display = 'block'; ms.classList.add('visible'); }
            const mg = panelMusic.querySelector('.music-grid'); if (mg) mg.style.display = 'none';
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        if (key === 'dining') {
          const panel = $id('panel-dining');
          if (panel) {
            const allPanels = document.querySelectorAll('.panel'); allPanels.forEach(p => { p.classList.remove('visible'); p.style.display = 'none'; p.setAttribute('aria-hidden', 'true'); });
            panel.classList.add('visible'); panel.style.display = 'block'; panel.setAttribute('aria-hidden', 'false');
            const homeEl = $id('home'); if (homeEl) homeEl.style.display = 'none';
            renderDining();
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        const panel = $id('panel-' + key);
        if (panel) {
          const panels2 = document.querySelectorAll('.panel'); panels2.forEach(p => { p.classList.remove('visible'); p.style.display = 'none'; p.setAttribute('aria-hidden', 'true'); });
          panel.classList.add('visible'); panel.style.display = 'block'; panel.setAttribute('aria-hidden', 'false');
          const h = $id('home'); if (h) h.style.display = 'none';
          if (key === 'flight') { renderFlight(); }
        } else {
          alert('模块“' + key + '”尚未实现（placeholder）。');
        }
        return;
      }

      // album card click -> open album
      const albumCard = e.target.closest('.album-card');
      if (albumCard && albumCard.dataset && albumCard.dataset.album) {
        const albumId = albumCard.dataset.album;
        const panelMusic2 = $id('panel-music');
        const ms2 = $id('music-selection');
        const mg2 = panelMusic2 ? panelMusic2.querySelector('.music-grid') : null;
        if (ms2) ms2.style.display = 'none';
        if (mg2) mg2.style.display = '';
        openMusicAlbum(albumId);
        if (panelMusic2) panelMusic2.scrollTop = 0;
        return;
      }

      // row-btn is handled on render (delegated fallback)
      const rowBtn = e.target.closest('.row-btn');
      if (rowBtn && rowBtn.dataset && rowBtn.dataset.idx !== undefined) {
        const idx = parseInt(rowBtn.dataset.idx, 10);
        playIdx(idx); updateLyricsForIndex(idx); highlightRow(idx, true);
        return;
      }

      // generic controls
      const btn = e.target.closest('.pill, .btn, button, .icon-btn, .badge, .lang-btn, .play-pill');
      if (btn) {
        const id = btn.id || (btn.dataset && btn.dataset.action);
        if (id === 'musicBack') { closeAllPanels(); return; }
        if (id === 'musicPlayAll' || btn.classList.contains('play-pill')) { const first = firstPlayableIndex(curAlbum); if (first !== -1) { playIdx(first); updateLyricsForIndex(first); } return; }
        if (id === 'btnPrev') { curIdx = prevPlayableIndex(curAlbum, curIdx); playIdx(curIdx); updateLyricsForIndex(curIdx); return; }
        if (id === 'btnNext') { curIdx = nextPlayableIndex(curAlbum, curIdx); playIdx(curIdx); updateLyricsForIndex(curIdx); return; }
        if (id === 'playPause') {
          if (!audio.src) { const f = firstPlayableIndex(curAlbum); if (f !== -1) { playIdx(f); updateLyricsForIndex(f); return; } }
          if (audio.paused) audio.play().then(() => setPauseIcon()).catch(() => setPlayIcon()); else { audio.pause(); setPlayIcon(); }
          return;
        }
        if (id === 'btnHome') { closeAllPanels(); return; }
        if (id === 'btnCall') { alert((I18N[lang] || I18N.en).ui.crew); return; }
        if (btn.classList.contains('lang-btn') && btn.dataset && btn.dataset.lang) {
          const chosen = btn.dataset.lang;
          applyLang(chosen);
          renderMusicSelection();
          const pm = $id('panel-music');
          if (pm && pm.classList.contains('visible')) openMusicAlbum(curAlbum);
          const ls2 = $id('langScreen'); if (ls2) ls2.style.display = 'none';
          return;
        }
      }

      // click outside lang modal to close
      const langScreen = $id('langScreen');
      if (langScreen && (e.target === langScreen)) { langScreen.style.display = 'none'; return; }
    }, true);

    /* ---------- highlight row & scroll sync ---------- */
    function highlightRow(index, scrollIntoView) {
      const rows = document.querySelectorAll('#trackList .row');
      rows.forEach(r => r.classList.remove('active'));
      const row = document.querySelector(`#trackList .row[data-idx="${index}"]`);
      if (row) {
        row.classList.add('active');
        // apply strong liquid-glass style via class; CSS handles glow (ensure class name .active present)
        if (scrollIntoView) {
          // ensure the list scrolls so the row is visible but we don't scroll the whole page
          try {
            row.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
          } catch (e) { /* ignore */ }
        }
      }
      // update player small np title (already done in playIdx), ensure bottom player shows current song
    }

    /* ---------- lyrics fetch & progress sync already implemented above ---------- */

    /* ---------- initial setup ---------- */
    // apply i18n
    applyLang(lang);

    // ensure album grid rendering and home visible
    renderMusicSelection();
    const homeEl = $id('home'); if (homeEl) homeEl.style.display = 'grid';
    const playerEl = $id('player'); if (playerEl) playerEl.style.display = '';

    // set initial volume UI
    setTimeout(function () {
      try {
        const vol = audio.volume || 0.6;
        const vb = $id('volBar'), vt = $id('volThumb'), vr = $id('volRail');
        if (vb) vb.style.width = (vol * 100) + '%';
        if (vt && vr) vt.style.left = (vol * (vr.getBoundingClientRect().width - 16) + 8) + 'px';
      } catch (e) { /* ignore */ }
    }, 200);

    // remove stray banner controls
    setTimeout(() => { cleanBannerControls(); }, 150);

    // expose some helpers for debugging in console if needed
    window.IFE = {
      LIB, openMusicAlbum, renderMusicSelection, playIdx, highlightRow, ensureAlbumToolbar, hideAlbumToolbar
    };

  } catch (err) {
    console.error('Initialization error', err);
  }
});