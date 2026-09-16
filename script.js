// Sectors Configuration (Removed "نصيحة الكبار")
const sectors = [
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

// Sound Toggle Event
soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggle.innerText = soundEnabled ? "🔊" : "🔇";
    soundToggle.title = soundEnabled ? "إيقاف الصوت" : "تشغيل الصوت";
    if (soundEnabled) initAudio();
});

// Dynamic LED Bulbs Setup
const TOTAL_LEDS = 16;
let ledElements = [];

function createLEDBulbs() {
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
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
}

function drawWheel() {
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
        ctx.fillStyle = sector.color;
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
        ctx.font = "bold 13px 'Cairo', sans-serif";

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

    // Pick a fair random winning sector index (avoid repeat if possible for variety)
    let selectedIndex = Math.floor(Math.random() * total);
    if (selectedIndex === lastWinningIndex && total > 1) {
        selectedIndex = (selectedIndex + 1 + Math.floor(Math.random() * (total - 1))) % total;
    }
    lastWinningIndex = selectedIndex;

    // Calculate target rotation so pointer at 1.5 * PI lands right in the middle of selectedIndex
    const startRotation = currentRotation;
    const pointerAngle = 1.5 * Math.PI;
    
    // Middle angle of sector `selectedIndex` in canvas local coordinates is `(selectedIndex + 0.5) * arc`
    // We want `(startRotation + delta + selectedIndex * arc + arc/2) % 2PI = 1.5 * PI`
    const sectorCenterLocal = (selectedIndex + 0.5) * arc;
    let deltaAngle = (pointerAngle - sectorCenterLocal - (startRotation % (2 * Math.PI))) % (2 * Math.PI);
    if (deltaAngle < 0) deltaAngle += 2 * Math.PI;

    // Add 5 to 7 full 360-degree rotations
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

function finishSpin(winningIndex) {
    isSpinning = false;
    spinBtn.disabled = false;

    const winningSector = sectors[winningIndex];
    const resultLabel = `${winningSector.icon || '⭐'} ${winningSector.label}`;

    resultBannerText.innerText = resultLabel;
    resultBannerText.style.color = "var(--cyan)";

    // Modal popup with customized message per result
    modalWinnerTag.innerText = resultLabel;
    modalWinnerMsg.innerText = winningSector.message || "";
    winnerModal.classList.add("active");

    playWinSound();
    triggerConfetti();
}

function closeModal() {
    winnerModal.classList.remove("active");
}

// Confetti Particle System
const confettiCanvas = document.getElementById("confetti-canvas");
const cCtx = confettiCanvas.getContext("2d");
let confettiParticles = [];

function resizeConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

window.addEventListener('resize', () => {
    setupCanvasDPI();
    drawWheel();
    resizeConfettiCanvas();
});

function triggerConfetti() {
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

// Initialization
createLEDBulbs();
setupCanvasDPI();
drawWheel();
