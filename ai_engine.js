// ============================================================================
// MOTOR DE IA KAPTIA - SPRINT 3 (MULTIMODAL MULTI-ARCHIVOS CON GEMINI 2.5 FLASH)
// Soporta múltiples PDFs, múltiples Fotos de cuaderno (.jpg/.png/.webp) y Texto
// ============================================================================

const KaptiaAIEngine = {
    model: "gemini-2.5-flash",

    getApiKey() {
        return localStorage.getItem("kaptia_gemini_api_key") || "";
    },

    saveApiKey(key) {
        localStorage.setItem("kaptia_gemini_api_key", key.trim());
    },

    // Convierte un archivo individual (PDF, Imagen o TXT) en una parte compatible con Gemini
    fileToGenerativePart(file) {
        return new Promise((resolve, reject) => {
            if (file.type === "text/plain" || file.name.endsWith(".txt")) {
                const textReader = new FileReader();
                textReader.onloadend = () => {
                    resolve({
                        text: `\n--- Contenido del archivo ${file.name} ---\n${textReader.result}\n`
                    });
                };
                textReader.onerror = reject;
                textReader.readAsText(file);
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Data = reader.result.split(",")[1];
                resolve({
                    inlineData: {
                        data: base64Data,
                        mimeType: file.type || "application/pdf"
                    }
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    // Procesa múltiples archivos y texto en una sola llamada a Gemini
    async generateCapsuleFromMaterial({ subject, customTitle, rawText, files = [] }) {
        const apiKey = this.getApiKey();
        if (!apiKey) {
            throw new Error("Falta tu API Key de Gemini. Pégala en el recuadro superior del Panel de Apoderados.");
        }

        const subjectRules = {
            ciencias: "El paso 4 es 'Cuaderno Naturalista': diseña un caso práctico de observación o experimento científico basado en las guías adjuntas.",
            historia: "El paso 4 es 'Constructor R.I.C.E.': diseña una pregunta de comprensión histórica guiada con los pasos Reafirmar, Incluir, Citar y Explicar.",
            matematicas: "El paso 4 es 'Pizarra M.O.R.A.': diseña un problema matemático aplicado desglosado en Marcar datos, Operación, Resolver y Anotar respuesta.",
            lenguaje: "El paso 4 es 'Constructor R.I.C.E.': diseña un desafío de lectura aplicando Reafirmar, Incluir, Citar con comillas y Explicar."
        };

        const systemInstruction = `
Eres el motor pedagógico neuro-adaptativo de Kaptia para niños de 8 a 12 años con TDAH.
Analiza TODOS los archivos adjuntos (pueden ser varias páginas de un cuaderno o múltiples guías PDF) y el texto entregado para integrarlos en UNA SOLA cápsula interactiva completa.

REGLAS ESTRICTAS:
1. Baja carga cognitiva: explicaciones de máximo 25 palabras por tarjeta, lenguaje claro, motivador y sin marcas Markdown raras.
2. Independencia del cuaderno físico: nunca digas "según la imagen de tu guía"; incluye siempre el contexto necesario en la pregunta.
3. No inventes materia ajena a los documentos proporcionados.
4. En las micro-misiones, incluye distractores con sentido semántico (no absurdos) y una pista deductiva amigable ("Pista de Detective").
5. Asignatura seleccionada: ${subject.toUpperCase()}. ${subjectRules[subject] || subjectRules.ciencias}

Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura exacta:
{
  "title": "Título corto y atractivo del tema unificado",
  "subtitle": "Subtítulo de 3 a 6 palabras",
  "icon": "Un emoji representativo (ej. 🌿, 🌋, 🏛️, 🧮, 📖)",
  "concepts": [
    {
      "icon": "Emoji del concepto",
      "title": "Nombre del concepto clave 1",
      "desc": "Explicación sencilla y directa de máximo 25 palabras."
    },
    {
      "icon": "Emoji del concepto",
      "title": "Nombre del concepto clave 2",
      "desc": "Explicación sencilla y directa de máximo 25 palabras."
    },
    {
      "icon": "Emoji del concepto",
      "title": "Nombre del concepto clave 3",
      "desc": "Explicación sencilla y directa de máximo 25 palabras."
    },
    {
      "icon": "Emoji del concepto",
      "title": "Nombre del concepto clave 4",
      "desc": "Explicación sencilla y directa de máximo 25 palabras."
    }
  ],
  "associations": [
    {
      "concept": "Término o parte 1",
      "match": "Su función o definición corta",
      "distractor": "Opción incorrecta pero plausible"
    },
    {
      "concept": "Término o parte 2",
      "match": "Su función o definición corta",
      "distractor": "Opción incorrecta pero plausible"
    },
    {
      "concept": "Término o parte 3",
      "match": "Su función o definición corta",
      "distractor": "Opción incorrecta pero plausible"
    }
  ],
  "missions": [
    {
      "question": "Pregunta interactiva 1 sobre el material",
      "options": ["Opción Correcta", "Distractor 1", "Distractor 2"],
      "correct": "Opción Correcta",
      "hint": "Pista deductiva breve para ayudar sin dar la respuesta directa."
    },
    {
      "question": "Pregunta interactiva 2 sobre el material",
      "options": ["Opción Correcta", "Distractor 1", "Distractor 2"],
      "correct": "Opción Correcta",
      "hint": "Pista deductiva breve."
    },
    {
      "question": "Pregunta interactiva 3 sobre el material",
      "options": ["Opción Correcta", "Distractor 1", "Distractor 2"],
      "correct": "Opción Correcta",
      "hint": "Pista deductiva breve."
    },
    {
      "question": "Pregunta interactiva 4 sobre el material",
      "options": ["Opción Correcta", "Distractor 1", "Distractor 2"],
      "correct": "Opción Correcta",
      "hint": "Pista deductiva breve."
    }
  ],
  "step4Challenge": {
    "prompt": "Caso práctico o pregunta final adaptada al método de la asignatura (M.O.R.A., R.I.C.E. o Cuaderno Naturalista)",
    "guideSteps": [
      "Paso 1 de apoyo para el niño",
      "Paso 2 de apoyo para el niño"
    ],
    "question": "Pregunta de cierre para validar el paso 4",
    "options": ["Respuesta correcta estructurada", "Respuesta incompleta 1", "Respuesta incorrecta 2"],
    "correct": "Respuesta correcta estructurada"
  }
}`;

        const parts = [{ text: systemInstruction }];

        if (customTitle) {
            parts.push({ text: `Título sugerido por el apoderado: ${customTitle}` });
        }
        if (rawText && rawText.trim().length > 0) {
            parts.push({ text: `Texto adicional de la guía escolar:\n${rawText.trim()}` });
        }

        if (files && files.length > 0) {
            const fileParts = await Promise.all(files.map(f => this.fileToGenerativePart(f)));
            parts.push(...fileParts);
        }

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${encodeURIComponent(apiKey)}`;

        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts }],
                generationConfig: {
                    temperature: 0.35,
                    responseMimeType: "application/json"
                }
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            const msg = errData?.error?.message || `Error HTTP ${response.status}`;
            throw new Error(`Error de Gemini API: ${msg}`);
        }

        const result = await response.json();
        const rawJsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawJsonText) {
            throw new Error("La IA no devolvió contenido válido. Intenta nuevamente.");
        }

        const cleanJson = rawJsonText.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanJson);
    }
};
