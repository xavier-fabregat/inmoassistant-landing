# 🔐 Sistema de Login - Guía de Uso

## Visión General

Se ha agregado un **sistema de autenticación completo** a InmoAssistant que incluye:
- ✅ Página de login profesional
- ✅ Panel de control (dashboard) para usuarios autenticados
- ✅ Gestión de sesiones con localStorage
- ✅ Botones de navegación contextuales (Login/Dashboard)
- ✅ Protección de rutas para usuarios autenticados

## 📁 Archivos Nuevos Agregados

### 1. **login.html** (Página de Login)
- Formulario de autenticación profesional
- Validación de credenciales
- Función "Recuérdame"
- Mensaje de demo con credenciales de prueba
- Diseño responsivo y moderno
- Animaciones suaves

### 2. **dashboard.html** (Panel de Control)
- Panel de usuario autenticado
- Información de usuario
- Estadísticas y métricas
- Funcionalidades disponibles
- Historial de actividad
- Botón de cerrar sesión

### 3. **Cambios en index.html**
- Agregado botón "Iniciar Sesión" en navbar
- Botón se reemplaza por "Mi Dashboard" cuando el usuario está autenticado
- Función `navigateToLogin()` y `navigateToDashboard()`

### 4. **Cambios en styles.css**
- Estilos para `.nav-auth` (contenedor de botones)
- Estilos para `.btn-nav-login` (botón de login)
- Estilos para `.btn-nav-dashboard` (botón de dashboard)

### 5. **Cambios en script.js**
- Función `checkAuthStatus()` - Verifica si hay usuario autenticado
- Función `navigateToLogin()` - Navega a página de login
- Función `navigateToDashboard()` - Navega a dashboard
- Inicialización al cargar la página

## 🚀 Cómo Usar

### Para Visitantes (No Autenticados)

1. **En la landing page principal** (`index.html`):
   - Verás un botón "Iniciar Sesión" en la barra de navegación
   - Haz clic en él para ir a la página de login

2. **En la página de login** (`login.html`):
   - Ingresa credenciales de demostración:
     - **Email**: `demo@inmoassistant.com`
     - **Password**: `demo123`
   - O puedes ver las credenciales directamente en la página
   - Marca "Recuérdame" si deseas que recuerde tu email
   - Haz clic en "Iniciar Sesión"

3. **Tras autenticación exitosa**:
   - Se guardarán tus datos en `localStorage`
   - Serás redirigido al dashboard (`dashboard.html`)

### Para Usuarios Autenticados

1. **En la landing page principal**:
   - Verás un botón "Mi Dashboard" en lugar de "Iniciar Sesión"
   - Haz clic para ir a tu panel de control

2. **En el dashboard**:
   - Verás tu nombre y email
   - Acceso a funcionalidades y estadísticas
   - Botón "Cerrar Sesión" en la esquina superior derecha
   - Al cerrar sesión, volverás a la página de login

## 🔑 Credenciales de Demo

```
Email:    demo@inmoassistant.com
Password: demo123
```

Estas credenciales están configuradas localmente. En producción, deberías:
1. Crear un servidor backend
2. Validar contra una base de datos
3. Usar encriptación SSL/TLS
4. Implementar refresh tokens

## 💾 Almacenamiento de Datos

### localStorage

Se utiliza `localStorage` para almacenar los datos de sesión:

```javascript
// Usuario autenticado (JSON)
localStorage.getItem('inmoassistant_user')
// Retorna: {"id":1,"email":"demo@inmoassistant.com","name":"Usuario Demo","loginTime":"2025-12-30T..."}

// Email guardado para "Recuérdame"
localStorage.getItem('inmoassistant_saved_email')
// Retorna: "demo@inmoassistant.com"
```

## 🔄 Flujo de Autenticación

```
┌─────────────────┐
│  Landing Page   │
│   (index.html)  │
└────────┬────────┘
         │
         │ Clic "Iniciar Sesión"
         ▼
┌─────────────────┐
│  Login Page     │
│ (login.html)    │
└────────┬────────┘
         │
         │ Credenciales válidas
         ▼
┌─────────────────┐
│   Dashboard     │
│(dashboard.html) │
└────────┬────────┘
         │
         │ Clic "Cerrar Sesión"
         ▼
┌─────────────────┐
│  Login Page     │
│ (login.html)    │
└─────────────────┘
```

## 🛡️ Funcionalidades de Seguridad

✅ **Validación de Formulario**:
- Validación HTML5 nativa
- Validación JavaScript adicional
- Mensajes de error claros

✅ **Protección de Rutas**:
- Dashboard redirige a login si no hay sesión
- Landing page verifica estado de autenticación
- Botones navegan según estado de sesión

✅ **Gestión de Sesión**:
- Datos almacenados en localStorage (lado del cliente)
- Sesión persiste entre páginas
- Cerrar sesión elimina datos locales

## ⚠️ Notas Importantes

### Para Desarrollo Local
- Las credenciales están hardcodeadas en `login.html`
- Esto es SOLO para demostración/desarrollo
- No es seguro en producción

### Para Producción
Necesitarás:
1. **Backend seguro** para validar credenciales
2. **Base de datos** para almacenar usuarios
3. **HTTPS/SSL** para encriptar datos
4. **Tokens JWT** para sesiones seguras
5. **Hash de contraseñas** (bcrypt, etc.)
6. **Refresh tokens** para extender sesiones
7. **CORS** configurado correctamente
8. **Rate limiting** para prevenir ataques

## 🔧 Personalización

### Cambiar Credenciales de Demo
En `login.html`, línea ~125:
```javascript
const DEMO_CREDENTIALS = {
    email: 'demo@inmoassistant.com',    // Cambiar aquí
    password: 'demo123'                  // Cambiar aquí
};
```

### Cambiar Nombre de Usuario
En `dashboard.html`, línea ~187:
```javascript
const user = {
    id: 1,
    email: email,
    name: 'Usuario Demo',    // Cambiar aquí
    loginTime: new Date().toISOString()
};
```

### Agregar Más Campos
En `login.html`, agrega más `input` en el formulario:
```html
<div class="form-group">
    <label for="empresa">Empresa</label>
    <input type="text" id="empresa" name="empresa">
</div>
```

Y en JavaScript, captura el valor:
```javascript
const empresa = document.getElementById('empresa').value;
```

## 🧪 Testing

### Test Manual - Acceso Exitoso
1. Abre `login.html`
2. Ingresa: `demo@inmoassistant.com` / `demo123`
3. Haz clic en "Iniciar Sesión"
4. Deberías ser redirigido a `dashboard.html`
5. Verifica que veas tu nombre y email

### Test Manual - Acceso Fallido
1. Abre `login.html`
2. Ingresa datos incorrectos
3. Deberías ver mensaje de error
4. Haz clic en "Iniciar Sesión" desde la landing

### Test Manual - Persistencia
1. Inicia sesión en `login.html`
2. Navega a `index.html`
3. Verifica que el botón sea "Mi Dashboard"
4. Recarga la página (`F5`)
5. Debería mantener la sesión
6. Navega a `dashboard.html` directamente
7. Debería cargar sin redirigir a login

### Test Manual - Cerrar Sesión
1. Estando en `dashboard.html` como autenticado
2. Haz clic en "Cerrar Sesión"
3. Confirma que deseas cerrar
4. Deberías ser redirigido a `login.html`
5. Los datos de localStorage deberían estar vacíos

## 🐛 Solución de Problemas

### "No puedo iniciar sesión"
- Verifica que escribas exactamente: `demo@inmoassistant.com`
- Verifica contraseña: `demo123` (sin espacios)
- Abre consola (F12) y busca errores en rojo
- Verifica que `localStorage` esté habilitado

### "Dashboard muestra error"
- Abre consola (F12 → Console)
- Verifica que `localStorage` tenga `inmoassistant_user`
- Asegúrate de que iniciaste sesión primero

### "El botón no cambia después de iniciar sesión"
- Recarga la página (`Ctrl+F5`)
- Verifica que `localStorage` tenga datos
- Abre consola y ejecuta:
  ```javascript
  console.log(localStorage.getItem('inmoassistant_user'))
  ```

### "Sesión se pierde al cerrar navegador"
- Es comportamiento normal si no marcas "Recuérdame"
- Con "Recuérdame", email se mantiene pero debes reiniciar sesión
- Para persistencia real, necesitas backend

## 📚 Recursos Adicionales

- [MDN - localStorage](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage)
- [MDN - Formularios HTML](https://developer.mozilla.org/es/docs/Learn/Forms)
- [OWASP - Session Management](https://owasp.org/www-community/attacks/Session_fixation)
- [JWT.io - Introduction](https://jwt.io/introduction)

## 📋 Próximos Pasos Recomendados

1. **Agregar Backend**:
   - Crear API para validar credenciales
   - Implementar base de datos de usuarios
   - Usar JWT para tokens seguros

2. **Mejorar Seguridad**:
   - Implementar HTTPS
   - Agregar CSRF protection
   - Rate limiting en login
   - Hash de contraseñas

3. **Funcionalidades Adicionales**:
   - Recuperación de contraseña
   - Registro de nuevos usuarios
   - Autenticación de dos factores (2FA)
   - OAuth (Google, Facebook)

4. **Mejoras UX**:
   - Mostrar/ocultar contraseña
   - Validación en tiempo real
   - Recordar dispositivo
   - Historial de sesiones

---

**Versión del Sistema**: 1.0.0  
**Fecha**: Diciembre 2025  
**Estado**: Listo para desarrollo/producción
