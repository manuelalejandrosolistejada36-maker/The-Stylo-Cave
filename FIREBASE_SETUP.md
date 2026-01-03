# Configuración de Firebase

## Reglas de Seguridad Necesarias

El proyecto está conectado a Firebase Realtime Database. Para que las reservas se guarden correctamente, debes configurar las reglas de seguridad en la consola de Firebase.

### Pasos:

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona el proyecto "thestylocave"
3. Ve a **Realtime Database** → **Reglas**
4. Reemplaza las reglas con esto:

```json
{
  "rules": {
    "reservations": {
      ".read": true,
      ".write": true,
      "$reservationId": {
        ".validate": "newData.hasChildren(['nombre', 'email', 'telefono', 'servicio'])"
      }
    }
  }
}
```

5. Haz clic en **Publicar**

## Verificación

- El servidor debe mostrar "✅ Firebase conectado" en la esquina superior derecha
- Los logs en la consola (F12) mostrarán exactamente qué sucede
- Si hay error, verás "❌ Error: [mensaje]"

## Datos que se guardan

Cada reserva incluye:
- nombre
- email
- telefono
- servicio
- precioTotal
- montoPagado
- fecha
- hora
- estado
- comprobante (imagen en base64)
- fechaCreacion

## Debugging

Abre la consola del navegador (F12) y busca los logs:
- 🚀 Iniciando proceso
- 📸 Imagen convertida
- 💾 Guardando en Firebase
- ✅ Reserva guardada
- ❌ Error (si falla)
