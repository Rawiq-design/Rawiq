const CHAPTERS = [{"id": 1, "name": "الفاتحة", "verses": 7}, {"id": 2, "name": "البقرة", "verses": 286}, {"id": 3, "name": "آل عمران", "verses": 200}, {"id": 4, "name": "النساء", "verses": 176}, {"id": 5, "name": "المائدة", "verses": 120}, {"id": 6, "name": "الأنعام", "verses": 165}, {"id": 7, "name": "الأعراف", "verses": 206}, {"id": 8, "name": "الأنفال", "verses": 75}, {"id": 9, "name": "التوبة", "verses": 129}, {"id": 10, "name": "يونس", "verses": 109}, {"id": 11, "name": "هود", "verses": 123}, {"id": 12, "name": "يوسف", "verses": 111}, {"id": 13, "name": "الرعد", "verses": 43}, {"id": 14, "name": "إبراهيم", "verses": 52}, {"id": 15, "name": "الحجر", "verses": 99}, {"id": 16, "name": "النحل", "verses": 128}, {"id": 17, "name": "الإسراء", "verses": 111}, {"id": 18, "name": "الكهف", "verses": 110}, {"id": 19, "name": "مريم", "verses": 98}, {"id": 20, "name": "طه", "verses": 135}, {"id": 21, "name": "الأنبياء", "verses": 112}, {"id": 22, "name": "الحج", "verses": 78}, {"id": 23, "name": "المؤمنون", "verses": 118}, {"id": 24, "name": "النور", "verses": 64}, {"id": 25, "name": "الفرقان", "verses": 77}, {"id": 26, "name": "الشعراء", "verses": 227}, {"id": 27, "name": "النمل", "verses": 93}, {"id": 28, "name": "القصص", "verses": 88}, {"id": 29, "name": "العنكبوت", "verses": 69}, {"id": 30, "name": "الروم", "verses": 60}, {"id": 31, "name": "لقمان", "verses": 34}, {"id": 32, "name": "السجدة", "verses": 30}, {"id": 33, "name": "الأحزاب", "verses": 73}, {"id": 34, "name": "سبأ", "verses": 54}, {"id": 35, "name": "فاطر", "verses": 45}, {"id": 36, "name": "يس", "verses": 83}, {"id": 37, "name": "الصافات", "verses": 182}, {"id": 38, "name": "ص", "verses": 88}, {"id": 39, "name": "الزمر", "verses": 75}, {"id": 40, "name": "غافر", "verses": 85}, {"id": 41, "name": "فصلت", "verses": 54}, {"id": 42, "name": "الشورى", "verses": 53}, {"id": 43, "name": "الزخرف", "verses": 89}, {"id": 44, "name": "الدخان", "verses": 59}, {"id": 45, "name": "الجاثية", "verses": 37}, {"id": 46, "name": "الأحقاف", "verses": 35}, {"id": 47, "name": "محمد", "verses": 38}, {"id": 48, "name": "الفتح", "verses": 29}, {"id": 49, "name": "الحجرات", "verses": 18}, {"id": 50, "name": "ق", "verses": 45}, {"id": 51, "name": "الذاريات", "verses": 60}, {"id": 52, "name": "الطور", "verses": 49}, {"id": 53, "name": "النجم", "verses": 62}, {"id": 54, "name": "القمر", "verses": 55}, {"id": 55, "name": "الرحمن", "verses": 78}, {"id": 56, "name": "الواقعة", "verses": 96}, {"id": 57, "name": "الحديد", "verses": 29}, {"id": 58, "name": "المجادلة", "verses": 22}, {"id": 59, "name": "الحشر", "verses": 24}, {"id": 60, "name": "الممتحنة", "verses": 13}, {"id": 61, "name": "الصف", "verses": 14}, {"id": 62, "name": "الجمعة", "verses": 11}, {"id": 63, "name": "المنافقون", "verses": 11}, {"id": 64, "name": "التغابن", "verses": 18}, {"id": 65, "name": "الطلاق", "verses": 12}, {"id": 66, "name": "التحريم", "verses": 12}, {"id": 67, "name": "الملك", "verses": 30}, {"id": 68, "name": "القلم", "verses": 52}, {"id": 69, "name": "الحاقة", "verses": 52}, {"id": 70, "name": "المعارج", "verses": 44}, {"id": 71, "name": "نوح", "verses": 28}, {"id": 72, "name": "الجن", "verses": 28}, {"id": 73, "name": "المزمل", "verses": 20}, {"id": 74, "name": "المدثر", "verses": 56}, {"id": 75, "name": "القيامة", "verses": 40}, {"id": 76, "name": "الإنسان", "verses": 31}, {"id": 77, "name": "المرسلات", "verses": 50}, {"id": 78, "name": "النبأ", "verses": 40}, {"id": 79, "name": "النازعات", "verses": 46}, {"id": 80, "name": "عبس", "verses": 42}, {"id": 81, "name": "التكوير", "verses": 29}, {"id": 82, "name": "الانفطار", "verses": 19}, {"id": 83, "name": "المطففين", "verses": 36}, {"id": 84, "name": "الانشقاق", "verses": 25}, {"id": 85, "name": "البروج", "verses": 22}, {"id": 86, "name": "الطارق", "verses": 17}, {"id": 87, "name": "الأعلى", "verses": 19}, {"id": 88, "name": "الغاشية", "verses": 26}, {"id": 89, "name": "الفجر", "verses": 30}, {"id": 90, "name": "البلد", "verses": 20}, {"id": 91, "name": "الشمس", "verses": 15}, {"id": 92, "name": "الليل", "verses": 21}, {"id": 93, "name": "الضحى", "verses": 11}, {"id": 94, "name": "الشرح", "verses": 8}, {"id": 95, "name": "التين", "verses": 8}, {"id": 96, "name": "العلق", "verses": 19}, {"id": 97, "name": "القدر", "verses": 5}, {"id": 98, "name": "البينة", "verses": 8}, {"id": 99, "name": "الزلزلة", "verses": 8}, {"id": 100, "name": "العاديات", "verses": 11}, {"id": 101, "name": "القارعة", "verses": 11}, {"id": 102, "name": "التكاثر", "verses": 8}, {"id": 103, "name": "العصر", "verses": 3}, {"id": 104, "name": "الهمزة", "verses": 9}, {"id": 105, "name": "الفيل", "verses": 5}, {"id": 106, "name": "قريش", "verses": 4}, {"id": 107, "name": "الماعون", "verses": 7}, {"id": 108, "name": "الكوثر", "verses": 3}, {"id": 109, "name": "الكافرون", "verses": 6}, {"id": 110, "name": "النصر", "verses": 3}, {"id": 111, "name": "المسد", "verses": 5}, {"id": 112, "name": "الإخلاص", "verses": 4}, {"id": 113, "name": "الفلق", "verses": 5}, {"id": 114, "name": "الناس", "verses": 6}];

const $ = (s)=>document.querySelector(s);

const els = {
  search: $('#search'),
  surah: $('#surah'),
  reciter: $('#reciter'),
  playBtn: $('#playBtn'),
  player: $('#player'),
  ayahs: $('#ayahs'),
  status: $('#status'),
  helpBtn: $('#helpBtn'),
  debugBtn: $('#debugBtn'),
};

const LS_KEY = 'riwaq_v16_state';

function setStatus(msg, kind='') {
  els.status.className = 'status' + (kind ? ' '+kind : '');
  els.status.textContent = msg;
}

function chapterLabel(c) {
  return `${c.id} - ${c.name} (${c.verses} آية)`;
}

function renderChapters(filter='') {
  const q = (filter||'').trim();
  const current = Number(els.surah.value) || null;
  els.surah.innerHTML = '';
  for (const c of CHAPTERS) {
    if (q) {
      const ok = String(c.id)===q || c.name.includes(q);
      if (!ok) continue;
    }
    const opt = document.createElement('option');
    opt.value = String(c.id);
    opt.textContent = chapterLabel(c);
    els.surah.appendChild(opt);
  }
  if (current && [...els.surah.options].some(o=>Number(o.value)===current)) {
    els.surah.value = String(current);
  }
}

function audioUrl(surahId, reciter) {
  return `https://cdn.islamic.network/quran/audio-surah/128/${reciter}/${surahId}.mp3`;
}

async function loadSurahText(surahId) {
  const url = `https://api.alquran.cloud/v1/surah/${surahId}`;
  const res = await fetch(url, {cache:'no-store'});
  if (!res.ok) throw new Error('HTTP '+res.status);
  const data = await res.json();
  if (!data || !data.data || !Array.isArray(data.data.ayahs)) throw new Error('bad payload');
  return data.data.ayahs.map(a => ({n: a.numberInSurah, t: a.text}));
}

function renderAyahs(list) {
  els.ayahs.innerHTML = '';
  for (const a of list) {
    const div = document.createElement('div');
    div.className = 'ayah';
    div.innerHTML = `
      <div class="ayahHead">
        <span class="badge" data-kind="num">آية ${a.n}</span>
        <span class="badge" data-kind="copy">نسخ</span>
      </div>
      <div class="ayahText"></div>
    `;
    div.querySelector('.ayahText').textContent = a.t;
    div.querySelector('[data-kind="copy"]').addEventListener('click', async ()=>{
      try {
        await navigator.clipboard.writeText(a.t);
        setStatus('تم نسخ الآية ✅', 'good');
        setTimeout(()=>setStatus('جاهز.', ''), 1000);
      } catch(e) {
        setStatus('لم يتم النسخ (المتصفح يمنع).', 'bad');
      }
    });
    els.ayahs.appendChild(div);
  }
}

function saveState() {
  const s = {
    surah: Number(els.surah.value)||1,
    reciter: els.reciter.value || 'ar.alafasy',
    search: els.search.value || ''
  };
  localStorage.setItem(LS_KEY, JSON.stringify(s));
}

function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(LS_KEY)||'null');
    return s || null;
  } catch(_) { return null; }
}

async function play() {
  const surahId = Number(els.surah.value)||1;
  const reciter = els.reciter.value || 'ar.alafasy';
  saveState();
  setStatus('جارٍ تحميل السورة…', '');
  els.ayahs.innerHTML = '';

  els.player.src = audioUrl(surahId, reciter);

  try {
    const ayahs = await loadSurahText(surahId);
    renderAyahs(ayahs);
    setStatus('تم تحميل النص ✅', 'good');
  } catch (e) {
    console.error(e);
    setStatus('تعذر تحميل نص السورة. جرّب مرة أخرى أو افتح ?debug=1 وصوّر الرسالة.', 'bad');
  }

  try { await els.player.play(); } catch(_) {}
}

els.search.addEventListener('input', (e)=>{
  renderChapters(e.target.value);
  saveState();
});

els.surah.addEventListener('change', saveState);
els.reciter.addEventListener('change', saveState);
els.playBtn.addEventListener('click', play);

els.helpBtn.addEventListener('click', ()=>{
  alert('١) اكتب اسم السورة أو اخترها\n٢) اضغط تشغيل\n\nملاحظة: تشغيل الصوت قد يحتاج ضغطة من المستخدم حسب سياسة المتصفح.');
});

els.debugBtn.addEventListener('click', ()=>{
  const s = {
    ua: navigator.userAgent,
    url: location.href,
    online: navigator.onLine,
    surah: els.surah.value,
    reciter: els.reciter.value
  };
  alert('RIWAQ DEBUG\n'+JSON.stringify(s,null,2));
});

(function init(){
  renderChapters('');
  const st = loadState();
  if (st) {
    els.search.value = st.search || '';
    renderChapters(els.search.value);
    els.reciter.value = st.reciter || 'ar.alafasy';
    els.surah.value = String(st.surah || 1);
  } else {
    els.surah.value = '1';
  }
})();
