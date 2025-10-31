# 🧠 NIMA — Task Manager

NIMA es un gestor de tareas tipo Trello, desarrollado con React + Supabase.

### ✨ Features

- Autenticación de usuarios con Supabase Auth
- Board con columnas y tareas drag & drop
- Subtareas (checklist)
- Calendario de vencimientos
- Modo demo
- Personalización del fondo (imagen o color)
- Persistencia en Supabase (DB + Storage)

### 🚀 Tecnologías

React • Supabase • Shadcn/UI • TailwindCSS • DnD Kit • Vercel

---

💻 Demo pública: _Próximamente_  
👤 Desarrollado por [Nicolás Devesa](https://www.nicolasdev.com)

- Portfolio: [https://nicolasdev.com]
- LinkedIn: [https://www.linkedin.com/in/nicolasdevesa/]

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
