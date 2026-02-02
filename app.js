/* Riwaq - GitHub Pages friendly static app
   Data source: https://alquran.cloud/api
*/

const $ = (sel) => document.querySelector(sel);

const surahSelect = $('#surahSelect');
const reciterSelect = $('#reciterSelect');
const tafsirSelect = $('#tafsirSelect');
const searchInput = $('#searchInput');
const ayahList = $('#ayahList');
const audioEl = $('#audio');
const statusEl = $('#status');

const btnPlay = $('#btnPlay');
const btnStop = $('#btnStop');
const btnReload = $('#btnReload');
const btnToggleTafsir = $('#btnToggleTafsir');
const btnSaveFav = $('#btnSaveFav');
const btnClearFav = $('#btnClearFav');

const btnHelp = $('#btnHelp');
const helpDialog = $('#helpDialog');
const closeHelp = $('#closeHelp');
const btnSettings = $('#btnSettings');
const settingsDialog = $('#settingsDialog');
const closeSettings = $('#closeSettings');
const fontSize = $('#fontSize');
const defaultTafsirVis = $('#defaultTafsirVis');

const favListEl = $('#favList');

// Juz tab
const juzSelect = $('#juzSelect');
const btnLoadJuz = $('#btnLoadJuz');
const juzStatus = $('#juzStatus');
const juzListEl = $('#juzList');

// Khatma / Session
const btnSession = $('#btnSession');
const btnPlan = $('#btnPlan');
const sessionPanel = $('#sessionPanel');
const planPanel = $('#planPanel');
const sessionMinutes = $('#sessionMinutes');
const sessionSurahSelect = $('#sessionSurahSelect');
const btnStartSession = $('#btnStartSession');
const sessionCountdown = $('#sessionCountdown');
const btnCloseSession = $('#btnCloseSession');
const planDays = $('#planDays');
const planStartDate = $('#planStartDate');
const btnCreatePlan = $('#btnCreatePlan');
const planToday = $('#planToday');
const planList = $('#planList');
const btnClosePlan = $('#btnClosePlan');

const API = 'https://api.alquran.cloud/v1';

// Common reciters available on AlQuran.cloud
const RECITERS = [
  { id: 'ar.alafasy', name: 'العفاسي' },
  { id: 'ar.abdulbasitmurattal', name: 'عبدالباسط (مرتل)' },
  { id: 'ar.husary', name: 'الحصري' },
  { id: 'ar.mahermuaiqly', name: 'ماهر المعيقلي' },
];

let state = {
  surahs: [],
  surahNo: 1,
  reciter: 'ar.alafasy',
  tafsir: 'ar.jalalayn',
  showTafsir: true,
  fontSize: 20,
};

function setStatus(text, kind='info'){
  statusEl.textContent = text;
  statusEl.style.color = (kind==='err') ? '#ffb7b7' : (kind==='ok' ? '#a7f3d0' : '');
}

function storageGet(key, fallback){
  try{ const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch{ return fallback; }
}
function storageSet(key, value){
  try{ localStorage.setItem(key, JSON.stringify(value)); } catch{}
}

function applyFontSize(px){
  document.documentElement.style.setProperty('--fs', `${px}px`);
}

async function fetchJson(url){
  const res = await fetch(url, { cache: 'no-store' });
  if(!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function loadSurahList(){
  // cache for 30 days
  const cache = storageGet('riwaq_surah_list_cache', null);
  const now = Date.now();
  if(cache && cache.ts && (now - cache.ts) < 30*24*60*60*1000 && Array.isArray(cache.data)){
    state.surahs = cache.data;
    return;
  }
  const data = await fetchJson(`${API}/surah`);
  state.surahs = data.data.map(s => ({ number: s.number, name: s.name, enName: s.englishName, ayahs: s.numberOfAyahs }));
  storageSet('riwaq_surah_list_cache', { ts: now, data: state.surahs });
}

function fillSelects(){
  surahSelect.innerHTML = state.surahs.map(s => `
    <option value="${s.number}">${s.number}. ${s.name} (${s.ayahs} آية)</option>
  `).join('');
  surahSelect.value = String(state.surahNo);

  reciterSelect.innerHTML = RECITERS.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
  reciterSelect.value = state.reciter;

  tafsirSelect.value = state.tafsir;
}

function normalizeArabic(s){
  return (s||'')
    .replace(/[\u064B-\u0652]/g, '') // tashkeel
    .replace(/ى/g,'ي')
    .replace(/أ|إ|آ/g,'ا')
    .replace(/ؤ/g,'و')
    .replace(/ئ/g,'ي')
    .replace(/ة/g,'ه')
    .trim();
}

function copyText(text){
  navigator.clipboard?.writeText(text).then(()=>{
    setStatus('تم النسخ ✅','ok');
    setTimeout(()=>setStatus('جاهز'), 1200);
  }).catch(()=>{
    setStatus('لم يتم النسخ (سياسة المتصفح)');
  });
}

function buildAyahCard(ayah, tafsirText){
  const wrap = document.createElement('div');
  wrap.className = 'ayah';

  const top = document.createElement('div');
  top.className = 'ayahTop';

  const badge = document.createElement('div');
  badge.className = 'badge';
  badge.textContent = `آية ${ayah.numberInSurah}`;

  const btns = document.createElement('div');
  btns.className = 'ayahBtns';

  const btnCopy = document.createElement('button');
  btnCopy.className = 'btnMini';
  btnCopy.textContent = 'نسخ';
  btnCopy.addEventListener('click', ()=> copyText(ayah.text));

  const btnPlayAyah = document.createElement('button');
  btnPlayAyah.className = 'btnMini';
  btnPlayAyah.textContent = '▶︎';
  btnPlayAyah.title = 'تشغيل الآية';
  btnPlayAyah.addEventListener('click', async ()=>{
    if(!ayah.audio){
      setStatus('الصوت غير متاح لهذه الآية','err');
      return;
    }
    try{
      audioEl.src = ayah.audio;
      await audioEl.play();
      setStatus('تشغيل الآية…','ok');
    } catch{
      setStatus('اضغط تشغيل من مشغل الصوت مرة واحدة','err');
    }
  });

  btns.appendChild(btnPlayAyah);
  btns.appendChild(btnCopy);

  top.appendChild(badge);
  top.appendChild(btns);

  const text = document.createElement('div');
  text.className = 'ayahText';
  text.textContent = ayah.text;

  wrap.appendChild(top);
  wrap.appendChild(text);

  const taf = document.createElement('div');
  taf.className = 'tafsir';
  taf.style.display = state.showTafsir ? 'block' : 'none';

  const tTitle = document.createElement('div');
  tTitle.className = 'tafsirTitle';
  tTitle.textContent = `التفسير (${tafsirSelect.options[tafsirSelect.selectedIndex].text})`;

  const tText = document.createElement('div');
  tText.className = 'tafsirText';
  tText.textContent = tafsirText || '—';

  taf.appendChild(tTitle);
  taf.appendChild(tText);

  wrap.appendChild(taf);

  return wrap;
}

function renderFav(){
  const fav = storageGet('riwaq_fav_surahs', []);
  if(!fav.length){
    favListEl.innerHTML = `<div class="empty"><div class="emptyText">لا توجد مفضلة بعد.</div></div>`;
    return;
  }
  const items = fav
    .map(n => state.surahs.find(s => s.number === n))
    .filter(Boolean);

  favListEl.innerHTML = '';
  for(const s of items){
    const row = document.createElement('div');
    row.className = 'favItem';
    row.innerHTML = `<div><b>${s.number}. ${s.name}</b><div class="smallNote">${s.ayahs} آية</div></div>`;

    const openBtn = document.createElement('button');
    openBtn.className = 'btnMini';
    openBtn.textContent = 'فتح';
    openBtn.addEventListener('click', ()=>{
      // switch to surah tab
      document.querySelector('[data-tab="surah"]').click();
      surahSelect.value = String(s.number);
      surahSelect.dispatchEvent(new Event('change'));
    });

    row.appendChild(openBtn);
    favListEl.appendChild(row);
  }
}

// -------------------- JUZ --------------------

function populateJuzSelect(){
  if(!juzSelect) return;
  const opts = [];
  for(let i=1;i<=30;i++) opts.push(`<option value="${i}">${i}</option>`);
  juzSelect.innerHTML = opts.join('');
}

function renderJuzList(juzNo, ayahs){
  if(!juzListEl) return;
  juzListEl.innerHTML = '';
  if(!ayahs.length){
    juzListEl.innerHTML = `<div class="empty"><div class="emptyTitle">لا يوجد محتوى</div><div class="emptyText">تعذر تحميل الجزء.</div></div>`;
    return;
  }
  const head = document.createElement('div');
  head.className = 'empty';
  head.innerHTML = `<div class="emptyTitle">الجزء ${juzNo}</div><div class="emptyText">يمكنك فتح أي آية داخل تبويب السورة.</div>`;
  juzListEl.appendChild(head);

  for(const a of ayahs){
    const surah = state.surahs.find(s => s.number === a.surahNumber);
    const surahName = surah ? surah.name : `سورة ${a.surahNumber}`;

    const row = document.createElement('div');
    row.className = 'ayah';
    row.innerHTML = `
      <div class="meta">
        <div>سورة: <b>${surahName}</b></div>
        <div class="badge">آية ${a.numberInSurah}</div>
      </div>
      <div class="text">${a.text}</div>
    `;

    const openBtn = document.createElement('button');
    openBtn.className = 'btnMini';
    openBtn.textContent = 'فتح في السورة';
    openBtn.addEventListener('click', async ()=>{
      // switch to surah tab
      document.querySelector('[data-tab="surah"]').click();
      surahSelect.value = String(a.surahNumber);
      await loadSurahAndRender({ autoplay:false });
      // scroll to ayah
      const target = document.querySelector(`[data-ayah="${a.numberInSurah}"]`);
      if(target) target.scrollIntoView({ behavior:'smooth', block:'center' });
    });
    row.appendChild(openBtn);
    juzListEl.appendChild(row);
  }
}

async function loadJuz(){
  const juzNo = Number(juzSelect?.value || 1);
  if(juzStatus) { juzStatus.textContent = 'جاري تحميل الجزء…'; juzStatus.style.color=''; }
  try{
    const data = await fetchJson(`${API}/juz/${juzNo}/quran-uthmani`);
    const ayahs = (data.data?.ayahs || []).map(a => ({
      surahNumber: a.surah?.number,
      numberInSurah: a.numberInSurah,
      text: a.text,
    })).filter(a=>a.surahNumber);
    if(juzStatus){ juzStatus.textContent = 'تم التحميل ✅'; juzStatus.style.color='var(--ok)'; }
    renderJuzList(juzNo, ayahs);
  } catch(e){
    console.error(e);
    if(juzStatus){ juzStatus.textContent = 'حصل خطأ في تحميل الجزء'; juzStatus.style.color='var(--err)'; }
    renderJuzList(juzNo, []);
  }
}

// -------------------- KHATMA / SESSION --------------------

function getKhatma(){
  return storageGet('riwaq_khatma_v1', null);
}

function setKhatma(obj){
  storageSet('riwaq_khatma_v1', obj);
}

function computeTodayRange(k){
  // day index starts at 1
  const start = new Date(k.startDate + 'T00:00:00');
  const now = new Date();
  const diffDays = Math.floor((now - start) / (24*60*60*1000)) + 1;
  const day = Math.max(1, diffDays);
  const days = Math.max(1, Number(k.days||30));
  const perDay = 30 / days;
  const juzStart = Math.min(30, Math.max(1, Math.floor((day-1)*perDay) + 1));
  const juzEnd = Math.min(30, Math.max(juzStart, Math.floor(day*perDay)));
  return { day, days, juzStart, juzEnd };
}

function renderPlan(){
  if(!planPanel || !planToday || !planList) return;
  const k = getKhatma();
  if(!k){
    planToday.textContent = 'لم تبدأ خطة ختم بعد.';
    planList.innerHTML = '';
    return;
  }
  const { day, days, juzStart, juzEnd } = computeTodayRange(k);
  const rangeText = (juzStart===juzEnd) ? `الجزء ${juzStart}` : `من الجزء ${juzStart} إلى ${juzEnd}`;
  planToday.textContent = `اليوم ${day} من ${days} — المطلوب: ${rangeText}`;

  const done = new Set(k.doneJuz || []);
  planList.innerHTML = '';
  for(let i=1;i<=30;i++){
    const row = document.createElement('label');
    row.className = 'checkRow';
    row.innerHTML = `<input type="checkbox" ${done.has(i)?'checked':''} /> <span>الجزء ${i}</span>`;
    const cb = row.querySelector('input');
    cb.addEventListener('change', ()=>{
      const k2 = getKhatma() || { startDate:k.startDate, days:k.days, doneJuz:[] };
      const set = new Set(k2.doneJuz || []);
      if(cb.checked) set.add(i); else set.delete(i);
      k2.doneJuz = Array.from(set).sort((a,b)=>a-b);
      setKhatma(k2);
    });
    planList.appendChild(row);
  }
}

function openPanel(panel){
  if(!panel) return;
  panel.style.display = 'block';
}
function closePanel(panel){
  if(!panel) return;
  panel.style.display = 'none';
}

function populateSessionSurahs(){
  if(!sessionSurahSelect) return;
  sessionSurahSelect.innerHTML = state.surahs
    .map(s=>`<option value="${s.number}">${s.number} - ${s.name}</option>`)
    .join('');
}

let sessionTimer = null;
function startSession(){
  const minutes = Number(sessionMinutes?.value || 10);
  const surahNo = Number(sessionSurahSelect?.value || 1);
  if(sessionCountdown) sessionCountdown.textContent = '';

  // load surah and autoplay
  document.querySelector('[data-tab="surah"]').click();
  surahSelect.value = String(surahNo);
  loadSurahAndRender({ autoplay:true }).catch(()=>{});

  const endAt = Date.now() + minutes*60*1000;
  storageSet('riwaq_session_v1', { minutes, surahNo, endAt });

  if(sessionTimer) clearInterval(sessionTimer);
  sessionTimer = setInterval(()=>{
    const left = Math.max(0, endAt - Date.now());
    const mm = String(Math.floor(left/60000)).padStart(2,'0');
    const ss = String(Math.floor((left%60000)/1000)).padStart(2,'0');
    if(sessionCountdown) sessionCountdown.textContent = `الوقت المتبقي: ${mm}:${ss}`;
    if(left <= 0){
      clearInterval(sessionTimer);
      sessionTimer = null;
      try{ audio.pause(); }catch{}
      if(sessionCountdown) sessionCountdown.textContent = 'انتهت الجلسة ✅';
    }
  }, 500);
}

async function loadSurahAndRender({ autoplay=false } = {}){
  const surahNo = Number(surahSelect.value || 1);
  state.surahNo = surahNo;
  state.reciter = reciterSelect.value;
  state.tafsir = tafsirSelect.value;

  storageSet('riwaq_last', {
    surahNo: state.surahNo,
    reciter: state.reciter,
    tafsir: state.tafsir,
  });

  const cacheKey = `riwaq_cache_${surahNo}_${state.reciter}_${state.tafsir}`;
  const cached = storageGet(cacheKey, null);
  const now = Date.now();

  if(cached && cached.ts && (now - cached.ts) < 6*60*60*1000 && cached.payload){
    setStatus('تم التحميل (من الكاش) ✅','ok');
    renderFromPayload(cached.payload);
    if(autoplay) await playSurahAudio(cached.payload);
    return;
  }

  setStatus('جاري تحميل السورة…');

  // We fetch:
  // 1) audio+text edition (reciter)
  // 2) tafsir edition
  // NOTE: Some editions may occasionally fail; we'll show graceful error.
  try{
    const [audioData, tafsirData] = await Promise.all([
      fetchJson(`${API}/surah/${surahNo}/${encodeURIComponent(state.reciter)}`),
      fetchJson(`${API}/surah/${surahNo}/${encodeURIComponent(state.tafsir)}`),
    ]);

    const payload = {
      surahNo,
      reciter: state.reciter,
      tafsir: state.tafsir,
      surahName: audioData.data?.name || '',
      ayahs: (audioData.data?.ayahs || []).map(a => ({
        numberInSurah: a.numberInSurah,
        text: a.text,
        audio: a.audio,
      })),
      tafsirAyahs: (tafsirData.data?.ayahs || []).map(a => ({
        numberInSurah: a.numberInSurah,
        text: a.text,
      }))
    };

    storageSet(cacheKey, { ts: now, payload });

    renderFromPayload(payload);
    setStatus('تم التحميل ✅','ok');

    if(autoplay) await playSurahAudio(payload);

  } catch (e){
    console.error(e);
    setStatus('حصل خطأ في التحميل. جرّب تحديث أو غيّر القارئ/التفسير.','err');
    ayahList.innerHTML = `<div class="empty"><div class="emptyTitle">خطأ في التحميل</div><div class="emptyText">${String(e.message||e)}</div></div>`;
  }
}

function renderFromPayload(payload){
  const q = normalizeArabic(searchInput.value);

  const tafMap = new Map(payload.tafsirAyahs.map(t => [t.numberInSurah, t.text]));

  const filtered = payload.ayahs.filter(a => {
    if(!q) return true;
    return normalizeArabic(a.text).includes(q);
  });

  ayahList.innerHTML = '';

  if(!filtered.length){
    ayahList.innerHTML = `<div class="empty"><div class="emptyText">لا توجد نتائج للبحث.</div></div>`;
    return;
  }

  for(const a of filtered){
    const card = buildAyahCard(a, tafMap.get(a.numberInSurah));
    ayahList.appendChild(card);
  }
}

async function playSurahAudio(payload){
  // AlQuran.cloud provides audio per ayah. We'll concatenate by sequential play.
  // We'll play from the first ayah and auto-advance.
  const list = payload.ayahs.filter(a => !!a.audio);
  if(!list.length){
    setStatus('الصوت غير متاح لهذه السورة','err');
    return;
  }

  let idx = 0;
  const playIdx = async (i) => {
    idx = i;
    audioEl.src = list[idx].audio;
    try{
      await audioEl.play();
      setStatus(`تشغيل السورة… (آية ${list[idx].numberInSurah})`,'ok');
    } catch {
      setStatus('اضغط تشغيل من مشغل الصوت مرة واحدة ثم جرّب تاني','err');
    }
  };

  audioEl.onended = () => {
    if(idx < list.length - 1){
      playIdx(idx + 1);
    } else {
      setStatus('انتهى التشغيل ✅','ok');
    }
  };

  await playIdx(0);
}

function initTabs(){
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const t = btn.dataset.tab;
      document.querySelectorAll('.tabPanel').forEach(p => p.classList.add('hidden'));
      $(`#tab-${t}`).classList.remove('hidden');

      if(t==='fav') renderFav();
    });
  });
}

function wireUI(){
  surahSelect.addEventListener('change', () => loadSurahAndRender({ autoplay: false }));
  reciterSelect.addEventListener('change', () => loadSurahAndRender({ autoplay: false }));
  tafsirSelect.addEventListener('change', () => loadSurahAndRender({ autoplay: false }));

  searchInput.addEventListener('input', () => {
    // Re-render from cache if possible
    const surahNo = state.surahNo;
    const cacheKey = `riwaq_cache_${surahNo}_${state.reciter}_${state.tafsir}`;
    const cached = storageGet(cacheKey, null);
    if(cached?.payload) renderFromPayload(cached.payload);
  });

  btnPlay.addEventListener('click', () => loadSurahAndRender({ autoplay: true }));

  btnStop.addEventListener('click', () => {
    audioEl.pause();
    audioEl.currentTime = 0;
    audioEl.onended = null;
    setStatus('تم الإيقاف');
  });

  btnReload.addEventListener('click', async () => {
    setStatus('تحديث…');
    // Clear cache for this selection
    const cacheKey = `riwaq_cache_${state.surahNo}_${state.reciter}_${state.tafsir}`;
    try{ localStorage.removeItem(cacheKey); } catch{}
    await loadSurahAndRender({ autoplay: false });
  });

  btnToggleTafsir.addEventListener('click', () => {
    state.showTafsir = !state.showTafsir;
    storageSet('riwaq_settings', { ...storageGet('riwaq_settings', {}), showTafsir: state.showTafsir });
    document.querySelectorAll('.tafsir').forEach(el => el.style.display = state.showTafsir ? 'block' : 'none');
  });

  btnSaveFav.addEventListener('click', () => {
    const n = state.surahNo;
    const fav = storageGet('riwaq_fav_surahs', []);
    if(!fav.includes(n)) fav.push(n);
    storageSet('riwaq_fav_surahs', fav);
    setStatus('تم الحفظ في المفضلة ⭐','ok');
  });

  btnClearFav.addEventListener('click', () => {
    storageSet('riwaq_fav_surahs', []);
    renderFav();
    setStatus('تم مسح المفضلة');
  });

  btnHelp.addEventListener('click', () => helpDialog.showModal());
  closeHelp.addEventListener('click', () => helpDialog.close());

  btnSettings.addEventListener('click', () => settingsDialog.showModal());
  closeSettings.addEventListener('click', () => settingsDialog.close());

  fontSize.addEventListener('input', () => {
    const v = Number(fontSize.value);
    state.fontSize = v;
    applyFontSize(v);
    storageSet('riwaq_settings', { ...storageGet('riwaq_settings', {}), fontSize: v });
  });

  defaultTafsirVis.addEventListener('change', () => {
    const on = defaultTafsirVis.value === 'on';
    state.showTafsir = on;
    storageSet('riwaq_settings', { ...storageGet('riwaq_settings', {}), showTafsir: on });
    document.querySelectorAll('.tafsir').forEach(el => el.style.display = on ? 'block' : 'none');
  });

  // Juz
  if(btnLoadJuz){
    btnLoadJuz.addEventListener('click', () => {
      const j = Number(juzSelect?.value || 1);
      loadJuz(j);
    });
  }

  // Session
  if(btnSession){
    btnSession.addEventListener('click', () => sessionPanel?.showModal());
  }
  if(btnCloseSession){
    btnCloseSession.addEventListener('click', () => sessionPanel?.close());
  }
  if(btnStartSession){
    btnStartSession.addEventListener('click', () => {
      const minutes = Number(sessionMinutes?.value || 10);
      const surahNo = Number(sessionSurahSelect?.value || state.surahNo);
      startSession(minutes, surahNo);
    });
  }

  // Plan
  if(btnPlan){
    btnPlan.addEventListener('click', () => {
      loadPlanUI();
      planPanel?.showModal();
    });
  }
  if(btnClosePlan){
    btnClosePlan.addEventListener('click', () => planPanel?.close());
  }
  if(btnCreatePlan){
    btnCreatePlan.addEventListener('click', () => {
      const days = Number(planDays?.value || 30);
      const startDate = planStartDate?.value || new Date().toISOString().slice(0,10);
      savePlan({ days, startDate });
      loadPlanUI();
    });
  }
}

async function init(){
  initTabs();

  // restore last
  const last = storageGet('riwaq_last', null);
  if(last){
    state.surahNo = Number(last.surahNo || 1);
    state.reciter = last.reciter || state.reciter;
    state.tafsir = last.tafsir || state.tafsir;
  }

  const settings = storageGet('riwaq_settings', {});
  if(settings.fontSize) state.fontSize = Number(settings.fontSize);
  if(typeof settings.showTafsir === 'boolean') state.showTafsir = settings.showTafsir;

  applyFontSize(state.fontSize);
  fontSize.value = String(state.fontSize);
  defaultTafsirVis.value = state.showTafsir ? 'on' : 'off';

  // Fill lists
  try{
    setStatus('تحميل قائمة السور…');
    await loadSurahList();
    fillSelects();
    populateJuzSelect();
    populateSessionSurahSelect();
    wireUI();
    setStatus('جاهز');

    // initial load
    surahSelect.value = String(state.surahNo);
    reciterSelect.value = state.reciter;
    tafsirSelect.value = state.tafsir;

    await loadSurahAndRender({ autoplay: false });
  } catch (e){
    console.error(e);
    setStatus('تعذر تحميل قائمة السور. تأكد من الإنترنت.','err');
    ayahList.innerHTML = `<div class="empty"><div class="emptyTitle">لا يمكن البدء</div><div class="emptyText">${String(e.message||e)}</div></div>`;
  }
}

init();
