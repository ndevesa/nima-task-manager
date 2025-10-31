# 🎯 NIMA

Un clon moderno de Trello con una interfaz glassmorphism, drag & drop y persistencia.

![Demo](./screenshots/demo.gif)

## 🚀 Demo en vivo

[Ver proyecto →](https://tu-deploy.vercel.app)

## ✨ Características

- ✅ Crear, editar y eliminar tareas
- 🎨 Drag & drop entre columnas
- 📅 Fechas de vencimiento y prioridades
- 💾 Persistencia local (localStorage)
- 💾 Supabase DB Support
- 📤 Exportar/Importar datos (JSON)
- 📱 Diseño responsive
- ⚡ Animaciones con Framer Motion

## 🛠️ Tech Stack

- **Frontend:** React 18
- **UI:** Tailwind CSS + shadcn/ui
- **Drag & Drop:** dnd-kit
- **Animaciones:** Framer Motion
- **Build:** Vite

## 📦 Instalación

\`\`\`bash

# Clonar el repositorio

git clone https://github.com/tu-usuario/trello-glass-clone.git

# Instalar dependencias

npm install

# Iniciar en desarrollo

npm run dev
\`\`\`

## 🎨 Screenshots

![Vista principal](./screenshots/home.png)
![Crear tarea](./screenshots/task-modal.png)

## 🧠 Aprendizajes

En este proyecto implementé:

- Implementar drag & drop complejo con dnd-kit
- Gestionar estado complejo con refs y callbacks
- Persistencia de datos con localStorage
- Optimización de renders en React

## 👨‍💻 Autor

**Nicolás Devesa**

- Portfolio: [https://nicolasdev.com]
- LinkedIn: [https://www.linkedin.com/in/nicolasdevesa/]
- GitHub: [@ndevesa]

## 📄 Licencia

MIT License - Siéntete libre de usar este proyecto para aprender!

:::::CHANGELOG:::::

DONE:

✅ MIGRACION A SUPABASE DB OK. -> VER WARNINGS DE SUPABASE BACKEND.
✅ MODO DEMO OK.
✅ Etiquetas / Tags [Agregar tags como “Diseño”, “Backend”, “Urgente”]
✅ Placeholders para filtros de prioridad y categoria/columna.
✅ Eliminar tarea desde vista calendar.
✅ Customización de usuario

28/10

✅ Agregar tareas en cada dia en vista calendar.
✅ Agregar subtareas a cada tarea mediante checkboxes.
✅ Archivo central para themes, colores y backgrounds.
✅ optimizacion y modularizacion de App.

30/10

✅ Adjuntar archivos o imágenes en tareas (vía Supabase Storage)

31/10

✅ Flickering entre data Demo y data User al iniciar sesión corregido.

---

TODOS:

⚙️ Recordatorios o tareas vencidas [ver si por mail quizas sea la mejor manera, ya tengo el mail porque los users se registran]
⚙️ Modo offline-first + sync con Supabase → Guardar cambios localmente y sincronizar después.
⚙️ Compartir tableros con otros usuarios → Requiere roles y control de permisos.
⚙️ Comentarios en tareas (mini chat) → Da interacción social, útil si apuntás a colaboración.
