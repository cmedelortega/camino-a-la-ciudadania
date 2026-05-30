export type Lang = 'es' | 'en'

/** Diccionario de la interfaz. El contenido del examen vive aparte (questions-2025.ts). */
export const UI_TEXT = {
  appName: { es: 'Camino a la Ciudadanía', en: 'Path to Citizenship' },
  tagline: {
    es: 'Prepárate para el examen de civismo de EE. UU. a tu ritmo.',
    en: 'Prepare for the U.S. civics test at your own pace.',
  },

  // Navegación / acciones principales
  study: { es: 'Estudiar', en: 'Study' },
  studyDesc: { es: 'Repasa las preguntas con tarjetas y audio', en: 'Review questions with cards and audio' },
  exam: { es: 'Examen de práctica', en: 'Practice test' },
  examDesc: { es: 'Simula la entrevista como con el oficial', en: 'Simulate the interview like with the officer' },
  progress: { es: 'Mi progreso', en: 'My progress' },
  settings: { es: 'Ajustes', en: 'Settings' },
  home: { es: 'Inicio', en: 'Home' },
  back: { es: 'Volver', en: 'Back' },

  // Tarjetas / estudio
  showAnswer: { es: 'Ver respuesta', en: 'Show answer' },
  hideAnswer: { es: 'Ocultar respuesta', en: 'Hide answer' },
  next: { es: 'Siguiente', en: 'Next' },
  previous: { es: 'Anterior', en: 'Previous' },
  listen: { es: 'Escuchar', en: 'Listen' },
  stop: { es: 'Detener', en: 'Stop' },
  speakAnswer: { es: 'Responder hablando', en: 'Answer by speaking' },
  listening: { es: 'Escuchando…', en: 'Listening…' },
  iKnewIt: { es: 'Me la sé', en: 'I knew it' },
  reviewAgain: { es: 'Repasar otra vez', en: 'Review again' },
  questionOf: { es: 'Pregunta {n} de {total}', en: 'Question {n} of {total}' },
  question: { es: 'Pregunta', en: 'Question' },
  answer: { es: 'Respuesta', en: 'Answer' },
  acceptableAnswers: { es: 'Respuestas aceptables', en: 'Acceptable answers' },

  // Marcas
  badge6520: { es: 'Pregunta 65/20', en: '65/20 question' },
  badgeDynamic: { es: 'Respuesta que cambia', en: 'Answer that changes' },
  verifyOfficial: { es: 'Verificar el dato más reciente', en: 'Check the most recent answer' },
  asOfDate: { es: 'Vigente al {date}', en: 'Current as of {date}' },
  checkBeforeInterview: {
    es: 'Confirma este nombre en uscis.gov/testupdates antes de tu entrevista.',
    en: 'Confirm this name at uscis.gov/testupdates before your interview.',
  },
  dependsOnState: {
    es: 'Esta respuesta depende de tu estado. Verifica el dato actual en una fuente oficial.',
    en: 'This answer depends on your state. Check the current answer from an official source.',
  },

  // Examen
  examIntro2025: {
    es: 'El oficial te hará 20 preguntas. Debes responder 12 bien para aprobar.',
    en: 'The officer will ask 20 questions. You must answer 12 correctly to pass.',
  },
  examIntro6520: {
    es: 'Excepción 65/20: 10 preguntas del grupo especial. Debes responder 6 bien.',
    en: '65/20 exception: 10 questions from the special set. You must answer 6 correctly.',
  },
  startExam: { es: 'Comenzar examen', en: 'Start test' },
  iGotItRight: { es: 'La contesté bien', en: 'I got it right' },
  iGotItWrong: { es: 'La fallé', en: 'I got it wrong' },
  examPassed: { es: '¡Aprobaste! 🎉', en: 'You passed! 🎉' },
  examFailed: { es: 'Sigue practicando', en: 'Keep practicing' },
  examScore: { es: 'Acertaste {correct} de {total}', en: 'You got {correct} of {total}' },
  passStopNote: {
    es: 'En el examen real, el oficial se detiene en cuanto alcanzas el mínimo de aciertos.',
    en: 'In the real test, the officer stops as soon as you reach the minimum correct answers.',
  },
  tryAgain: { es: 'Intentar de nuevo', en: 'Try again' },
  finishExam: { es: 'Terminar', en: 'Finish' },

  // Progreso
  mastered: { es: 'Dominadas', en: 'Mastered' },
  learning: { es: 'En repaso', en: 'Learning' },
  notSeen: { es: 'Sin ver', en: 'Not seen' },
  resetProgress: { es: 'Borrar mi progreso', en: 'Reset my progress' },
  noAttempts: { es: 'Aún no has hecho exámenes de práctica.', en: 'You have not taken practice tests yet.' },
  lastAttempts: { es: 'Últimos exámenes', en: 'Recent tests' },

  // Ajustes
  language: { es: 'Idioma', en: 'Language' },
  textSize: { es: 'Tamaño del texto', en: 'Text size' },
  bigger: { es: 'Más grande', en: 'Bigger' },
  smaller: { es: 'Más pequeño', en: 'Smaller' },
  highContrast: { es: 'Alto contraste', en: 'High contrast' },
  darkMode: { es: 'Modo oscuro', en: 'Dark mode' },
  myState: { es: 'Mi estado', en: 'My state' },
  selectState: { es: 'Selecciona tu estado', en: 'Select your state' },
  on: { es: 'Activado', en: 'On' },
  off: { es: 'Desactivado', en: 'Off' },

  // Categorías
  cat_principles: { es: 'Principios de la democracia', en: 'Principles of democracy' },
  cat_system: { es: 'Sistema de gobierno', en: 'System of government' },
  cat_rights: { es: 'Derechos y responsabilidades', en: 'Rights and responsibilities' },
  cat_colonial: { es: 'Período colonial e independencia', en: 'Colonial period and independence' },
  cat_1800s: { es: 'Historia: los años 1800', en: 'History: the 1800s' },
  cat_recent: { es: 'Historia reciente', en: 'Recent history' },
  cat_symbols: { es: 'Símbolos', en: 'Symbols' },
  cat_holidays: { es: 'Feriados', en: 'Holidays' },

  // Estudio: selección de mazo
  studyAll: { es: 'Las 128 preguntas', en: 'All 128 questions' },
  study6520: { es: 'Solo las 20 preguntas 65/20', en: 'Only the 20 (65/20) questions' },
  studyByCategory: { es: 'Por tema', en: 'By topic' },
  chooseWhatToStudy: { es: '¿Qué quieres estudiar?', en: 'What do you want to study?' },

  officialNote: {
    es: 'El texto en inglés es el oficial de USCIS. El español es una ayuda de estudio.',
    en: 'The English text is the official USCIS version. Spanish is a study aid.',
  },
  voiceNotSupported: {
    es: 'Tu navegador no permite reconocimiento de voz. Prueba con Chrome o Edge.',
    en: 'Your browser does not support speech recognition. Try Chrome or Edge.',
  },

  // ===== Elegibilidad =====
  eligibility: { es: 'Elegibilidad', en: 'Eligibility' },
  eligibilityDesc: {
    es: 'Descubre cuándo puedes aplicar y qué examen te toca',
    en: 'Find out when you can apply and which test you take',
  },
  yes: { es: 'Sí', en: 'Yes' },
  no: { es: 'No', en: 'No' },
  continue: { es: 'Continuar', en: 'Continue' },
  seeResult: { es: 'Ver mi resultado', en: 'See my result' },
  editAnswers: { es: 'Editar mis respuestas', en: 'Edit my answers' },
  stepOf: { es: 'Paso {n} de {total}', en: 'Step {n} of {total}' },

  wizBirth: { es: '¿Cuál es tu fecha de nacimiento?', en: 'What is your date of birth?' },
  wizLpr: {
    es: '¿Cuándo obtuviste tu Green Card (residencia permanente)?',
    en: 'When did you get your Green Card (permanent residence)?',
  },
  wizMarried: {
    es: '¿Estás casado/a con un ciudadano estadounidense?',
    en: 'Are you married to a U.S. citizen?',
  },
  wizSpouse3y: {
    es: '¿Han vivido juntos los últimos 3 años y tu cónyuge ha sido ciudadano todo ese tiempo?',
    en: 'Have you lived together for the last 3 years and has your spouse been a citizen that whole time?',
  },
  wizFiling: {
    es: '¿Cuándo planeas presentar el Formulario N-400?',
    en: 'When do you plan to file Form N-400?',
  },

  // Resultado
  resultTitle: { es: 'Tu diagnóstico', en: 'Your assessment' },
  basisFive: { es: 'Aplica la regla de 5 años (residente general).', en: '5-year rule applies (general resident).' },
  basisThree: {
    es: 'Aplica la regla de 3 años (casado/a con ciudadano).',
    en: '3-year rule applies (married to a citizen).',
  },
  ageYearsSummary: {
    es: 'A la fecha de presentación tendrás {age} años y {lpr} años con Green Card.',
    en: 'At the filing date you will be {age} years old with {lpr} years as a permanent resident.',
  },
  whenCanApply: { es: '¿Cuándo puedes aplicar?', en: 'When can you apply?' },
  eligibleYes: { es: '✅ Ya puedes presentar tu solicitud.', en: '✅ You can already file your application.' },
  eligibleNo: { es: '⏳ Aún no cumples el tiempo requerido.', en: '⏳ You have not yet met the time requirement.' },
  earliestDate: { es: 'Fecha más temprana para presentar: {date}', en: 'Earliest date to file: {date}' },
  earlyFilingNote: {
    es: 'Puedes presentar hasta 90 días antes de cumplir los {years} años.',
    en: 'You may file up to 90 days before completing the {years} years.',
  },
  plannedOk: {
    es: 'Tu fecha planeada ({date}) cumple el requisito de tiempo. 👍',
    en: 'Your planned date ({date}) meets the time requirement. 👍',
  },
  plannedEarly: {
    es: '⚠️ Tu fecha planeada ({date}) es antes de tiempo. Espera hasta {earliest}.',
    en: '⚠️ Your planned date ({date}) is too early. Wait until {earliest}.',
  },

  englishTitle: { es: 'Examen de inglés', en: 'English test' },
  englishExemptYes: {
    es: 'Estás EXENTO del examen de inglés (regla {rule}).',
    en: 'You are EXEMPT from the English test (rule {rule}).',
  },
  englishExemptNo: {
    es: 'Debes tomar el examen de inglés (leer, escribir y hablar).',
    en: 'You must take the English test (reading, writing, and speaking).',
  },
  nativeLanguageNote: {
    es: 'Puedes hacer el examen de civismo en tu idioma, con un intérprete que tú llevas.',
    en: 'You may take the civics test in your language, with an interpreter you bring.',
  },
  simplifiedNote: {
    es: 'Civismo simplificado: solo estudias las 20 preguntas marcadas ★; te preguntan 10 y debes acertar 6.',
    en: 'Simplified civics: study only the 20 starred (★) questions; you are asked 10 and must get 6 right.',
  },

  civicsTitle: { es: 'Examen de civismo', en: 'Civics test' },
  version2025Info: {
    es: 'Versión 2025: 128 preguntas. Te preguntan 20 y debes acertar 12.',
    en: '2025 version: 128 questions. You are asked 20 and must get 12 right.',
  },
  version2008Info: {
    es: 'Versión 2008: 100 preguntas. Te preguntan 10 y debes acertar 6.',
    en: '2008 version: 100 questions. You are asked 10 and must get 6 right.',
  },
  version2008AppNote: {
    es: 'Nota: esta app incluye la versión 2025. Para la 2008 consulta también la lista oficial de 100 preguntas.',
    en: 'Note: this app includes the 2025 version. For the 2008 test, also check the official 100-question list.',
  },
  recommendStudy: { es: 'Te conviene practicar en este modo:', en: 'You should practice in this mode:' },
  goPractice: { es: 'Ir a practicar', en: 'Go practice' },

  remindersTitle: { es: 'Recuerda también', en: 'Also remember' },
  reminderContinuous: {
    es: 'Mantener residencia continua: evita viajes largos que rompan el periodo de {months} meses.',
    en: 'Keep continuous residence: avoid long trips that break the {months}-month period.',
  },
  reminderPhysical: {
    es: 'Tener al menos {months} meses de presencia física en EE. UU.',
    en: 'Have at least {months} months of physical presence in the U.S.',
  },
  reminderMoral: {
    es: 'Demostrar buen carácter moral y estar al día con tus impuestos.',
    en: 'Show good moral character and be current on your taxes.',
  },
  legalDisclaimer: {
    es: 'Esta herramienta es orientativa y no es asesoría legal. Confirma tu caso en uscis.gov o con un abogado.',
    en: 'This tool is informational and not legal advice. Confirm your case at uscis.gov or with an attorney.',
  },

  mode_standard2025: { es: 'Examen 2025 (20 preguntas)', en: '2025 test (20 questions)' },
  mode_mode6520: { es: 'Examen 65/20 (10 preguntas)', en: '65/20 test (10 questions)' },
  mode_standard2008: { es: 'Examen 2008 (10 preguntas)', en: '2008 test (10 questions)' },

  // ===== Asistente IA =====
  assistant: { es: 'Asistente', en: 'Assistant' },
  assistantDesc: {
    es: 'Pregunta tus dudas sobre la ciudadanía y el examen',
    en: 'Ask your questions about citizenship and the test',
  },
  assistantIntro: {
    es: 'Hola 👋 Soy tu asistente. Pregúntame sobre el examen de civismo, las exenciones, o el proceso de ciudadanía.',
    en: "Hi 👋 I'm your assistant. Ask me about the civics test, exemptions, or the citizenship process.",
  },
  askPlaceholder: { es: 'Escribe tu pregunta…', en: 'Type your question…' },
  send: { es: 'Enviar', en: 'Send' },
  searchWeb: { es: 'Buscar en internet (datos actuales)', en: 'Search the web (current data)' },
  thinking: { es: 'Pensando…', en: 'Thinking…' },
  clearChat: { es: 'Borrar conversación', en: 'Clear conversation' },
  suggestionsTitle: { es: 'Preguntas frecuentes', en: 'Common questions' },
  sug1: { es: '¿Quién es el presidente actual?', en: 'Who is the current president?' },
  sug2: { es: '¿Qué es la exención 55/15?', en: 'What is the 55/15 exemption?' },
  sug3: { es: '¿Cuántas preguntas tiene el examen 2025?', en: 'How many questions are on the 2025 test?' },
  sug4: { es: '¿Qué documentos necesito para el N-400?', en: 'What documents do I need for the N-400?' },
  assistantNotConfiguredTitle: { es: 'Asistente no configurado', en: 'Assistant not configured' },
  assistantNotConfiguredBody: {
    es: 'Para activar el asistente con IA, agrega tu clave OPENROUTER_API_KEY en el archivo .env.local. Mientras tanto, Estudiar y Examen funcionan sin conexión.',
    en: 'To enable the AI assistant, add your OPENROUTER_API_KEY to the .env.local file. In the meantime, Study and Test work offline.',
  },
  assistantDisclaimer: {
    es: 'El asistente puede equivocarse y no es asesoría legal. Confirma siempre en uscis.gov.',
    en: 'The assistant can make mistakes and is not legal advice. Always confirm at uscis.gov.',
  },

  // ===== Plan de estudio =====
  studyPlan: { es: 'Plan de estudio', en: 'Study plan' },
  studyPlanDesc: {
    es: 'Un plan semana a semana, hecho a tu medida',
    en: 'A week-by-week plan, tailored to you',
  },
  planWeeksLabel: { es: '¿En cuántas semanas?', en: 'In how many weeks?' },
  planDeckLabel: { es: '¿Qué vas a estudiar?', en: 'What will you study?' },
  weeksValue: { es: '{n} semanas', en: '{n} weeks' },
  planForDate: { es: '📅 Para tu N-400 del {date}', en: '📅 For your N-400 on {date}' },
  planSuggested: { es: 'Sugerido por tu perfil', en: 'Suggested by your profile' },
  noProfileHint: {
    es: 'Consejo: completa Elegibilidad y personalizamos tu plan automáticamente.',
    en: 'Tip: complete Eligibility and we tailor your plan automatically.',
  },
  weekTitle: { es: 'Semana {n}', en: 'Week {n}' },
  planKindLearn: { es: 'Aprender', en: 'Learn' },
  planKindSimulacros: { es: 'Simulacros de examen', en: 'Practice tests' },
  planKindReview: { es: 'Repaso final y entrevista', en: 'Final review and interview' },
  questionsCount: { es: '{n} preguntas', en: '{n} questions' },
  studyThisWeek: { es: 'Estudiar esta semana', en: 'Study this week' },
  doExam: { es: 'Hacer simulacro', en: 'Take a practice test' },
  markDone: { es: 'Marcar como hecha', en: 'Mark as done' },
  weekDone: { es: 'Hecha ✓', en: 'Done ✓' },
  planProgress: { es: '{done} de {total} semanas hechas', en: '{done} of {total} weeks done' },
  dailyRoutineTitle: { es: 'Rutina diaria sugerida (30–45 min)', en: 'Suggested daily routine (30–45 min)' },
  routine1: { es: '5 min — repasar tarjetas de días anteriores.', en: '5 min — review cards from previous days.' },
  routine2: {
    es: '20–25 min — estudiar preguntas nuevas (leer, escuchar, repetir en voz alta).',
    en: '20–25 min — study new questions (read, listen, repeat aloud).',
  },
  routine3: {
    es: '10–15 min — ronda de preguntas mezcladas o un simulacro corto.',
    en: '10–15 min — a round of mixed questions or a short practice test.',
  },
  reviewWeekTip: {
    es: 'Repasa tus preguntas más difíciles y ensaya la entrevista en voz alta (con intérprete si aplica).',
    en: 'Review your hardest questions and rehearse the interview aloud (with an interpreter if applicable).',
  },

  // ===== Autenticación =====
  signInTitle: { es: 'Iniciar sesión', en: 'Sign in' },
  signUpTitle: { es: 'Crear cuenta', en: 'Create account' },
  emailLabel: { es: 'Correo electrónico', en: 'Email' },
  passwordLabel: { es: 'Contraseña', en: 'Password' },
  signInBtn: { es: 'Entrar', en: 'Sign in' },
  signUpBtn: { es: 'Crear mi cuenta', en: 'Create my account' },
  noAccount: { es: '¿No tienes cuenta? Regístrate', en: "Don't have an account? Sign up" },
  haveAccount: { es: '¿Ya tienes cuenta? Inicia sesión', en: 'Already have an account? Sign in' },
  authProcessing: { es: 'Un momento…', en: 'One moment…' },
  checkEmail: {
    es: 'Te enviamos un correo para confirmar tu cuenta. Revísalo y luego inicia sesión.',
    en: 'We sent you an email to confirm your account. Check it and then sign in.',
  },
  signOut: { es: 'Salir', en: 'Sign out' },
  loadingProgress: { es: 'Cargando tu progreso…', en: 'Loading your progress…' },
  authNotConfiguredTitle: { es: 'Supabase no configurado', en: 'Supabase not configured' },
  authNotConfiguredBody: {
    es: 'Falta configurar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local para activar las cuentas.',
    en: 'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local to enable accounts.',
  },
  loginWelcome: {
    es: 'Inicia sesión para guardar tu progreso en la nube.',
    en: 'Sign in to save your progress in the cloud.',
  },

  // ===== Proceso N-400 =====
  process: { es: 'Proceso N-400', en: 'N-400 process' },
  processDesc: { es: 'Los pasos para hacerte ciudadano, explicados', en: 'The steps to become a citizen, explained' },
  processIntro: {
    es: 'Estos son los pasos típicos de la naturalización. Es una guía orientativa; confirma tu caso en uscis.gov.',
    en: 'These are the typical naturalization steps. This is a guide; confirm your case at uscis.gov.',
  },
  stepLabel: { es: 'Paso {n}', en: 'Step {n}' },
  timelineTitle: { es: '⏱️ ¿Cuánto tarda?', en: '⏱️ How long does it take?' },
  timelineBody: {
    es: 'Desde que envías el N-400 hasta el juramento suele tomar entre 8 y 18 meses, según la oficina y la carga de trabajo.',
    en: 'From submitting the N-400 to the oath usually takes 8 to 18 months, depending on the office and workload.',
  },
  checklistTitle: { es: '📄 Lista de documentos', en: '📄 Document checklist' },
  checklistDesc: { es: 'Marca lo que ya tienes listo. Se guarda solo.', en: 'Check off what you have ready. It saves automatically.' },
  checklistProgress: { es: '{done} de {total} listos', en: '{done} of {total} ready' },
} as const

export type UIKey = keyof typeof UI_TEXT

/** Traduce una clave con interpolación simple de {var}. */
export function t(key: UIKey, lang: Lang, vars?: Record<string, string | number>): string {
  let s: string = UI_TEXT[key][lang]
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
    }
  }
  return s
}
