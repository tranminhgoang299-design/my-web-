(() => {
  "use strict";
  // Chỉnh thông tin sự kiện tại đây.
  const CONFIG = { name: "Minh Hoàng", date: "2026-10-18T13:00:00+07:00", dateText: "18/10/2026", timeText: "13:00", place: "Tại gia" };
  const $ = (s) => document.querySelector(s);
  const envelopeScreen = $("#envelope-screen"), inviteScreen = $("#invitation-screen"), toast = $("#toast");
  let toastTimer;
  document.title = `Thiệp sinh nhật · ${CONFIG.name}`;
  function notify(message) { toast.textContent = message; toast.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 3000); }
  function confetti() { if (!matchMedia("(prefers-reduced-motion: reduce)").matches && typeof window.confetti === "function") window.confetti({particleCount:100, spread:75, origin:{y:.62}, colors:["#f4a8bd","#dcd2ff","#d7f1e4","#ffe5a6","#ffffff"]}); }
  $("#open-letter").addEventListener("click", () => {
    const button = $("#open-letter"); if (button.disabled) return; button.disabled = true;
    envelopeScreen.classList.add("opening"); confetti();
    setTimeout(() => { envelopeScreen.classList.add("hidden"); inviteScreen.classList.remove("hidden"); $("#music").classList.remove("hidden"); updateCountdown(); window.scrollTo({top:0,behavior:"smooth"}); confetti(); }, 850);
  });
  const eventTime = new Date(CONFIG.date).getTime(), pad = n => String(n).padStart(2,"0");
  function updateCountdown() {
    const left = eventTime - Date.now();
    if (left <= 0) { $("#countdown").classList.add("hidden"); $("#count-message").textContent = "Đến giờ quẩy rồi! 🎉 Chúc mọi người có một buổi tiệc thật vui!"; return; }
    const s = Math.floor(left/1000); $("#days").textContent = Math.floor(s/86400); $("#hours").textContent = pad(Math.floor(s%86400/3600)); $("#minutes").textContent = pad(Math.floor(s%3600/60)); $("#seconds").textContent = pad(s%60);
  }
  updateCountdown(); setInterval(updateCountdown,1000);
  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    const area = document.createElement("textarea"); area.value=text; area.style.position="fixed"; area.style.opacity="0"; document.body.appendChild(area); area.select(); const ok=document.execCommand("copy"); area.remove(); if(!ok) throw new Error("Không thể sao chép");
  }
  $("#attend").addEventListener("click", () => { $("#name-box").classList.remove("hidden"); $("#feedback").textContent="Yayyy! Cho Hoàng biết ai sẽ đến chung vui nha 💖"; $("#guest-name").focus(); });
  $("#confirm").addEventListener("click", async () => {
    const name=$("#guest-name").value.trim(); if(!name){$("#guest-name").focus();notify("Nhập tên của bạn trước nha 💗");return;}
    const msg=`🎉 ${name} xác nhận sẽ tham dự sinh nhật ${CONFIG.name} vào ${CONFIG.dateText} lúc ${CONFIG.timeText}, địa điểm: ${CONFIG.place}.`;
    try { await copyText(msg); $("#feedback").textContent=`Yayyy, ${name}! Tin nhắn xác nhận đã được sao chép. Hãy gửi trực tiếp cho Hoàng nhé 💖`; notify("Đã sao chép xác nhận — gửi cho Hoàng nhé!"); }
    catch { $("#feedback").textContent=msg; notify("Hãy sao chép tin nhắn xác nhận để gửi cho Hoàng nhé."); } confetti();
  });
  const modal=$("#modal"), form=$("#wish-form"), result=$("#wish-result");
  function openModal(){modal.classList.remove("hidden");document.body.style.overflow="hidden";result.classList.add("hidden");form.classList.remove("hidden");$("#wish-name").focus();}
  function closeModal(){modal.classList.add("hidden");document.body.style.overflow="";$("#wish").focus();}
  $("#wish").addEventListener("click",openModal); $("#close").addEventListener("click",closeModal); $("#scrim").addEventListener("click",closeModal);
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!modal.classList.contains("hidden"))closeModal();});
  form.addEventListener("submit",e=>{e.preventDefault();const name=$("#wish-name").value.trim(),wish=$("#wish-text").value.trim();if(!name||!wish)return;$("#generated").value=`💌 Lời chúc sinh nhật gửi ${CONFIG.name}\n\n${wish}\n\n— ${name} ♡`;form.classList.add("hidden");result.classList.remove("hidden");$("#copy-feedback").textContent="Lời chúc mới được tạo trên thiết bị của bạn, chưa tự gửi đi đâu nhé.";confetti();});
  $("#copy-wish").addEventListener("click",async()=>{try{await copyText($("#generated").value);$("#copy-feedback").textContent="Đã sao chép! Giờ gửi lời chúc cho Hoàng thôi 💗";notify("Đã sao chép lời chúc 💌");}catch{$("#generated").focus();$("#generated").select();$("#copy-feedback").textContent="Không tự sao chép được. Hãy dùng Ctrl+C để sao chép.";}});
  $("#share").addEventListener("click",async()=>{const data={title:`Thiệp sinh nhật ${CONFIG.name}`,text:`Bạn được mời đến sinh nhật ${CONFIG.name} lúc ${CONFIG.timeText} ngày ${CONFIG.dateText}! 🎂`,url:location.href};try{if(navigator.share)await navigator.share(data);else{await copyText(location.href);notify("Đã sao chép đường link thiệp 🔗");}}catch(e){if(e.name!=="AbortError")notify("Hãy sao chép link trên thanh địa chỉ nhé.");}});
  // Giai điệu đơn giản được tạo bằng Web Audio; chỉ phát khi người dùng chủ động bật.
  let audioCtx=null,timer=null,playing=false,index=0;const notes=[523.25,659.25,783.99,659.25,587.33,698.46,783.99,698.46];
  function playNote(freq){const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.type="sine";osc.frequency.value=freq;gain.gain.setValueAtTime(.0001,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(.04,audioCtx.currentTime+.03);gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.32);osc.connect(gain);gain.connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+.34);}
  $("#music").addEventListener("click",async()=>{const button=$("#music");if(!playing){try{const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)throw Error();audioCtx=audioCtx||new Ctx();await audioCtx.resume();playing=true;button.textContent="♫ Nhạc: bật";button.setAttribute("aria-pressed","true");playNote(notes[index++%notes.length]);timer=setInterval(()=>playNote(notes[index++%notes.length]),380);}catch{notify("Trình duyệt này chưa hỗ trợ nhạc nền.");}}else{playing=false;clearInterval(timer);button.textContent="♫ Nhạc: tắt";button.setAttribute("aria-pressed","false");}});
})();
