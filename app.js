// ============================================================================
// 1. UTILIDADES DE FECHA PARA LAS PRUEBAS ESCOLARES
// ============================================================================
function getFutureDateStr(daysAhead) {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split("T")[0];
}

function getExamStatus(examDateStr) {
    if (!examDateStr) {
        return { isExpired: false, badgeText: "📅 Sin fecha límite", urgent: false };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = new Date(examDateStr + "T00:00:00");
    const diffDays = Math.round((exam - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { isExpired: true, badgeText: `📦 Prueba rendida (${examDateStr})`, urgent: false };
    }
    if (diffDays === 0) {
        return { isExpired: false, badgeText: "🔥 ¡Prueba HOY!", urgent: true };
    }
    if (diffDays === 1) {
        return { isExpired: false, badgeText: "⚡ ¡Prueba MAÑANA!", urgent: true };
    }
    return { isExpired: false, badgeText: `📅 Prueba en ${diffDays} días`, urgent: diffDays <= 3 };
}

function renderStarsBadge(reviewCount, maxReviews = 5) {
    const filled = Math.min(maxReviews, reviewCount || 0);
    const empty = Math.max(0, maxReviews - filled);
    return "⭐".repeat(filled) + "☆".repeat(empty);
}

// ============================================================================
// 2. BASE DE DATOS INICIAL POR MUNDO Y CÁPSULAS (CON REPASOS, FECHAS Y PISTAS)
// ============================================================================
const INITIAL_WORLDS_DATA = {
    ciencias: {
        title: "Ciencias Naturales 🌱",
        step4Label: "4. Cuaderno Naturalista 🌿",
        capsules: [
            {
                id: "cap-plantas",
                icon: "🌱",
                title: "Las Plantas y Ecosistemas",
                subtitle: "Fotosíntesis y factores bióticos",
                cardClass: "world-green",
                btnClass: "btn-green",
                examDate: getFutureDateStr(4),
                reviewCount: 2,
                maxReviews: 5,
                concepts: [
                    { icon: "🦅", title: "Factores Bióticos", desc: "Son todos los seres que TIENEN VIDA en un ecosistema: nacen, respiran y se alimentan (Ej: Cóndor, Vicuña, Puma y Plantas)." },
                    { icon: "🪨", title: "Factores Abióticos", desc: "Son los componentes SIN VIDA del ecosistema pero esenciales, como el agua, las rocas, el aire y la luz del Sol." },
                    { icon: "☀️", title: "Energía Solar", desc: "Las hojas de las plantas crecen siempre buscando la luz del Sol para fabricar su propio alimento." }
                ],
                associations: [
                    {
                        concept: "Cóndor y Vicuña",
                        match: "Factores Bióticos (Con vida)",
                        distractor: "Factores Abióticos (Sin vida)",
                        hint: "Piensa si el cóndor y la vicuña respiran, crecen y se alimentan."
                    },
                    {
                        concept: "Rocas y Agua",
                        match: "Factores Abióticos (Sin vida)",
                        distractor: "Animales vertebrados",
                        hint: "Las rocas y el agua son esenciales en la naturaleza, pero ¿tienen vida propia?"
                    }
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
                        "Observa qué elemento no vivo entra por la ventana (Luz solar).",
                        "Deduce cómo responderá el tallo de la planta después de unos días."
                    ],
                    question: "¿Qué ocurrirá con la planta dentro de la caja?",
                    options: ["🌱 Crecerá inclinándose hacia la ventana con sol", "🥀 Se esconderá de la luz", "🪨 Se convertirá en factor abiótico"],
                    correct: "🌱 Crecerá inclinándose hacia la ventana con sol",
                    hint: "Las plantas siempre buscan la fuente de luz solar para poder fabricar su alimento."
                }
            },
            {
                id: "cap-tierra",
                icon: "🌋",
                title: "La Tierra Dinámica",
                subtitle: "Capas, placas tectónicas y volcanes",
                cardClass: "world-orange",
                btnClass: "btn-orange",
                examDate: getFutureDateStr(2),
                reviewCount: 0,
                maxReviews: 5,
                concepts: [
                    { icon: "🌍", title: "Núcleo Interno y Externo", desc: "El núcleo interno de la Tierra es sólido y el núcleo externo es líquido con altísimas temperaturas." },
                    { icon: "🌋", title: "Magma y Lava", desc: "Cuando la roca fundida (magma) sube y sale por el cráter del volcán hacia la superficie, pasa a llamarse lava." }
                ],
                associations: [
                    {
                        concept: "Placas Convergentes",
                        match: "Chocan entre sí",
                        distractor: "Se separan",
                        hint: "Converger significa juntarse o dirigirse hacia un mismo punto."
                    },
                    {
                        concept: "Placas Divergentes",
                        match: "Se separan entre sí",
                        distractor: "Se deslizan de lado",
                        hint: "Divergir significa tomar caminos separados o alejarse."
                    }
                ],
                missions: [
                    {
                        question: "Cuando dos placas tectónicas chocan entre sí provocando sismos, el movimiento es...",
                        options: ["💥 Convergente", "↔️ Divergente", "🌊 Oceánico"],
                        correct: "💥 Convergente",
                        hint: "Piensa en dos fuerzas que convergen (se juntan y chocan) en el mismo punto."
                    }
                ],
                step4Challenge: {
                    prompt: "Prevención sísmica: Estás en la sala de clases y comienza un sismo fuerte.",
                    guideSteps: [
                        "Mantén la calma y aléjate de las ventanas con vidrios.",
                        "Ubícate en la zona de seguridad o bajo una mesa firme."
                    ],
                    question: "¿Cuál es la medida de autocuidado correcta durante el sismo?",
                    options: ["🛡️ Alejarse de ventanas y cubrirse bajo una mesa firme", "🏃 Correr por las escaleras mientras tiembla", "🪟 Mirar por la ventana"],
                    correct: "🛡️ Alejarse de ventanas y cubrirse bajo una mesa firme",
                    hint: "Observa los dos pasos de apoyo con ticket verde que están justo arriba de la pregunta."
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
                subtitle: "Sapa Inca, Cusco, Chasquis y Andenes",
                cardClass: "world-blue",
                btnClass: "btn-blue",
                examDate: getFutureDateStr(6),
                reviewCount: 5,
                maxReviews: 5,
                concepts: [
                    { icon: "👑", title: "Sapa Inca y Cusco", desc: "El Sapa Inca era el gobernante supremo, considerado hijo del Dios Sol (Inti). La capital del imperio fue Cusco." },
                    { icon: "🏃", title: "Chasquis y Andenes", desc: "Los Chasquis eran los mensajeros que corrían por la red de caminos. Cultivaban en terrazas escalonadas llamadas Andenes." }
                ],
                associations: [
                    {
                        concept: "Los Chasquis",
                        match: "Mensajeros de la red de caminos",
                        distractor: "Terrazas de cultivo agrícola",
                        hint: "Recuerda quiénes corrían a gran velocidad llevando recados por el imperio."
                    },
                    {
                        concept: "Los Andenes",
                        match: "Terrazas escalonadas en los cerros",
                        distractor: "Idioma oficial quechua",
                        hint: "Eran escalones gigantes construidos en las laderas de las montañas para plantar."
                    }
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
                        "R + I: Yo creo que los incas construyeron andenes para poder cultivar en terrenos inclinados.",
                        "C + E: El texto indica que eran 'terrazas en forma de escaleras', lo que aprovechaba el agua."
                    ],
                    question: "¿Cuál respuesta aplica mejor el modelo R.I.C.E. completo?",
                    options: [
                        "📖 Los incas construyeron andenes para cultivar en los cerros, creando 'terrazas en forma de escaleras' que aprovechaban el agua.",
                        "🔸 Porque sí, en las montañas.",
                        "🔹 Los chasquis corrían rápido."
                    ],
                    correct: "📖 Los incas construyeron andenes para cultivar en los cerros, creando 'terrazas en forma de escaleras' que aprovechaban el agua.",
                    hint: "Busca la opción que reafirma la pregunta, incluye la cita entre comillas y explica para qué servían."
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
                title: "Multiplicación y Problemas",
                subtitle: "Tablas, reservas y método M.O.R.A.",
                cardClass: "world-orange",
                btnClass: "btn-orange",
                examDate: getFutureDateStr(5),
                reviewCount: 1,
                maxReviews: 5,
                concepts: [
                    { icon: "📦", title: "Multiplicar es repetir", desc: "Si tenemos 3 cajas con 124 cuadernos en cada una, multiplicamos 124 × 3 = 372 cuadernos en total." }
                ],
                associations: [
                    {
                        concept: "48 : 6",
                        match: "Resultado: 8",
                        distractor: "Resultado: 6",
                        hint: "Piensa: ¿6 multiplicado por cuánto nos da 48?"
                    },
                    {
                        concept: "124 × 3",
                        match: "Resultado: 372",
                        distractor: "Resultado: 127",
                        hint: "Multiplica primero la unidad: 4 × 3 = 12 (termina en 2)."
                    }
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
                    correct: "🧮 El resultado es 14 (porque 10 + 4 = 14)",
                    hint: "Suma los dos resultados parciales del paso R: 10 más 4."
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
                title: "Comprensión y Método R.I.C.E.",
                subtitle: "Reafirmar, Incluir, Citar y Explicar",
                cardClass: "world-purple",
                btnClass: "btn-purple",
                examDate: getFutureDateStr(7),
                reviewCount: 0,
                maxReviews: 5,
                concepts: [
                    { icon: "💬", title: "Citar con Comillas", desc: "En el método R.I.C.E., la letra C significa Citar una parte exacta de la lectura usando comillas (\"...\")." }
                ],
                associations: [
                    {
                        concept: "Letra R (Reafirmar)",
                        match: "Usar las palabras de la pregunta",
                        distractor: "Copiar el título del cuento",
                        hint: "Reafirmar es comenzar tu respuesta repitiendo parte de la pregunta."
                    },
                    {
                        concept: "Letra C (Citar)",
                        match: "Escribir evidencia exacta entre comillas",
                        distractor: "Dar solo un sí o un no",
                        hint: "Recuerda que las comillas abrazan las palabras exactas del texto."
                    }
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
                        "C + E: En el texto dice que \"la casa se llenó de pulgas\", lo que demuestra que su idea causó un problema."
                    ],
                    question: "¿Cuál oración cumple correctamente la R (Reafirmar) e I (Incluir) mencionando al personaje?",
                    options: [
                        "✍️ Yo creo que a Pedro no siempre le sirve ser bueno para argumentar.",
                        "✍️ No le sirve.",
                        "✍️ Las pulgas saltan mucho."
                    ],
                    correct: "✍️ Yo creo que a Pedro no siempre le sirve ser bueno para argumentar.",
                    hint: "Elige la oración completa que incluye el nombre de Pedro y las palabras de la pregunta."
                }
            }
        ]
    }
};

const SQUISHY_COLLECTION = [
    { id: "sq1", name: "Osito Cacao", emoji: "🧸", unlocked: true },
    { id: "sq2", name: "Gatito Mochi", emoji: "🐱", unlocked: true },
    { id: "sq3", name: "Frutilla Crema", emoji: "🍓", unlocked: false },
    { id: "sq4", name: "Pollito Sol", emoji: "🐥", unlocked: true },
    { id: "sq5", name: "Pulpo Lila", emoji: "🐙", unlocked: true },
    { id: "sq6", name: "Mantequilla Kawaii", emoji: "🧈", unlocked: false },
    { id: "sq7", name: "Capibara Yuzu", emoji: "🦫", unlocked: false },
    { id: "sq8", name: "Ranita Menta", emoji: "🐸", unlocked: true },
    { id: "sq9", name: "Dragón Galáctico", emoji: "🐉", unlocked: false }
];

// ============================================================================
// 3. ESTADO GLOBAL Y PERSISTENCIA LOCAL (CON CANDADO PROGRESIVO DE ETAPAS)
// ============================================================================
const appState = {
    studentName: localStorage.getItem("kaptia_student_name") || "Santi",
    studentPin: localStorage.getItem("kaptia_student_pin") || "1234",
    points: parseInt(localStorage.getItem("kaptia_points_s3") || "120", 10),
    gems: parseInt(localStorage.getItem("kaptia_gems_s3") || "25", 10),
    impulsiveCount: parseInt(localStorage.getItem("kaptia_impulsive_s3") || "0", 10),
    soundEnabled: true,
    largeFont: false,
    currentWorldKey: "ciencias",
    topicsFilter: "active",
    currentCapsuleId: "cap-plantas",
    currentStageIdx: 0,
    maxUnlockedStageIdx: 0, // Evita que el estudiante salte al Paso 4 sin hacer los pasos 1, 2 y 3
    currentConceptIdx: 0,
    currentAssocIdx: 0,
    currentMissionIdx: 0,
    answeredCurrentQuestion: false, // Evita avanzar sin responder o marcar errores después de acertar
    currentOptionsOrder: null,      // Mantiene fijo el orden aleatorio de la pregunta actual mientras está en pantalla
    questionShownAt: 0,
    triggerCalmLock: false,
    uploadSubject: "ciencias",
    filesQueue: [],
    worldsData: JSON.parse(localStorage.getItem("kaptia_worlds_s3")) || INITIAL_WORLDS_DATA,
    squishies: JSON.parse(localStorage.getItem("kaptia_squishies_s3")) || SQUISHY_COLLECTION
};

function saveAppState() {
    localStorage.setItem("kaptia_student_name", appState.studentName);
    localStorage.setItem("kaptia_student_pin", appState.studentPin);
    localStorage.setItem("kaptia_points_s3", appState.points.toString());
    localStorage.setItem("kaptia_gems_s3", appState.gems.toString());
    localStorage.setItem("kaptia_impulsive_s3", appState.impulsiveCount.toString());
    localStorage.setItem("kaptia_worlds_s3", JSON.stringify(appState.worldsData));
    localStorage.setItem("kaptia_squishies_s3", JSON.stringify(appState.squishies));
    syncHeaderData();
}

function syncHeaderData() {
    document.querySelectorAll(".points-val").forEach(el => { el.textContent = appState.points; });
    document.querySelectorAll(".gems-val").forEach(el => { el.textContent = appState.gems; });
    document.querySelectorAll(".student-name-ref").forEach(el => { el.textContent = appState.studentName; });

    const portalName = document.getElementById("portal-student-name");
    if (portalName) portalName.textContent = `🎮 ${appState.studentName}`;
    const parentDisplay = document.getElementById("parent-student-name-display");
    if (parentDisplay) parentDisplay.textContent = appState.studentName;
    const pinDisplay = document.getElementById("magic-pin-display");
    if (pinDisplay) pinDisplay.textContent = appState.studentPin;

    const impVal = document.getElementById("parent-impulsive-val");
    if (impVal) impVal.textContent = appState.impulsiveCount;

    const keyInput = document.getElementById("gemini-api-key-input");
    const keyStatus = document.getElementById("api-key-status");
    const savedKey = KaptiaAIEngine.getApiKey();
    if (keyInput && savedKey) {
        keyInput.value = savedKey;
        if (keyStatus) keyStatus.textContent = "✅ API Key lista para procesar múltiples guías.";
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
// 4. MOTOR DE SONIDO Y SÍNTESIS DE VOZ
// ============================================================================
function playSoftTone(type = "click") {
    if (!appState.soundEnabled) return;
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(type === "win" ? 660 : (type === "calm" ? 310 : 420), ctx.currentTime);
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
// 5. NAVEGACIÓN Y FILTROS DE VIGENCIA DE CÁPSULAS
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
    document.getElementById("filter-active-caps").classList.toggle("active", filterType === "active");
    document.getElementById("filter-archived-caps").classList.toggle("active", filterType === "archived");
    renderWorldCapsules();
}

function renderWorldCapsules() {
    const world = appState.worldsData[appState.currentWorldKey];
    if (!world) return;

    document.getElementById("topics-world-header").textContent = world.title;
    const container = document.getElementById("capsules-grid-container");

    const filteredCapsules = world.capsules.filter(cap => {
        const ex = getExamStatus(cap.examDate);
        return appState.topicsFilter === "archived" ? ex.isExpired : !ex.isExpired;
    });

    if (filteredCapsules.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; background:white; border-radius:24px; padding:32px; text-align:center;">
                <p style="font-size:18px; font-weight:700; color:#475569;">
                    ${appState.topicsFilter === "archived"
                        ? "📦 Aún no hay pruebas rendidas archivadas en este mundo."
                        : "🎉 ¡No tienes pruebas pendientes en este mundo!"}
                </p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredCapsules.map(cap => {
        const reviews = cap.reviewCount || 0;
        const maxR = cap.maxReviews || 5;
        const examInfo = getExamStatus(cap.examDate);
        const starsStr = renderStarsBadge(reviews, maxR);

        let statusExplain = "";
        let btnText = "";

        if (examInfo.isExpired) {
            statusExplain = "📦 Prueba pasada • Modo Práctica Libre";
            btnText = "Practicar Libre ▶";
        } else if (reviews === 0) {
            statusExplain = "🌟 ¡Nueva! 1ª vez gana +30 🏆 Monedas";
            btnText = "Comenzar (1/5) ▶";
        } else if (reviews < maxR) {
            statusExplain = `💎 Repaso ${reviews}/${maxR} • ¡Repasa y gana +15 Gemas!`;
            btnText = `Repasar (${reviews + 1}/${maxR}) ▶`;
        } else {
            statusExplain = "🏆 ¡Listo para el 7.0! (5/5 Repasos completados)";
            btnText = "Práctica Libre ↻";
        }

        return `
            <div class="world-card ${cap.cardClass}" onclick="openCapsule('${cap.id}')">
                <div class="world-icon">${cap.icon}</div>
                <div class="world-content">
                    <div class="capsule-meta-badges">
                        <span class="exam-date-badge ${examInfo.urgent ? 'urgent' : ''}">${examInfo.badgeText}</span>
                    </div>
                    <h2>${cap.title}</h2>
                    <p>${cap.subtitle}</p>
                    <div class="stars-mastery-row">
                        <span>Maestría: ${starsStr}</span>
                        <span>${reviews}/${maxR}</span>
                    </div>
                    <span class="capsule-status-text">${statusExplain}</span>
                    <button class="btn-world ${cap.btnClass}">${btnText}</button>
                </div>
            </div>
        `;
    }).join("");
}

function openCapsule(capsuleId) {
    appState.currentCapsuleId = capsuleId;
    appState.currentStageIdx = 0;
    appState.maxUnlockedStageIdx = 0; // Reinicia el candado progresivo al abrir la cápsula
    appState.currentConceptIdx = 0;
    appState.currentAssocIdx = 0;
    appState.currentMissionIdx = 0;
    appState.answeredCurrentQuestion = false;
    appState.currentOptionsOrder = null;
    appState.triggerCalmLock = false;
    navigateTo("screen-capsule");
}

// ============================================================================
// 6. CÁPSULA DE ENFOQUE BLINDADA (CANDADO DE ETAPAS + PISTA AL FALLAR)
// ============================================================================
function getActiveCapsuleObj() {
    const world = appState.worldsData[appState.currentWorldKey];
    return world.capsules.find(c => c.id === appState.currentCapsuleId) || world.capsules[0];
}

function isCapsuleRewardEligible(cap) {
    const examInfo = getExamStatus(cap.examDate);
    const reviews = cap.reviewCount || 0;
    const maxR = cap.maxReviews || 5;
    return !examInfo.isExpired && reviews < maxR;
}

function prepareNewQuestionState() {
    appState.answeredCurrentQuestion = false;
    appState.currentOptionsOrder = null;
}

function renderCapsuleWorkspace() {
    const world = appState.worldsData[appState.currentWorldKey];
    const cap = getActiveCapsuleObj();

    document.getElementById("capsule-breadcrumb").textContent = `${world.title} • ${cap.title}`;

    const reviews = cap.reviewCount || 0;
    const maxR = cap.maxReviews || 5;
    const examInfo = getExamStatus(cap.examDate);
    const bannerEl = document.getElementById("capsule-mastery-banner");

    if (examInfo.isExpired) {
        bannerEl.innerHTML = `<span>📦 <strong>Prueba Rendida:</strong> Modo Práctica Libre (Sin puntos)</span><span>${renderStarsBadge(reviews, maxR)}</span>`;
    } else if (reviews === 0) {
        bannerEl.innerHTML = `<span>🎯 <strong>1° Estudio:</strong> Completa las 4 etapas para ganar <strong>+30 🏆 Monedas</strong></span><span>${renderStarsBadge(reviews, maxR)} (0/5)</span>`;
    } else if (reviews < maxR) {
        bannerEl.innerHTML = `<span>💎 <strong>Modo Repaso Activo (${reviews + 1} de ${maxR}):</strong> ¡Completa las 4 etapas y gana <strong>+15 💎 Gemas</strong>!</span><span>${renderStarsBadge(reviews, maxR)}</span>`;
    } else {
        bannerEl.innerHTML = `<span>🏆 <strong>¡Meta 7.0 Alcanzada (5/5)!</strong> Ya ganaste todo el tesoro de esta guía. Modo Práctica Libre.</span><span>⭐⭐⭐⭐⭐</span>`;
    }

    const stages = [
        "1. Entrenamiento 🧠",
        "2. Asociación 🔗",
        "3. Micro-Misiones 🎯",
        world.step4Label
    ];

    // Barra de etapas con candado para impedir saltarse pasos
    const barEl = document.getElementById("capsule-stages-bar");
    barEl.innerHTML = stages.map((label, idx) => {
        const isLocked = idx > appState.maxUnlockedStageIdx;
        const isActive = appState.currentStageIdx === idx;
        return `
            <button
                class="stage-step-btn ${isActive ? 'active' : ''}"
                style="${isLocked ? 'opacity:0.45; cursor:not-allowed;' : ''}"
                onclick="setCapsuleStage(${idx})"
                title="${isLocked ? 'Completa primero la etapa anterior para desbloquear' : label}"
            >
                ${isLocked ? '🔒 ' : ''}${label}
            </button>
        `;
    }).join("");

    const contentEl = document.getElementById("capsule-stage-content");
    const footerEl = document.getElementById("capsule-footer-bar");

    appState.questionShownAt = Date.now();

    // ETAPA 0: ENTRENAMIENTO
    if (appState.currentStageIdx === 0) {
        hideCalmLockBanner();
        const concepts = cap.concepts && cap.concepts.length ? cap.concepts : [{ icon: cap.icon, title: cap.title, desc: cap.subtitle }];
        const cIdx = Math.min(appState.currentConceptIdx, concepts.length - 1);
        const concept = concepts[cIdx];
        const safeSpeech = `${concept.title}. ${concept.desc}`.replace(/'/g, "");

        contentEl.innerHTML = `
            <div class="capsule-inner-pastel">
                <span class="capsule-counter-pill">Zona de Entrenamiento • Concepto ${cIdx + 1} de ${concepts.length}</span>
                <div class="capsule-big-illustration">${concept.icon || "💡"}</div>
                <div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:10px;flex-wrap:wrap;">
                    <h2 class="capsule-concept-title" style="margin:0;">${concept.title}</h2>
                    <button class="btn-back-pill" onclick="speakText('${safeSpeech}')">🔊 Escuchar</button>
                </div>
                <p class="capsule-concept-desc">${concept.desc}</p>
            </div>
        `;
        footerEl.innerHTML = `
            <button class="btn-capsule-prev" onclick="prevConceptOrBack()">Anterior</button>
            <button class="btn-capsule-next" onclick="nextConceptOrStage()">
                ${cIdx + 1 < concepts.length ? "Siguiente Concepto ➔" : "Desbloquear Asociación ➔"}
            </button>
        `;
    }
    // ETAPA 1: ASOCIACIÓN (Con botón Continuar bloqueado hasta acertar y Pista oculta hasta fallar)
    else if (appState.currentStageIdx === 1) {
        const assocs = cap.associations && cap.associations.length
            ? cap.associations
            : [{ concept: cap.title, match: "Concepto principal de la guía", distractor: "Tema no relacionado", hint: "Recuerda lo leído en la Zona de Entrenamiento." }];
        const aIdx = Math.min(appState.currentAssocIdx, assocs.length - 1);
        const item = assocs[aIdx];

        if (!appState.currentOptionsOrder) {
            appState.currentOptionsOrder = shuffleArray([item.match, item.distractor]);
        }
        const options = appState.currentOptionsOrder;
        const hintText = item.hint || `Recuerda qué función o característica tiene "${item.concept}" según el entrenamiento.`;

        contentEl.innerHTML = `
            <div class="capsule-inner-pastel">
                <span class="capsule-counter-pill">🔗 Conecta la Pareja (${aIdx + 1} de ${assocs.length})</span>
                <div class="capsule-big-illustration">${cap.icon}</div>
                <h2 class="capsule-concept-title">¿Con qué se asocia "${item.concept}"?</h2>
                <div class="capsule-options-row">
                    ${options.map(opt => `
                        <button class="choice-btn" onclick="evaluateInteractiveAnswer(this, '${opt.replace(/'/g, "\\'")}', '${item.match.replace(/'/g, "\\'")}')">${opt}</button>
                    `).join("")}
                </div>
                <div id="detective-hint-box" class="hidden" style="margin-top:16px; background:#FEF3C7; color:#92400E; padding:10px 18px; border-radius:999px; font-weight:700; font-size:14px; display:inline-block; border:1.5px solid #F59E0B;">
                    💡 Pista de Detective: ${hintText}
                </div>
            </div>
        `;
        footerEl.innerHTML = `
            <button class="btn-capsule-prev" onclick="prevAssocOrStage()">Anterior</button>
            <button id="btn-stage-continue" class="btn-capsule-next" disabled style="opacity:0.45; cursor:not-allowed;" onclick="nextAssocOrStage()">
                🔒 Responde para continuar
            </button>
        `;
        applyCalmLockIfNeeded();
    }
    // ETAPA 2: MICRO-MISIONES (Pista oculta al inicio; solo aparece si se equivoca)
    else if (appState.currentStageIdx === 2) {
        const missions = cap.missions && cap.missions.length
            ? cap.missions
            : [{ question: `¿Listo para superar ${cap.title}?`, options: ["¡Sí!", "Casi"], correct: "¡Sí!", hint: "Elige la respuesta afirmativa." }];
        const mIdx = Math.min(appState.currentMissionIdx, missions.length - 1);
        const m = missions[mIdx];

        if (!appState.currentOptionsOrder) {
            appState.currentOptionsOrder = shuffleArray(m.options || []);
        }
        const options = appState.currentOptionsOrder;
        const hintText = m.hint || "Lee con calma las palabras clave de la pregunta para descartar las opciones falsas.";

        contentEl.innerHTML = `
            <div class="capsule-inner-pastel">
                <span class="capsule-counter-pill">🎯 Micro-Misión ${mIdx + 1} de ${missions.length}</span>
                <h2 class="capsule-concept-title">${m.question}</h2>
                <div class="capsule-options-row">
                    ${options.map(opt => `
                        <button class="choice-btn" onclick="evaluateInteractiveAnswer(this, '${opt.replace(/'/g, "\\'")}', '${(m.correct || "").replace(/'/g, "\\'")}')">${opt}</button>
                    `).join("")}
                </div>
                <div id="detective-hint-box" class="hidden" style="margin-top:16px; background:#FEF3C7; color:#92400E; padding:10px 18px; border-radius:999px; font-weight:700; font-size:14px; display:inline-block; border:1.5px solid #F59E0B;">
                    💡 Pista de Detective: ${hintText}
                </div>
            </div>
        `;
        footerEl.innerHTML = `
            <button class="btn-capsule-prev" onclick="prevMissionOrStage()">Anterior</button>
            <button id="btn-stage-continue" class="btn-capsule-next" disabled style="opacity:0.45; cursor:not-allowed;" onclick="nextMissionOrStage()">
                🔒 Responde para continuar
            </button>
        `;
        applyCalmLockIfNeeded();
    }
    // ETAPA 3: PASO 4 DINÁMICO (CUADERNO NATURALISTA / M.O.R.A. / R.I.C.E.)
    else {
        const ch = cap.step4Challenge || {
            prompt: `Aplica lo aprendido en ${cap.title}.`,
            guideSteps: ["Lee con calma el desafío.", "Elige la respuesta más completa."],
            question: "¿Cuál alternativa sintetiza mejor el aprendizaje de hoy?",
            options: ["La respuesta completa con evidencia de la guía", "Una respuesta sin justificación"],
            correct: "La respuesta completa con evidencia de la guía",
            hint: "Fíjate en los pasos con ticket verde de arriba para elegir la opción más completa."
        };

        if (!appState.currentOptionsOrder) {
            appState.currentOptionsOrder = shuffleArray(ch.options || []);
        }
        const options = appState.currentOptionsOrder;
        const hintText = ch.hint || "Apóyate en las pistas con ticket verde (✅) que están en el recuadro blanco.";

        contentEl.innerHTML = `
            <div class="capsule-inner-pastel">
                <span class="capsule-counter-pill">${world.step4Label}</span>
                <h2 class="capsule-concept-title" style="font-size:21px;">${ch.prompt}</h2>
                <div style="text-align:left; max-width:600px; margin:10px auto; background:white; padding:12px 16px; border-radius:14px;">
                    ${(ch.guideSteps || []).map(st => `<p style="font-size:14px; margin-bottom:5px; font-weight:600;">✅ ${st}</p>`).join("")}
                </div>
                <p style="font-weight:800; font-size:16px; margin-top:10px;">${ch.question}</p>
                <div class="capsule-options-row">
                    ${options.map(opt => `
                        <button class="choice-btn" onclick="evaluateInteractiveAnswer(this, '${opt.replace(/'/g, "\\'")}', '${(ch.correct || "").replace(/'/g, "\\'")}')">${opt}</button>
                    `).join("")}
                </div>
                <div id="detective-hint-box" class="hidden" style="margin-top:16px; background:#FEF3C7; color:#92400E; padding:10px 18px; border-radius:999px; font-weight:700; font-size:14px; display:inline-block; border:1.5px solid #F59E0B;">
                    💡 Pista de Detective: ${hintText}
                </div>
            </div>
        `;
        footerEl.innerHTML = `
            <button class="btn-capsule-prev" onclick="setCapsuleStage(2)">Anterior</button>
            <button id="btn-stage-continue" class="btn-capsule-next" disabled style="opacity:0.45; cursor:not-allowed;" onclick="finishFullCapsule()">
                🔒 Responde para completar
            </button>
        `;
        applyCalmLockIfNeeded();
    }
}

// Evalúa la respuesta: bloquea opciones al acertar y muestra la Pista de Detective SOLO al equivocarse
function evaluateInteractiveAnswer(btnEl, chosen, correct) {
    // Si ya acertó esta pregunta, no permitir tocar opciones erróneas ni sumar puntos dobles
    if (appState.answeredCurrentQuestion) return;

    const elapsedMs = Date.now() - appState.questionShownAt;
    const cap = getActiveCapsuleObj();
    const canEarn = isCapsuleRewardEligible(cap);

    // Detector Anti-Azar: si responde en menos de 1.8 segundos, programa Modo Calma para la siguiente tarjeta
    if (elapsedMs < 1800) {
        appState.impulsiveCount++;
        appState.triggerCalmLock = true;
        saveAppState();
    }

    if (chosen === correct) {
        appState.answeredCurrentQuestion = true;
        btnEl.classList.add("correct");
        playSoftTone("win");

        // Bloquear todos los demás botones de alternativa para que no pueda marcar errores después de acertar
        document.querySelectorAll(".choice-btn").forEach(b => {
            b.disabled = true;
        });

        // Habilitar el botón verde de Continuar / Completar Cápsula
        const continueBtn = document.getElementById("btn-stage-continue");
        if (continueBtn) {
            continueBtn.disabled = false;
            continueBtn.style.opacity = "1";
            continueBtn.style.cursor = "pointer";
            continueBtn.textContent = appState.currentStageIdx === 3
                ? "🏆 ¡Completar Cápsula!"
                : "¡Correcto! Continuar ➔";
        }

        if (canEarn) {
            if ((cap.reviewCount || 0) === 0) {
                appState.points += 5;
            } else {
                appState.gems += 2;
            }
            saveAppState();
        }
    } else {
        // Si se equivoca: marca en rojo esa opción, la deshabilita y revela la Pista de Detective
        btnEl.classList.add("wrong");
        btnEl.disabled = true;
        playSoftTone("click");

        const hintBox = document.getElementById("detective-hint-box");
        if (hintBox) {
            hintBox.classList.remove("hidden");
        }
    }
}

function applyCalmLockIfNeeded() {
    const calmBanner = document.getElementById("calm-mode-banner");
    const calmBar = document.getElementById("calm-progress-bar");
    if (!appState.triggerCalmLock) {
        hideCalmLockBanner();
        return;
    }

    appState.triggerCalmLock = false;
    playSoftTone("calm");
    calmBanner.classList.remove("hidden");
    calmBar.style.transition = "none";
    calmBar.style.width = "0%";

    const choiceButtons = document.querySelectorAll(".choice-btn");
    choiceButtons.forEach(b => { b.disabled = true; });

    setTimeout(() => {
        calmBar.style.transition = "width 2.4s linear";
        calmBar.style.width = "100%";
    }, 30);

    setTimeout(() => {
        if (!appState.answeredCurrentQuestion) {
            choiceButtons.forEach(b => {
                if (!b.classList.contains("wrong")) b.disabled = false;
            });
        }
        calmBanner.classList.add("hidden");
        appState.questionShownAt = Date.now();
    }, 2500);
}

function hideCalmLockBanner() {
    const calmBanner = document.getElementById("calm-mode-banner");
    if (calmBanner) calmBanner.classList.add("hidden");
}

// Impide saltar a etapas bloqueadas desde la barra superior
function setCapsuleStage(idx) {
    if (idx > appState.maxUnlockedStageIdx) {
        playSoftTone("click");
        return;
    }
    appState.currentStageIdx = idx;
    prepareNewQuestionState();
    renderCapsuleWorkspace();
}

function prevConceptOrBack() {
    if (appState.currentConceptIdx > 0) {
        appState.currentConceptIdx--;
        renderCapsuleWorkspace();
    } else {
        navigateTo("screen-topics");
    }
}

function nextConceptOrStage() {
    const cap = getActiveCapsuleObj();
    const total = (cap.concepts && cap.concepts.length) || 1;
    playSoftTone("win");

    if (appState.currentConceptIdx + 1 < total) {
        appState.currentConceptIdx++;
        renderCapsuleWorkspace();
    } else {
        appState.maxUnlockedStageIdx = Math.max(appState.maxUnlockedStageIdx, 1);
        appState.currentStageIdx = 1;
        appState.currentAssocIdx = 0;
        prepareNewQuestionState();
        renderCapsuleWorkspace();
    }
}

function prevAssocOrStage() {
    if (appState.currentAssocIdx > 0) {
        appState.currentAssocIdx--;
        prepareNewQuestionState();
        renderCapsuleWorkspace();
    } else {
        appState.currentStageIdx = 0;
        renderCapsuleWorkspace();
    }
}

function nextAssocOrStage() {
    if (!appState.answeredCurrentQuestion) return;
    const cap = getActiveCapsuleObj();
    const total = (cap.associations && cap.associations.length) || 1;

    if (appState.currentAssocIdx + 1 < total) {
        appState.currentAssocIdx++;
        prepareNewQuestionState();
        renderCapsuleWorkspace();
    } else {
        appState.maxUnlockedStageIdx = Math.max(appState.maxUnlockedStageIdx, 2);
        appState.currentStageIdx = 2;
        appState.currentMissionIdx = 0;
        prepareNewQuestionState();
        renderCapsuleWorkspace();
    }
}

function prevMissionOrStage() {
    if (appState.currentMissionIdx > 0) {
        appState.currentMissionIdx--;
        prepareNewQuestionState();
        renderCapsuleWorkspace();
    } else {
        appState.currentStageIdx = 1;
        prepareNewQuestionState();
        renderCapsuleWorkspace();
    }
}

function nextMissionOrStage() {
    if (!appState.answeredCurrentQuestion) return;
    const cap = getActiveCapsuleObj();
    const total = (cap.missions && cap.missions.length) || 1;

    if (appState.currentMissionIdx + 1 < total) {
        appState.currentMissionIdx++;
        prepareNewQuestionState();
        renderCapsuleWorkspace();
    } else {
        appState.maxUnlockedStageIdx = Math.max(appState.maxUnlockedStageIdx, 3);
        appState.currentStageIdx = 3;
        prepareNewQuestionState();
        renderCapsuleWorkspace();
    }
}

function finishFullCapsule() {
    // Doble validación: solo permite terminar si está en el Paso 4 y ya respondió correctamente
    if (appState.currentStageIdx < 3 || !appState.answeredCurrentQuestion) return;

    const cap = getActiveCapsuleObj();
    const examInfo = getExamStatus(cap.examDate);
    const reviews = cap.reviewCount || 0;
    const maxR = cap.maxReviews || 5;

    playSoftTone("win");

    if (!examInfo.isExpired && reviews < maxR) {
        if (reviews === 0) {
            appState.points += 30;
            cap.reviewCount = 1;
            alert(`🎉 ¡Primera estrella conseguida (1/5)!\nGanaste +30 🏆 Monedas de Oro.\n\n¡Vuelve a repasar esta cápsula antes de la prueba para ganar 💎 Gemas de Esfuerzo!`);
        } else {
            cap.reviewCount = reviews + 1;
            const bonusGems = cap.reviewCount === maxR ? 25 : 15;
            appState.gems += bonusGems;
            if (cap.reviewCount === maxR) {
                alert(`🏆 ¡META 7.0 ALCANZADA (5/5 REPASOS)!\nGanaste +${bonusGems} 💎 Gemas de Esfuerzo y desbloqueaste un Cofre Familiar en el Panel de tus Papás.`);
            } else {
                alert(`💎 ¡Repaso ${cap.reviewCount} de ${maxR} completado!\nGanaste +${bonusGems} 💎 Gemas de Esfuerzo.`);
            }
        }
        saveAppState();
    } else {
        alert("👏 ¡Excelente práctica libre! Como ya completaste los 5 repasos (o la fecha de la prueba ya pasó), esta sesión no suma puntos extra.");
    }

    navigateTo("screen-topics");
}

// ============================================================================
// 7. PANTALLA 5: EL REINO SQUISHY (DOBLE MONEDA: 🏆 MONEDAS Y 💎 GEMAS)
// ============================================================================
function renderKingdomShelf() {
    const shelfEl = document.getElementById("squishy-shelf-grid");
    shelfEl.innerHTML = appState.squishies.map(sq => `
        <div class="squishy-slot" title="${sq.name}" onclick="playSoftTone('win')">
            ${sq.unlocked
                ? `<span class="squishy-emoji">${sq.emoji}</span>`
                : `<div class="squishy-locked">🔒</div>`
            }
        </div>
    `).join("");
}

function buySquishyCapsule(tier = "simple") {
    const msgEl = document.getElementById("gachapon-msg");
    const lockedList = appState.squishies.filter(s => !s.unlocked);

    if (lockedList.length === 0) {
        msgEl.textContent = "🎉 ¡Increíble! Ya coleccionaste todos los Squishies de esta repisa.";
        return;
    }

    if (tier === "simple") {
        if (appState.points < 40) {
            msgEl.textContent = "⏳ Necesitas 40 🏆 Monedas. ¡Estudia una cápsula nueva para ganar más!";
            return;
        }
        appState.points -= 40;
    } else {
        if (appState.gems < 25) {
            msgEl.textContent = "💎 Necesitas 25 Gemas de Esfuerzo. ¡Repasa tus cápsulas antes de la prueba para ganarlas!";
            return;
        }
        appState.gems -= 25;
    }

    const won = tier === "mythic" ? lockedList[lockedList.length - 1] : lockedList[0];
    won.unlocked = true;
    playSoftTone("win");
    msgEl.textContent = `✨ ¡Salto de cápsula! Desbloqueaste a: ${won.emoji} ${won.name}`;
    saveAppState();
    renderKingdomShelf();
}

// ============================================================================
// 8. PANEL DE APODERADOS: MULTI-ARCHIVOS + GEMINI IA + HISTORIAL 7.0
// ============================================================================
function saveGeminiKeyFromUI() {
    const keyInput = document.getElementById("gemini-api-key-input");
    const statusEl = document.getElementById("api-key-status");
    if (!keyInput || !keyInput.value.trim()) {
        statusEl.style.color = "#DC2626";
        statusEl.textContent = "⚠️ Ingresa una API Key válida.";
        return;
    }
    KaptiaAIEngine.saveApiKey(keyInput.value);
    statusEl.style.color = "#059669";
    statusEl.textContent = "✅ API Key guardada correctamente en este navegador.";
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

function handleMultipleFilesSelected(input) {
    const newFiles = Array.from(input.files || []);
    if (newFiles.length > 0) {
        appState.filesQueue.push(...newFiles);
        input.value = "";
        renderAttachedFilesQueue();
    }
}

function removeFileFromQueue(idx) {
    appState.filesQueue.splice(idx, 1);
    renderAttachedFilesQueue();
}

function renderAttachedFilesQueue() {
    const listEl = document.getElementById("attached-files-list");
    if (!listEl) return;

    if (appState.filesQueue.length === 0) {
        listEl.classList.add("hidden");
        listEl.innerHTML = "";
        return;
    }

    listEl.classList.remove("hidden");
    listEl.innerHTML = `
        <div style="font-size:12px; font-weight:800; color:#1E3A8A; margin-bottom:4px;">
            📚 Archivos listos para unir en una sola cápsula (${appState.filesQueue.length}):
        </div>
        ${appState.filesQueue.map((file, idx) => `
            <div class="attached-file-chip">
                <span>${file.type.includes("image") ? "🖼️" : "📄"} ${file.name}</span>
                <button class="btn-remove-file" onclick="removeFileFromQueue(${idx})" title="Quitar archivo">✖</button>
            </div>
        `).join("")}
    `;
}

function renderParentHistory() {
    const listEl = document.getElementById("parent-history-list");
    const chestBanner = document.getElementById("family-chest-banner");

    const allCaps = [
        ...appState.worldsData.ciencias.capsules,
        ...appState.worldsData.historia.capsules,
        ...appState.worldsData.matematicas.capsules,
        ...appState.worldsData.lenguaje.capsules
    ];

    const masteredCaps = allCaps.filter(c => (c.reviewCount || 0) >= (c.maxReviews || 5));
    if (chestBanner) {
        chestBanner.innerHTML = masteredCaps.length > 0
            ? `🎁 <strong>¡Cofre Familiar Activo!</strong> ${appState.studentName} alcanzó 5/5 repasos en <strong>${masteredCaps.length} guía(s)</strong> (¡Listo para el 7.0!).`
            : `💡 Cuando ${appState.studentName} complete 5/5 repasos en una guía, aquí se desbloqueará su recompensa familiar.`;
    }

    listEl.innerHTML = allCaps.slice(0, 6).map(c => {
        const ex = getExamStatus(c.examDate);
        const rev = c.reviewCount || 0;
        const maxR = c.maxReviews || 5;
        return `
            <div class="history-item">
                <div>
                    <strong>${c.title}</strong><br>
                    <small style="color:#64748B;">${ex.badgeText} • Repasos: ${rev}/${maxR}</small>
                </div>
                <span>${renderStarsBadge(rev, maxR)}</span>
            </div>
        `;
    }).join("");
}

async function createCapsuleWithGemini() {
    const keyInput = document.getElementById("gemini-api-key-input");
    if (keyInput && keyInput.value.trim()) {
        KaptiaAIEngine.saveApiKey(keyInput.value.trim());
    }

    const customTitle = document.getElementById("input-capsule-title").value.trim();
    const examDateInput = document.getElementById("input-exam-date").value || getFutureDateStr(5);
    const rawText = document.getElementById("input-capsule-text").value.trim();
    const files = appState.filesQueue;

    const loadingBox = document.getElementById("ai-loading-box");
    const filesCountLabel = document.getElementById("ai-files-count-label");
    const errorBox = document.getElementById("ai-error-box");
    const btnGenerate = document.getElementById("btn-generate-ai");

    errorBox.classList.add("hidden");

    if (!rawText && files.length === 0) {
        errorBox.textContent = "⚠️ Por favor adjunta al menos un archivo (PDF o fotos del cuaderno) o pega el texto de la guía.";
        errorBox.classList.remove("hidden");
        return;
    }

    try {
        if (filesCountLabel) {
            filesCountLabel.textContent = files.length > 0 ? `${files.length} archivo(s)` : "el texto de la guía";
        }
        loadingBox.classList.remove("hidden");
        btnGenerate.disabled = true;
        btnGenerate.textContent = "⏳ Procesando lote con Gemini IA...";

        const aiData = await KaptiaAIEngine.generateCapsuleFromMaterial({
            subject: appState.uploadSubject,
            customTitle,
            rawText,
            files
        });

        const colorMap = {
            ciencias: { card: "world-green", btn: "btn-green", icon: "🌿" },
            historia: { card: "world-blue", btn: "btn-blue", icon: "🏛️" },
            matematicas: { card: "world-orange", btn: "btn-orange", icon: "🧮" },
            lenguaje: { card: "world-purple", btn: "btn-purple", icon: "📖" }
        }[appState.uploadSubject];

        const newCapsule = {
            id: "cap-ai-" + Date.now(),
            icon: aiData.icon || colorMap.icon,
            title: customTitle || aiData.title || "Nueva Guía IA",
            subtitle: aiData.subtitle || `Generada desde ${files.length || 1} documento(s)`,
            cardClass: colorMap.card,
            btnClass: colorMap.btn,
            examDate: examDateInput,
            reviewCount: 0,
            maxReviews: 5,
            concepts: aiData.concepts || [],
            associations: aiData.associations || [],
            missions: aiData.missions || [],
            step4Challenge: aiData.step4Challenge || null
        };

        const world = appState.worldsData[appState.uploadSubject];
        world.capsules.unshift(newCapsule);
        saveAppState();

        document.getElementById("input-capsule-title").value = "";
        document.getElementById("input-capsule-text").value = "";
        appState.filesQueue = [];
        renderAttachedFilesQueue();

        appState.currentWorldKey = appState.uploadSubject;
        appState.topicsFilter = "active";
        navigateTo("screen-topics");

    } catch (err) {
        errorBox.textContent = `❌ ${err.message}`;
        errorBox.classList.remove("hidden");
    } finally {
        loadingBox.classList.add("hidden");
        btnGenerate.disabled = false;
        btnGenerate.textContent = "✨ Crear Cápsula con IA";
    }
}

// Modales de Login y Pase Mágico
function openParentLoginModal() {
    document.getElementById("login-error").classList.add("hidden");
    document.getElementById("modal-parent-login").classList.remove("hidden");
}

function submitParentLogin() {
    const u = document.getElementById("login-user").value.trim().toLowerCase();
    const p = document.getElementById("login-pass").value.trim();
    if (u === "padre" && p === "1234") {
        closeModals();
        navigateTo("screen-parent");
    } else {
        document.getElementById("login-error").classList.remove("hidden");
    }
}

function openStudentPinModal() {
    document.getElementById("pin-error").classList.add("hidden");
    document.getElementById("modal-student-pin").classList.remove("hidden");
}

function verifyStudentPin() {
    const entered = document.getElementById("student-pin-input").value.trim();
    if (entered === appState.studentPin) {
        closeModals();
        navigateTo("screen-worlds");
    } else {
        document.getElementById("pin-error").classList.remove("hidden");
    }
}

function openEditStudentModal() {
    document.getElementById("edit-student-name").value = appState.studentName;
    document.getElementById("edit-student-pin").value = appState.studentPin;
    document.getElementById("modal-edit-student").classList.remove("hidden");
}

function saveStudentProfile() {
    const newName = document.getElementById("edit-student-name").value.trim() || "Santi";
    const newPin = document.getElementById("edit-student-pin").value.trim() || "1234";
    appState.studentName = newName;
    appState.studentPin = newPin;
    saveAppState();
    closeModals();
}

function copyMagicPass() {
    alert(`Pase Mágico de ${appState.studentName} copiado:\nPIN de acceso rápido: ${appState.studentPin}`);
}

function closeModals() {
    document.querySelectorAll(".modal-overlay").forEach(m => m.classList.add("hidden"));
}

function toggleFontSize() {
    appState.largeFont = !appState.largeFont;
    document.body.classList.toggle("large-font", appState.largeFont);
}

function toggleSound() {
    appState.soundEnabled = !appState.soundEnabled;
}

window.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById("input-exam-date");
    if (dateInput && !dateInput.value) {
        dateInput.value = getFutureDateStr(5);
    }
    syncHeaderData();
});
