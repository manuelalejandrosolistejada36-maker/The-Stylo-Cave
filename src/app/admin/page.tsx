'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getReservations, deleteReservation, database, ref, update } from '@/lib/firebase';
import { Eye, EyeOff } from 'lucide-react';

type Cita = {
  id?: string;
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  precioTotal: number;
  montoPagado: number;
  hora: string;
  fecha: string;
  estado: 'pendiente' | 'aceptada' | 'completada' | 'cancelada' | 'no-vino';
  comprobante: string;
  fechaCreacion?: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [autenticado, setAutenticado] = useState(false);
  const [password, setPassword] = useState('');
  const [citas, setCitas] = useState<Cita[]>([]);
  const [errorPassword, setErrorPassword] = useState('');
  const [comprobanteModal, setComprobanteModal] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  // Cargar las citas al iniciar
  useEffect(() => {
    if (autenticado) {
      cargarCitas();
      // Actualizar cada 30 segundos
      const interval = setInterval(cargarCitas, 30000);
      return () => clearInterval(interval);
    }
  }, [autenticado]);

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && comprobanteModal) {
        setComprobanteModal(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [comprobanteModal]);

  const cargarCitas = async () => {
    try {
      setCargando(true);
      const datos = await getReservations();
      if (datos) {
        // Convertir objeto a array
        const citasArray = Object.entries(datos).map(([id, data]: [string, any]) => ({
          id,
          ...data
        }));
        setCitas(citasArray);
      } else {
        setCitas([]);
      }
    } catch (error) {
      console.error('Error al cargar citas:', error);
    } finally {
      setCargando(false);
    }
  };

  // Manejar Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Manuel72091842') {
      setAutenticado(true);
      setErrorPassword('');
    } else {
      setErrorPassword('Contraseña incorrecta');
      setPassword('');
    }
  };

  // Cambiar estado de la cita
  const cambiarEstado = async (id: string | undefined, nuevoEstado: Cita['estado']) => {
    if (!id) return;
    
    try {
      const reservationRef = ref(database, `reservations/${id}`);
      await update(reservationRef, {
        estado: nuevoEstado
      });
      
      // Actualizar localmente
      const citasActualizadas = citas.map(cita => 
        cita.id === id ? { ...cita, estado: nuevoEstado } : cita
      );
      setCitas(citasActualizadas);
    } catch (error) {
      console.error('Error al actualizar cita:', error);
    }
  };

  // Enviar mensaje de WhatsApp personalizado
  const enviarWhatsApp = (cita: Cita) => {
    const mensaje = encodeURIComponent(
      `Hola ${cita.nombre}! 👋\n\n` +
      `Tu cita ha sido confirmada ✅\n\n` +
      `📋 Detalles:\n` +
      `• Servicio: ${cita.servicio}\n` +
      `• Fecha: ${cita.fecha}\n` +
      `• Hora: ${cita.hora}\n` +
      `• Total a pagar: $${cita.precioTotal.toFixed(2)}\n\n` +
      `¡Te esperamos en THE STYLO CAVE! 💈`
    );
    
    // Abrir WhatsApp con el mensaje
    window.open(`https://wa.me/51${cita.telefono}?text=${mensaje}`, '_blank');
  };

  // Eliminar cita
  const eliminarCita = async (id: string | undefined) => {
    if (!id || !confirm('¿Estás seguro de eliminar esta cita?')) return;
    
    try {
      await deleteReservation(id);
      const nuevasCitas = citas.filter(c => c.id !== id);
      setCitas(nuevasCitas);
    } catch (error) {
      console.error('Error al eliminar cita:', error);
    }
  };

  // Cálculos
  const citasPendientes = citas.filter(c => c.estado === 'pendiente').length;
  const citasAceptadas = citas.filter(c => c.estado === 'aceptada').length;
  const citasCompletadas = citas.filter(c => c.estado === 'completada').length;
  const totalIngresos = citas
    .filter(c => c.estado === 'completada')
    .reduce((acc, curr) => acc + curr.montoPagado, 0);

  // Color del badge según estado
  const getBadgeColor = (estado: Cita['estado']) => {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'aceptada': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'completada': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'cancelada': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'no-vino': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getEstadoTexto = (estado: Cita['estado']) => {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'aceptada': return 'Aceptada';
      case 'completada': return 'Completada';
      case 'cancelada': return 'Cancelada';
      case 'no-vino': return 'No Vino';
    }
  };

  // --- VISTA DE LOGIN (SEGURIDAD) ---

  const [showPassword, setShowPassword] = useState(false);

  if (!autenticado) {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="bg-neutral-900 p-8 rounded-2xl border border-amber-500/30 w-full max-w-md shadow-2xl shadow-amber-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 blur-[100px] opacity-10 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔐</div>
            <h2 className="text-2xl font-bold font-serif text-amber-500 mb-2">Panel de Administración</h2>
            <p className="text-neutral-400 text-sm">THE STYLO CAVE</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">
                Contraseña de Acceso
              </label>
              
              {/* Contenedor relativo para posicionar el icono */}
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorPassword('');
                  }}
                  placeholder="Ingresa la contraseña"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 pr-10 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  autoFocus
                />
                
                {/* Botón del icono */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-amber-500 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {errorPassword && (
                <p className="text-red-400 text-sm mt-2">❌ {errorPassword}</p>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-amber-500 text-black font-bold py-3 rounded-lg hover:bg-amber-400 transition-all"
            >
              Ingresar al Panel
            </button>
          </form>

          <button
            onClick={() => router.push('/')}
            className="w-full mt-4 text-neutral-500 hover:text-white text-sm underline transition-colors"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}

  // --- VISTA DEL DASHBOARD ---
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans p-4 sm:p-6 pt-32">
      
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

      {/* Header Admin */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 border-b border-neutral-800 pb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-white">Panel de Control</h1>
          <p className="text-xs text-amber-500 uppercase tracking-widest">The Stylo Cave Manager</p>
        </div>
        <button 
          onClick={() => setAutenticado(false)}
          className="text-sm bg-neutral-800 px-4 py-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-700 transition-all"
        >
          🚪 Cerrar Sesión
        </button>
      </header>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-neutral-900 p-4 sm:p-6 rounded-xl border border-yellow-500/20">
          <p className="text-neutral-500 text-xs uppercase font-bold">Pendientes</p>
          <p className="text-2xl sm:text-3xl text-yellow-500 font-bold mt-2">{citasPendientes}</p>
        </div>
        <div className="bg-neutral-900 p-4 sm:p-6 rounded-xl border border-blue-500/20">
          <p className="text-neutral-500 text-xs uppercase font-bold">Aceptadas</p>
          <p className="text-2xl sm:text-3xl text-blue-500 font-bold mt-2">{citasAceptadas}</p>
        </div>
        <div className="bg-neutral-900 p-4 sm:p-6 rounded-xl border border-green-500/20">
          <p className="text-neutral-500 text-xs uppercase font-bold">Completadas</p>
          <p className="text-2xl sm:text-3xl text-green-500 font-bold mt-2">{citasCompletadas}</p>
        </div>
        <div className="bg-neutral-900 p-4 sm:p-6 rounded-xl border border-amber-500/20">
          <p className="text-neutral-500 text-xs uppercase font-bold">Ingresos</p>
          <p className="text-2xl sm:text-3xl text-amber-500 font-bold mt-2">${totalIngresos.toFixed(2)}</p>
        </div>
      </div>

      {/* Lista de Citas */}
      <h3 className="text-xl text-white font-serif mb-6">📋 Gestión de Citas</h3>

      {citas.length === 0 ? (
        <div className="text-center py-20 bg-neutral-900/50 rounded-xl border border-dashed border-neutral-800">
          <p className="text-neutral-500 text-lg">📭 No hay citas programadas</p>
          <p className="text-neutral-600 text-sm mt-2">Las citas aparecerán aquí automáticamente</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {citas.map((cita) => (
            <div 
              key={cita.id} 
              className={`bg-neutral-900 rounded-xl border transition-all overflow-hidden relative ${
                cita.estado === 'pendiente' ? 'border-yellow-500/50' :
                cita.estado === 'aceptada' ? 'border-blue-500/50' :
                cita.estado === 'completada' ? 'border-green-500/50' :
                cita.estado === 'cancelada' ? 'border-red-500/50' :
                'border-gray-500/50'
              }`}
            >
              
              {/* Indicador lateral */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                cita.estado === 'pendiente' ? 'bg-yellow-500' :
                cita.estado === 'aceptada' ? 'bg-blue-500' :
                cita.estado === 'completada' ? 'bg-green-500' :
                cita.estado === 'cancelada' ? 'bg-red-500' :
                'bg-gray-500'
              }`}></div>

              <div className="p-4 sm:p-6">
                {/* Header de la cita */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-white">{cita.nombre}</h4>
                    <a 
                      href={`https://wa.me/51${cita.telefono}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1"
                    >
                      📱 {cita.telefono}
                    </a>
                    <p className="text-sm text-amber-500 font-medium mt-1">🕐 {cita.hora}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded border ${getBadgeColor(cita.estado)}`}>
                    {getEstadoTexto(cita.estado)}
                  </span>
                </div>

                {/* Detalles de la cita */}
                <div className="space-y-2 text-sm text-neutral-400 mb-4 bg-neutral-800/50 p-3 rounded-lg">
                  <div className="flex justify-between border-b border-neutral-700 pb-2">
                    <span>Servicio:</span>
                    <span className="text-neutral-200 font-medium">{cita.servicio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span>${cita.precioTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-400">
                    <span>Pagado:</span>
                    <span className="font-bold">${cita.montoPagado.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-amber-500 border-t border-neutral-700 pt-2">
                    <span>Por Cobrar:</span>
                    <span>${(cita.precioTotal - cita.montoPagado).toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-neutral-500 mt-2">
                    📅 {cita.fecha}
                  </div>
                </div>

                {/* Ver Comprobante */}
                <button
                  onClick={() => setComprobanteModal(cita.comprobante)}
                  className="w-full py-2 mb-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 border border-amber-500/20 transition-all text-sm font-semibold"
                >
                  📸 Ver Comprobante de Pago
                </button>

                {/* Botones de Acción */}
                <div className="space-y-2">
                  {cita.estado === 'pendiente' && (
                    <>
                      <button 
                        onClick={() => cambiarEstado(cita.id, 'aceptada')}
                        className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-semibold"
                      >
                        ✅ Aceptar Cita
                      </button>
                    </>
                  )}
                  
                  {cita.estado === 'aceptada' && (
                    <>
                      <button 
                        onClick={() => enviarWhatsApp(cita)}
                        className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-semibold flex items-center justify-center gap-2"
                      >
                        💬 Enviar WhatsApp
                      </button>
                      <button 
                        onClick={() => cambiarEstado(cita.id, 'completada')}
                        className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-sm font-semibold"
                      >
                        ✂️ Marcar Completada
                      </button>
                      <button 
                        onClick={() => cambiarEstado(cita.id, 'no-vino')}
                        className="w-full py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all text-sm font-semibold"
                      >
                        ❌ No Vino
                      </button>
                    </>
                  )}

                  {(cita.estado === 'pendiente' || cita.estado === 'aceptada') && (
                    <button 
                      onClick={() => cambiarEstado(cita.id, 'cancelada')}
                      className="w-full py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 border border-red-500/20 transition-all text-sm font-semibold"
                    >
                      🚫 Cancelar Cita
                    </button>
                  )}

                  {(cita.estado === 'completada' || cita.estado === 'cancelada' || cita.estado === 'no-vino') && (
                    <button 
                      onClick={() => eliminarCita(cita.id)}
                      className="w-full py-2 bg-neutral-800 text-neutral-400 rounded-lg hover:bg-neutral-700 hover:text-white transition-all text-sm font-semibold"
                    >
                      🗑️ Eliminar del Historial
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Nota informativa */}
      <div className="mt-8 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-center">
        <p className="text-amber-200 text-sm">
          ℹ️ Las citas se eliminan automáticamente después de 24 horas (Hora Peruana)
        </p>
      </div>

      {/* Modal para ver comprobante */}
      {comprobanteModal && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          onClick={() => setComprobanteModal(null)}
        >
          <div 
            className="bg-neutral-900 border border-amber-500/30 rounded-2xl p-4 sm:p-6 max-w-3xl w-full shadow-2xl shadow-amber-900/20 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón X grande y visible */}
            <button
              onClick={() => setComprobanteModal(null)}
              className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold shadow-lg z-10 transition-all"
            >
              ✕
            </button>

            <div className="mb-4">
              <h3 className="text-xl font-bold text-amber-500 text-center">📸 Comprobante de Pago</h3>
            </div>

            <div className="bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700">
              <img 
                src={comprobanteModal} 
                alt="Comprobante de pago" 
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setComprobanteModal(null)}
                className="flex-1 bg-neutral-700 text-white font-semibold py-3 rounded-lg hover:bg-neutral-600 transition-all"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = comprobanteModal;
                  link.download = `comprobante_${Date.now()}.jpg`;
                  link.click();
                }}
                className="flex-1 bg-amber-500 text-black font-bold py-3 rounded-lg hover:bg-amber-400 transition-all"
              >
                📥 Descargar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}