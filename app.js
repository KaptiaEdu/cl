const INITIAL_WORLDS_DATA = {
    ciencias: {
        title: "Ciencias Naturales 🌱",
        step4Label: "4. Cuaderno Naturalista 🌿",
        capsules: [
            {
                id: "cap-plantas",
                icon: "🌱",
                title: "Las Plantas",
                subtitle: "Fotosíntesis y necesidades",
                cardClass: "world-green",
                btnClass: "btn-green",
                totalMissions: 5,
                completedMissions: 3,
                statusText: "⏳ En progreso (3 de 5 misiones)",
                actionLabel: "Continuar ▶",
                concepts: [
                    { icon: "🦅", title: "Factores Bióticos", desc: "Son todos los seres que TIENEN VIDA en un ecosistema: nacen, respiran y se alimentan." }
                ],
                mission: {
                    question: "¿Qué necesitan las hojas de una planta para realizar la fotosíntesis?",
                    options: ["☀️ Luz del Sol y Agua", "🌙 Oscuridad total", "🪨 Solo piedras secas"],
                    correct: "☀️ Luz del Sol y Agua"
                }
            }
        ]
    },
    historia: {
        title: "Historia y Sociedad 🏛️",
        step4Label: "4. Constructor R.I.C.E. 📝",
        capsules: [
            {
                id: "cap-incas",
                icon: "☀️",
                title: "El Imperio Inca",
                subtitle: "Sapa Inca y Chasquis",
                cardClass: "world-blue",
                btnClass: "btn-blue",
                totalMissions: 5,
                completedMissions: 2,
                statusText: "⏳ En progreso (2 de 5 misiones)",
                actionLabel: "Continuar ▶",
                concepts: [
                    { icon: "🏃", title: "Chasquis", desc: "Mensajeros incas que corrían por los caminos de los Andes." }
                ],
                mission: {
                    question: "¿Quiénes corrían por los caminos incas para llevar mensajes?",
                    options: ["🏃 Los Chasquis", "🧹 Los Yanaconas", "👑 La Nobleza"],
                    correct: "🏃 Los Chasquis"
                }
            }
        ]
    },
    matematicas: {
        title: "Matemáticas 🧮",
        step4Label: "4. Pizarra M.O.R.A. 📓",
        capsules: [
            {
                id: "cap-multi",
                icon: "✖️",
                title: "Multiplicación",
                subtitle: "Tablas y método M.O.R.A.",
                cardClass: "world-orange",
                btnClass: "btn-orange",
                totalMissions: 5,
                completedMissions: 1,
                statusText: "⏳ En progreso (1 de 5 misiones)",
                actionLabel: "Continuar ▶",
                concepts: [
                    { icon: "📦", title: "Multiplicar", desc: "Repetir un número varias veces es el atajo de la multiplicación." }
                ],
                mission: {
                    question: "Si repartimos 72 caramelos en 8 bolsas iguales, ¿cuántos van en cada bolsa?",
                    options: ["🍬 9 caramelos", "🍬 12 caramelos", "🍬 64 caramelos"],
                    correct: "🍬 9 caramelos"
                }
            }
        ]
    },
    lenguaje: {
        title: "Lenguaje 📖",
        step4Label: "4. Constructor R.I.C.E. 📝",
        capsules: [
            {
                id: "cap-rice",
                icon: "📝",
                title: "Método R.I.C.E.",
                subtitle: "Reafirmar, Incluir, Citar y Explicar",
                cardClass: "world-purple",
                btnClass: "btn-purple",
                totalMissions: 4,
                completedMissions: 0,
                statusText: "🌟 ¡Nueva! (0 de 4 misiones)",
                actionLabel: "Comenzar ▶",
                concepts: [
                    { icon: "💬", title: "Citar con Comillas", desc: "Usar comillas para extraer evidencia del texto." }
                ],
                mission: {
                    question: "¿Qué debemos hacer en el paso R (Reafirmar)?",
                    options: ["📖 Usar las palabras de la pregunta", "🔸 Poner solo Sí o No", "🔹 Copiar el título"],
                    correct: "📖 Usar las palabras de la pregunta"
                }
            }
        ]
    }
};

const SQUISHY_COLLECTION = [
    { id: "sq1", name: "Osito Cacao", emoji: "🧸", unlocked: true },
    { id: "sq2", name: "Gatito Mochi", emoji: "🐱", unlocked: true },
    { id: "sq3", name: "Perrito Nube", emoji: "🐶", unlocked: false },
    { id: "sq4", name: "Pollito Sol", emoji: "🐥", unlocked: true },
    { id: "sq5", name: "Pulpo Lila", emoji: "🐙", unlocked: true },
    { id: "sq6", name: "Conejito Canela", emoji: "🐰", unlocked: false }
];

const appState = {
    studentName: localStorage.getItem("kaptia_student_name") || "Santi",
    studentPin: localStorage.getItem("kaptia_student_pin") || "1234",
    points: parseInt(localStorage.getItem("kaptia_points_s1") || "120", 10),
    soundEnabled: true,
    largeFont: false,
    currentWorldKey: "ciencias",
    currentCapsuleId: "cap-plantas",
    currentStageIdx: 0,
    uploadSubject: "ciencias",
    worldsData: JSON.parse(localStorage.getItem("kaptia_worlds_s1")) || INITIAL_WORLDS_DATA,
    squishies: JSON.parse(localStorage.getItem("kaptia_squishies_s1")) || SQUISHY_COLLECTION
};

function saveAppState() {
    localStorage.setItem("kaptia_student_name", appState.studentName);
    localStorage.setItem("kaptia_student_pin", appState.studentPin);
    localStorage.setItem("kaptia_points_s1", appState.points.toString());
    localStorage.setItem("kaptia_worlds_s1", JSON.stringify(appState.worldsData));
    localStorage.setItem("kaptia_squishies_s1", JSON.stringify(appState.squishies));
    syncHeaderData();
}

function syncHeaderData() {
    document.querySelectorAll(".points-val").forEach(el => el.textContent = appState.points);
    document.querySelectorAll(".student-name-ref").forEach(el => el.textContent = appState.studentName);
    const portalName = document.getElementById("portal-student-name");
    if (portalName) portalName.textContent = `🎮 ${appState.studentName}`;
    const parentDisplay = document.getElementById("parent-student-name-display");
    if (parentDisplay) parentDisplay.textContent = appState.studentName;
    const pinDisplay = document.getElementById("magic-pin-display");
    if (pinDisplay) pinDisplay.textContent = appState.studentPin;
}

function playSoftTone(type = "click") {
    if (!appState.soundEnabled) return;
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(type === "win" ? 660 : 420, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.17);
    } catch (e) {}
}

function speakText(text) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setTimeout(() => {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = "es-CL";
        utter.rate = 0.95;
        window.speechSynthesis.speak(utter);
    }, 50);
}

function navigateTo(screenId) {
    playSoftTone("click");
    document.querySelectorAll(".screen").forEach(scr => scr.classList.remove("active"));
    const target = document.getElementById(screenId);
    if (target) target.classList.add("active");
    syncHeaderData();

    if (screenId === "screen-topics") renderWorldCapsules();
    if (screenId === "screen-capsule") renderCapsuleWorkspace();
    if (screenId === "screen-kingdom") renderKingdomShelf();
    if (screenId === "screen-parent") renderParentHistory();
}

function enterStudentFlow() { navigateTo("screen-worlds"); }
function openWorld(worldKey) { appState.currentWorldKey = worldKey; navigateTo("screen-topics"); }

function renderWorldCapsules() {
    const world = appState.worldsData[appState.currentWorldKey];
    if (!world) return;
    document.getElementById("topics-world-header").textContent = world.title;
    const container = document.getElementById("capsules-grid-container");

    container.innerHTML = world.capsules.map(cap => {
        const pct = Math.round((cap.completedMissions / cap.totalMissions) * 100);
        return `
            <div class="world-card ${cap.cardClass}" onclick="openCapsule('${cap.id}')">
                <div class="world-icon">${cap.icon}</div>
                <div class="world-content">
                    <h2>${cap.title}</h2>
                    <p>${cap.subtitle}</p>
                    <div class="capsule-progress-track">
                        <div class="capsule-progress-fill ${cap.btnClass}" style="width: ${pct}%"></div>
                    </div>
                    <span class="capsule-status-text">${cap.statusText}</span>
                    <button class="btn-world ${cap.btnClass}">${cap.actionLabel}</button>
                </div>
            </div>
        `;
    }).join("");
}

function openCapsule(capsuleId) {
    appState.currentCapsuleId = capsuleId;
    appState.currentStageIdx = 0;
    navigateTo("screen-capsule");
}

function getActiveCapsuleObj() {
    const world = appState.worldsData[appState.currentWorldKey];
    return world.capsules.find(c => c.id === appState.currentCapsuleId) || world.capsules[0];
}

function renderCapsuleWorkspace() {
    const world = appState.worldsData[appState.currentWorldKey];
    const cap = getActiveCapsuleObj();
    document.getElementById("capsule-breadcrumb").textContent = `${world.title} • ${cap.title}`;

    const stages = ["1. Entrenamiento 🧠", "2. Asociación 🔗", "3. Micro-Misiones 🎯", world.step4Label];
    const barEl = document.getElementById("capsule-stages-bar");
    barEl.innerHTML = stages.map((label, idx) => `
        <button class="stage-step-btn ${appState.currentStageIdx === idx ? 'active' : ''}" onclick="setCapsuleStage(${idx})">
            ${label}
        </button>
    `).join("");

    const contentEl = document.getElementById("capsule-stage-content");
    const footerEl = document.getElementById("capsule-footer-bar");

    if (appState.currentStageIdx === 0) {
        const concept = cap.concepts[0];
        contentEl.innerHTML = `
            <div class="capsule-inner-pastel">
                <span class="capsule-counter-pill">Zona de Entrenamiento • Concepto 1 de ${cap.concepts.length}</span>
                <div class="capsule-big-illustration">${concept.icon}</div>
                <div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:10px;">
                    <h2 class="capsule-concept-title" style="margin:0;">🐾 ${concept.title}</h2>
                    <button class="btn-back-pill" onclick="speakText('${concept.title}. ${concept.desc}')">🔊 Escuchar</button>
                </div>
                <p class="capsule-concept-desc">${concept.desc}</p>
            </div>
        `;
        footerEl.innerHTML = `
            <button class="btn-capsule-prev" onclick="navigateTo('screen-topics')">Anterior</button>
            <button class="btn-capsule-next" onclick="completeStageStep()">¡Concepto Capturado! (+10 pts) ➔</button>
        `;
    } else if (appState.currentStageIdx === 2) {
        const m = cap.mission;
        contentEl.innerHTML = `
            <div class="capsule-inner-pastel">
                <span class="capsule-counter-pill">🎯 Micro-Misión Interactiva</span>
                <h2 class="capsule-concept-title">${m.question}</h2>
                <div class="capsule-options-row">
                    ${m.options.map(opt => `
                        <button class="choice-btn" onclick="checkMissionChoice(this, '${opt}', '${m.correct}')">${opt}</button>
                    `).join("")}
                </div>
            </div>
        `;
        footerEl.innerHTML = `
            <button class="btn-capsule-prev" onclick="setCapsuleStage(1)">Anterior</button>
            <button class="btn-capsule-next" onclick="completeStageStep()">Siguiente Etapa ➔</button>
        `;
    } else {
        contentEl.innerHTML = `
            <div class="capsule-inner-pastel">
                <span class="capsule-counter-pill">${stages[appState.currentStageIdx]}</span>
                <div class="capsule-big-illustration">${cap.icon}</div>
                <h2 class="capsule-concept-title">${cap.title}</h2>
                <p class="capsule-concept-desc">Módulo interactivo adaptado para ${world.title}.</p>
            </div>
        `;
        footerEl.innerHTML = `
            <button class="btn-capsule-prev" onclick="setCapsuleStage(${Math.max(0, appState.currentStageIdx - 1)})">Anterior</button>
            <button class="btn-capsule-next" onclick="completeStageStep()">Avanzar (+10 pts) ➔</button>
        `;
    }
}

function setCapsuleStage(idx) { appState.currentStageIdx = idx; renderCapsuleWorkspace(); }
function completeStageStep() {
    playSoftTone("win");
    appState.points += 10;
    saveAppState();
    if (appState.currentStageIdx < 3) {
        appState.currentStageIdx++;
        renderCapsuleWorkspace();
    } else {
        navigateTo("screen-kingdom");
    }
}

function checkMissionChoice(btnEl, chosen, correct) {
    if (chosen === correct) {
        btnEl.classList.add("correct");
        playSoftTone("win");
        appState.points += 20;
        saveAppState();
    } else {
        btnEl.classList.add("wrong");
        playSoftTone("click");
    }
}

function renderKingdomShelf() {
    const shelfEl = document.getElementById("squishy-shelf-grid");
    shelfEl.innerHTML = appState.squishies.map(sq => `
        <div class="squishy-slot" onclick="playSoftTone('win')">
            ${sq.unlocked ? `<span class="squishy-emoji">${sq.emoji}</span>` : `<div class="squishy-locked">🔒</div>`}
        </div>
    `).join("");
}

function buySquishyCapsule() {
    const msgEl = document.getElementById("gachapon-msg");
    const lockedList = appState.squishies.filter(s => !s.unlocked);
    if (lockedList.length === 0) { msgEl.textContent = "🎉 ¡Ya coleccionaste todos los Squishies!"; return; }
    if (appState.points < 40) { msgEl.textContent = "⏳ Necesitas 40 puntos para abrir una cápsula."; return; }

    appState.points -= 40;
    lockedList[0].unlocked = true;
    playSoftTone("win");
    msgEl.textContent = `✨ ¡Desbloqueaste a: ${lockedList[0].emoji} ${lockedList[0].name}!`;
    saveAppState();
    renderKingdomShelf();
}

function switchParentTab(tab) {
    const isKaptear = tab === "kaptear";
    document.getElementById("tab-parent-kaptear").classList.toggle("active", isKaptear);
    document.getElementById("tab-parent-student").classList.toggle("active", !isKaptear);
    document.getElementById("parent-view-kaptear").classList.toggle("hidden", !isKaptear);
    document.getElementById("parent-view-student").classList.toggle("hidden", isKaptear);
}

function selectUploadSubject(subj, btn) {
    appState.uploadSubject = subj;
    document.querySelectorAll(".subj-pill").forEach(b => b.classList.remove("active-subj"));
    btn.classList.add("active-subj");
}

function handleFileSelected(input) {
    const file = input.files && input.files[0];
    if (file) document.getElementById("dropzone-text").textContent = `✅ Archivo cargado: ${file.name}`;
}

function renderParentHistory() {
    const listEl = document.getElementById("parent-history-list");
    const allCaps = [...appState.worldsData.ciencias.capsules, ...appState.worldsData.historia.capsules];
    listEl.innerHTML = allCaps.slice(0, 3).map(c => `
        <div class="history-item">
            <span><strong>${c.title}</strong> - ${c.statusText}</span>
            <span>${c.completedMissions >= c.totalMissions ? "✅" : "⏳"}</span>
        </div>
    `).join("");
}

function createDemoCapsuleSprint1() {
    const titleInput = document.getElementById("input-capsule-title").value.trim() || "Nueva Guía";
    const world = appState.worldsData[appState.uploadSubject];
    world.capsules.unshift({
        id: "cap-" + Date.now(),
        icon: "✨",
        title: titleInput,
        subtitle: "Cápsula personalizada",
        cardClass: "world-green",
        btnClass: "btn-green",
        totalMissions: 5,
        completedMissions: 0,
        statusText: "🌟 ¡Nueva! (0 de 5 misiones)",
        actionLabel: "Comenzar ▶",
        concepts: [{ icon: "✨", title: titleInput, desc: "Contenido generado para estudio personalizado." }],
        mission: { question: `¿Estás listo para dominar ${titleInput}?`, options: ["🚀 ¡Sí!", "⏳ Luego"], correct: "🚀 ¡Sí!" }
    });
    saveAppState();
    appState.currentWorldKey = appState.uploadSubject;
    navigateTo("screen-topics");
}

function openParentLoginModal() { document.getElementById("modal-parent-login").classList.remove("hidden"); }
function submitParentLogin() {
    const u = document.getElementById("login-user").value.trim().toLowerCase();
    const p = document.getElementById("login-pass").value.trim();
    if (u === "padre" && p === "1234") { closeModals(); navigateTo("screen-parent"); }
    else { document.getElementById("login-error").classList.remove("hidden"); }
}

function openStudentPinModal() { document.getElementById("modal-student-pin").classList.remove("hidden"); }
function verifyStudentPin() {
    const entered = document.getElementById("student-pin-input").value.trim();
    if (entered === appState.studentPin) { closeModals(); navigateTo("screen-worlds"); }
    else { document.getElementById("pin-error").classList.remove("hidden"); }
}

function openEditStudentModal() {
    document.getElementById("edit-student-name").value = appState.studentName;
    document.getElementById("edit-student-pin").value = appState.studentPin;
    document.getElementById("modal-edit-student").classList.remove("hidden");
}

function saveStudentProfile() {
    appState.studentName = document.getElementById("edit-student-name").value.trim() || "Santi";
    appState.studentPin = document.getElementById("edit-student-pin").value.trim() || "1234";
    saveAppState();
    closeModals();
}

function copyMagicPass() { alert(`Pase Mágico copiado:\nPIN: ${appState.studentPin}`); }
function closeModals() { document.querySelectorAll(".modal-overlay").forEach(m => m.classList.add("hidden")); }
function toggleFontSize() { document.body.classList.toggle("large-font"); }
function toggleSound() { appState.soundEnabled = !appState.soundEnabled; }

window.addEventListener("DOMContentLoaded", () => { syncHeaderData(); });
