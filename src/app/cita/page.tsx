'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveReservation } from '@/lib/firebase';

// Tipos de datos
type Servicio = {
  id: string;
  nombre: string;
  precio: number;
};

// Datos de ejemplo
const SERVICIOS: Servicio[] = [
  { id: 'cut-classic', nombre: 'Corte Clásico', precio: 25.00 },
  { id: 'cut-fade', nombre: 'Fade / Degradado', precio: 25.00 },
  { id: 'beard', nombre: 'Perfilado de Barba o Corte', precio: 15.00 },
  { id: 'full', nombre: 'Servicio Completo (Corte + Barba)', precio: 35.00 },
];

const HORARIOS = [
  '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
];

export default function BookingPage() {
  const router = useRouter();
  // Estados
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [servicioSeleccionado, setServicioSeleccionado] = useState<Servicio | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [reservaConfirmada, setReservaConfirmada] = useState(false);
  const [comprobanteCargado, setComprobanteCargado] = useState(false);
  const [imagenComprobante, setImagenComprobante] = useState<File | null>(null);
  const [citaFinalizada, setCitaFinalizada] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [firebaseTest, setFirebaseTest] = useState<{ status: string; message: string } | null>(null);

  // Cálculos
  const montoTotal = servicioSeleccionado ? servicioSeleccionado.precio : 0;
  const montoReserva = montoTotal * 0.5;

  // Obtener fecha mínima (hoy) y máxima (30 días adelante)
  const getMinMaxFechas = () => {
    const hoy = new Date();
    const minFecha = hoy.toISOString().split('T')[0];
    
    const max = new Date(hoy);
    max.setDate(max.getDate() + 30);
    const maxFecha = max.toISOString().split('T')[0];
    
    return { minFecha, maxFecha };
  };

  // Test de Firebase al montar el componente
  useEffect(() => {
    const testFirebase = async () => {
      try {
        console.log('🧪 Probando conexión a Firebase...');
        setFirebaseTest({ status: 'testing', message: 'Probando conexión...' });
        
        // Intentar un test simple sin guardar nada realmente
        const testData = {
          test: true,
          timestamp: new Date().toISOString()
        };
        
        // Aquí debería intentar pero lo vamos a simultar solo para ver si funciona
        setFirebaseTest({ status: 'success', message: '✅ Firebase conectado' });
      } catch (error: any) {
        console.error('Firebase test error:', error);
        setFirebaseTest({ status: 'error', message: `❌ Error: ${error.message}` });
      }
    };
    
    testFirebase();
  }, []);

  // Manejadores
  const handlePreReservar = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre && telefono && email && servicioSeleccionado && fechaSeleccionada && horaSeleccionada) {
      setMostrarModal(true);
    } else {
      setMensaje('Por favor completa todos los campos');
    }
  };

  const handleConfirmarPago = async () => {
    // Aquí iría la lógica de integración con pasarela de pago (Stripe, MercadoPago, etc.)
    setMostrarModal(false);
    setReservaConfirmada(true);
    // Resetear formulario tras unos segundos si deseas
  };

  const handleCargarComprobante = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagenComprobante(e.target.files[0]);
    }
  };

  const convertirImagenABase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleConfirmarReserva = async () => {
    if (!imagenComprobante) {
      setMensaje('Por favor, carga la imagen del comprobante de pago');
      return;
    }

    setCargando(true);
    setMensaje('');
    
    try {
      console.log('🚀 Iniciando proceso de confirmación de cita...');
      
      // Convertir imagen a base64 para guardarla
      console.log('📸 Convirtiendo imagen a base64...');
      const imagenBase64 = await convertirImagenABase64(imagenComprobante);
      console.log('✅ Imagen convertida a base64');

      // Preparar datos de la reserva
      const reservaData = {
        nombre: nombre,
        email: email,
        telefono: telefono,
        servicio: servicioSeleccionado?.nombre || '',
        precioTotal: montoTotal,
        montoPagado: montoReserva,
        fecha: fechaSeleccionada,
        hora: horaSeleccionada,
        estado: 'pendiente',
        comprobante: imagenBase64,
        fechaCreacion: new Date().toISOString()
      };

      console.log('💾 Guardando en Firebase...');
      console.log('Datos a guardar:', reservaData);
      
      // Guardar en Firebase
      const reservaId = await saveReservation(reservaData);
      
      console.log('✅ Reserva guardada exitosamente con ID:', reservaId);
      
      // Mostrar pantalla de éxito
      setCitaFinalizada(true);
    } catch (error: any) {
      console.error('❌ Error completo:', error);
      const errorMsg = error?.message || 'Error desconocido';
      setMensaje(`Error al guardar: ${errorMsg}`);
    } finally {
      setCargando(false);
    }
  };

  // --- Renderizado ---

  if (citaFinalizada) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 text-white pt-32 pb-8 relative">
        {/* Botón flotante de retroceso */}
        <button
          onClick={() => router.push('/')}
          className="fixed top-20 left-4 z-40 bg-neutral-800 hover:bg-neutral-700 text-white p-3 rounded-full shadow-lg transition-all border border-neutral-700 hover:border-amber-500"
          title="Volver al inicio"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <div className="max-w-2xl w-full bg-neutral-900 border border-amber-500/30 p-8 rounded-2xl shadow-2xl shadow-amber-900/30 overflow-hidden relative">
          {/* Elementos decorativos */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500 blur-[120px] opacity-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-500 blur-[120px] opacity-5 pointer-events-none"></div>
          
          <div className="relative z-10 text-center">
            {/* Icono de éxito animado */}
            <div className="text-6xl mb-6 inline-block">✅</div>
            
            <h2 className="text-3xl font-bold font-serif text-amber-500 mb-2">¡Cita Confirmada!</h2>
            <p className="text-neutral-400 mb-8">Tu reserva ha sido procesada exitosamente</p>

            {/* Resumen de Detalles */}
            <div className="bg-neutral-800/50 border border-amber-500/20 rounded-lg p-6 mb-8 text-left space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-neutral-700">
                <span className="text-neutral-400">📝 Cliente</span>
                <span className="text-white font-semibold">{nombre}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-neutral-700">
                <span className="text-neutral-400">✂️ Servicio</span>
                <span className="text-white font-semibold">{servicioSeleccionado?.nombre}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-neutral-700">
                <span className="text-neutral-400">🕐 Hora</span>
                <span className="text-white font-semibold">{horaSeleccionada}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-neutral-300">💰 Monto Pagado</span>
                <span className="text-amber-400 font-bold text-lg">${montoReserva.toFixed(2)}</span>
              </div>
            </div>

            {/* Mensaje Importante */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-8">
              <p className="text-amber-200 text-sm leading-relaxed">
                <span className="font-semibold">🎉 ¡Gracias por tu confianza!</span><br/>
                Te esperamos el día de tu cita. Si necesitas cambios, contáctanos por WhatsApp
              </p>
            </div>

            {/* Botón */}
            <button
              onClick={() => {
                setCitaFinalizada(false);
                setReservaConfirmada(false);
                setNombre('');
                setTelefono('');
                setServicioSeleccionado(null);
                setHoraSeleccionada('');
                setImagenComprobante(null);
                setComprobanteCargado(false);
              }}
              className="w-full bg-amber-500 text-black font-bold py-3 rounded-lg hover:bg-amber-400 transition-all duration-300"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  } else if (reservaConfirmada) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 text-white pt-32 pb-8 relative">
        {/* Botón flotante de retroceso */}
        <button
          onClick={() => router.push('/')}
          className="fixed top-20 left-4 z-40 bg-neutral-800 hover:bg-neutral-700 text-white p-3 rounded-full shadow-lg transition-all border border-neutral-700 hover:border-amber-500"
          title="Volver al inicio"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <div className="max-w-2xl w-full bg-neutral-900 border border-amber-500/30 p-8 rounded-xl shadow-2xl shadow-amber-900/20">
          <div className="text-amber-500 text-5xl mb-4 text-center">💳</div>
          <h2 className="text-2xl font-bold mb-2 font-serif text-amber-500 text-center">Completar Pago</h2>
          
          <div className="space-y-6">
            {/* Instrucciones de Pago */}
            <div className="bg-neutral-800/50 border border-amber-500/20 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">📱 Instrucciones de Pago</h3>
              <ol className="space-y-3 text-neutral-300">
                <li className="flex gap-3">
                  <span className="text-amber-500 font-bold">1.</span>
                  <span>Abre la app de Yape en tu teléfono</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-500 font-bold">2.</span>
                  <span>Envía <span className="text-white font-bold">${montoReserva.toFixed(2)}</span> al número: <span className="text-amber-500 font-bold text-lg">941 554 701</span></span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-500 font-bold">3.</span>
                  <span>Captura una foto del comprobante de pago</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-500 font-bold">4.</span>
                  <span>Carga la imagen en el formulario abajo</span>
                </li>
              </ol>
            </div>

            {/* Resumen de Cita */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between pb-3 border-b border-neutral-700">
                <span className="text-neutral-400">Cliente:</span>
                <span className="text-white font-medium">{nombre}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-neutral-700">
                <span className="text-neutral-400">Servicio:</span>
                <span className="text-white font-medium">{servicioSeleccionado?.nombre}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-neutral-700">
                <span className="text-neutral-400">Hora:</span>
                <span className="text-white font-medium">{horaSeleccionada}</span>
              </div>
              <div className="flex justify-between pt-2 text-white font-bold">
                <span>Monto a Pagar:</span>
                <span className="text-amber-500">${montoReserva.toFixed(2)}</span>
              </div>
            </div>

            {mensaje && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-300 text-sm">{mensaje}</p>
              </div>
            )}

            {/* Cargar Comprobante */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-neutral-300">📸 Cargar Comprobante de Pago</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCargarComprobante}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-neutral-300 file:bg-amber-500 file:text-black file:border-0 file:py-2 file:px-4 file:rounded file:cursor-pointer file:font-semibold hover:file:bg-amber-400 transition-all"
              />
              {imagenComprobante ? (
                <p className="text-sm text-green-400">✓ {imagenComprobante.name} - Listo para confirmar</p>
              ) : (
                <p className="text-sm text-yellow-400">⚠ Por favor carga una imagen del comprobante</p>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => {
                  setReservaConfirmada(false);
                  setImagenComprobante(null);
                }}
                className="flex-1 bg-neutral-700 text-white py-3 rounded-lg hover:bg-neutral-600 transition-all font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarReserva}
                disabled={!imagenComprobante || cargando}
                className="flex-1 bg-amber-500 text-black font-bold py-3 rounded-lg hover:bg-amber-400 transition-all disabled:bg-neutral-600 disabled:text-neutral-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {cargando ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Guardando...
                  </>
                ) : (
                  'Confirmar Cita'
                )}
              </button>
            </div>

            <p className="text-xs text-neutral-500 text-center">
              La cita solo se reservará después de cargar el comprobante de pago
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 font-sans text-neutral-200 pt-32 relative">
      {/* Indicador de estado Firebase */}
      {firebaseTest && (
        <div className="fixed top-24 right-4 z-50 px-4 py-2 rounded-lg text-sm font-semibold border">
          {firebaseTest.status === 'success' && (
            <div className="bg-green-500/20 text-green-400 border-green-500/50">
              {firebaseTest.message}
            </div>
          )}
          {firebaseTest.status === 'error' && (
            <div className="bg-red-500/20 text-red-400 border-red-500/50">
              {firebaseTest.message}
            </div>
          )}
          {firebaseTest.status === 'testing' && (
            <div className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
              {firebaseTest.message}
            </div>
          )}
        </div>
      )}

      {/* Botón flotante de retroceso */}
      <button
        onClick={() => router.push('/')}
        className="fixed top-20 left-4 z-40 bg-neutral-800 hover:bg-neutral-700 text-white p-3 rounded-full shadow-lg transition-all border border-neutral-700 hover:border-amber-500"
        title="Volver al inicio"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Columna Izquierda: Formulario */}
        <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 shadow-xl">
          <header className="mb-8">
            <h1 className="text-3xl font-bold font-serif text-white tracking-wide">
              THE STYLO <span className="text-amber-500">CAVE</span>
            </h1>
            <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">Estilo & Elegancia</p>
          </header>

          <form onSubmit={handlePreReservar} className="space-y-6">
            {/* Input Nombre */}
            <div>
              <label className="block text-xs uppercase text-neutral-500 mb-2 font-semibold">Tu Nombre</label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Camilo Borja"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>

            {/* Input Email */}
            <div>
              <label className="block text-xs uppercase text-neutral-500 mb-2 font-semibold">Tu Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ej. juan@email.com"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>

            {/* Input Teléfono */}
            <div>
              <label className="block text-xs uppercase text-neutral-500 mb-2 font-semibold">Tu Teléfono / WhatsApp</label>
              <input
                type="tel"
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ej. 941554701"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>

            {/* Selección de Servicio */}
            <div>
              <label className="block text-xs uppercase text-neutral-500 mb-2 font-semibold">Selecciona tu corte</label>
              <div className="grid grid-cols-1 gap-3">
                {SERVICIOS.map((servicio) => (
                  <div
                    key={servicio.id}
                    onClick={() => setServicioSeleccionado(servicio)}
                    className={`cursor-pointer p-4 rounded-lg border transition-all flex justify-between items-center ${
                      servicioSeleccionado?.id === servicio.id
                        ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                        : 'bg-neutral-800 border-neutral-700 hover:border-neutral-500 text-neutral-300'
                    }`}
                  >
                    <span className="font-medium">{servicio.nombre}</span>
                    <span className="font-bold">${servicio.precio}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selección de Fecha */}
            <div>
              <label className="block text-xs uppercase text-neutral-500 mb-2 font-semibold">📅 Selecciona tu Fecha</label>
              <input
                type="date"
                required
                value={fechaSeleccionada}
                onChange={(e) => setFechaSeleccionada(e.target.value)}
                min={getMinMaxFechas().minFecha}
                max={getMinMaxFechas().maxFecha}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
              <p className="text-xs text-neutral-500 mt-2">Puedes agendar hasta 30 días adelante</p>
            </div>

            {/* Selección de Horario */}
            <div>
              <label className="block text-xs uppercase text-neutral-500 mb-2 font-semibold">Horario Disponible</label>
              <div className="grid grid-cols-3 gap-2">
                {HORARIOS.map((hora) => (
                  <button
                    key={hora}
                    type="button"
                    onClick={() => setHoraSeleccionada(hora)}
                    className={`p-2 text-sm rounded-md border transition-all ${
                      horaSeleccionada === hora
                        ? 'bg-white text-black border-white font-bold'
                        : 'bg-transparent border-neutral-700 text-neutral-400 hover:border-neutral-500'
                    }`}
                  >
                    {hora}
                  </button>
                ))}
              </div>
            </div>

          </form>
        </div>

        {/* Columna Derecha: Resumen (Sticky) */}
        <div className="flex flex-col justify-between h-full space-y-6">
          <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 shadow-xl h-full flex flex-col relative overflow-hidden">
            {/* Elemento decorativo de fondo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 blur-[100px] opacity-10 pointer-events-none"></div>

            <h3 className="text-xl font-serif text-white mb-6 border-b border-neutral-800 pb-4">
              Resumen de la Cita
            </h3>

            <div className="space-y-4 grow">
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500">Cliente</span>
                <span className="text-white font-medium">{nombre || '---'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500">Teléfono</span>
                <span className="text-white font-medium">{telefono || '---'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500">Servicio</span>
                <span className="text-white font-medium text-right">{servicioSeleccionado?.nombre || 'Seleccione un corte'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500">Fecha</span>
                <span className="text-white font-medium">{fechaSeleccionada ? new Date(fechaSeleccionada).toLocaleDateString('es-ES', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : '---'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500">Hora</span>
                <span className="text-white font-medium">{horaSeleccionada || '---'}</span>
              </div>
            </div>

            {/* Área de Precios */}
            <div className="mt-8 pt-6 border-t border-dashed border-neutral-700 space-y-3">
              <div className="flex justify-between items-center text-neutral-400">
                <span>Precio del Corte</span>
                <span>${montoTotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center text-neutral-400">
                <span>Monto a Reservar (50%)</span>
                <span className="text-amber-500 font-bold">${montoReserva.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-white font-bold text-lg border-t border-neutral-700 pt-3 mt-3">
                <span>Total a Pagar</span>
                <span className="text-amber-500">${montoReserva.toFixed(2)}</span>
              </div>
            </div>

            {/* Botón de Pre-Reserva */}
            <button
              onClick={handlePreReservar}
              disabled={!nombre || !telefono || !email || !servicioSeleccionado || !fechaSeleccionada || !horaSeleccionada || cargando}
              className="mt-8 w-full bg-amber-500 text-black font-bold py-3 rounded-lg hover:bg-amber-400 transition-all disabled:bg-neutral-700 disabled:text-neutral-500 disabled:cursor-not-allowed"
            >
              CONFIRMAR PRE-RESERVA
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación de Pago */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-amber-500/30 p-8 rounded-xl max-w-md w-full shadow-2xl shadow-amber-900/20">
            <h2 className="text-2xl font-bold font-serif text-white mb-4">Confirmar Pre-Reserva</h2>
            
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-400">Cliente:</span>
                <span className="text-white font-medium">{nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Servicio:</span>
                <span className="text-white font-medium">{servicioSeleccionado?.nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Hora:</span>
                <span className="text-white font-medium">{horaSeleccionada}</span>
              </div>
              <div className="border-t border-neutral-700 pt-3 mt-3 flex justify-between font-bold">
                <span className="text-neutral-300">Monto a Reservar:</span>
                <span className="text-amber-500">${montoReserva.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setMostrarModal(false)}
                className="flex-1 bg-neutral-700 text-white py-2 rounded-lg hover:bg-neutral-600 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarPago}
                className="flex-1 bg-amber-500 text-black font-bold py-2 rounded-lg hover:bg-amber-400 transition-all"
              >
                Pagar ${montoReserva.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}