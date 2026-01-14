'use server'

export async function sendNotification(reserva: any) {
  // Tópico único para tu barbería (basado en tu número)
  const topic = 'the_stylo_cave_reservations_941554701'; 
  
  const message = `
🆕 ¡NUEVA RESERVA!
👤 Cliente: ${reserva.nombre}
📱 Teléfono: ${reserva.telefono}
✂️ Servicio: ${reserva.servicio}
📅 Fecha: ${reserva.fecha}
⏰ Hora: ${reserva.hora}
💰 Monto reserva: S/. ${reserva.montoPagado}
`.trim();

  try {
    await fetch(`https://ntfy.sh/${topic}`, {
      method: 'POST',
      body: message,
      headers: {
        'Title': 'Nueva Cita en The Stylo Cave',
        'Priority': 'high',
        'Tags': 'haircut,calendar'
      }
    });
    return { success: true };
  } catch (error) {
    console.error('Error enviando notificación:', error);
    return { success: false };
  }
}
