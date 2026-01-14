'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveReservation, getReservations } from '@/lib/firebase';

type Servicio = {
  id: string;
  nombre: string;
  precio: number;
};

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
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [servicioSeleccionado, setServicioSeleccionado] = useState<Servicio | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [reservaConfirmada, setReservaConfirmada] = useState(false);
  const [imagenComprobante, setImagenComprobante] = useState<File | null>(null);
  const [citaFinalizada, setCitaFinalizada] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);

  const montoTotal = servicioSeleccionado ? servicioSeleccionado.precio : 0;
  const montoReserva = montoTotal * 0.5;

  // Cargar horarios ocupados cuando la fecha cambia
  useEffect(() => {
    const cargarHorariosOcupados = async () => {
      if (!fechaSeleccionada) {
        setHorariosOcupados([]);
        return;
      }
      
      try {
        const reservas = await getReservations();
        if (!reservas) {
          setHorariosOcupados([]);
          return;
        }

        const horariosDelDia = Object.values(reservas as any)
          .filter((reserva: any) => reserva.fecha === fechaSeleccionada && reserva.estado !== 'cancelada')
          .map((reserva: any) => reserva.hora);

        setHorariosOcupados(horariosDelDia);
      } catch (error) {
        console.error('Error al cargar horarios:', error);
        setHorariosOcupados([]);
      }
    };

    cargarHorariosOcupados();
  }, [fechaSeleccionada]);

  const getMinMaxFechas = () => {
    const hoy = new Date();
    const minFecha = hoy.toISOString().split('T')[0];
    const max = new Date(hoy);
    max.setDate(max.getDate() + 30);
    const maxFecha = max.toISOString().split('T')[0];
    return { minFecha, maxFecha };
  };

  const handlePreReservar = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre && telefono && servicioSeleccionado && fechaSeleccionada && horaSeleccionada) {
      setMostrarModal(true);
    } else {
      setMensaje('Por favor completa todos los campos');
    }
  };

  const handleConfirmarPago = () => {
    setMostrarModal(false);
    setReservaConfirmada(true);
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
      const imagenBase64 = await convertirImagenABase64(imagenComprobante);
      const reservaData = {
        nombre,
        telefono,
        servicio: servicioSeleccionado?.nombre || '',
        precioTotal: montoTotal,
        montoPagado: montoReserva,
        fecha: fechaSeleccionada,
        hora: horaSeleccionada,
        estado: 'pendiente',
        comprobante: imagenBase64,
        fechaCreacion: new Date().toISOString()
      };

      await saveReservation(reservaData);
      setCitaFinalizada(true);
    } catch (error: any) {
      const errorMsg = error?.message || 'Error desconocido';
      setMensaje(`Error al guardar: ${errorMsg}`);
    } finally {
      setCargando(false);
    }
  };

  // Pantalla de éxito
  if (citaFinalizada) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600 rounded-full blur-[120px]"></div>
        </div>

        <button
          onClick={() => router.push('/')}
          className="fixed top-6 left-6 z-50 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110 border border-white/10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <div className="relative z-10 max-w-md w-full">
          <div className="flex justify-center mb-8">
            <div className="text-6xl">✓</div>
          </div>

          <div className="text-center mb-8 space-y-2">
            <h2 className="text-3xl font-bold text-white">¡Reserva Confirmada!</h2>
            <p className="text-gray-400">Te esperamos pronto</p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 space-y-4 mb-6">
            <div className="flex justify-between text-sm border-b border-white/10 pb-3">
              <span className="text-gray-400">Cliente</span>
              <span className="text-white font-medium">{nombre}</span>
            </div>
            <div className="flex justify-between text-sm border-b border-white/10 pb-3">
              <span className="text-gray-400">Servicio</span>
              <span className="text-white font-medium">{servicioSeleccionado?.nombre}</span>
            </div>
            <div className="flex justify-between text-sm border-b border-white/10 pb-3">
              <span className="text-gray-400">Hora</span>
              <span className="text-white font-medium">{horaSeleccionada}</span>
            </div>
            <div className="flex justify-between text-base pt-2">
              <span className="text-white">Pagado</span>
              <span className="text-amber-400 font-bold">S/. {montoReserva.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => {
              setCitaFinalizada(false);
              setReservaConfirmada(false);
              setNombre('');
              setTelefono('');
              setServicioSeleccionado(null);
              setHoraSeleccionada('');
              setImagenComprobante(null);
            }}
            className="w-full bg-white text-black font-semibold py-4 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105"
          >
            Hacer otra reserva
          </button>
        </div>
      </div>
    );
  }

  // Pantalla de pago
  if (reservaConfirmada) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-amber-500 rounded-full blur-[120px] animate-pulse"></div>
        </div>

        <button
          onClick={() => router.push('/')}
          className="fixed top-6 left-6 z-50 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110 border border-white/10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <div className="relative z-10 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">💳</div>
            <h2 className="text-2xl font-bold text-white mb-2">Completar Pago</h2>
            <p className="text-gray-400 text-sm">Envía el pago y confirma tu reserva</p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="bg-amber-500 text-black font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0-sm">1</div>
                <p className="text-gray-300 text-sm pt-1">Abre Yape en tu teléfono</p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="bg-amber-500 text-black font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm">2</div>
                <p className="text-gray-300 text-sm pt-1">
                  Envía <span className="text-white font-semibold">S/. {montoReserva.toFixed(2)}</span> al <span className="text-amber-400 font-semibold">941 554 701</span>
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="bg-amber-500 text-black font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm">3</div>
                <p className="text-gray-300 text-sm pt-1">Captura y carga el comprobante abajo</p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Cliente</span>
                <span className="text-white">{nombre}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Servicio</span>
                <span className="text-white">{servicioSeleccionado?.nombre}</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t border-white/10">
                <span className="text-white">Total</span>
                <span className="text-amber-400">S/. {montoReserva.toFixed(2)}</span>
              </div>
            </div>

            {mensaje && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3">
                <p className="text-red-400 text-sm text-center">{mensaje}</p>
              </div>
            )}

            <div className="space-y-3">
              <label className="block">
                <div className="border-2 border-dashed border-white/20 hover:border-amber-500/50 rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 hover:bg-white/5">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCargarComprobante}
                    className="hidden"
                  />
                  <div className="text-4xl mb-2">📸</div>
                  <p className="text-white text-sm font-medium">
                    {imagenComprobante ? imagenComprobante.name : 'Cargar comprobante'}
                  </p>
                  {!imagenComprobante && (
                    <p className="text-gray-500 text-xs mt-1">Toca para seleccionar imagen</p>
                  )}
                </div>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setReservaConfirmada(false);
                  setImagenComprobante(null);
                }}
                className="flex-1 bg-white/5 text-white py-4 rounded-full hover:bg-white/10 transition-all duration-300 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarReserva}
                disabled={!imagenComprobante || cargando}
                className="flex-1 bg-amber-500 text-black font-semibold py-4 rounded-full hover:bg-amber-400 transition-all duration-300 disabled:bg-gray-600 disabled:text-gray-400 hover:scale-105 disabled:scale-100"
              >
                {cargando ? 'Guardando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla principal
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="fixed inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600 rounded-full blur-[150px]"></div>
      </div>

      <button
        onClick={() => router.push('/')}
        className="fixed top-6 left-6 z-50 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110 border border-white/10"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      <div className="relative z-10 max-w-md mx-auto px-4 py-8 pt-20 pb-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">
            THE STYLO <span className="text-amber-500">CAVE</span>
          </h1>
          <p className="text-gray-400 text-sm">Reserva tu cita</p>
        </div>

        <form onSubmit={handlePreReservar} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-xs uppercase mb-2 font-medium">Nombre</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre completo"
              className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs uppercase mb-2 font-medium">Teléfono</label>
            <input
              type="tel"
              required
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej: 941554701"
              className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs uppercase mb-3 font-medium">Selecciona tu corte</label>
            <div className="space-y-3">
              {SERVICIOS.map((servicio) => (
                <div
                  key={servicio.id}
                  onClick={() => setServicioSeleccionado(servicio)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all flex justify-between items-center hover:scale-[1.02] ${
                    servicioSeleccionado?.id === servicio.id
                      ? 'bg-amber-500 border-amber-500 text-black'
                      : 'bg-white/5 border-white/10 hover:border-white/20 backdrop-blur-sm'
                  }`}
                >
                  <span className="font-medium">{servicio.nombre}</span>
                  <span className="font-bold">S/. {servicio.precio}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-xs uppercase mb-2 font-medium">Fecha</label>
            <input
              type="date"
              required
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              min={getMinMaxFechas().minFecha}
              max={getMinMaxFechas().maxFecha}
              className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-amber-500 transition-all duration-300 scheme-dark"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs uppercase mb-3 font-medium">Horario</label>
            <div className="grid grid-cols-3 gap-2">
              {HORARIOS.map((hora) => {
                const estaOcupado = horariosOcupados.includes(hora);
                return (
                  <button
                    key={hora}
                    type="button"
                    onClick={() => !estaOcupado && setHoraSeleccionada(hora)}
                    disabled={estaOcupado}
                    className={`py-3 text-sm rounded-xl border transition-all hover:scale-105 ${
                      horaSeleccionada === hora
                        ? 'bg-white text-black border-white font-bold'
                        : estaOcupado
                        ? 'bg-red-500/20 border-red-500/50 text-red-300 cursor-not-allowed opacity-50'
                        : 'bg-white/5 border-white/10 hover:border-white/20 backdrop-blur-sm'
                    }`}
                  >
                    {hora}
                    {estaOcupado && <span className="text-xs block">Ocupado</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {servicioSeleccionado && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Servicio</span>
                <span>{servicioSeleccionado.nombre}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Precio total</span>
                <span>S/. {montoTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-white/10 pt-3">
                <span className="text-gray-400">Reserva (50%)</span>
                <span className="text-amber-400 font-bold">S/. {montoReserva.toFixed(2)}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!nombre || !telefono || !servicioSeleccionado || !fechaSeleccionada || !horaSeleccionada}
            className="w-full bg-amber-500 text-black font-bold py-4 rounded-full hover:bg-amber-400 transition-all duration-300 disabled:bg-gray-700 disabled:text-gray-500 hover:scale-105 disabled:scale-100"
          >
            Continuar con la reserva
          </button>
        </form>
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-6 text-center">Confirmar Reserva</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Cliente</span>
                <span>{nombre}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Servicio</span>
                <span>{servicioSeleccionado?.nombre}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Hora</span>
                <span>{horaSeleccionada}</span>
              </div>
              <div className="flex justify-between font-bold pt-3 border-t border-white/20">
                <span>A pagar</span>
                <span className="text-amber-400">S/. {montoReserva.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setMostrarModal(false)}
                className="flex-1 bg-white/10 py-3 rounded-full hover:bg-white/20 transition-all duration-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarPago}
                className="flex-1 bg-amber-500 text-black font-bold py-3 rounded-full hover:bg-amber-400 transition-all duration-300 hover:scale-105"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}