// Storage Keys & Defaults
const STORAGE_SECTORS_KEY = "wheel_game_sectors_v1";
const STORAGE_POOLS_KEY = "wheel_game_pools_v1";
const STORAGE_PIN_KEY = "wheel_game_admin_pin_v1";
const DEFAULT_PIN = "1234";

const DEFAULT_SECTORS = [
    { 
        color: "#FF5252", 
        textColor: "#FFFFFF", 
        label: "سؤال عن الكلية", 
        icon: "🎓",
        message: "يا ترى حافظ كليتك كويس؟ جاوب على السؤال وزود نقاطك! 📚"
    },
    { 
        color: "#FF793F", 
        textColor: "#FFFFFF", 
        label: "كسر الجليد", 
        icon: "❄️",
        message: "جاهز تكسر الجليد؟ احكي لنا موقف طريف حصلك في الكلية! 😄"
    },
    { 
        color: "#FFB142", 
        textColor: "#1E272C", 
        label: "تحدي كوميدي", 
        icon: "🎭",
        message: "وقت الفرفشة! قلّد شخصية أو أعمل حركة كوميدية قدام الناس! 🎭"
    },
    { 
        color: "#33D9B2", 
        textColor: "#1E272C", 
        label: "هدية فورية", 
        icon: "🎁",
        message: "يا حظك يا عم! ليك هدية ممتازة فورية من اتحاد الطلاب! 🎁✨"
    },
    { 
        color: "#706FD3", 
        textColor: "#FFFFFF", 
        label: "فرصة ثانية", 
        icon: "🔄",
        message: "حظ سعيد! خد لفة ثانية العجلة بتديك فرصة جديدة! 🔄🔥"
    }
];

const DEFAULT_CHALLENGE_POOLS = {
    "سؤال عن الكلية": [
        "اذكر اسم 3 دكاترة بتدرسلهم في الكلية السنة دي! 📚",
        "أكتر مادة حاسس إنها تقيلة وخايف منها وليه؟ 😅",
        "ايه هو مكانك المفضل في الكلية لما تكون عاوز تروق؟ ☕",
        "مين أول صديق اتعرفت عليه في الكلية وأسلوب تعارفكم كان إزاي؟ 🤝",
        "لو تقدر تغير حاجة واحدة في جدول المحاضرات، هتغير ايه؟ 🗓️",
        "ايه أكتر موقف مضحك حصلك جوة مدرج الكلية؟ 😂",
        "قول اسم 3 أقسام أو تخصصات موجودة في كليتنا! 🏛️",
        "ايه هي أكتر قاعة محاضرات بترتاح فيها وليه؟ 🏫"
    ],
    "كسر الجليد": [
        "احكي لنا عن أكتر أكلة بتحب تاكلها لما تكون متضايق! 🍕",
        "لو كسبت 100 ألف جنيه دلوقتي حالا، أول حاجة هتشتريها ايه؟ 💰",
        "ايه هي العادة الغريبة اللي بتعملها وما حدش يعرفها عنك؟ 🤫",
        "لو هتختار تمثل في فيلم كوميدي، تحب تطلع شخصية مين؟ 🎬",
        "قولنا ايه هي أمنيّتك الأولى للسنة الدراسية الجديدة؟ 🌟",
        "لو اتعرض عليك تسافر أي بلد بكرة، تختار تروح فين ومع مين؟ ✈️",
        "ايه أكتر موهبة مدفونة عندك نفسك الناس تعرفها؟ 🎤",
        "ايه هو الشعار السري أو الحكمة اللي بتأمن بيها في حياتك؟ 💡"
    ],
    "تحدي كوميدي": [
        "قلّد صوت أو حركة دكتور/معيد بدون ما تقول اسمه واللي واقفين يحذروا! 🎭",
        "احكي نكتة سريعة وخلي 3 من صحابك يضحكوا! 😆",
        "مثّل مشهد درامي حزين جداً وأنت بتطلب سندوتش فول وطعمية! 🎬",
        "قول بيت شعر أو غنوة بصوت عالي كأنك في أوبرا! 🎼",
        "أعمل 5 تمرين ضغط أو حركة كوميدية مضحكة قدام الناس! 🏋️‍♂️",
        "قلّد ضحكة كرتونية مشهورة بصوت مرتفع لمدة 5 ثواني! 🤪",
        "اتكلم باللغة العربية الفصحى المعقدة في كل كلامك لمدة دقيقة كاملة! 📜",
        "اعمل إعلان مضحك وكوميدي على نظارتك أو ساعتك كانها اختراع خارق! ⌚"
    ]
};

// Global Data State
let sectors = [];
let challengePools = {};

function loadStateFromStorage() {
    try {
        const savedSectors = localStorage.getItem(STORAGE_SECTORS_KEY);
        const savedPools = localStorage.getItem(STORAGE_POOLS_KEY);
        
        sectors = savedSectors ? JSON.parse(savedSectors) : JSON.parse(JSON.stringify(DEFAULT_SECTORS));
        challengePools = savedPools ? JSON.parse(savedPools) : JSON.parse(JSON.stringify(DEFAULT_CHALLENGE_POOLS));
    } catch (e) {
        sectors = JSON.parse(JSON.stringify(DEFAULT_SECTORS));
        challengePools = JSON.parse(JSON.stringify(DEFAULT_CHALLENGE_POOLS));
    }
}

function saveStateToStorage() {
    try {
        localStorage.setItem(STORAGE_SECTORS_KEY, JSON.stringify(sectors));
        localStorage.setItem(STORAGE_POOLS_KEY, JSON.stringify(challengePools));
    } catch (e) {}
    drawWheel();
}

// Canvas & Controls Elements
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const pointerBox = document.getElementById("pointerBox");
const spinBtn = document.getElementById("spinBtn");
const resultBannerText = document.getElementById("resultBannerText");
const soundToggle = document.getElementById("soundToggle");
const ledBezel = document.getElementById("ledBezel");

// Modal Elements
const winnerModal = document.getElementById("winnerModal");
const modalWinnerTag = document.getElementById("modalWinnerTag");
const modalWinnerMsg = document.getElementById("modalWinnerMsg");

// Envelope Modal Elements
const envelopeModal = document.getElementById("envelopeModal");
const envelopeCategoryTitle = document.getElementById("envelopeCategoryTitle");
const revealedChallengeBox = document.getElementById("revealedChallengeBox");
const revealedTag = document.getElementById("revealedTag");
const revealedText = document.getElementById("revealedText");

// Admin Elements
const adminBtn = document.getElementById("adminBtn");
const adminPinModal = document.getElementById("adminPinModal");
const adminModal = document.getElementById("adminModal");
const pinInput = document.getElementById("pinInput");
const pinErrorMsg = document.getElementById("pinErrorMsg");
const adminToast = document.getElementById("adminToast");

// Color Picker Dual Sync
const sectorColor = document.getElementById("sectorColor");
const sectorColorText = document.getElementById("sectorColorText");
const sectorTextColor = document.getElementById("sectorTextColor");
const sectorTextColorText = document.getElementById("sectorTextColorText");

if (sectorColor && sectorColorText) {
    sectorColor.addEventListener("input", (e) => sectorColorText.value = e.target.value.toUpperCase());
    sectorColorText.addEventListener("input", (e) => sectorColor.value = e.target.value);
}
if (sectorTextColor && sectorTextColorText) {
    sectorTextColor.addEventListener("input", (e) => sectorTextColorText.value = e.target.value.toUpperCase());
    sectorTextColorText.addEventListener("input", (e) => sectorTextColor.value = e.target.value);
}

// Envelope State
let currentEnvelopeChallenges = [];
let isEnvelopeSelected = false;

// Audio Context
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            audioCtx = new AudioContext();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playTickSound() {
    if (!soundEnabled || !audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(580, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.04);
        
        gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.04);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {}
}

function playWinSound() {
    if (!soundEnabled || !audioCtx) return;
    try {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, index) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            const startTime = audioCtx.currentTime + index * 0.12;
            gain.gain.setValueAtTime(0.25, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start(startTime);
            osc.stop(startTime + 0.5);
        });
    } catch (e) {}
}

function playEnvelopeOpenSound() {
    if (!soundEnabled || !audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(750, audioCtx.currentTime + 0.35);
        
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {}
}

// Sound Toggle Event
if (soundToggle) {
    soundToggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        soundToggle.innerText = soundEnabled ? "🔊" : "🔇";
        soundToggle.title = soundEnabled ? "إيقاف الصوت" : "تشغيل الصوت";
        if (soundEnabled) initAudio();
    });
}

function finishSpin(winningIndex) {
    isSpinning = false;
    spinBtn.disabled = false;

    const winningSector = sectors[winningIndex];
    if (!winningSector) return;

    const resultLabel = `${winningSector.icon || '⭐'} ${winningSector.label}`;

    resultBannerText.innerText = resultLabel;
    resultBannerText.style.color = "var(--cyan)";

    const pool = challengePools[winningSector.label];

    // Check if sector triggers the 3 Envelopes system (pool exists & has elements)
    if (pool && Array.isArray(pool) && pool.length > 0) {
        openEnvelopeModal(winningSector);
    } else {
        // Direct modal popup for instant gift or extra spin
        modalWinnerTag.innerText = resultLabel;
        modalWinnerMsg.innerText = winningSector.message || "مبروك الفوز!";
        winnerModal.classList.add("active");
        playWinSound();
        triggerConfetti();
    }
}

function openEnvelopeModal(winningSector) {
    const categoryName = winningSector.label;
    const pool = challengePools[categoryName] || [];
    
    if (pool.length === 0) {
        modalWinnerTag.innerText = `${winningSector.icon || '⭐'} ${winningSector.label}`;
        modalWinnerMsg.innerText = winningSector.message || "مبروك الفوز!";
        winnerModal.classList.add("active");
        playWinSound();
        triggerConfetti();
        return;
    }

    // Pick 3 random challenges from pool (handles small pools cleanly)
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    currentEnvelopeChallenges = [];
    for (let i = 0; i < 3; i++) {
        currentEnvelopeChallenges.push(shuffled[i % shuffled.length]);
    }
    
    isEnvelopeSelected = false;

    // Reset Envelopes UI state
    envelopeCategoryTitle.innerText = `${winningSector.icon || '📜'} ${categoryName}`;
    revealedChallengeBox.classList.remove("active");
    
    const items = document.querySelectorAll(".envelope-item");
    items.forEach(item => {
        item.classList.remove("selected", "open", "fade-out");
    });

    envelopeModal.classList.add("active");
}

function selectEnvelope(selectedIndex) {
    if (isEnvelopeSelected) return;
    isEnvelopeSelected = true;
    initAudio();
    playEnvelopeOpenSound();

    const items = document.querySelectorAll(".envelope-item");
    items.forEach((item, idx) => {
        if (idx === selectedIndex) {
            item.classList.add("selected");
            setTimeout(() => {
                item.classList.add("open");
            }, 300);
        } else {
            item.classList.add("fade-out");
        }
    });

    // Reveal challenge details after flap animation
    setTimeout(() => {
        const chosenChallenge = currentEnvelopeChallenges[selectedIndex] || "تحدي ممتاز!";
        revealedText.innerText = chosenChallenge;
        revealedTag.innerText = `🎭 الظرف رقم ${selectedIndex + 1}`;
        revealedChallengeBox.classList.add("active");
        playWinSound();
        triggerConfetti();
    }, 950);
}

function closeEnvelopeModal() {
    envelopeModal.classList.remove("active");
    isEnvelopeSelected = false;
}

function closeModal() {
    winnerModal.classList.remove("active");
}

// Dynamic LED Bulbs Setup
const TOTAL_LEDS = 16;
let ledElements = [];

function createLEDBulbs() {
    if (!ledBezel) return;
    ledBezel.innerHTML = '';
    ledElements = [];
    const radiusPercentage = 46;

    for (let i = 0; i < TOTAL_LEDS; i++) {
        const angle = (i * 2 * Math.PI) / TOTAL_LEDS;
        const x = 50 + radiusPercentage * Math.cos(angle);
        const y = 50 + radiusPercentage * Math.sin(angle);

        const bulb = document.createElement('div');
        bulb.className = 'led-bulb';
        bulb.style.left = `${x}%`;
        bulb.style.top = `${y}%`;
        ledBezel.appendChild(bulb);
        ledElements.push(bulb);
    }
}

function updateLEDs(chaseIndex) {
    ledElements.forEach((bulb, idx) => {
        bulb.classList.remove('active', 'alt-active');
        if (idx === chaseIndex % TOTAL_LEDS) {
            bulb.classList.add('active');
        } else if ((idx + 8) % TOTAL_LEDS === chaseIndex % TOTAL_LEDS) {
            bulb.classList.add('alt-active');
        }
    });
}

// Wheel State Variables
let currentRotation = 0; // in radians
let isSpinning = false;
let lastPassedSector = 0;
let lastWinningIndex = -1;

function setupCanvasDPI() {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
}

function drawWheel() {
    if (!canvas || !ctx || sectors.length === 0) return;
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2;
    const total = sectors.length;
    const arc = (2 * Math.PI) / total;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < total; i++) {
        const angle = currentRotation + i * arc;
        const sector = sectors[i];

        // Slice
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, angle, angle + arc, false);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = sector.color || "#FF5252";
        ctx.fill();

        // Sector Divider Border Line
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Text & Emoji
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillStyle = sector.textColor || "#FFFFFF";
        
        // Dynamic Font Size based on sector count
        const fontSize = total > 8 ? 10 : (total > 6 ? 11 : 13);
        ctx.font = `bold ${fontSize}px 'Cairo', sans-serif`;

        const text = `${sector.icon || '⭐'} ${sector.label}`;
        ctx.fillText(text, radius - 16, 0);
        ctx.restore();
    }
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function spinWheel() {
    if (isSpinning || sectors.length === 0) return;
    initAudio();

    isSpinning = true;
    spinBtn.disabled = true;
    resultBannerText.innerText = "جاري تدوير العجلة...";
    resultBannerText.style.color = "var(--text-secondary)";

    const total = sectors.length;
    const arc = (2 * Math.PI) / total;

    // Fair random winning sector index
    let selectedIndex = Math.floor(Math.random() * total);
    if (selectedIndex === lastWinningIndex && total > 1) {
        selectedIndex = (selectedIndex + 1 + Math.floor(Math.random() * (total - 1))) % total;
    }
    lastWinningIndex = selectedIndex;

    const startRotation = currentRotation;
    const pointerAngle = 1.5 * Math.PI;
    
    const sectorCenterLocal = (selectedIndex + 0.5) * arc;
    let deltaAngle = (pointerAngle - sectorCenterLocal - (startRotation % (2 * Math.PI))) % (2 * Math.PI);
    if (deltaAngle < 0) deltaAngle += 2 * Math.PI;

    const fullSpins = (5 + Math.floor(Math.random() * 3)) * 2 * Math.PI;
    const targetRotation = startRotation + fullSpins + deltaAngle;

    const spinDuration = 5200;
    let startTime = null;
    lastPassedSector = -1;

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);
        const easeProgress = easeOutCubic(progress);

        currentRotation = startRotation + (targetRotation - startRotation) * easeProgress;
        drawWheel();

        // LED Chasing
        const ledStep = Math.floor(easeProgress * 60);
        updateLEDs(ledStep);

        // Sector Tick Detector
        const normalizedAngle = (1.5 * Math.PI - (currentRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const currentSectorIndex = Math.floor(normalizedAngle / arc) % total;

        if (currentSectorIndex !== lastPassedSector) {
            lastPassedSector = currentSectorIndex;
            playTickSound();
            pointerBox.classList.remove("tick");
            void pointerBox.offsetWidth;
            pointerBox.classList.add("tick");
        }

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            finishSpin(selectedIndex);
        }
    }

    requestAnimationFrame(animate);
}

// Confetti Particle System
const confettiCanvas = document.getElementById("confetti-canvas");
const cCtx = confettiCanvas ? confettiCanvas.getContext("2d") : null;
let confettiParticles = [];

function resizeConfettiCanvas() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

window.addEventListener('resize', () => {
    setupCanvasDPI();
    drawWheel();
    resizeConfettiCanvas();
});

function triggerConfetti() {
    if (!confettiCanvas || !cCtx) return;
    resizeConfettiCanvas();
    confettiParticles = [];
    const colors = ["#ffd700", "#6c5ce7", "#00f2fe", "#ff5252", "#33d9b2", "#ffb142"];

    for (let i = 0; i < 120; i++) {
        confettiParticles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2 - 100,
            vx: (Math.random() - 0.5) * 16,
            vy: (Math.random() - 0.7) * 16,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4,
            rotation: Math.random() * 360,
            rSpeed: (Math.random() - 0.5) * 10,
            opacity: 1
        });
    }

    function renderConfetti() {
        cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        let alive = false;

        confettiParticles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.35;
            p.opacity -= 0.012;
            p.rotation += p.rSpeed;

            if (p.opacity > 0) {
                alive = true;
                cCtx.save();
                cCtx.translate(p.x, p.y);
                cCtx.rotate((p.rotation * Math.PI) / 180);
                cCtx.fillStyle = p.color;
                cCtx.globalAlpha = Math.max(0, p.opacity);
                cCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                cCtx.restore();
            }
        });

        if (alive) {
            requestAnimationFrame(renderConfetti);
        } else {
            cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        }
    }

    requestAnimationFrame(renderConfetti);
}

// ==========================================================================
// ADMIN PANEL FUNCTIONALITY
// ==========================================================================

function getAdminPin() {
    return localStorage.getItem(STORAGE_PIN_KEY) || DEFAULT_PIN;
}

if (adminBtn) {
    adminBtn.addEventListener('click', openAdminPinModal);
}

function openAdminPinModal() {
    pinInput.value = "";
    pinErrorMsg.innerText = "";
    adminPinModal.classList.add("active");
    setTimeout(() => pinInput.focus(), 200);
}

function closeAdminPinModal() {
    adminPinModal.classList.remove("active");
}

function handlePinSubmit(e) {
    e.preventDefault();
    const enteredPin = pinInput.value.trim();
    const currentPin = getAdminPin();

    if (enteredPin === currentPin) {
        closeAdminPinModal();
        openAdminModal();
    } else {
        pinErrorMsg.innerText = "❌ رمز الـ PIN غير صحيح!";
        pinInput.value = "";
        pinInput.focus();
    }
}

function openAdminModal() {
    adminModal.classList.add("active");
    switchAdminTab("sectors");
}

function closeAdminModal() {
    adminModal.classList.remove("active");
}

function switchAdminTab(tabName) {
    const tabs = ["sectors", "questions", "settings"];
    tabs.forEach(t => {
        const btn = document.getElementById(`tabBtn${t.charAt(0).toUpperCase() + t.slice(1)}`);
        const pane = document.getElementById(`tab${t.charAt(0).toUpperCase() + t.slice(1)}`);
        if (btn) btn.classList.toggle("active", t === tabName);
        if (pane) pane.classList.toggle("active", t === tabName);
    });

    if (tabName === "sectors") {
        renderAdminSectors();
    } else if (tabName === "questions") {
        populateCategoryFilter();
        renderAdminQuestions();
    }
}

// Toast Helper
function showAdminToast(msg) {
    if (!adminToast) return;
    adminToast.innerText = msg;
    adminToast.classList.add("active");
    setTimeout(() => adminToast.classList.remove("active"), 3000);
}

// --------------------------------------------------------------------------
// Sector Management Logic
// --------------------------------------------------------------------------

function renderAdminSectors() {
    const container = document.getElementById("adminSectorsList");
    const countBadge = document.getElementById("sectorsCountBadge");
    if (!container) return;

    countBadge.innerText = `${sectors.length} قطاعات`;
    container.innerHTML = "";

    if (sectors.length === 0) {
        container.innerHTML = '<div class="empty-state">لا توجد قطاعات حالياً! أضف قطاعاً جديداً بالكتلة أعلاه.</div>';
        return;
    }

    sectors.forEach((sec, idx) => {
        const hasQuestions = challengePools[sec.label] && challengePools[sec.label].length > 0;
        const qCount = hasQuestions ? challengePools[sec.label].length : 0;

        const row = document.createElement("div");
        row.className = "sector-item-row";
        row.innerHTML = `
            <div class="sector-item-info">
                <span class="sector-color-badge" style="background-color: ${sec.color};"></span>
                <div>
                    <div class="sector-item-title">${sec.icon || '⭐'} ${sec.label} (${qCount} أسئلة)</div>
                    <div class="sector-item-msg">${sec.message ? sec.message : 'يستخدم الأسئلة والتحديات المخصصة'}</div>
                </div>
            </div>
            <div class="item-actions">
                <button class="btn-icon-action edit-btn" onclick="editSector(${idx})" title="تعديل">✏️</button>
                <button class="btn-icon-action delete-btn" onclick="deleteSector(${idx})" title="حذف">🗑️</button>
            </div>
        `;
        container.appendChild(row);
    });
}

function handleSaveSector(e) {
    e.preventDefault();
    const editIdx = parseInt(document.getElementById("sectorEditIndex").value, 10);
    const label = document.getElementById("sectorLabel").value.trim();
    const icon = document.getElementById("sectorIcon").value.trim();
    const color = document.getElementById("sectorColor").value;
    const textColor = document.getElementById("sectorTextColor").value;
    const message = document.getElementById("sectorMessage").value.trim();

    if (!label) return;

    if (editIdx >= 0 && editIdx < sectors.length) {
        const oldLabel = sectors[editIdx].label;
        sectors[editIdx] = { label, icon, color, textColor, message };
        
        // Rename pool key if label changed
        if (oldLabel !== label && challengePools[oldLabel]) {
            challengePools[label] = challengePools[oldLabel];
            delete challengePools[oldLabel];
        }
        showAdminToast("✅ تم تحديث القطاع بنجاح!");
    } else {
        sectors.push({ label, icon, color, textColor, message });
        if (!challengePools[label]) {
            challengePools[label] = [];
        }
        showAdminToast("🎉 تم إضافة القطاع الجديد!");
    }

    saveStateToStorage();
    resetSectorForm();
    renderAdminSectors();
}

function editSector(idx) {
    if (idx < 0 || idx >= sectors.length) return;
    const sec = sectors[idx];
    document.getElementById("sectorEditIndex").value = idx;
    document.getElementById("sectorLabel").value = sec.label;
    document.getElementById("sectorIcon").value = sec.icon || "";
    document.getElementById("sectorColor").value = sec.color || "#FF5252";
    document.getElementById("sectorColorText").value = sec.color || "#FF5252";
    document.getElementById("sectorTextColor").value = sec.textColor || "#FFFFFF";
    document.getElementById("sectorTextColorText").value = sec.textColor || "#FFFFFF";
    document.getElementById("sectorMessage").value = sec.message || "";

    document.getElementById("sectorFormTitle").innerText = "✏️ تعديل بيانات القطاع";
    document.getElementById("saveSectorBtn").innerText = "تحديث القطاع 💾";
    document.getElementById("cancelSectorEditBtn").style.display = "inline-flex";

    document.getElementById("sectorForm").scrollIntoView({ behavior: 'smooth' });
}

function resetSectorForm() {
    document.getElementById("sectorEditIndex").value = "-1";
    document.getElementById("sectorForm").reset();
    document.getElementById("sectorFormTitle").innerText = "➕ إضافة قطاع جديد للعجلة";
    document.getElementById("saveSectorBtn").innerText = "حفظ القطاع 💾";
    document.getElementById("cancelSectorEditBtn").style.display = "none";
}

function deleteSector(idx) {
    if (sectors.length <= 2) {
        alert("يجب أن تظل العجلة تحتوي على قطاعين على الأقل!");
        return;
    }
    const sec = sectors[idx];
    if (confirm(`هل أنت تأكد من حذف قطاع "${sec.label}"؟`)) {
        sectors.splice(idx, 1);
        saveStateToStorage();
        renderAdminSectors();
        showAdminToast("🗑️ تم حذف القطاع!");
    }
}

// --------------------------------------------------------------------------
// Questions & Comedians Pool Management
// --------------------------------------------------------------------------

function populateCategoryFilter() {
    const select = document.getElementById("categoryFilter");
    if (!select) return;

    const currentVal = select.value;
    select.innerHTML = "";

    sectors.forEach(sec => {
        const opt = document.createElement("option");
        opt.value = sec.label;
        opt.innerText = `${sec.icon || '⭐'} ${sec.label}`;
        select.appendChild(opt);
    });

    if (currentVal && sectors.some(s => s.label === currentVal)) {
        select.value = currentVal;
    }
}

function onCategoryFilterChange() {
    resetQuestionForm();
    renderAdminQuestions();
}

function renderAdminQuestions() {
    const categorySelect = document.getElementById("categoryFilter");
    const container = document.getElementById("adminQuestionsList");
    const countBadge = document.getElementById("questionsCountBadge");
    const searchVal = (document.getElementById("questionSearch").value || "").toLowerCase().trim();

    if (!categorySelect || !container) return;
    const selectedCategory = categorySelect.value;
    if (!selectedCategory) {
        container.innerHTML = '<div class="empty-state">اختر فئة لعرض الأسئلة والتحديات!</div>';
        return;
    }

    const pool = challengePools[selectedCategory] || [];
    let filtered = pool.map((q, idx) => ({ text: q, originalIdx: idx }));

    if (searchVal) {
        filtered = filtered.filter(item => item.text.toLowerCase().includes(searchVal));
    }

    countBadge.innerText = `${pool.length} سؤال/تحدي`;
    container.innerHTML = "";

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state">لا توجد أسئلة أو تحديات في فئة "${selectedCategory}" حتى الآن!</div>`;
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement("div");
        card.className = "question-item-card";
        card.innerHTML = `
            <div class="question-item-text">
                <strong style="color: var(--cyan); margin-left: 6px;">#${item.originalIdx + 1}</strong> ${item.text}
            </div>
            <div class="item-actions">
                <button class="btn-icon-action edit-btn" onclick="editQuestion(${item.originalIdx})" title="تعديل">✏️</button>
                <button class="btn-icon-action delete-btn" onclick="deleteQuestion(${item.originalIdx})" title="حذف">🗑️</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function handleSaveQuestion(e) {
    e.preventDefault();
    const categorySelect = document.getElementById("categoryFilter");
    const selectedCategory = categorySelect ? categorySelect.value : "";
    if (!selectedCategory) return;

    const editIdx = parseInt(document.getElementById("questionEditIndex").value, 10);
    const textInput = document.getElementById("questionTextInput");
    const text = textInput.value.trim();

    if (!text) return;

    if (!challengePools[selectedCategory]) {
        challengePools[selectedCategory] = [];
    }

    if (editIdx >= 0 && editIdx < challengePools[selectedCategory].length) {
        challengePools[selectedCategory][editIdx] = text;
        showAdminToast("✅ تم تحديث السؤال!");
    } else {
        challengePools[selectedCategory].push(text);
        showAdminToast("🎉 تم إضافة السؤال الجديد!");
    }

    saveStateToStorage();
    resetQuestionForm();
    renderAdminQuestions();
    renderAdminSectors(); // Update count badges in sectors
}

function editQuestion(idx) {
    const categorySelect = document.getElementById("categoryFilter");
    const selectedCategory = categorySelect ? categorySelect.value : "";
    const pool = challengePools[selectedCategory] || [];

    if (idx < 0 || idx >= pool.length) return;

    document.getElementById("questionEditIndex").value = idx;
    document.getElementById("questionTextInput").value = pool[idx];
    document.getElementById("questionFormTitle").innerText = "✏️ تعديل السؤال / التحدي";
    document.getElementById("saveQuestionBtn").innerText = "تحديث السؤال 💾";
    document.getElementById("cancelQuestionEditBtn").style.display = "inline-flex";

    document.getElementById("questionForm").scrollIntoView({ behavior: 'smooth' });
}

function resetQuestionForm() {
    document.getElementById("questionEditIndex").value = "-1";
    document.getElementById("questionForm").reset();
    document.getElementById("questionFormTitle").innerText = "➕ إضافة سؤال / تحدي جديد للفئة المحددة";
    document.getElementById("saveQuestionBtn").innerText = "إضافة السؤال ➕";
    document.getElementById("cancelQuestionEditBtn").style.display = "none";
}

function deleteQuestion(idx) {
    const categorySelect = document.getElementById("categoryFilter");
    const selectedCategory = categorySelect ? categorySelect.value : "";
    const pool = challengePools[selectedCategory] || [];

    if (idx < 0 || idx >= pool.length) return;

    if (confirm("هل أنت تأكد من حذف هذا السؤال / التحدي؟")) {
        pool.splice(idx, 1);
        saveStateToStorage();
        renderAdminQuestions();
        renderAdminSectors();
        showAdminToast("🗑️ تم حذف السؤال!");
    }
}

// --------------------------------------------------------------------------
// Settings, PIN Change & Import/Export
// --------------------------------------------------------------------------

function handleChangePin(e) {
    e.preventDefault();
    const currentEntered = document.getElementById("currentPinInput").value.trim();
    const newPin = document.getElementById("newPinInput").value.trim();
    const actualPin = getAdminPin();

    if (currentEntered !== actualPin) {
        alert("رمز PIN الحالي غير صحيح!");
        return;
    }

    if (!newPin || newPin.length < 3) {
        alert("يرجى إدخال رمز PIN جديد مكون من 3 أرقام أو أكثر!");
        return;
    }

    localStorage.setItem(STORAGE_PIN_KEY, newPin);
    document.getElementById("changePinForm").reset();
    showAdminToast("🔒 تم تغيير رمز الـ PIN بنجاح!");
}

function exportDataJSON() {
    const data = {
        sectors: sectors,
        challengePools: challengePools,
        exportedAt: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `wheel_game_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showAdminToast("📥 تم تحميل ملف النسخة الاحتياطية!");
}

function importDataJSON(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const parsed = JSON.parse(event.target.result);
            if (parsed && Array.isArray(parsed.sectors) && parsed.challengePools) {
                sectors = parsed.sectors;
                challengePools = parsed.challengePools;
                saveStateToStorage();
                switchAdminTab("sectors");
                showAdminToast("🎉 تم استرجاع كافة البيانات بنجاح!");
            } else {
                alert("ملف JSON غير صالح أو لا يحتوي على تنسيق العجلة الصحيح!");
            }
        } catch (err) {
            alert("خطأ في قراءة ملف JSON!");
        }
    };
    reader.readAsText(file);
}

function confirmResetDefaults() {
    if (confirm("هل أنت تأكد تماماً من استعادة جميع البيانات الافتراضية؟ سيتم مسح أي أسئلة أو قطاعات قمت بإضافتها.")) {
        sectors = JSON.parse(JSON.stringify(DEFAULT_SECTORS));
        challengePools = JSON.parse(JSON.stringify(DEFAULT_CHALLENGE_POOLS));
        localStorage.removeItem(STORAGE_PIN_KEY);
        saveStateToStorage();
        switchAdminTab("sectors");
        showAdminToast("🔄 تم إعادة ضبط المصنع للبيانات الافتراضية!");
    }
}

// --------------------------------------------------------------------------
// Initialization
// --------------------------------------------------------------------------
loadStateFromStorage();
createLEDBulbs();
setupCanvasDPI();
drawWheel();
