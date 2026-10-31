# JG Cables · Sistema de gestión

Aplicación multiplataforma (PWA) para gestionar los pedidos, clientes y usuarios de **JG Cables**, una empresa ficticia de venta de cables.
Proyecto individual del módulo **Desarrollo de Interfaces (0488)** de 2º DAM.

## Tecnologías

| Parte | Tecnología |
|---|---|
| Interfaz | Ionic 9 + Angular 22 (componentes standalone y señales) |
| Autenticación y roles | Firebase Authentication + Firestore (`usuarios`) |
| Datos NoSQL en tiempo real | Firebase Firestore (`pedidos`) |
| Datos SQL | Supabase (PostgreSQL) a través de su API REST (`clientes`, `productos`, `usuarios`) |
| Gráficos | Chart.js |
| Informes | jsPDF + jsPDF-AutoTable (PDF) y CSV |
| Despliegue | Vercel + GitHub Actions |

## Instalación

```bash
git clone https://github.com/jacobogonzhern/jgcables-di.git
cd jgcables-di
npm install
ionic serve
```

La aplicación se abre en `http://localhost:8100`.

Otros comandos:

| Comando | Para qué sirve |
|---|---|
| `npm run build` | Compila la aplicación para producción en la carpeta `www` |
| `npm test` | Ejecuta los tests unitarios (Vitest) |
| `npm run lint` | Revisa el código con ESLint |
| `npm run docs` | Genera la documentación técnica con Compodoc en `documentation/` |

## Estructura del proyecto

```
src/app
├── components/      Componentes reutilizables (data-table, metric-card, chart)
├── core/
│   ├── guards/      authGuard y roleGuard (protección de rutas)
│   ├── models/      Interfaces de datos
│   ├── services/    Auth, Firebase, Supabase y exportación de informes
│   └── validators/  Validador asíncrono de email
└── pages/           login, register, pedidos, dashboard, usuarios, ayuda
```

## Flujo de trabajo con Git

Se sigue Git Flow: `main` (producción), `develop` (integración) y una rama `feature/...` por cada funcionalidad.
Cada rama se integra en `develop` mediante Pull Request y GitHub Actions comprueba lint, tests y compilación antes de fusionar.
Vercel despliega automáticamente la rama `main`.

---

# Manual de usuario

### 1. Acceso
1. Abre la aplicación e introduce tu correo y tu contraseña.
2. Pulsa **Entrar**. Si eres administrador irás al **Dashboard**; si eres usuario, a **Pedidos**.
3. Para salir, abre el menú lateral y pulsa **Cerrar sesión**.

### 2. Crear una cuenta
1. En la pantalla de acceso pulsa **Regístrate**.
2. Escribe tu nombre, tu correo y una contraseña de al menos 6 caracteres.
3. Mientras escribes el correo, la aplicación comprueba si ya está registrado y te avisa.
4. Pulsa **Crear cuenta** y después inicia sesión. Las cuentas nuevas tienen el rol **Usuario**.

### 3. Pedidos
- La tabla se actualiza sola cuando cambia un pedido.
- Usa el **buscador** para filtrar por cualquier columna y el selector para cambiar las filas por página.
- Pulsa una fila (o selecciónala con `Tab` y pulsa `Enter`) para ver el resumen del pedido.
- **Exportar PDF** descarga un informe con la cabecera de la empresa. **Exportar CSV** genera un archivo para Excel.

### 4. Dashboard (solo administrador)
- Muestra el total de pedidos, de clientes, los ingresos y los pedidos pendientes.
- Filtra por estado con el desplegable o pulsando un sector del gráfico circular.
- Pulsa la tarjeta de pedidos para ir al listado.

### 5. Usuarios (solo administrador)
- Lista de las personas registradas en la aplicación, con buscador.

### 6. Ayuda
- Este mismo manual está disponible dentro de la aplicación en el apartado **Ayuda** del menú.

### Accesibilidad
- Toda la aplicación se puede usar con el teclado (`Tab`, `Mayús + Tab` y `Enter`).
- Los colores cumplen el contraste mínimo de WCAG y el texto se puede ampliar con el zoom del navegador.
