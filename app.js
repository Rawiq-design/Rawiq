
const surahSelect = document.getElementById("surahSelect");
const content = document.getElementById("content");

// Load surah list
fetch("https://api.alquran.cloud/v1/surah")
.then(res=>res.json())
.then(data=>{
  data.data.forEach(s=>{
    const opt = document.createElement("option");
    opt.value = s.number;
    opt.textContent = s.name;
    surahSelect.appendChild(opt);
  });
});

function loadSurah(){
  const num = surahSelect.value;
  content.innerHTML="جاري التحميل...";

  fetch(`https://api.alquran.cloud/v1/surah/${num}`)
  .then(res=>res.json())
  .then(data=>{
    let html="";
    data.data.ayahs.forEach(a=>{
      html+=`<p>(${a.numberInSurah}) ${a.text}</p>`;
    });
    content.innerHTML=html;
  })
  .catch(()=>{
    content.innerHTML="حدث خطأ في التحميل";
  });
}
