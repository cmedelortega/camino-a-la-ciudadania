/**
 * Guía del proceso de naturalización (Formulario N-400).
 * Contenido orientativo (no asesoría legal). Verifica todo en uscis.gov.
 * El inglés y el español son equivalentes para mostrar según el idioma elegido.
 */

export interface ProcessStep {
  id: number
  icon: string
  titleEs: string
  titleEn: string
  descEs: string
  descEn: string
  /** Puntos clave (viñetas). */
  bulletsEs: string[]
  bulletsEn: string[]
  /** Tiempo estimado de esta fase. */
  timeEs?: string
  timeEn?: string
  /** Enlace interno a otro módulo de la app. */
  link?: { href: string; labelEs: string; labelEn: string }
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 1,
    icon: '✅',
    titleEs: 'Verifica que cumples los requisitos',
    titleEn: 'Confirm you meet the requirements',
    descEs: 'Antes de aplicar, asegúrate de cumplir el tiempo como residente y las demás condiciones.',
    descEn: 'Before applying, make sure you meet the residency time and the other conditions.',
    bulletsEs: [
      'Tener Green Card por 5 años (o 3 si estás casado/a con ciudadano).',
      'Residencia continua y presencia física suficiente.',
      'Buen carácter moral y estar al día con impuestos.',
      'Tener 18 años o más.',
    ],
    bulletsEn: [
      'Hold a Green Card for 5 years (or 3 if married to a citizen).',
      'Continuous residence and enough physical presence.',
      'Good moral character and current on taxes.',
      'Be 18 or older.',
    ],
    link: { href: '/elegibilidad', labelEs: 'Revisar mi elegibilidad', labelEn: 'Check my eligibility' },
  },
  {
    id: 2,
    icon: '📄',
    titleEs: 'Reúne tus documentos',
    titleEn: 'Gather your documents',
    descEs: 'Junta la información que te pedirán para llenar el formulario y para la entrevista.',
    descEn: "Collect the information you'll need to complete the form and for the interview.",
    bulletsEs: [
      'Tu Green Card e identificación.',
      'Direcciones y empleos de los últimos años.',
      'Fechas de todos tus viajes fuera de EE. UU.',
      'Declaraciones de impuestos y, si aplica, actas de matrimonio/divorcio.',
    ],
    bulletsEn: [
      'Your Green Card and ID.',
      'Addresses and jobs from recent years.',
      'Dates of all your trips outside the U.S.',
      'Tax returns and, if applicable, marriage/divorce certificates.',
    ],
    link: { href: '#checklist', labelEs: 'Ver mi lista de documentos', labelEn: 'See my document checklist' },
  },
  {
    id: 3,
    icon: '📝',
    titleEs: 'Completa y envía el Formulario N-400',
    titleEn: 'Complete and submit Form N-400',
    descEs: 'Puedes hacerlo en línea (recomendado) o en papel, y pagar la tarifa correspondiente.',
    descEn: 'You can do it online (recommended) or on paper, and pay the corresponding fee.',
    bulletsEs: [
      'Crea tu cuenta en my.uscis.gov para aplicar en línea.',
      'Revisa la tarifa vigente del N-400 en uscis.gov (cambia con el tiempo).',
      'Puedes pedir una exención de pago si calificas.',
      'Guarda tu número de recibo: con él rastreas tu caso.',
    ],
    bulletsEn: [
      'Create your account at my.uscis.gov to apply online.',
      'Check the current N-400 fee at uscis.gov (it changes over time).',
      'You may request a fee waiver if you qualify.',
      'Save your receipt number: use it to track your case.',
    ],
  },
  {
    id: 4,
    icon: '🖐️',
    titleEs: 'Cita de biometría',
    titleEn: 'Biometrics appointment',
    descEs: 'USCIS te cita para tomar tus huellas, foto y firma (verificación de antecedentes).',
    descEn: 'USCIS schedules you to take your fingerprints, photo, and signature (background check).',
    bulletsEs: [
      'Recibirás una carta con la fecha, hora y lugar.',
      'Lleva tu carta de cita y tu Green Card.',
      'Suele ser una visita corta.',
    ],
    bulletsEn: [
      'You will get a letter with the date, time, and place.',
      'Bring your appointment letter and your Green Card.',
      'It is usually a short visit.',
    ],
    timeEs: 'Normalmente unas semanas después de aplicar.',
    timeEn: 'Usually a few weeks after applying.',
  },
  {
    id: 5,
    icon: '🗣️',
    titleEs: 'Entrevista con USCIS',
    titleEn: 'Interview with USCIS',
    descEs: 'Un oficial revisa tu solicitud y te hace el examen de inglés y de civismo.',
    descEn: 'An officer reviews your application and gives you the English and civics tests.',
    bulletsEs: [
      'Lleva tu carta de cita, Green Card e identificación.',
      'Te harán preguntas sobre tu solicitud.',
      'Examen de civismo (y de inglés, salvo que estés exento por edad/tiempo).',
      'Si estás exento del inglés, puedes llevar tu intérprete.',
    ],
    bulletsEn: [
      'Bring your appointment letter, Green Card, and ID.',
      'They will ask questions about your application.',
      'Civics test (and English, unless you are exempt by age/time).',
      'If exempt from English, you may bring your interpreter.',
    ],
    link: { href: '/examen', labelEs: 'Practicar el examen', labelEn: 'Practice the test' },
  },
  {
    id: 6,
    icon: '📬',
    titleEs: 'Recibe la decisión',
    titleEn: 'Receive the decision',
    descEs: 'Después de la entrevista, USCIS te dice si fue aprobada, continuada o negada.',
    descEn: 'After the interview, USCIS tells you if it was granted, continued, or denied.',
    bulletsEs: [
      'Aprobada: pasas a la ceremonia del juramento.',
      'Continuada: puede que necesiten más documentos o repetir una parte del examen.',
      'Negada: puedes apelar o volver a aplicar más adelante.',
    ],
    bulletsEn: [
      'Granted: you move on to the oath ceremony.',
      'Continued: they may need more documents or a retest of part of the exam.',
      'Denied: you can appeal or reapply later.',
    ],
  },
  {
    id: 7,
    icon: '🎉',
    titleEs: 'Ceremonia del Juramento de Lealtad',
    titleEn: 'Oath of Allegiance ceremony',
    descEs: 'Tomas el Juramento de Lealtad y recibes tu Certificado de Naturalización: ¡ya eres ciudadano!',
    descEn: 'You take the Oath of Allegiance and receive your Certificate of Naturalization: you are now a citizen!',
    bulletsEs: [
      'Recibirás la fecha de tu ceremonia.',
      'Entregas tu Green Card y recibes tu certificado.',
      'Después puedes tramitar pasaporte y registrarte para votar.',
    ],
    bulletsEn: [
      'You will get your ceremony date.',
      'You turn in your Green Card and receive your certificate.',
      'Afterward you can get a passport and register to vote.',
    ],
  },
]

export interface ChecklistItem {
  id: string
  labelEs: string
  labelEn: string
}

export const DOCUMENTS_CHECKLIST: ChecklistItem[] = [
  { id: 'greencard', labelEs: 'Green Card (tarjeta de residente permanente)', labelEn: 'Green Card (permanent resident card)' },
  { id: 'id', labelEs: 'Identificación con foto (licencia o pasaporte)', labelEn: 'Photo ID (license or passport)' },
  { id: 'addresses', labelEs: 'Direcciones de los últimos 5 años (o 3)', labelEn: 'Addresses for the last 5 years (or 3)' },
  { id: 'jobs', labelEs: 'Historial de empleos y escuelas', labelEn: 'Work and school history' },
  { id: 'trips', labelEs: 'Fechas de todos los viajes fuera de EE. UU.', labelEn: 'Dates of all trips outside the U.S.' },
  { id: 'taxes', labelEs: 'Declaraciones de impuestos', labelEn: 'Tax returns' },
  { id: 'marriage', labelEs: 'Acta de matrimonio/divorcio (si aplica)', labelEn: 'Marriage/divorce certificate (if applicable)' },
  { id: 'spouse', labelEs: 'Datos del cónyuge ciudadano (regla de 3 años)', labelEn: "Citizen spouse's info (3-year rule)" },
  { id: 'selective', labelEs: 'Registro del Servicio Selectivo (hombres 18–26)', labelEn: 'Selective Service registration (men 18–26)' },
  { id: 'legal', labelEs: 'Documentos de arrestos o cortes (si aplica)', labelEn: 'Arrest or court documents (if applicable)' },
]
