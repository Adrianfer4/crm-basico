# 📋 CRM Básico – Gestión de Clientes, Eventos, Ventas y Notificaciones

**CRM Básico** es una aplicación móvil multiplataforma (iOS/Android) desarrollada con **React Native** y **Expo**, destinada a gestionar clientes, eventos (citas), ventas y notificaciones. Diseño minimalista e intuitivo, ideal para peluquerías, consultorios, pymes, o uso personal.

---

## 🚀 Tecnologías principales

- **React Native + Expo** – desarrollo móvil cross‑platform
- **Expo Router** – navegación tipo folder-based con tabs y pantallas protegidas
- **TypeScript** – tipado sólido
- **Redux** (o contexto personalizado) – manejo centralizado del estado
- **React Native Paper** – componentes estilo Material Design
- **Firebase**:
  - Firestore – gestión de `clientes`, `eventos`, `ventas`, `notificaciones`
  - Firebase Auth – autenticación de usuario
  - Cloud Notifications (via *expo-notifications*)

---

## 📱 Funcionalidades principales

- 🔐 Registro/login de usuario
- 🧾 CRUD de **clientes**
- 🗓️ Agenda de **eventos**, con notificaciones programadas
- 💰 Registro de **ventas**, mostrando estado y total
- 📊 Dashboard con estadísticas: total de clientes, ventas diarias y eventos programados
- 🧭 Navegación fluida entre pantallas protegidas (Dashboard, Ventas, Agenda, Notificaciones, Clientes, Perfil)
- 🚪 Cierre de sesión (logout)

---

## 🔐 Reglas de seguridad (Firestore)

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
                    && request.auth.uid == request.resource.data.userId;
      allow delete: if request.auth != null
                     && request.auth.uid == resource.data.userId;
    }
  }
}
⚙️ Instalación y puesta en marcha
Clonar repo:

git clone https://github.com/Adrianfer4/crm-basico.git
cd crm-basico
Instalar dependencias:

npm install
# o
yarn install
Configurar Firebase:

Crea proyecto en Firebase.

Habilita Firestore y Auth.

Coloca tu configuración en config/firebaseConfig.ts.

Ejecutar app:

npx expo start
🧪 Integraciones personalizadas
Eventos: CRUD y programación de notificaciones (expo-notifications + Firestore).

Ventas: Registro con estado (pendiente, pagado, cancelado).

Dashboard: estadísticas circulares, últimos clientes, próximos eventos.

Routing: navegación tipo stack & tabs con historial propio y botón atrás nativo.

🧩 Próximos pasos / mejoras
Implementar lógica real de ventas del día en el dashboard (obtenerVentasHoy)

Mostrar historial de notificaciones

Exportar reportes (PDF, CSV)

🎯 Propósito del proyecto
Facilitar la gestión integral de clientes, citas y ventas en pequeños negocios, con herramientas útiles como notificaciones recordatorio, panel informativo y una experiencia fluida en móvil multiplataforma.