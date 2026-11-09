// ============================================================================
// 1. UTILIDADES DE FECHAS PARA VIGENCIA DE PRUEBAS
// ============================================================================
function getFutureDateStr(daysAhead) {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split("T")[0];
}

function isExamExpired(examDateStr) {
    if (!examDateStr) return false;
    const today = new Date().toISOString().split("T")[0];
    return examDateStr < today;
}

function getExamBadgeInfo(examDateStr) {
    if (!examDateStr) return { text: "📅 Sin fecha límite", expired: false };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = new Date(examDateStr + "T00:00:00");
    const diffDays = Math.round((exam - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: "🏅 Prueba ya rendida", expired: true };
    if (diffDays === 0) return { text: "🔥 ¡La prueba es HOY!", expired: false };
    if (diffDays === 1) return { text: "⏰ Prueba MAÑANA", expired: false };
    return { text: `📅 Prueba en ${diffDays} días`, expired: false };
}

function renderStarsString(reviewsCount) {
    const filled = Math.min(5, Math.max(0, reviewsCount || 0));
    return "⭐".repeat(filled) + "☆".repeat(5 - filled);
}

// ============================================================================
// 2. BASE DE DATOS INICIAL POR MUNDO Y CÁPSULAS (CON FECHAS Y REPASOS)
// ============================================================================
const INITIAL_WORLDS_DATA = {
    ciencias: {
        title: "Ciencias Naturales 🌱",
        step4Label: "4. Naturalista 🌿",
        capsules: [
            {
                id: "cap-plantas",
                icon: "🌱",
                title: "Las Plantas y Ecosistemas",
                subtitle: "Fotosíntesis y factores bióticos",
                cardClass: "world-green",
                btnClass: "btn-green",
                examDate: getFutureDateStr(4),
                reviewsCount: 2, // Lleva 2 de 5 repasos
                totalMissions: 3,
                completedMissions: 3,
                concepts: [
                    { icon: "🦅", title: "Factores Bióticos", desc: "Son todos los seres que TIENEN VIDA en un ecosistema: nacen, respiran y se alimentan (Ej: Cóndor, Vicuña, Puma y Plantas)." },
                    { icon: "🪨", title: "Factores Abióticos", desc: "Son los componentes SIN VIDA del ecosistema pero esenciales, como el agua, las rocas, el aire y la luz del Sol." },
                    { icon: "☀️", title: "Energía Solar", desc: "Las hojas de las plantas crecen siempre buscando la luz del Sol para fabricar su propio alimento." }
                ],
                associations: [
                    { concept: "Cóndor y Vicuña", match: "Factores Bióticos (Con vida)", distractor: "Factores Abióticos (Sin vida)" },
                    { concept: "Rocas y Agua", match: "Factores Abióticos (Sin vida)", distractor: "Animales vertebrados" }
                ],
                missions: [
                    {
                        question: "¿Qué necesitan las hojas de una planta para realizar la fotosíntesis?",
                        options: ["☀️ Luz del Sol y Agua", "🌙 Oscuridad total", "🪨 Solo piedras secas"],
                        correct: "☀️ Luz del Sol y Agua",
                        hint: "Recuerda hacia dónde crecen las plantas cuando están cerca de una ventana."
                    },
                    {
                        question: "¿El cóndor, la vicuña y el puma son factores...?",
                        options: ["🌿 Bióticos (Tienen vida)", "🪨 Abióticos (Sin vida)", "💧 Minerales líquidos"],
                        correct: "🌿 Bióticos (Tienen vida)",
                        hint: "Bio significa vida: estos animales respiran y se alimentan."
                    }
                ],
                step4Challenge: {
                    prompt: "Experimento de Observación: Pones una planta dentro de una caja con una pequeña ventana por donde entra sol.",
                    guideSteps: [
                        "Observa qué elemento entra por la ventana (Luz solar).",
                        "Deduce cómo responderá el tallo de la planta después de unos días."
                    ],
                    question: "¿Qué ocurrirá con la planta dentro de la caja?",
                    options: ["🌱 Crecerá inclinándose hacia la ventana con sol", "🥀 Se esconderá de la luz", "🪨 Se convertirá en piedra"],
                    correct: "🌱 Crecerá inclinándose hacia la ventana con sol"
                }
            },
            {
                id: "cap-solar-pasada",
                icon: "🪐",
                title: "El Sistema Solar",
                subtitle: "Planetas, el Sol y la Luna",
                cardClass: "world-purple",
                btnClass: "btn-purple",
                examDate: getFutureDateStr(-5), // Prueba ya rendida hace 5 días
                reviewsCount: 5,
                totalMissions: 3,
                completedMissions: 3,
                concepts: [
                    { icon: "🪐", title: "Órbitas Planetarias", desc: "Todos los planetas del Sistema Solar giran alrededor del Sol, nuestra estrella central." }
                ],
                associations: [
                    { concept: "El Sol", match: "Estrella central con luz propia", distractor: "Satélite natural de la Tierra" }
                ],
                missions: [
                    {
                        question: "¿Cuál es la estrella central que entrega luz y calor a nuestro sistema?",
                        options: ["☀️ El Sol", "🌕 La Luna", "🪐 Saturno"],
                        correct: "☀️ El Sol",
                        hint: "Brilla de día y nos da calor."
                    }
                ],
                step4Challenge: {
                    prompt: "Observación Astronómica: La Tierra tarda 365 días en dar una vuelta completa al Sol.",
                    guideSteps: ["Recuerda la diferencia entre rotación (día/noche) y traslación (un año)."],
                    question: "¿Cómo se llama este movimiento de 365 días alrededor del Sol?",
                    options: ["🌍 Movimiento de Traslación", "🌀 Movimiento Sísmico", "🌑 Eclipse Lunar"],
                    correct: "🌍 Movimiento de Traslación"
                }
            }
        ]
    },
    historia: {
        title: "Historia y Sociedad 🏛️",
        step4Label: "4. R.I.C.E. 📝",
        capsules: [
            {
                id: "cap-incas",
                icon: "☀️",
                title: "El Imperio Inca",
                subtitle: "Sapa Inca, Cusco, Chasquis y Andenes",
                cardClass: "world-blue",
                btnClass: "btn-blue",
                examDate: getFutureDateStr(3),
                reviewsCount: 4, // ¡A 1 repaso del 7.0!
                totalMissions: 3,
                completedMissions: 3,
                concepts: [
                    { icon: "👑", title: "Sapa Inca y Cusco", desc: "El Sapa Inca era el gobernante supremo, considerado hijo del Dios Sol (Inti). La capital del imperio fue Cusco." },
                    { icon: "🏃", title: "Chasquis y Andenes", desc: "Los Chasquis eran los mensajeros que corrían por la red de caminos. Cultivaban en terrazas escalonadas llamadas Andenes." }
                ],
                associations: [
                    { concept: "Los Chasquis", match: "Mensajeros de la red de caminos", distractor: "Terrazas de cultivo agrícola" },
                    { concept: "Los Andenes", match: "Terrazas escalonadas en los cerros", distractor: "Idioma oficial quechua" }
                ],
                missions: [
                    {
                        question: "¿Quiénes corrían por los caminos incas para llevar mensajes?",
                        options: ["🏃 Los Chasquis", "🧹 Los Yanaconas", "👑 La Nobleza"],
                        correct: "🏃 Los Chasquis",
                        hint: "Eran corredores muy veloces que se relevaban en el Camino del Inca."
                    }
                ],
                step4Challenge: {
                    prompt: "Desafío R.I.C.E.: ¿Por qué los incas construyeron andenes en las montañas de los Andes?",
                    guideSteps: [
                        "R + I: Yo creo que los incas construyeron andenes para cultivar en terrenos inclinados.",
                        "C + E: El texto indica que eran 'terrazas en forma de escaleras' que aprovechaban el agua."
                    ],
                    question: "¿Cuál respuesta aplica mejor el modelo R.I.C.E. completo?",
                    options: [
                        "📖 Los incas construyeron andenes para cultivar en los cerros, creando 'terrazas en forma de escaleras' que aprovechaban el agua.",
                        "🔸 Porque sí, en las montañas.",
                        "🔹 Los chasquis corrían rápido."
                    ],
                    correct: "📖 Los incas construyeron andenes para cultivar en los cerros, creando 'terrazas en forma de escaleras' que aprovechaban el agua."
                }
            }
        ]
    },
    matematicas: {
        title: "Matemáticas 🧮",
        step4Label: "4. M.O.R.A. 📓",
        capsules: [
            {
                id: "cap-multi",
                icon: "✖️",
                title: "Multiplicación y Problemas",
                subtitle: "Tablas, reservas y método M.O.R.A.",
                cardClass: "world-orange",
                btnClass: "btn-orange",
                examDate: getFutureDateStr(6),
                reviewsCount: 0,
                totalMissions: 3,
                completedMissions: 0,
                concepts: [
                    { icon: "📦", title: "Multiplicar es repetir", desc: "Si tenemos 3 cajas con 124 cuadernos en cada una, multiplicamos 124 × 3 = 372 cuadernos en total." }
                ],
                associations: [
                    { concept: "48 : 6", match: "Resultado: 8", distractor: "Resultado: 6" },
                    { concept: "124 × 3", match: "Resultado: 372", distractor: "Resultado: 127" }
                ],
                missions: [
                    {
                        question: "Si repartimos 48 lápices en 6 estuches iguales, ¿cuántos van en cada estuche?",
                        options: ["✏️ 8 lápices", "✏️ 6 lápices", "✏️ 42 lápices"],
                        correct: "✏️ 8 lápices",
                        hint: "Piensa qué número multiplicado por 6 da exactamente 48."
                    }
                ],
                step4Challenge: {
                    prompt: "Método M.O.R.A.: Para resolver 56 : 4 por descomposición, separamos 56 en 40 y 16.",
                    guideSteps: [
                        "M y O: Marcamos los datos (56 dividido en 4).",
                        "R y A: 40 : 4 = 10 y 16 : 4 = 4. Sumamos 10 + 4."
                    ],
                    question: "Siguiendo los pasos M.O.R.A., ¿cuál es la respuesta completa de 56 : 4?",
                    options: ["🧮 El resultado es 14 (porque 10 + 4 = 14)", "🧮 El resultado es 40", "🧮 El resultado es 16"],
                    correct: "🧮 El resultado es 14 (porque 10 + 4 = 14)"
                }
            }
        ]
    },
    lenguaje: {
        title: "Lenguaje 📖",
        step4Label: "4. R.I.C.E. 📝",
        capsules: [
            {
                id: "cap-rice",
                icon: "📝",
                title: "Comprensión y Método R.I.C.E.",
                subtitle: "Reafirmar, Incluir, Citar y Explicar",
                cardClass: "world-purple",
                btnClass: "btn-purple",
                examDate: getFutureDateStr(5),
                reviewsCount: 1,
                totalMissions: 3,
                completedMissions: 3,
                concepts: [
                    { icon: "💬", title: "Citar con Comillas", desc: "En el método R.I.C.E., la letra C significa Citar una parte exacta de la lectura usando comillas (\"...\")." }
                ],
                associations: [
                    { concept: "Letra R (Reafirmar)", match: "Usar las palabras de la pregunta", distractor: "Copiar el título del cuento" },
                    { concept: "Letra C (Citar)", match: "Escribir evidencia exacta entre comillas", distractor: "Dar solo un sí o un no" }
                ],
                missions: [
                    {
                        question: "¿Qué debemos hacer en el paso R (Reafirmar) del método R.I.C.E.?",
                        options: ["📖 Usar las palabras de la pregunta", "🔸 Poner solo Sí o No", "🔹 Copiar el título"],
                        correct: "📖 Usar las palabras de la pregunta",
                        hint: "Si te preguntan '¿Qué opina Pedro?', empiezas con 'Yo creo que Pedro opina que...'."
                    }
                ],
                step4Challenge: {
                    prompt: "Lectura: 'Pedro es bueno para argumentar, pero una vez convenció a sus hermanos de juntar pulgas y la casa se llenó de pulgas.'",
                    guideSteps: [
                        "R + I: Yo creo que a Pedro no siempre le sirve argumentar bien.",
                        "C + E: En el texto dice que \"la casa se llenó de pulgas\", causando un problema."
                    ],
                    question: "¿Cuál oración cumple correctamente la R (Reafirmar) e I (Incluir) incluyendo al personaje?",
                    options: [
                        "✍️ Yo creo que a Pedro no siempre le sirve ser bueno para argumentar.",
                        "✍️ No le sirve.",
                        "✍️ Las pulgas saltan mucho."
                    ],
                    correct: "✍️ Yo creo que a Pedro no siempre le sirve ser bueno para argumentar."
                }
            }
        ]
    }
};

const SQUISHY_COLLECTION = [
    { id: "sq1", name: "Osito Cacao", emoji: "🧸", unlocked: true },
    { id: "sq2", name: "Gatito Mochi", emoji: "🐱", unlocked: true },
    { id: "sq3", name: "Frutilla Kawaii", emoji: "🍓", unlocked: false },
    { id: "sq4", name: "Pollito Sol", emoji: "🐥", unlocked: true },
    { id: "sq5", name: "Pulpo Lila", emoji: "🐙", unlocked: true },
    { id: "sq6", name: "Pan con Mantequilla", emoji: "🧈", unlocked: false },
    { id: "sq7", name: "Capibara Zen", emoji: "🦫", unlocked: false },
    { id: "sq8", name: "Ranita Menta", emoji: "🐸", unlocked: true },
    { id: "sq9", name: "Dragón Mítico", emoji: "🐉", unlocked: false }
];

// ============================================================================
// 3. ESTADO GLOBAL Y PERSISTENCIA LOCAL (SPRINT 3)
// ============================================================================
const appState = {
    studentName: localStorage.getItem("kaptia_student_name") || "Santi",
    studentPin: localStorage.getItem("kaptia_student_pin") || "1234",
    points: parseInt(localStorage.getItem("kaptia_points_s3") || "120", 10),
    gems: parseInt(localStorage.getItem("kaptia_gems_s3") || "15", 10),
    calmTriggersCount: parseInt(localStorage.getItem("kaptia_calm_s3") || "0", 10),
    soundEnabled: true,
    largeFont: false,
    currentWorldKey: "ciencias",
    topicsFilter: "active", // 'active' (Pruebas vigentes) o 'archived' (Pruebas rendidas)
    currentCapsuleId: "cap-plantas",
    currentStageIdx: 0,
    currentConceptIdx: 0,
    currentAssocIdx: 0,
    currentMissionIdx: 0,
    questionShownAt: 0, // Marca de tiempo para el Detector Anti-Azar
    calmLockActive: false,
    uploadSubject: "ciencias",
    selectedFiles: [], // Soporta múltiples archivos simultáneos
    worldsData: JSON.parse(localStorage.getItem("kaptia_worlds_s3")) || INITIAL_WORLDS_DATA,
    squishies: JSON.parse(localStorage.getItem("kaptia_squishies_s3")) || SQUISHY_COLLECTION
};

function saveAppState() {
    localStorage.setItem("kaptia_student_name", appState.studentName);
    localStorage.setItem("kaptia_student_pin", appState.studentPin);
    localStorage.setItem("kaptia_points_s3", appState.points.toString());
    localStorage.setItem("kaptia_gems_s3", appState.gems.toString());
    localStorage.setItem("kaptia_calm_s3", appState.calmTriggersCount.toString());
    localStorage.setItem("kaptia_worlds_s3", JSON.stringify(appState.worldsData));
    localStorage.setItem("kaptia_squishies_s3", JSON.stringify(appState.squishies));
    syncHeaderData();
}

function syncHeaderData() {
    document.querySelectorAll(".points-val").forEach(el => el.textContent = appState.points);
    document.querySelectorAll(".gems-val").forEach(el => el.textContent = appState.gems);
    document.querySelectorAll(".student-name-ref").forEach(el => el.textContent = appState.studentName);

    const portalName = document.getElementById("portal-student-name");
    if (portalName) portalName.textContent = `🎮 ${appState.studentName}`;
    const parentDisplay = document.getElementById("parent-student-name-display");
    if (parentDisplay) parentDisplay.textContent = appState.studentName;
    const pinDisplay = document.getElementById("magic-pin-display");
    if (pinDisplay) pinDisplay.textContent = appState.studentPin;
    const calmVal = document.getElementById("parent-calm-val");
    if (calmVal) calmVal.textContent = appState.calmTriggersCount;

    const keyInput = document.getElementById("gemini-api-key-input");
    const keyStatus = document.getElementById("api-key-status");
    const savedKey = KaptiaAIEngine.getApiKey();
    if (keyInput && savedKey) {
        keyInput.value = savedKey;
        if (keyStatus) keyStatus.textContent = "✅ API Key lista para procesar múltiples fotos o PDFs.";
    }
}

function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

// ============================================================================
// 4. MOTOR DE SONIDO Y VOZ
// ============================================================================
function playSoftTone(type = "click") {
    if (!appState.soundEnabled) return;
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(type === "win" ? 660 : (type === "calm" ? 320 : 420), ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.19);
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

// ============================================================================
// 5. NAVEGACIÓN ENTRE PANTALLAS
// ============================================================================
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
function openWorld(worldKey) {
    appState.currentWorldKey = worldKey;
    appState.topicsFilter = "active";
    navigateTo("screen-topics");
}

function setTopicsFilter(filterType) {
    appState.topicsFilter = filterType;
    document.getElementById("btn-filter-active").classList.toggle("active", filterType === "active");
    document.getElementById("btn-filter-archived").classList.toggle("active", filterType === "archived");
    renderWorldCapsules();
}

// ============================================================================
// 6. PANTALLA 3: CÁPSULAS CON FECHA DE PRUEBA Y TOPE DE 5 REPASOS
// ============================================================================
function getCapsuleStatusSummary(cap) {
    const expired = isExamExpired(cap.examDate);
    const revs = cap.reviewsCount || 0;

    if (expired) {
        return {
            statusText: `🏅 Prueba rendida (${revs}/5 repasos logrados)`,
            actionLabel: "Práctica Libre ↻"
        };
    }
    if (revs === 0) {
        return {
            statusText: "🌟 ¡Nueva! 1ª vez gana Monedas 🏆",
            actionLabel: "Comenzar ▶"
        };
    }
    if (revs < 5) {
        return {
            statusText: `💎 Modo Repaso Activo (${revs}/5 para el 7.0) • Gana Gemas`,
            actionLabel: `Repasar #${revs + 1} (+15 💎) ▶`
        };
    }
    return {
        statusText: "🏆 ¡Listo para el 7.0! (5/5 Repasos completados)",
        actionLabel: "Práctica Libre ↻"
    };
}

function renderWorldCapsules() {
    const world = appState.worldsData[appState.currentWorldKey];
    if (!world) return;

    document.getElementById("topics-world-header").textContent = world.title;
    document.getElementById("btn-filter-active").classList.toggle("active", appState.topicsFilter === "active");
    document.getElementById("btn-filter-archived").classList.toggle("active", appState.topicsFilter === "archived");

    const filteredCapsules = world.capsules.filter(cap => {
        const expired = isExamExpired(cap.examDate);
        return appState.topicsFilter === "archived" ? expired : !expired;
    });

    const container = document.getElementById("capsules-grid-container");

    if (filteredCapsules.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; background:white; border-radius:24px; padding:32px; text-align:center;">
                <div style="font-size:48px; margin-bottom:8px;">${appState.topicsFilter === 'active' ? '🎉' : '📦'}</div>
                <h3>${appState.topicsFilter === 'active' ? '¡No hay pruebas pendientes aquí!' : 'Aún no hay pruebas rendidas en el baúl'}</h3>
                <p style="color:#64748B; font-size:14px; margin-top:6px;">
                    ${appState.topicsFilter === 'active' ? 'Pídele a tus papás que suban una nueva guía o revisa otro mundo.' : 'Aquí se guardarán tus cápsulas después de la fecha de cada prueba.'}
                </p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredCapsules.map(cap => {
        const revs = Math.min(5, cap.reviewsCount || 0);
        const pct = Math.round((revs / 5) * 100);
        const badgeInfo = getExamBadgeInfo(cap.examDate);
        const summary = getCapsuleStatusSummary(cap);
        const starsStr = renderStarsString(revs);

        return `
            <div class="world-card ${cap.cardClass}" onclick="openCapsule('${cap.id}')">
                <div class="world-icon">${cap.icon}</div>
                <div class="world-content">
                    <div class="capsule-meta-badges">
                        <span class="exam-date-badge ${badgeInfo.expired ? 'expired' : ''}">${badgeInfo.text}</span>
                        ${revs >= 5
                            ? `<span class="ready-70-badge">🏆 ¡Listo para el 7.0!</span>`
                            : `<span class="stars-badge">${starsStr} (${revs}/5)</span>`
                        }
                    </div>
                    <h2>${cap.title}</h2>
                    <p>${cap.subtitle}</p>
                    <div class="capsule-progress-track" title="Progreso hacia los 5 repasos">
                        <div class="capsule-progress-fill ${cap.btnClass}" style="width: ${pct}%"></div>
                    </div>
                    <span class="capsule-status-text">${summary.statusText}</span>
                    <button class="btn-world ${cap.btnClass}">${summary.actionLabel}</button>
                </div>
            </div>
        `;
    }).join("");
}

function openCapsule(capsuleId) {
    appState.currentCapsuleId = capsuleId;
    appState.currentStageIdx = 0;
    appState.currentConceptIdx = 0;
    appState.currentAssocIdx = 0;
    appState.currentMissionIdx = 0;
    navigateTo("screen-capsule");
}

// ============================================================================
// 7. DETECTOR ANTI-AZAR (MODO CALMA DE DETECTIVE < 1.8 SEGUNDOS)
// ============================================================================
function markQuestionShownTime() {
    appState.questionShownAt = Date.now();
}

function checkIfImpulsiveClick() {
    const elapsed = Date.now() - appState.questionShownAt;
    if (elapsed < 1800) {
        appState.calmTriggersCount++;
        saveAppState();
        triggerCalmModeCooldown();
        return true;
    }

