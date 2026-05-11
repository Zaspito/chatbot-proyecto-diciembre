const chat = document.getElementById('chat');
const formulario = document.getElementById('formulario');
const input = document.getElementById('mensaje');
const chips = document.querySelectorAll('.chips button');
const borrar = document.getElementById('borrar');

const CLAVE_HISTORIAL = 'hotelCostaAzulChat';

const respuestas = {
  saludo: 'Hola, bienvenido al Hotel Costa Azul. Soy Marina, la asistente virtual del hotel. Puedo ayudarte con horarios, servicios, habitaciones, recomendaciones locales o pasarte con recepci\u00f3n. \u00bfEn qu\u00e9 puedo ayudarte?',
  horarios: 'Estos son nuestros horarios principales:\n\n- Check-in: desde las 15:00.\n- Check-out: hasta las 12:00.\n- Desayuno buffet: de 7:30 a 10:30.\n- Restaurante Mediterr\u00e1neo: comidas de 13:00 a 16:00 y cenas de 20:00 a 23:00.\n- Piscina exterior: de 10:00 a 20:00.\n\nSi tienes una llegada tard\u00eda, recepci\u00f3n est\u00e1 disponible las 24 horas.',
  servicios: 'El hotel cuenta con wifi gratuito, parking privado de pago, piscina exterior, spa, gimnasio, restaurante, bar terraza, recepci\u00f3n 24 horas y servicio de habitaciones.\n\nEl parking tiene un coste orientativo de 14 \u20ac por noche y se recomienda reservar plaza en temporada alta. Las mascotas se aceptan bajo petici\u00f3n previa, con suplemento y disponibilidad limitada.',
  habitaciones: 'Disponemos de varias opciones de alojamiento:\n\n- Habitaci\u00f3n est\u00e1ndar: para 1 o 2 personas. Puede contratarse con solo alojamiento o con desayuno.\n- Habitaci\u00f3n familiar: para hasta 4 personas. Recomendada para familias o estancias largas.\n- Suite vista mar: para 2 personas, con zona de estar y terraza.\n\nLos precios dependen de la fecha y la ocupaci\u00f3n. Como referencia, la est\u00e1ndar suele ser la opci\u00f3n m\u00e1s econ\u00f3mica y la suite la m\u00e1s completa. La cancelaci\u00f3n es gratuita hasta 48 horas antes de la llegada en tarifa flexible; las tarifas no reembolsables no admiten devoluci\u00f3n. Para consultar disponibilidad real, indica fechas, n\u00famero de personas y tipo de habitaci\u00f3n.',
  recomendaciones: 'Cerca del hotel puedes disfrutar de varias opciones:\n\nLugares para visitar:\n- Paseo Mar\u00edtimo Costa Azul, perfecto para caminar al atardecer.\n- Mirador del Faro, con vistas a la costa.\n- Casco antiguo y mercado local, ideal para una visita tranquila.\n\nPlanes y restaurantes:\n- Ruta por la playa y chiringuitos cercanos.\n- Cena de arroces y pescado en restaurantes del paseo.\n- Excursi\u00f3n corta en barco o alquiler de paddle surf si el tiempo acompa\u00f1a.\n\nPara esta tarde, recomendar\u00eda paseo por la playa, visita al mirador y cena cerca del puerto.',
  recepcion: 'Perfecto, te paso con recepci\u00f3n.\n\nUn recepcionista te contestar\u00e1 por el chat en unos minutos. Si lo prefieres, puedes llamar al +34 965 123 456 o escribir a recepcion@hotelcostazul.es.',
  error: 'Lo siento, no he entendido bien tu pregunta. Puedes probar con una de estas opciones:\n\n- Preguntar por servicios del hotel.\n- Ver horarios.\n- Consultar habitaciones.\n- Pedir recomendaciones.\n- Hablar con recepci\u00f3n.'
};

const grupos = {
  saludo: ['hola', 'buenos dias', 'buenas tardes', 'buenas noches', 'saludos'],
  horarios: ['horario', 'hora', 'check in', 'check-in', 'entrada', 'check out', 'check-out', 'salida', 'desayuno', 'restaurante', 'comida', 'cena', 'abrir', 'cierra'],
  servicios: ['servicio', 'wifi', 'wi-fi', 'internet', 'parking', 'aparcamiento', 'piscina', 'spa', 'gimnasio', 'mascota', 'perro', 'gato', 'bar', 'terraza'],
  habitaciones: ['habitacion', 'habitaciones', 'suite', 'familiar', 'estandar', 'doble', 'reserva', 'reservar', 'disponibilidad', 'precio', 'precios', 'coste', 'cancelacion', 'capacidad', 'personas', 'desayuno incluido'],
  recomendaciones: ['recomendacion', 'recomendaciones', 'que hacer', 'hacer por la tarde', 'actividad', 'actividades', 'turismo', 'visitar', 'cerca', 'playa', 'ruta', 'cenar', 'restaurante cerca', 'mirador', 'paseo'],
  recepcion: ['recepcion', 'persona', 'humano', 'recepcionista', 'contacto', 'telefono', 'llamar', 'ayuda inmediata', 'urgente']
};

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectarIntencion(texto) {
  const limpio = normalizar(texto);

  for (const [intencion, palabras] of Object.entries(grupos)) {
    if (palabras.some(palabra => limpio.includes(normalizar(palabra)))) {
      return intencion;
    }
  }

  return 'error';
}

function obtenerRespuesta(texto) {
  const intencion = detectarIntencion(texto);
  return respuestas[intencion] || respuestas.error;
}

function crearMensaje(texto, tipo) {
  const bloque = document.createElement('div');
  bloque.className = `mensaje ${tipo}`;
  bloque.textContent = texto;
  chat.appendChild(bloque);
  chat.scrollTop = chat.scrollHeight;
}

function leerHistorial() {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE_HISTORIAL)) || [];
  } catch {
    return [];
  }
}

function guardarMensaje(texto, tipo) {
  const historial = leerHistorial();
  historial.push({ texto, tipo });
  sessionStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(historial));
}

function enviarMensaje(texto, tipo) {
  crearMensaje(texto, tipo);
  guardarMensaje(texto, tipo);
}

function responderAlUsuario(texto) {
  enviarMensaje(texto, 'usuario');
  setTimeout(() => enviarMensaje(obtenerRespuesta(texto), 'bot'), 260);
}

function cargarChat() {
  const historial = leerHistorial();

  if (historial.length === 0) {
    enviarMensaje(respuestas.saludo, 'bot');
    return;
  }

  historial.forEach(m => crearMensaje(m.texto, m.tipo));
}

formulario.addEventListener('submit', evento => {
  evento.preventDefault();
  const texto = input.value.trim();
  if (!texto) return;
  input.value = '';
  responderAlUsuario(texto);
});

chips.forEach(chip => {
  chip.addEventListener('click', () => responderAlUsuario(chip.dataset.text));
});

borrar.addEventListener('click', () => {
  sessionStorage.removeItem(CLAVE_HISTORIAL);
  chat.innerHTML = '';
  enviarMensaje(respuestas.saludo, 'bot');
});

cargarChat();
